# MapDistancePro - 批量地址距离计算与地图标注

一个基于高德地图 API 的批量地址距离计算工具，支持在地图上标注多个地址点并计算到用户位置的距离。

## ✨ 功能特点

- 📍 批量地址解析和距离计算
- 🗺️ 地图可视化标注
- 📊 结果按距离排序
- 📤 支持 CSV 格式导出
- ⚙️ 灵活的配置选项
- 🔐 支持环境变量默认配置
- 💾 自动保存用户配置

## 🚀 快速开始

### 1. 获取高德地图 API 密钥

1. 访问 [高德开放平台](https://console.amap.com/)
2. 注册/登录账号并创建新应用
3. 添加 Key，勾选以下服务：
   - ✅ **Web 端(JS API)** - 用于地图显示
   - ✅ **Web 服务 API** - 用于地址解析
4. 配置白名单（IP 白名单设置为 `*`，域名白名单添加您的域名）
5. 启用数字签名并获取安全密钥

### 2. 环境配置

**方式一：环境变量配置（推荐）**

```bash
# 复制配置模板
Copy-Item .env.example .env.local
```

在 `.env.local` 文件中填入你的高德地图 API 密钥：

```env
NEXT_PUBLIC_AMAP_JS_API_KEY=your_js_api_key_here
NEXT_PUBLIC_AMAP_REST_API_KEY=your_rest_api_key_here
NEXT_PUBLIC_AMAP_SECURITY_CODE=your_security_code_here
```

**方式二：应用内配置**

如果没有配置环境变量，也可以在应用的设置页面手动输入密钥。

### 3. 安装和运行

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

访问 `http://localhost:3000` 即可使用。

## 📢 产品宣传页面

我们为 MapDistancePro 设计了全新的产品宣传页面！

- 🌟 **访问路径**: `https://map.14790897.xyz/promo`
- 🎨 **精美设计**: 现代化UI设计，展示产品核心价值
- 📊 **功能亮点**: 详细介绍所有功能特性和技术优势
- 🎯 **应用场景**: 展示房地产、物流、市场调研等多种使用场景
- 📈 **实时数据**: 动态显示用户统计和评分信息

在主应用页面点击 **"产品介绍"** 按钮即可访问！

## 🛠️ 技术栈

- **框架**: Next.js 15
- **样式**: Tailwind CSS + shadcn/ui
- **地图服务**: 高德地图 API
- **部署**: Vercel

## 📊 数据处理流程

1. **用户输入**: 批量地址列表
2. **位置获取**: 自动获取用户 GPS 位置
3. **地址解析**: 调用高德地图 API 转换为坐标
4. **距离计算**: 使用球面距离公式计算距离
5. **结果排序**: 按距离远近排序
6. **地图标注**: 可视化显示所有位置
7. **数据导出**: 支持 CSV 格式导出

## 📁 项目结构

```
app/
  ├── page.tsx          # 主应用页面（包含所有数据处理逻辑）
  ├── layout.tsx        # 应用布局
  └── globals.css       # 全局样式

components/
  └── ui/              # UI组件库
      ├── button.tsx
      ├── input.tsx
      ├── card.tsx
      └── ...

lib/
  └── utils.ts         # 工具函数
```

## 📚 详细文档

- **[环境变量配置指南](./ENV_CONFIG.md)** - 本地开发和生产环境的完整配置说明
- **[部署指南](./DEPLOY_GUIDE.md)** - Vercel部署的详细步骤
- **[SEO优化指南](./SEO_GUIDE.md)** - 搜索引擎优化配置
- **[Vercel命令参考](./VERCEL_COMMANDS.md)** - 环境变量推送命令

## 🔧 开发指南

继续开发请访问: **[https://v0.dev/chat/projects/8LdFw13Wphf](https://v0.dev/chat/projects/8LdFw13Wphf)**

### 核心功能模块

- **地理编码**: `geocodeAddress()` - 地址转坐标
- **距离计算**: `getDistance()` - 球面距离算法
- **批量处理**: `processAddresses()` - 主处理流程
- **位置获取**: `getUserLocation()` - GPS 定位
- **数据导出**: `exportResults()` - CSV 导出

## ❓ 常见问题

### `USERKEY_PLAT_NOMATCH` 错误

这是最常见的错误，解决方案：

1. **检查服务平台设置**
   ```
   控制台 → 我的应用 → 选择应用 → 添加Key → 勾选：
   ✅ Web服务API
   ✅ Web端(JS API)
   ```

2. **检查白名单配置**
   ```
   IP白名单：设置为 * (允许所有IP)
   域名白名单：添加您的部署域名
   ```

3. **数字签名配置**
   ```
   启用数字签名并妥善保管安全密钥
   ```

### 其他错误码

- `10001`: API Key 不正确或已过期
- `10003`: 访问已超出日访问量
- `10005`: IP 白名单限制
- `10006`: 域名白名单限制
- `20001`: 缺少必填参数

## 🆘 技术支持

如遇问题，请检查：

1. API Key 配置是否正确
2. 网络连接是否正常
3. 浏览器是否支持地理定位

更多详细信息请参考对应的文档指南。
