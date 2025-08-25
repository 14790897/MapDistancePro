# 环境变量配置完整指南

## 本地开发环境配置

### 1. 复制配置模板
```bash
Copy-Item .env.example .env.local
```

### 2. 编辑配置文件
在 `.env.local` 文件中填入你的API密钥：

#### 必需配置
```env
# 高德地图JS API Key（用于地图显示）
NEXT_PUBLIC_AMAP_JS_API_KEY=your_js_api_key_here

# 高德地图REST API Key（用于地址解析）
NEXT_PUBLIC_AMAP_REST_API_KEY=your_rest_api_key_here

# 高德地图安全密钥
NEXT_PUBLIC_AMAP_SECURITY_CODE=your_security_code_here
```

#### 可选配置
```env
# 默认位置设置
NEXT_PUBLIC_DEFAULT_LOCATION=北京市

# 请求数量限制
NEXT_PUBLIC_REQUEST_LIMIT=50

# 请求延迟（毫秒）
NEXT_PUBLIC_REQUEST_DELAY=1000
```

## 获取高德地图API密钥

1. 访问 [高德开放平台](https://console.amap.com/)
2. 注册/登录账号
3. 创建新应用
4. 添加Key并启用以下服务：
   - ✅ **Web端(JS API)** - 用于地图显示
   - ✅ **Web服务API** - 用于地址解析
5. 配置白名单（IP白名单设置为 `*`，域名白名单添加您的域名）
6. 启用数字签名并获取安全密钥
7. 复制生成的密钥到配置文件

## Vercel生产环境配置

### 方法一：使用Vercel CLI推送（推荐）

#### 1. 安装和配置Vercel CLI
```powershell
# 安装Vercel CLI
npm i -g vercel

# 登录Vercel
vercel login

# 链接项目（如果还未链接）
vercel link
```

#### 2. 推送环境变量
```powershell
# 推送单个环境变量到生产环境
vercel env add NEXT_PUBLIC_AMAP_JS_API_KEY production
vercel env add NEXT_PUBLIC_AMAP_REST_API_KEY production  
vercel env add NEXT_PUBLIC_AMAP_SECURITY_CODE production
vercel env add NEXT_PUBLIC_DEFAULT_LOCATION production
vercel env add NEXT_PUBLIC_REQUEST_LIMIT production
vercel env add NEXT_PUBLIC_REQUEST_DELAY production

# 或者推送到所有环境（development, preview, production）
vercel env add NEXT_PUBLIC_AMAP_JS_API_KEY
vercel env add NEXT_PUBLIC_AMAP_REST_API_KEY
vercel env add NEXT_PUBLIC_AMAP_SECURITY_CODE
vercel env add NEXT_PUBLIC_DEFAULT_LOCATION
vercel env add NEXT_PUBLIC_REQUEST_LIMIT
vercel env add NEXT_PUBLIC_REQUEST_DELAY
```

#### 3. 验证环境变量
```powershell
vercel env ls
```

### 方法二：通过Vercel Dashboard设置

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择您的项目
3. 进入 Settings → Environment Variables
4. 逐一添加以下环境变量：
   - `NEXT_PUBLIC_AMAP_JS_API_KEY`
   - `NEXT_PUBLIC_AMAP_REST_API_KEY`
   - `NEXT_PUBLIC_AMAP_SECURITY_CODE`
   - `NEXT_PUBLIC_DEFAULT_LOCATION`
   - `NEXT_PUBLIC_REQUEST_LIMIT`
   - `NEXT_PUBLIC_REQUEST_DELAY`

### 方法三：批量导入.env文件

```powershell
# 使用Vercel CLI批量导入
vercel env pull .env.vercel

# 将.env.local内容推送到Vercel
vercel env add production < .env.local
```

## 配置优先级

- **用户设置** > **环境变量默认值**
- 用户可以在应用设置页面覆盖环境变量配置
- 如果用户清空设置，会自动回退到环境变量配置

## 环境变量说明

- `NEXT_PUBLIC_*` 前缀的变量会暴露到浏览器端
- 这些变量在构建时被替换为实际值
- 修改环境变量后需要重新构建和部署

## 常见问题

**Q: 环境变量推送失败？**
A: 确保已登录Vercel CLI并且有项目权限

**Q: 部署后环境变量没有生效？**
A: 修改环境变量后需要重新部署才能生效

**Q: 密钥暴露在浏览器？**
A: NEXT_PUBLIC_* 前缀的变量会暴露到客户端，这是正常的，高德地图API需要在客户端使用
