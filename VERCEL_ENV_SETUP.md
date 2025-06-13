# Vercel环境变量配置指南

## 方法一：使用Vercel CLI推送环境变量

### 1. 安装Vercel CLI
```powershell
npm i -g vercel
# 或者
pnpm add -g vercel
```

### 2. 登录Vercel
```powershell
vercel login
```

### 3. 链接项目（如果还未链接）
```powershell
vercel link
```

### 4. 推送环境变量
```powershell
# 推送单个环境变量
vercel env add NEXT_PUBLIC_AMAP_JS_API_KEY production
vercel env add NEXT_PUBLIC_AMAP_REST_API_KEY production  
vercel env add NEXT_PUBLIC_AMAP_SECURITY_CODE production
vercel env add NEXT_PUBLIC_DEFAULT_LOCATION production
vercel env add NEXT_PUBLIC_REQUEST_LIMIT production
vercel env add NEXT_PUBLIC_REQUEST_DELAY production

# 或者推送所有环境（development, preview, production）
vercel env add NEXT_PUBLIC_AMAP_JS_API_KEY
vercel env add NEXT_PUBLIC_AMAP_REST_API_KEY
vercel env add NEXT_PUBLIC_AMAP_SECURITY_CODE
vercel env add NEXT_PUBLIC_DEFAULT_LOCATION
vercel env add NEXT_PUBLIC_REQUEST_LIMIT
vercel env add NEXT_PUBLIC_REQUEST_DELAY
```

### 5. 验证环境变量
```powershell
vercel env ls
```

## 方法二：通过Vercel Dashboard设置

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目
3. 进入 **Settings** → **Environment Variables**
4. 添加以下环境变量：

| 变量名 | 值 | 环境 |
|--------|----|----|
| `NEXT_PUBLIC_AMAP_JS_API_KEY` | 你的JS API Key | Production |
| `NEXT_PUBLIC_AMAP_REST_API_KEY` | 你的REST API Key | Production |
| `NEXT_PUBLIC_AMAP_SECURITY_CODE` | 你的安全密钥 | Production |
| `NEXT_PUBLIC_DEFAULT_LOCATION` | 鹤沙航城 | Production |
| `NEXT_PUBLIC_REQUEST_LIMIT` | 50 | Production |
| `NEXT_PUBLIC_REQUEST_DELAY` | 1000 | Production |

## 方法三：批量导入.env文件

### 1. 创建env导入脚本
```powershell
# 使用Vercel CLI批量导入
vercel env pull .env.vercel
```

### 2. 从.env.local推送到Vercel
```powershell
# 将.env.local内容推送到Vercel
vercel env add production < .env.local
```

## 注意事项

- ⚠️ **安全提醒**：环境变量中包含敏感信息，请确保：
  - 不要将真实密钥提交到Git仓库
  - 在生产环境中使用专门的密钥
  - 定期轮换API密钥

- 🔄 **部署后**：设置环境变量后需要重新部署才能生效
  ```powershell
  vercel --prod
  ```

- 📝 **验证**：部署完成后，可以在应用中检查环境变量是否正确加载

## 环境变量说明

- `NEXT_PUBLIC_*` 前缀的变量会暴露到浏览器端
- 这些变量在构建时被替换为实际值
- 修改环境变量后需要重新构建和部署
