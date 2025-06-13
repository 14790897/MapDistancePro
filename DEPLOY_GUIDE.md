# 快速部署指南

## 环境变量推送到Vercel

### 方法一：使用npm脚本（推荐）

```powershell
# 推送到生产环境
pnpm run env:push

# 推送到所有环境（development, preview, production）
pnpm run env:push:all

# 推送到预览环境
pnpm run env:push:preview

# 推送到开发环境
pnpm run env:push:dev
```

### 方法二：直接使用PowerShell脚本

```powershell
# 推送到生产环境
.\push-env.ps1

# 推送到所有环境
.\push-env.ps1 -All

# 推送到特定环境
.\push-env.ps1 -Preview
.\push-env.ps1 -Development
```

### 方法三：手动使用Vercel CLI

```powershell
# 安装Vercel CLI
npm i -g vercel

# 登录
vercel login

# 链接项目
vercel link

# 手动添加环境变量
vercel env add NEXT_PUBLIC_AMAP_JS_API_KEY production
vercel env add NEXT_PUBLIC_AMAP_REST_API_KEY production
vercel env add NEXT_PUBLIC_AMAP_SECURITY_CODE production
vercel env add NEXT_PUBLIC_DEFAULT_LOCATION production
vercel env add NEXT_PUBLIC_REQUEST_LIMIT production
vercel env add NEXT_PUBLIC_REQUEST_DELAY production
```

## 部署项目

```powershell
# 部署到生产环境
pnpm run deploy

# 部署预览版本
pnpm run deploy:preview

# 或者直接使用Vercel CLI
vercel --prod
vercel
```

## 验证部署

1. 检查Vercel Dashboard中的环境变量设置
2. 访问部署后的网站，确认功能正常
3. 检查浏览器控制台，确认环境变量正确加载

## 常见问题

**Q: 环境变量推送失败？**
A: 确保已登录Vercel CLI并且有项目权限

**Q: 部署后环境变量没有生效？**
A: 修改环境变量后需要重新部署才能生效

**Q: 密钥暴露在浏览器？**
A: NEXT_PUBLIC_* 前缀的变量会暴露到客户端，这是正常的，高德地图API需要在客户端使用
