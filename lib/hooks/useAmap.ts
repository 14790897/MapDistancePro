import { useRef, useCallback, useEffect, useState } from 'react';

interface MapLocation {
  lng: number;
  lat: number;
}

interface MapMarker {
  id: string;
  location: MapLocation;
  title: string;
  isUser?: boolean;
}

interface UseAmapOptions {
  jsApiKey: string;
  securityCode: string;
  onMapReady?: () => void;
  onError?: (error: string) => void;
}

export const useAmap = ({ jsApiKey, securityCode, onMapReady, onError }: UseAmapOptions) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const scriptLoadedRef = useRef(false);
  
  const [isMapReady, setIsMapReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 加载高德地图脚本
  const loadMapScript = useCallback(() => {
    if (!jsApiKey.trim() || !securityCode.trim()) {
      onError?.('请输入JS API Key和安全密钥');
      return;
    }

    if (scriptLoadedRef.current) {
      initMap();
      return;
    }

    setIsLoading(true);

    try {
      // 设置安全密钥
      window._AMapSecurityConfig = {
        securityJsCode: securityCode,
      };

      // 创建并加载脚本
      const script = document.createElement('script');
      script.src = `https://webapi.amap.com/maps?v=2.0&key=${jsApiKey}`;
      script.onload = () => {
        scriptLoadedRef.current = true;
        setIsLoading(false);
        initMap();
      };
      script.onerror = () => {
        setIsLoading(false);
        onError?.('地图API加载失败，请检查JS API Key和网络连接');
      };
      document.head.appendChild(script);

    } catch (err) {
      setIsLoading(false);
      onError?.(err instanceof Error ? err.message : '地图API加载失败');
    }
  }, [jsApiKey, securityCode, onError]);

  // 初始化地图
  const initMap = useCallback(() => {
    if (mapRef.current && window.AMap && !mapInstance.current) {
      try {
        mapInstance.current = new window.AMap.Map(mapRef.current, {
          zoom: 11,
          center: [116.397428, 39.90923], // 默认北京
          mapStyle: 'amap://styles/normal',
          dragEnable: true,
          zoomEnable: true,
          doubleClickZoom: true,
          keyboardEnable: true,
          scrollWheel: true,
          touchZoom: true,
        });

        mapInstance.current.on('complete', () => {
          console.log('地图加载完成');
          setIsMapReady(true);
          onMapReady?.();
        });

      } catch (err) {
        onError?.(err instanceof Error ? err.message : '地图初始化失败');
      }
    }
  }, [onMapReady, onError]);

  // 添加标记
  const addMarker = useCallback((marker: MapMarker) => {
    if (!mapInstance.current || !window.AMap) {
      console.warn('地图未准备好，无法添加标记');
      return null;
    }

    try {
      // 如果标记已存在，先移除
      if (markersRef.current.has(marker.id)) {
        removeMarker(marker.id);
      }

      // 创建简单的标记（先不用自定义图标，确保能显示）
      const amapMarker = new window.AMap.Marker({
        position: [marker.location.lng, marker.location.lat],
        map: mapInstance.current,
        title: marker.title,
        clickable: true,
        // 使用默认图标，确保显示
        icon: marker.isUser 
          ? 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png'
          : 'https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png',
        zIndex: marker.isUser ? 200 : 100,
      });

      // 添加信息窗口
      const infoWindow = new window.AMap.InfoWindow({
        content: `<div style="padding: 8px; font-size: 12px; color: #333;">${marker.title}</div>`,
        offset: new window.AMap.Pixel(0, -30),
      });

      // 添加点击事件
      amapMarker.on('click', () => {
        infoWindow.open(mapInstance.current, amapMarker.getPosition());
      });

      // 存储标记
      markersRef.current.set(marker.id, amapMarker);
      
      console.log(`标记添加成功: ${marker.title}`, marker.location);
      return amapMarker;

    } catch (err) {
      console.error('添加标记失败:', err);
      onError?.(`添加标记失败: ${err instanceof Error ? err.message : '未知错误'}`);
      return null;
    }
  }, [onError]);

  // 移除标记
  const removeMarker = useCallback((markerId: string) => {
    const marker = markersRef.current.get(markerId);
    if (marker) {
      marker.setMap(null);
      markersRef.current.delete(markerId);
    }
  }, []);

  // 清除所有标记
  const clearAllMarkers = useCallback(() => {
    markersRef.current.forEach((marker) => {
      marker.setMap(null);
    });
    markersRef.current.clear();
  }, []);

  // 设置地图中心
  const setMapCenter = useCallback((location: MapLocation, zoom?: number) => {
    if (mapInstance.current) {
      mapInstance.current.setCenter([location.lng, location.lat]);
      if (zoom) {
        mapInstance.current.setZoom(zoom);
      }
    }
  }, []);

  // 调整地图视野以包含所有标记
  const fitMapView = useCallback((locations: MapLocation[]) => {
    if (mapInstance.current && window.AMap && locations.length > 0) {
      try {
        const bounds = new window.AMap.Bounds();
        locations.forEach(pos => {
          bounds.extend([pos.lng, pos.lat]);
        });
        mapInstance.current.setBounds(bounds, true, [20, 20, 20, 20]);
      } catch (err) {
        console.error('调整地图视野失败:', err);
      }
    }
  }, []);

  // 自动加载地图
  useEffect(() => {
    if (jsApiKey && securityCode && !isMapReady && !isLoading) {
      loadMapScript();
    }
  }, [jsApiKey, securityCode, isMapReady, isLoading, loadMapScript]);

  return {
    mapRef,
    isMapReady,
    isLoading,
    loadMapScript,
    addMarker,
    removeMarker,
    clearAllMarkers,
    setMapCenter,
    fitMapView,
  };
};
