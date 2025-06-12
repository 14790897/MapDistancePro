"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, MapPin, Navigation, Trash2, Download, Settings } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AddressResult {
  address: string
  location: { lng: number; lat: number } | null
  distance: number | null
  error?: string
}

interface UserPosition {
  lng: number
  lat: number
}

declare global {
  interface Window {
    AMap: any
    _AMapSecurityConfig: any
  }
}

export default function AmapAddressCalculator() {
  const [addresses, setAddresses] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [securityCode, setSecurityCode] = useState("")
  const [results, setResults] = useState<AddressResult[]>([])
  const [loading, setLoading] = useState(false)
  const [mapLoading, setMapLoading] = useState(false)
  const [userPosition, setUserPosition] = useState<UserPosition | null>(null)
  const [error, setError] = useState("")
  const [mapInitialized, setMapInitialized] = useState(false)

  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const userMarkerRef = useRef<any>(null)
  const scriptLoadedRef = useRef(false)

  // 清除地图标记
  const clearMarkers = useCallback(() => {
    if (userMarkerRef.current) {
      userMarkerRef.current.setMap(null)
      userMarkerRef.current = null
    }
    if (markersRef.current.length > 0) {
      markersRef.current.forEach((marker) => {
        if (marker && marker.setMap) {
          marker.setMap(null)
        }
      })
      markersRef.current = []
    }
  }, [])

  // 初始化地图
  const initMap = useCallback(() => {
    if (mapRef.current && window.AMap && !mapInstance.current) {
      try {
        mapInstance.current = new window.AMap.Map(mapRef.current, {
          zoom: 11,
          center: [116.397428, 39.90923], // 默认北京
          mapStyle: "amap://styles/normal",
        })
        setMapInitialized(true)
        setError("")
      } catch (err) {
        setError("地图初始化失败：" + (err instanceof Error ? err.message : "未知错误"))
      }
    }
  }, [])

  // 加载高德地图API
  const loadAmapScript = useCallback(() => {
    if (!apiKey.trim() || !securityCode.trim()) {
      setError("请输入API Key和安全密钥")
      return
    }

    if (scriptLoadedRef.current) {
      initMap()
      return
    }

    setMapLoading(true)
    setError("")

    try {
      // 设置安全密钥
      window._AMapSecurityConfig = {
        securityJsCode: securityCode,
      }

      // 创建并加载脚本
      const script = document.createElement("script")
      script.src = `https://webapi.amap.com/maps?v=2.0&key=${apiKey}`
      script.onload = () => {
        scriptLoadedRef.current = true
        setMapLoading(false)
        initMap()
      }
      script.onerror = () => {
        setMapLoading(false)
        setError("地图API加载失败，请检查API Key和网络连接")
      }
      document.head.appendChild(script)

      return () => {
        if (script.parentNode) {
          document.head.removeChild(script)
        }
      }
    } catch (err) {
      setMapLoading(false)
      setError("地图API加载失败：" + (err instanceof Error ? err.message : "未知错误"))
    }
  }, [apiKey, securityCode, initMap])

  // 获取用户当前位置
  const getUserLocation = (): Promise<UserPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("浏览器不支持定位"))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lng = pos.coords.longitude
          const lat = pos.coords.latitude
          resolve({ lng, lat })
        },
        (err) => {
          let errorMessage = "定位失败"
          switch (err.code) {
            case err.PERMISSION_DENIED:
              errorMessage = "用户拒绝了定位请求"
              break
            case err.POSITION_UNAVAILABLE:
              errorMessage = "位置信息不可用"
              break
            case err.TIMEOUT:
              errorMessage = "定位请求超时"
              break
          }
          reject(new Error(errorMessage))
        },
        {
          timeout: 15000,
          enableHighAccuracy: true,
          maximumAge: 300000, // 5分钟缓存
        },
      )
    })
  }

  // 地理编码API
  const geocodeAddress = async (address: string): Promise<{ lng: number; lat: number }> => {
    const url = `https://restapi.amap.com/v3/geocode/geo?address=${encodeURIComponent(address)}&key=${apiKey}&batch=false&output=JSON`

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status}`)
      }

      const data = await response.json()

      if (data.status === "1" && data.geocodes && data.geocodes.length > 0) {
        const loc = data.geocodes[0].location.split(",")
        return { lng: Number.parseFloat(loc[0]), lat: Number.parseFloat(loc[1]) }
      } else {
        throw new Error(data.info || "未找到地址坐标")
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`地址解析失败: ${error.message}`)
      }
      throw new Error("地址解析失败")
    }
  }

  // 计算两点间距离
  const getDistance = (lng1: number, lat1: number, lng2: number, lat2: number): number => {
    const radLat1 = (lat1 * Math.PI) / 180.0
    const radLat2 = (lat2 * Math.PI) / 180.0
    const a = radLat1 - radLat2
    const b = ((lng1 - lng2) * Math.PI) / 180.0
    let s =
      2 *
      Math.asin(
        Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)),
      )
    s = s * 6378137.0 // 地球半径
    s = Math.round(s * 10000) / 10000
    return s
  }

  // 添加地图标记
  const addMarker = (location: { lng: number; lat: number }, title: string, isUser = false) => {
    if (mapInstance.current && window.AMap) {
      try {
        const marker = new window.AMap.Marker({
          position: [location.lng, location.lat],
          map: mapInstance.current,
          title: title,
          icon: isUser
            ? "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png"
            : "https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png",
        })

        if (isUser) {
          userMarkerRef.current = marker
        } else {
          markersRef.current.push(marker)
        }
      } catch (err) {
        console.error("添加标记失败:", err)
      }
    }
  }

  // 调整地图视野以包含所有标记点
  const fitMapView = (positions: { lng: number; lat: number }[]) => {
    if (mapInstance.current && window.AMap && positions.length > 0) {
      try {
        const bounds = new window.AMap.Bounds()
        positions.forEach((pos) => {
          bounds.extend([pos.lng, pos.lat])
        })
        mapInstance.current.setBounds(bounds, false, [20, 20, 20, 20])
      } catch (err) {
        console.error("调整地图视野失败:", err)
      }
    }
  }

  // 主处理函数
  const processAddresses = async () => {
    if (!apiKey.trim() || !securityCode.trim()) {
      setError("请先输入API Key和安全密钥")
      return
    }

    if (!addresses.trim()) {
      setError("请输入地址")
      return
    }

    if (!mapInitialized) {
      setError("地图未初始化，请先加载地图")
      return
    }

    setLoading(true)
    setError("")
    setResults([])
    clearMarkers()

    try {
      // 获取用户位置
      const userPos = await getUserLocation()
      setUserPosition(userPos)

      // 解析地址列表
      const addressList = addresses.split("\n").filter((line) => line.trim() !== "")
      const results: AddressResult[] = []

      // 处理每个地址
      for (const addr of addressList) {
        try {
          const location = await geocodeAddress(addr.trim())
          const distance = getDistance(userPos.lng, userPos.lat, location.lng, location.lat)
          results.push({ address: addr.trim(), location, distance })
        } catch (error) {
          results.push({
            address: addr.trim(),
            location: null,
            distance: null,
            error: error instanceof Error ? error.message : "未知错误",
          })
        }
      }

      // 按距离排序
      results.sort((a, b) => {
        if (a.distance === null) return 1
        if (b.distance === null) return -1
        return a.distance - b.distance
      })

      setResults(results)

      // 更新地图
      if (mapInstance.current) {
        // 设置地图中心为用户位置
        mapInstance.current.setCenter([userPos.lng, userPos.lat])
        mapInstance.current.setZoom(12)

        // 添加用户位置标记
        addMarker(userPos, "我的位置", true)

        // 添加地址标记
        const validPositions = [userPos]
        results.forEach((result) => {
          if (result.location) {
            addMarker(result.location, result.address)
            validPositions.push(result.location)
          }
        })

        // 调整地图视野
        if (validPositions.length > 1) {
          fitMapView(validPositions)
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "处理失败")
    } finally {
      setLoading(false)
    }
  }

  // 清除所有数据
  const clearAll = () => {
    setAddresses("")
    setResults([])
    setError("")
    setUserPosition(null)
    clearMarkers()
    if (mapInstance.current) {
      mapInstance.current.setCenter([116.397428, 39.90923])
      mapInstance.current.setZoom(11)
    }
  }

  // 导出结果
  const exportResults = () => {
    if (results.length === 0) return

    const csvContent = [
      ["地址", "距离(公里)", "经度", "纬度", "状态"].join(","),
      ...results.map((result) =>
        [
          `"${result.address}"`,
          result.distance ? (result.distance / 1000).toFixed(2) : "无法计算",
          result.location?.lng || "无",
          result.location?.lat || "无",
          result.error || "成功",
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "地址距离计算结果.csv"
    link.click()
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-center mb-2">批量地址距离计算与地图标注</h1>
        <p className="text-gray-600 text-center">输入多个地址，自动计算到您当前位置的距离并在地图上标注</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧输入区域 */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                API配置
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="apiKey">高德地图API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="请输入您的高德地图API Key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="securityCode">安全密钥</Label>
                <Input
                  id="securityCode"
                  type="password"
                  placeholder="请输入您的高德地图安全密钥"
                  value={securityCode}
                  onChange={(e) => setSecurityCode(e.target.value)}
                />
              </div>

              <p className="text-sm text-gray-500">
                请在
                <a
                  href="https://console.amap.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline mx-1"
                >
                  高德开放平台
                </a>
                申请API Key和安全密钥
              </p>

              <Button
                onClick={loadAmapScript}
                disabled={mapLoading || !apiKey.trim() || !securityCode.trim()}
                className="w-full"
              >
                {mapLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    加载地图中...
                  </>
                ) : mapInitialized ? (
                  "地图已加载"
                ) : (
                  "加载地图"
                )}
              </Button>
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
                <Button onClick={processAddresses} disabled={loading || !mapInitialized} className="flex-1">
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
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{result.address}</p>
                        {result.error && <p className="text-sm text-red-500">{result.error}</p>}
                      </div>
                      <div className="text-right">
                        {result.distance !== null ? (
                          <Badge variant="secondary">{(result.distance / 1000).toFixed(2)} km</Badge>
                        ) : (
                          <Badge variant="destructive">失败</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 右侧地图区域 */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>地图标注</CardTitle>
            </CardHeader>
            <CardContent>
              <div ref={mapRef} className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                {!mapInitialized ? (
                  <div className="text-center">
                    <p className="text-gray-500 mb-2">{mapLoading ? "地图加载中..." : "请先配置API并加载地图"}</p>
                    {mapLoading && <Loader2 className="w-6 h-6 animate-spin mx-auto" />}
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>

          {userPosition && (
            <Card>
              <CardHeader>
                <CardTitle>当前位置</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  经度: {userPosition.lng.toFixed(6)}
                  <br />
                  纬度: {userPosition.lat.toFixed(6)}
                </p>
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
        </div>
      </div>

      {error && (
        <Alert className="mt-4" variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
