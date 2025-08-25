# Vercel环境变量推送命令

## 前置条件
```powershell
# 1. 安装Vercel CLI
npm i -g vercel

# 2. 登录Vercel
vercel login

# 3. 链接项目（如果还未链接）
vercel link
```

## 推送环境变量命令（逐个执行）

```powershell
# JS API Key
echo "your_js_api_key_here" | vercel env add NEXT_PUBLIC_AMAP_JS_API_KEY production --force

# REST API Key
echo "your_rest_api_key_here" | vercel env add NEXT_PUBLIC_AMAP_REST_API_KEY production --force

# 安全密钥
echo "your_security_code_here" | vercel env add NEXT_PUBLIC_AMAP_SECURITY_CODE production --force

# 默认位置
echo "北京市" | vercel env add NEXT_PUBLIC_DEFAULT_LOCATION production --force

# 请求限制
echo "50" | vercel env add NEXT_PUBLIC_REQUEST_LIMIT production --force

# 请求延迟
echo "1000" | vercel env add NEXT_PUBLIC_REQUEST_DELAY production --force
```

## 验证和部署

```powershell
# 查看环境变量
vercel env ls

# 部署到生产环境
vercel --prod
```

## 如果想推送到所有环境

```powershell
# 推送到development, preview, production
echo "your_js_api_key_here" | vercel env add NEXT_PUBLIC_AMAP_JS_API_KEY
echo "your_rest_api_key_here" | vercel env add NEXT_PUBLIC_AMAP_REST_API_KEY
echo "your_security_code_here" | vercel env add NEXT_PUBLIC_AMAP_SECURITY_CODE
echo "北京市" | vercel env add NEXT_PUBLIC_DEFAULT_LOCATION
echo "50" | vercel env add NEXT_PUBLIC_REQUEST_LIMIT
echo "1000" | vercel env add NEXT_PUBLIC_REQUEST_DELAY
```
