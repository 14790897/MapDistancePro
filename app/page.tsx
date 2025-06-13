"use client"

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  MapPin,
  Navigation,
  Trash2,
  Download,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";

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

declare global {
  interface Window {
    AMap: any;
    _AMapSecurityConfig: any;
  }
}

export default function AmapAddressCalculator() {
  const [addresses, setAddresses] = useLocalStorage("amap_addresses", "");

  // 使用 useLocalStorage 管理API密钥
  const [jsApiKey, setJsApiKey] = useLocalStorage("amap_js_api_key", "");
  const [restApiKey, setRestApiKey] = useLocalStorage("amap_rest_api_key", "");
  const [securityCode, setSecurityCode] = useLocalStorage(
    "amap_security_code",
    ""
  );

  // 使用 useLocalStorage 管理位置和配置设置
  const [manualLocation, setManualLocation] = useLocalStorage(
    "amap_manual_location",
    ""
  );
  const [requestLimit, setRequestLimit] = useLocalStorage(
    "amap_request_limit",
    50
  );
  const [requestDelay, setRequestDelay] = useLocalStorage(
    "amap_request_delay",
    1000
  );

  const [results, setResults] = useState<AddressResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [mapLoading, setMapLoading] = useState(false);
  const [userPosition, setUserPosition] = useState<UserPosition | null>(null);
  const [error, setError] = useState("");
  const [mapInitialized, setMapInitialized] = useState(false);
  // 密钥保存状态 - 根据实际值判断
  const keysSaved = {
    jsApi: Boolean(jsApiKey),
    restApi: Boolean(restApiKey),
    security: Boolean(securityCode),
  };
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const userMarkerRef = useRef<any>(null);
  const scriptLoadedRef = useRef(false);

  // 清除地图标记
  const clearMarkers = useCallback(() => {
    if (userMarkerRef.current) {
      userMarkerRef.current.setMap(null);
      userMarkerRef.current = null;
    }
    if (markersRef.current.length > 0) {
      markersRef.current.forEach((marker) => {
        if (marker && marker.setMap) {
          marker.setMap(null);
        }
      });
      markersRef.current = [];
    }
  }, []); // 自动定位用户位置
  const autoLocateUser = useCallback(async () => {
    if (!mapInstance.current) {
      console.warn("地图实例不存在，无法进行定位");
      return;
    }

    try {
      console.log("开始自动定位...");
      const userPos = await getUserLocation();
      setUserPosition(userPos);

      // 确保地图已经完全初始化
      setTimeout(() => {
        if (mapInstance.current) {
          // 更新地图中心和缩放级别
          mapInstance.current.setCenter([userPos.lng, userPos.lat]);
          mapInstance.current.setZoom(13);

          // 清除之前的用户标记
          if (userMarkerRef.current) {
            userMarkerRef.current.setMap(null);
            userMarkerRef.current = null;
          }

          // 添加用户位置标记
          addMarker(userPos, "我的位置", true);

          console.log("自动定位成功:", userPos);
        }
      }, 500); // 延迟500ms确保地图完全加载
    } catch (error) {
      console.warn("自动定位失败:", error);
      // 定位失败时不显示错误，用户可以手动设置位置或点击查询时再次尝试
    }
  }, []);
  const initMap = useCallback(() => {
    if (mapRef.current && window.AMap && !mapInstance.current) {
      try {
        mapInstance.current = new window.AMap.Map(mapRef.current, {
          zoom: 11,
          center: [116.397428, 39.90923], // 默认北京
          mapStyle: "amap://styles/normal",
          // 确保地图交互功能启用
          dragEnable: true,
          zoomEnable: true,
          doubleClickZoom: true,
          keyboardEnable: true,
          scrollWheel: true,
          touchZoom: true,
          touchZoomCenter: 1,
        }); // 监听地图完全加载事件
        mapInstance.current.on("complete", () => {
          console.log("地图加载完成，开始自动定位");
          console.log("地图实例:", mapInstance.current);
          console.log("AMap 对象:", window.AMap);
          setMapInitialized(true);
          setError("");

          // 地图完全加载后进行定位
          setTimeout(() => {
            autoLocateUser();
          }, 100);
        });
      } catch (err) {
        setError(
          "地图初始化失败：" + (err instanceof Error ? err.message : "未知错误")
        );
      }
    }
  }, [autoLocateUser]);

  // 加载高德地图API
  const loadAmapScript = useCallback(() => {
    if (!jsApiKey.trim() || !securityCode.trim()) {
      setError("请输入JS API Key和安全密钥");
      return;
    }

    if (scriptLoadedRef.current) {
      initMap();
      return;
    }

    setMapLoading(true);
    setError("");

    try {
      // 设置安全密钥
      window._AMapSecurityConfig = {
        securityJsCode: securityCode,
      };

      // 创建并加载脚本
      const script = document.createElement("script");
      script.src = `https://webapi.amap.com/maps?v=2.0&key=${jsApiKey}`;
      script.onload = () => {
        scriptLoadedRef.current = true;
        setMapLoading(false);
        initMap();
      };
      script.onerror = () => {
        setMapLoading(false);
        setError("地图API加载失败，请检查JS API Key和网络连接");
      };
      document.head.appendChild(script);

      return () => {
        if (script.parentNode) {
          document.head.removeChild(script);
        }
      };
    } catch (err) {
      setMapLoading(false);
      setError(
        "地图API加载失败：" + (err instanceof Error ? err.message : "未知错误")
      );
    }
  }, [jsApiKey, securityCode, initMap]);

  // 自动加载地图 - 如果有密钥数据就自动加载
  useEffect(() => {
    if (jsApiKey && securityCode && !mapInitialized && !mapLoading) {
      console.log("检测到密钥数据，自动加载地图...");
      loadAmapScript();
    }
  }, [jsApiKey, securityCode, mapInitialized, mapLoading, loadAmapScript]);

  // 获取用户当前位置 - 支持多种定位方式
  const getUserLocation = async (): Promise<UserPosition> => {
    // 如果有手动设置的位置，优先使用
    if (manualLocation.trim()) {
      try {
        const location = await geocodeAddress(manualLocation.trim());
        console.log("使用手动设置位置:", location);
        return location;
      } catch (error) {
        console.warn("手动位置解析失败，尝试其他定位方式");
      }
    }

    // 尝试使用高德地图的IP定位服务
    if (restApiKey.trim()) {
      try {
        const ipLocationUrl = `https://restapi.amap.com/v3/ip?key=${restApiKey}&output=JSON`;
        const response = await fetch(ipLocationUrl);
        const data = await response.json();

        if (data.status === "1" && data.rectangle) {
          // 从矩形范围中取中心点
          const coords = data.rectangle.split(";")[0].split(",");
          const location = {
            lng: parseFloat(coords[0]),
            lat: parseFloat(coords[1]),
          };
          console.log("使用高德IP定位:", location, "城市:", data.city);
          return location;
        }
      } catch (error) {
        console.warn("高德IP定位失败:", error);
      }
    }

    // 最后尝试浏览器定位
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("浏览器不支持定位"));
        return;
      }

      console.log("尝试浏览器定位...");
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lng = pos.coords.longitude;
          const lat = pos.coords.latitude;
          console.log(
            "浏览器定位结果:",
            { lng, lat },
            "精度:",
            pos.coords.accuracy + "米"
          );

          // 检查是否在中国境内的合理范围
          if (lng >= 73 && lng <= 135 && lat >= 18 && lat <= 54) {
            resolve({ lng, lat });
          } else {
            console.warn("浏览器定位结果不在中国境内，可能不准确");
            reject(new Error("定位结果可能不准确，建议手动设置位置"));
          }
        },
        (err) => {
          let errorMessage = "浏览器定位失败";
          switch (err.code) {
            case err.PERMISSION_DENIED:
              errorMessage = "用户拒绝了定位请求，请手动设置位置";
              break;
            case err.POSITION_UNAVAILABLE:
              errorMessage = "位置信息不可用，请手动设置位置";
              break;
            case err.TIMEOUT:
              errorMessage = "定位请求超时，请手动设置位置";
              break;
          }
          reject(new Error(errorMessage));
        },
        {
          timeout: 10000,
          enableHighAccuracy: true,
          maximumAge: 300000, // 5分钟缓存
        }
      );
    });
  };

  // 主处理函数
  const geocodeAddress = async (
    address: string
  ): Promise<{ lng: number; lat: number }> => {
    const url = `https://restapi.amap.com/v3/geocode/geo?address=${encodeURIComponent(
      address
    )}&key=${restApiKey}&batch=false&output=JSON`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === "1" && data.geocodes && data.geocodes.length > 0) {
        const loc = data.geocodes[0].location.split(",");
        return {
          lng: Number.parseFloat(loc[0]),
          lat: Number.parseFloat(loc[1]),
        };
      } else {
        throw new Error(data.info || "未找到地址坐标");
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`地址解析失败: ${error.message}`);
      }
      throw new Error("地址解析失败");
    }
  };

  // 计算两点间距离
  const getDistance = (
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
  }; // 添加地图标记
  const addMarker = (
    location: { lng: number; lat: number },
    title: string,
    isUser = false
  ) => {
    if (mapInstance.current && window.AMap) {
      try {
        console.log(`添加标记: ${title}`, location, "用户标记:", isUser);

        // 创建自定义图标
        const createCustomIcon = (color: string) => {
          return new window.AMap.Icon({
            size: new window.AMap.Size(25, 34),
            image: `data:image/svg+xml;base64,${btoa(`
              <svg width="25" height="34" viewBox="0 0 25 34" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.5 0C5.6 0 0 5.6 0 12.5C0 19.4 12.5 34 12.5 34S25 19.4 25 12.5C25 5.6 19.4 0 12.5 0Z" fill="${color}"/>
                <circle cx="12.5" cy="12.5" r="8" fill="white"/>
                <circle cx="12.5" cy="12.5" r="5" fill="${color}"/>
              </svg>
            `)}`,
            imageOffset: new window.AMap.Pixel(-12, -34),
          });
        };

        const marker = new window.AMap.Marker({
          position: [location.lng, location.lat],
          map: mapInstance.current,
          title: title,
          clickable: true,
          bubble: true,
          zIndex: isUser ? 200 : 100,
          icon: createCustomIcon(isUser ? "#1E40AF" : "#DC2626"), // 蓝色用户，红色地址
          anchor: "bottom-center",
        });

        // 添加信息窗口
        const infoWindow = new window.AMap.InfoWindow({
          content: `<div style="padding: 8px; font-size: 12px;">${title}</div>`,
          offset: new window.AMap.Pixel(0, -34),
        });

        // 添加点击事件
        marker.on("click", function () {
          console.log(`点击了标记: ${title}`, location);
          infoWindow.open(mapInstance.current, marker.getPosition());
        });

        // 鼠标悬停显示标题
        marker.on("mouseover", function () {
          infoWindow.open(mapInstance.current, marker.getPosition());
        });

        marker.on("mouseout", function () {
          infoWindow.close();
        });

        if (isUser) {
          userMarkerRef.current = marker;
          console.log("用户标记已添加");
        } else {
          markersRef.current.push(marker);
          console.log(
            "地址标记已添加，当前标记总数:",
            markersRef.current.length
          );
        }
      } catch (err) {
        console.error("添加标记失败:", err);
        // 如果自定义图标失败，使用默认标记
        try {
          const marker = new window.AMap.Marker({
            position: [location.lng, location.lat],
            map: mapInstance.current,
            title: title,
            clickable: true,
            bubble: true,
            zIndex: isUser ? 200 : 100,
          });

          if (isUser) {
            userMarkerRef.current = marker;
          } else {
            markersRef.current.push(marker);
          }
          console.log("使用默认标记成功");
        } catch (fallbackErr) {
          console.error("默认标记也失败:", fallbackErr);
        }
      }
    } else {
      console.warn("地图实例或AMap不存在，无法添加标记");
    }
  };
  // 调整地图视野以包含所有标记点
  const fitMapView = (positions: { lng: number; lat: number }[]) => {
    if (mapInstance.current && window.AMap && positions.length > 0) {
      try {
        const bounds = new window.AMap.Bounds();
        positions.forEach((pos) => {
          bounds.extend([pos.lng, pos.lat]);
        });
        // 使用 true 保持地图交互功能，添加边距确保标记不会被遮挡
        mapInstance.current.setBounds(bounds, true, [20, 20, 20, 20]);
      } catch (err) {
        console.error("调整地图视野失败:", err);
      }
    }
  };

  // 主处理函数
  const processAddresses = async () => {
    if (!jsApiKey.trim() || !restApiKey.trim() || !securityCode.trim()) {
      setError("请先输入JS API Key、REST API Key和安全密钥");
      return;
    }

    if (!addresses.trim()) {
      setError("请输入地址");
      return;
    }

    if (!mapInitialized) {
      setError("地图未初始化，请先加载地图");
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);
    clearMarkers();
    try {
      // 获取用户位置
      const userPos = await getUserLocation();
      setUserPosition(userPos);

      // 解析地址列表
      const addressList = addresses
        .split("\n")
        .filter((line) => line.trim() !== "");

      // 检查请求次数限制
      if (addressList.length > requestLimit) {
        setError(
          `地址数量超过限制！最多可处理 ${requestLimit} 个地址，当前输入了 ${addressList.length} 个地址。请减少地址数量或调整限制设置。`
        );
        setLoading(false);
        return;
      }

      const results: AddressResult[] = [];

      // 处理每个地址（添加延迟避免API频率限制）
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
            error: error instanceof Error ? error.message : "未知错误",
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

      setResults(results); // 更新地图
      if (mapInstance.current) {
        console.log("开始更新地图标记...");

        // 设置地图中心为用户位置
        mapInstance.current.setCenter([userPos.lng, userPos.lat]);
        mapInstance.current.setZoom(12);

        // 添加用户位置标记
        console.log("添加用户位置标记:", userPos);
        addMarker(userPos, "我的位置", true);

        // 添加地址标记
        const validPositions = [userPos];
        console.log("处理结果数量:", results.length);

        results.forEach((result, index) => {
          if (result.location) {
            console.log(
              `添加地址标记 ${index + 1}:`,
              result.address,
              result.location
            );
            addMarker(result.location, result.address);
            validPositions.push(result.location);
          }
        });
        console.log("有效位置总数:", validPositions.length);
        console.log(
          "当前地图上的标记数量:",
          markersRef.current.length + (userMarkerRef.current ? 1 : 0)
        );

        // 调整地图视野以显示所有标记
        // if (validPositions.length > 1) {
        //   setTimeout(() => {
        //     fitMapView(validPositions);
        //   }, 500);
        // }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "处理失败");
    } finally {
      setLoading(false);
    }
  }; // 清除所有数据
  const clearAll = () => {
    setAddresses("");
    setResults([]);
    setError("");
    setUserPosition(null);
    clearMarkers();
    if (mapInstance.current) {
      mapInstance.current.setCenter([116.397428, 39.90923]);
      mapInstance.current.setZoom(11);
    }
  };

  // 导出结果
  const exportResults = () => {
    if (results.length === 0) return;

    const csvContent = [
      ["地址", "距离(公里)", "经度", "纬度", "状态"].join(","),
      ...results.map((result) =>
        [
          `"${result.address}"`,
          result.distance ? (result.distance / 1000).toFixed(2) : "无法计算",
          result.location?.lng || "无",
          result.location?.lat || "无",
          result.error || "成功",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "地址距离计算结果.csv";
    link.click();
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {" "}
      <div className="mb-6">
        {" "}
        <div className="flex items-center justify-between mb-4">
          {" "}
          <div className="text-center flex-1">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg">
                <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none">
                  <g stroke="white" strokeWidth="2" fill="none">
                    <path
                      d="M6 8L12 6L20 10L26 8V22L20 24L12 20L6 22V8Z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path d="M12 6V20M20 10V24" strokeLinecap="round" />
                  </g>
                  <g fill="white">
                    <circle cx="16" cy="14" r="3" fill="#ef4444" />
                    <circle cx="16" cy="14" r="1.5" fill="white" />
                  </g>
                </svg>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">
                <span className="hidden sm:inline">
                  批量地址距离计算与地图标注
                </span>
                <span className="sm:hidden">地址距离计算</span>
              </h1>
            </div>
            <p className="text-gray-600 text-sm md:text-base">
              输入多个地址，自动计算到您当前位置的距离并在地图上标注
            </p>
          </div>
          <Link href="/settings">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              设置
            </Button>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {" "}
        {/* 左侧输入区域 */}
        <div className="space-y-4">
          {/* 快速开始检查 */}
          {(!jsApiKey || !restApiKey || !securityCode) && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-orange-800 text-lg">
                  ⚠️ 配置提醒
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-orange-700">
                <p className="mb-2">需要先配置API密钥才能使用此功能：</p>
                <div className="space-y-1">
                  {!jsApiKey && <p>• 缺少JS API Key（用于地图显示）</p>}
                  {!restApiKey && <p>• 缺少REST API Key（用于地址解析）</p>}
                  {!securityCode && <p>• 缺少安全密钥</p>}
                </div>
                <div className="mt-3">
                  <Link href="/settings">
                    <Button
                      size="sm"
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      前往设置
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
          {/* 地图加载按钮 */}
          {jsApiKey && securityCode && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  地图初始化
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={loadAmapScript}
                  disabled={mapLoading || mapInitialized}
                  className="w-full"
                >
                  {mapLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      加载地图中...
                    </>
                  ) : mapInitialized ? (
                    "✅ 地图已加载"
                  ) : (
                    "🗺️ 加载地图"
                  )}
                </Button>
              </CardContent>
            </Card>
          )}{" "}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                位置设置
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="currentLocation">当前位置设置</Label>
                <div className="flex gap-2">
                  <Input
                    id="currentLocation"
                    placeholder="自动定位中..."
                    value={manualLocation || "使用自动定位"}
                    readOnly
                    className="flex-1 bg-gray-50"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={autoLocateUser}
                    disabled={!mapInitialized}
                    title="重新定位"
                  >
                    📍
                  </Button>
                  <Link href="/settings">
                    <Button variant="outline" size="sm" title="位置设置">
                      ⚙️
                    </Button>
                  </Link>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  如需修改位置或调整其他参数，请点击设置按钮
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                地址输入
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="addresses">批量地址输入（每行一个）</Label>
                <Textarea
                  id="addresses"
                  placeholder="请输入地址，每行一个&#10;例如：&#10;北京市朝阳区三里屯&#10;上海市浦东新区陆家嘴&#10;广州市天河区珠江新城"
                  value={addresses}
                  onChange={(e) => setAddresses(e.target.value)}
                  rows={8}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={processAddresses}
                  disabled={loading || !mapInitialized}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      处理中...
                    </>
                  ) : (
                    <>
                      <Navigation className="w-4 h-4 mr-2" />
                      开始查询
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={clearAll}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  清除
                </Button>
              </div>
            </CardContent>
          </Card>
          {/* 结果列表 */}
          {results.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>查询结果 ({results.length})</CardTitle>
                  <Button variant="outline" size="sm" onClick={exportResults}>
                    <Download className="w-4 h-4 mr-2" />
                    导出CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {results.map((result, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{result.address}</p>
                        {result.error && (
                          <p className="text-sm text-red-500">{result.error}</p>
                        )}
                      </div>
                      <div className="text-right">
                        {result.distance !== null ? (
                          <Badge variant="secondary">
                            {(result.distance / 1000).toFixed(2)} km
                          </Badge>
                        ) : (
                          <Badge variant="destructive">失败</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}{" "}
        </div>
        {/* 右侧地图区域 */}
        <div className="space-y-4">
          {" "}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>地图标注</CardTitle>
                {mapInitialized && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // 测试添加标记
                      const testLocation = { lng: 116.397428, lat: 39.90923 };
                      addMarker(testLocation, "测试标记", false);
                      console.log("添加测试标记");
                    }}
                  >
                    测试标记
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div
                ref={mapRef}
                className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center"
              >
                {!mapInitialized ? (
                  <div className="text-center">
                    <p className="text-gray-500 mb-2">
                      {mapLoading ? "地图加载中..." : "请先配置API并加载地图"}
                    </p>
                    {mapLoading && (
                      <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                    )}
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>{" "}
          {userPosition && (
            <Card>
              <CardHeader>
                <CardTitle>当前位置信息</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">
                    <strong>经度:</strong> {userPosition.lng.toFixed(6)}
                  </p>
                  <p className="text-gray-600">
                    <strong>纬度:</strong> {userPosition.lat.toFixed(6)}
                  </p>
                  {manualLocation.trim() && (
                    <p className="text-blue-600">
                      <strong>位置来源:</strong> 手动设置 ({manualLocation})
                    </p>
                  )}
                  <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-yellow-800 text-xs">
                      💡 如果位置不准确，请在"位置设置"中手动输入您的实际位置
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {mapInitialized && (
            <Card>
              <CardHeader>
                <CardTitle>使用说明</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 space-y-2">
                <p>• 蓝色标记：您的当前位置</p>
                <p>• 红色标记：查询的地址位置</p>
                <p>• 结果按距离远近自动排序</p>
                <p>• 支持导出CSV格式数据</p>
              </CardContent>
            </Card>
          )}
        </div>{" "}
      </div>
      {error && (
        <Alert className="mt-4" variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
