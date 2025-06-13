"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Settings, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import Link from "next/link";

export default function SettingsPage() {
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

  const [error, setError] = useState("");

  // 密钥保存状态 - 根据实际值判断
  const keysSaved = {
    jsApi: Boolean(jsApiKey),
    restApi: Boolean(restApiKey),
    security: Boolean(securityCode),
  };

  // API配置测试函数
  const testApiConfig = async () => {
    if (!jsApiKey.trim() && !restApiKey.trim()) {
      setError("请至少输入一个API Key进行测试");
      return;
    }

    setError("");
    let testResults: string[] = [];

    // 测试REST API (如果有)
    if (restApiKey.trim()) {
      try {
        const testUrl = `https://restapi.amap.com/v3/geocode/geo?address=北京市天安门&key=${restApiKey}&output=JSON`;
        const response = await fetch(testUrl);
        const data = await response.json();

        if (data.status === "1") {
          testResults.push("✅ REST API Key 配置正确");
        } else {
          testResults.push(
            `❌ REST API Key 错误: ${data.info} (${data.infocode})`
          );
        }
      } catch (error) {
        testResults.push(
          `❌ REST API 测试失败: ${
            error instanceof Error ? error.message : "网络错误"
          }`
        );
      }
    }

    // 测试JS API (简单验证格式)
    if (jsApiKey.trim()) {
      if (jsApiKey.length >= 30) {
        testResults.push("✅ JS API Key 格式正确");
      } else {
        testResults.push("❌ JS API Key 格式可能不正确");
      }
    }

    setError(testResults.join("\n"));
  };

  // 清除保存的密钥
  const clearSavedKeys = () => {
    setJsApiKey("");
    setRestApiKey("");
    setSecurityCode("");
    setError("API密钥已清除");
  };

  // 清除所有保存的设置
  const clearAllSettings = () => {
    setJsApiKey("");
    setRestApiKey("");
    setSecurityCode("");
    setManualLocation("");
    setRequestLimit(50);
    setRequestDelay(1000);
    setError("所有设置已清除");
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-6">        <div className="flex items-center gap-4 mb-4">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回主页
            </Button>
          </Link>
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg">
            <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none">
              <g stroke="white" strokeWidth="2" fill="none">
                <path d="M6 8L12 6L20 10L26 8V22L20 24L12 20L6 22V8Z" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 6V20M20 10V24" strokeLinecap="round"/>
              </g>
              <g fill="white">
                <circle cx="16" cy="14" r="3" fill="#ef4444"/>
                <circle cx="16" cy="14" r="1.5" fill="white"/>
              </g>
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold">系统设置</h1>
            <p className="text-gray-600">配置API密钥和应用参数</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* API配置 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              API配置
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <Label htmlFor="jsApiKey">
                  高德地图JS API Key (用于地图显示)
                </Label>
                {keysSaved.jsApi && (
                  <Badge variant="secondary" className="text-xs">
                    💾 已保存
                  </Badge>
                )}
              </div>
              <Input
                id="jsApiKey"
                type="password"
                placeholder="请输入您的高德地图JS API Key"
                value={jsApiKey}
                onChange={(e) => setJsApiKey(e.target.value)}
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <Label htmlFor="restApiKey">
                  高德地图REST API Key (用于地址解析)
                </Label>
                {keysSaved.restApi && (
                  <Badge variant="secondary" className="text-xs">
                    💾 已保存
                  </Badge>
                )}
              </div>
              <Input
                id="restApiKey"
                type="password"
                placeholder="请输入您的高德地图REST API Key"
                value={restApiKey}
                onChange={(e) => setRestApiKey(e.target.value)}
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <Label htmlFor="securityCode">安全密钥</Label>
                {keysSaved.security && (
                  <Badge variant="secondary" className="text-xs">
                    💾 已保存
                  </Badge>
                )}
              </div>
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
              分别申请JS API Key和REST API Key以及安全密钥
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={testApiConfig}
                disabled={!jsApiKey.trim() && !restApiKey.trim()}
                className="flex-1"
              >
                测试配置
              </Button>

              <Button
                variant="destructive"
                onClick={clearSavedKeys}
                size="sm"
                title="清除保存的密钥"
              >
                清除密钥
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 应用设置 */}
        <Card>
          <CardHeader>
            <CardTitle>应用设置</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="manualLocation">默认起始位置（可选）</Label>
              <Input
                id="manualLocation"
                placeholder="例如：北京市朝阳区三里屯 或留空使用自动定位"
                value={manualLocation}
                onChange={(e) => setManualLocation(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                如果自动定位不准确，可以设置一个默认的起始位置
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="requestLimit">请求次数限制</Label>
                <Input
                  id="requestLimit"
                  type="number"
                  min="1"
                  max="50"
                  placeholder="50"
                  value={requestLimit}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value) && value >= 1 && value <= 50) {
                      setRequestLimit(value);
                    }
                  }}
                />
                <p className="text-xs text-gray-500 mt-1">
                  一次最多处理的地址数量（1-50）
                </p>
              </div>

              <div>
                <Label htmlFor="requestDelay">请求间隔(毫秒)</Label>
                <Input
                  id="requestDelay"
                  type="number"
                  min="100"
                  max="5000"
                  placeholder="1000"
                  value={requestDelay}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value) && value >= 100 && value <= 5000) {
                      setRequestDelay(value);
                    }
                  }}
                />
                <p className="text-xs text-gray-500 mt-1">
                  每次API请求的间隔时间（100-5000ms）
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={clearAllSettings}
                className="text-red-600 hover:text-red-700"
              >
                重置所有设置
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* API配置说明 */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800 text-lg">
              📋 API配置说明
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-700 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="font-semibold">🗺️ JS API Key (用于地图显示)</p>
                <p>• 用于加载和显示高德地图</p>
                <p>• 需要在控制台启用"Web端(JS API)"服务</p>
              </div>
              <div>
                <p className="font-semibold">🔍 REST API Key (用于地址解析)</p>
                <p>• 用于地址转换为坐标信息</p>
                <p>• 需要在控制台启用"Web服务API"</p>
              </div>
              <div>
                <p className="font-semibold">🔐 安全密钥</p>
                <p>• 提高API访问安全性</p>
                <p>• 在应用管理中配置数字签名</p>
              </div>
            </div>
            <div className="mt-3 p-2 bg-yellow-100 rounded border-yellow-300 border">
              <p className="text-yellow-800 text-xs">
                💡 <strong>提示：</strong>
                请在
                <a
                  href="https://console.amap.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline mx-1"
                >
                  高德开放平台控制台
                </a>
                申请相应的API密钥。所有设置都会自动保存在浏览器本地存储中。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {error && (
        <Alert className="mt-4" variant={error.includes("✅") ? "default" : "destructive"}>
          <AlertDescription className="whitespace-pre-line">{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
