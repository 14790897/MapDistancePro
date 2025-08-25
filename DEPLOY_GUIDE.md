# 快速部署指南

本指南将帮助您将 MapDistancePro 部署到 Vercel 生产环境。

## 前置条件

确保您已经：
- 完成了 [环境变量配置](./ENV_CONFIG.md)
- 获取了高德地图 API 密钥
- 创建了 Vercel 账号

## 部署步骤

### 1. 环境变量推送到Vercel

**方法一：使用npm脚本（推荐）**

```bash
# 推送到生产环境
pnpm run env:push

# 推送到所有环境（development, preview, production）
pnpm run env:push:all

# 推送到预览环境
pnpm run env:push:preview

# 推送到开发环境
pnpm run env:push:dev
```

**方法二：直接使用PowerShell脚本**

```powershell
# 推送到生产环境
.\push-env.ps1

# 推送到所有环境
.\push-env.ps1 -All

# 推送到特定环境
.\push-env.ps1 -Preview
.\push-env.ps1 -Development
```

**方法三：手动使用Vercel CLI**

详细命令参考 [Vercel命令指南](./VERCEL_COMMANDS.md)

### 2. 部署项目

```bash
# 部署到生产环境
pnpm run deploy

# 部署预览版本
pnpm run deploy:preview

# 或者直接使用Vercel CLI
vercel --prod
vercel
```

### 3. 验证部署

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

**Q: 如何检查部署状态？**
A: 访问 [Vercel Dashboard](https://vercel.com/dashboard) 查看部署状态和日志

## 相关链接

- [环境变量配置完整指南](./ENV_CONFIG.md)
- [Vercel命令参考](./VERCEL_COMMANDS.md)
- [SEO优化配置](./SEO_GUIDE.md)
