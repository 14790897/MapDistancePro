import { useState, useCallback } from 'react';

interface AddressResult {
  address: string;
  location: { lng: number; lat: number } | null;
  distance: number | null;
  error?: string;
}

interface UserPosition {
  lng: number;
  lat: number;
}

interface UseAddressProcessorOptions {
  restApiKey: string;
  requestLimit: number;
  requestDelay: number;
  onError?: (error: string) => void;
}

export const useAddressProcessor = ({ 
  restApiKey, 
  requestLimit, 
  requestDelay, 
  onError 
}: UseAddressProcessorOptions) => {
  const [results, setResults] = useState<AddressResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [userPosition, setUserPosition] = useState<UserPosition | null>(null);

  // 地址解析
  const geocodeAddress = useCallback(async (address: string): Promise<{ lng: number; lat: number }> => {
    const url = `https://restapi.amap.com/v3/geocode/geo?address=${encodeURIComponent(
      address
    )}&key=${restApiKey}&batch=false&output=JSON`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === '1' && data.geocodes && data.geocodes.length > 0) {
        const loc = data.geocodes[0].location.split(',');
        return {
          lng: Number.parseFloat(loc[0]),
          lat: Number.parseFloat(loc[1]),
        };
      } else {
        throw new Error(data.info || '未找到地址坐标');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`地址解析失败: ${error.message}`);
      }
      throw new Error('地址解析失败');
    }
  }, [restApiKey]);

  // 获取用户位置
  const getUserLocation = useCallback(async (manualLocation?: string): Promise<UserPosition> => {
    // 如果有手动设置的位置，优先使用
    if (manualLocation?.trim()) {
      try {
        const location = await geocodeAddress(manualLocation.trim());
        console.log('使用手动设置位置:', location);
        return location;
      } catch (error) {
        console.warn('手动位置解析失败，尝试其他定位方式');
      }
    }

    // 尝试使用高德地图的IP定位服务
    if (restApiKey.trim()) {
      try {
        const ipLocationUrl = `https://restapi.amap.com/v3/ip?key=${restApiKey}&output=JSON`;
        const response = await fetch(ipLocationUrl);
        const data = await response.json();

        if (data.status === '1' && data.rectangle) {
          // 从矩形范围中取中心点
          const coords = data.rectangle.split(';')[0].split(',');
          const location = {
            lng: parseFloat(coords[0]),
            lat: parseFloat(coords[1]),
          };
          console.log('使用高德IP定位:', location, '城市:', data.city);
          return location;
        }
      } catch (error) {
        console.warn('高德IP定位失败:', error);
      }
    }

    // 最后尝试浏览器定位
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('浏览器不支持定位'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lng = pos.coords.longitude;
          const lat = pos.coords.latitude;
          
          // 检查是否在中国境内的合理范围
          if (lng >= 73 && lng <= 135 && lat >= 18 && lat <= 54) {
            resolve({ lng, lat });
          } else {
            reject(new Error('定位结果可能不准确，建议手动设置位置'));
          }
        },
        (err) => {
          let errorMessage = '浏览器定位失败';
          switch (err.code) {
            case err.PERMISSION_DENIED:
              errorMessage = '用户拒绝了定位请求，请手动设置位置';
              break;
            case err.POSITION_UNAVAILABLE:
              errorMessage = '位置信息不可用，请手动设置位置';
              break;
            case err.TIMEOUT:
              errorMessage = '定位请求超时，请手动设置位置';
              break;
          }
          reject(new Error(errorMessage));
        },
        {
          timeout: 10000,
          enableHighAccuracy: true,
          maximumAge: 300000,
        }
      );
    });
  }, [geocodeAddress, restApiKey]);

  // 计算两点间距离
  const getDistance = useCallback((
    lng1: number,
    lat1: number,
    lng2: number,
    lat2: number
  ): number => {
    const radLat1 = (lat1 * Math.PI) / 180.0;
    const radLat2 = (lat2 * Math.PI) / 180.0;
    const a = radLat1 - radLat2;
    const b = ((lng1 - lng2) * Math.PI) / 180.0;
    let s =
      2 *
      Math.asin(
        Math.sqrt(
          Math.pow(Math.sin(a / 2), 2) +
            Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)
        )
      );
    s = s * 6378137.0; // 地球半径
    s = Math.round(s * 10000) / 10000;
    return s;
  }, []);

  // 处理地址批量查询
  const processAddresses = useCallback(async (
    addressesText: string,
    manualLocation?: string
  ) => {
    if (!restApiKey.trim()) {
      onError?.('请先输入REST API Key');
      return;
    }

    if (!addressesText.trim()) {
      onError?.('请输入地址');
      return;
    }

    setLoading(true);
    setResults([]);

    try {
      // 获取用户位置
      const userPos = await getUserLocation(manualLocation);
      setUserPosition(userPos);

      // 解析地址列表
      const addressList = addressesText
        .split('\n')
        .filter((line) => line.trim() !== '');

      // 检查请求次数限制
      if (addressList.length > requestLimit) {
        onError?.(
          `地址数量超过限制！最多可处理 ${requestLimit} 个地址，当前输入了 ${addressList.length} 个地址。`
        );
        setLoading(false);
        return;
      }

      const results: AddressResult[] = [];

      // 处理每个地址
      for (let i = 0; i < addressList.length; i++) {
        const addr = addressList[i];
        try {
          const location = await geocodeAddress(addr.trim());
          const distance = getDistance(
            userPos.lng,
            userPos.lat,
            location.lng,
            location.lat
          );
          results.push({ address: addr.trim(), location, distance });
        } catch (error) {
          results.push({
            address: addr.trim(),
            location: null,
            distance: null,
            error: error instanceof Error ? error.message : '未知错误',
          });
        }

        // 添加延迟（除了最后一个请求）
        if (i < addressList.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, requestDelay));
        }
      }

      // 按距离排序
      results.sort((a, b) => {
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });

      setResults(results);
      return { userPosition: userPos, results };

    } catch (error) {
      onError?.(error instanceof Error ? error.message : '处理失败');
    } finally {
      setLoading(false);
    }
  }, [restApiKey, requestLimit, requestDelay, getUserLocation, geocodeAddress, getDistance, onError]);

  return {
    results,
    loading,
    userPosition,
    setUserPosition,
    processAddresses,
    getUserLocation,
    clearResults: () => setResults([]),
  };
};
