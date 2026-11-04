# Vercel环境变量推送命令

> ⚠️ 密钥不要写进这个文件。下面的命令从环境变量读取，
> 先在本地 `.env.local` 里填好真实值，再执行。

## 前置条件
```powershell
# 1. 安装Vercel CLI
npm i -g vercel

# 2. 登录Vercel
vercel login

# 3. 链接项目（如果还未链接）
vercel link
```

## 推送环境变量命令

PowerShell 下先加载 `.env.local`：

```powershell
Get-Content .env.local | ForEach-Object {
    if ($_ -match '^\s*([^#][^=]*)=(.*)$') {
        [Environment]::SetEnvironmentVariable($matches[1].Trim(), $matches[2].Trim(), 'Process')
    }
}
```

然后逐个推送：

```powershell
# JS API Key
echo $env:NEXT_PUBLIC_AMAP_JS_API_KEY | vercel env add NEXT_PUBLIC_AMAP_JS_API_KEY production --force

# REST API Key
echo $env:NEXT_PUBLIC_AMAP_REST_API_KEY | vercel env add NEXT_PUBLIC_AMAP_REST_API_KEY production --force

# 安全密钥
echo $env:NEXT_PUBLIC_AMAP_SECURITY_CODE | vercel env add NEXT_PUBLIC_AMAP_SECURITY_CODE production --force

# 默认位置
echo "鹤沙航城" | vercel env add NEXT_PUBLIC_DEFAULT_LOCATION production --force

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
echo $env:NEXT_PUBLIC_AMAP_JS_API_KEY | vercel env add NEXT_PUBLIC_AMAP_JS_API_KEY
echo $env:NEXT_PUBLIC_AMAP_REST_API_KEY | vercel env add NEXT_PUBLIC_AMAP_REST_API_KEY
echo $env:NEXT_PUBLIC_AMAP_SECURITY_CODE | vercel env add NEXT_PUBLIC_AMAP_SECURITY_CODE
echo "鹤沙航城" | vercel env add NEXT_PUBLIC_DEFAULT_LOCATION
echo "50" | vercel env add NEXT_PUBLIC_REQUEST_LIMIT
echo "1000" | vercel env add NEXT_PUBLIC_REQUEST_DELAY
```
