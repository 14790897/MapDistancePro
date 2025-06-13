# 环境变量配置说明

## 配置文件

1. **复制配置模板**：
   ```bash
   Copy-Item .env.example .env.local
   ```

2. **编辑配置文件**：
   在 `.env.local` 文件中填入你的API密钥

## 必需配置

```env
# 高德地图JS API Key（用于地图显示）
NEXT_PUBLIC_AMAP_JS_API_KEY=your_js_api_key_here

# 高德地图REST API Key（用于地址解析）
NEXT_PUBLIC_AMAP_REST_API_KEY=your_rest_api_key_here

# 高德地图安全密钥
NEXT_PUBLIC_AMAP_SECURITY_CODE=your_security_code_here
```

## 可选配置

```env
# 默认位置设置
NEXT_PUBLIC_DEFAULT_LOCATION=北京市

# 请求数量限制
NEXT_PUBLIC_REQUEST_LIMIT=50

# 请求延迟（毫秒）
NEXT_PUBLIC_REQUEST_DELAY=1000
```

## 获取API密钥

1. 访问 [高德开放平台](https://console.amap.com/)
2. 注册/登录账号
3. 创建新应用
4. 添加Key并启用以下服务：
   - Web端(JS API)
   - Web服务API
5. 配置白名单和数字签名
6. 复制生成的密钥到配置文件

## 配置优先级

- **用户设置** > **环境变量默认值**
- 用户可以在应用设置页面覆盖环境变量配置
- 如果用户清空设置，会自动回退到环境变量配置
