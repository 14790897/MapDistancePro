# 高德地图批量地址距离计算工具

> 基于高德地图API的批量地址距离计算与地图标注应用

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/14790897s-projects/v0-amap-script-optimization)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/8LdFw13Wphf)

## 功能特性

- 🗺️ 批量地址解析与距离计算
- 📍 地图可视化标注
- 📊 距离排序与CSV导出
- 🔐 支持高德地图API安全密钥
- 📱 响应式界面设计

## 部署地址

在线体验: **[https://vercel.com/14790897s-projects/v0-amap-script-optimization](https://vercel.com/14790897s-projects/v0-amap-script-optimization)**

## 如何使用

### 1. 获取高德地图API密钥

1. 访问 [高德开放平台](https://console.amap.com/)
2. 注册/登录账号
3. 创建应用并获取以下密钥：
   - **JS API Key** (用于地图显示)
   - **REST API Key** (用于地址解析)
   - **安全密钥** (数字签名)

### 2. API Key 配置要求

⚠️ **重要：本应用需要两种不同的API Key**

#### JS API Key 配置
- **服务类型**: Web端(JS API)
- **用途**: 地图显示和交互
- **配置位置**: 控制台 → 我的应用 → 添加Key → 勾选"Web端(JS API)"

#### REST API Key 配置  
- **服务类型**: Web服务API
- **用途**: 地址解析和地理编码
- **配置位置**: 控制台 → 我的应用 → 添加Key → 勾选"Web服务API"

> 💡 **提示**: 可以使用同一个Key同时启用两个服务，但建议分开配置以便独立管理

#### 白名单设置

- **IP白名单**: 添加 `*` 或您的服务器IP
- **域名白名单**: 添加您的部署域名


### 3. 密钥持久保存

🔒 **安全特性**: 应用会自动将您的API密钥保存到浏览器的localStorage中

- **自动保存**: 输入密钥后会立即保存到浏览器本地
- **自动加载**: 下次访问时会自动加载之前保存的密钥
- **安全性**: 密钥仅保存在您的浏览器中，不会发送到任何服务器
- **清除功能**: 可以通过🗑️按钮清除所有保存的密钥

### 4. 常见错误解决

#### `USERKEY_PLAT_NOMATCH` 错误
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

#### 其他错误码说明
- `10001`: API Key不正确或已过期
- `10003`: 访问已超出日访问量
- `10005`: IP白名单限制
- `10006`: 域名白名单限制
- `20001`: 缺少必填参数

## 本地开发

### 环境要求
- Node.js 18+
- pnpm (推荐) 或 npm

### 安装依赖
```bash
pnpm install
```

### 启动开发服务器
```bash
pnpm dev
```

### 构建生产版本
```bash
pnpm build
```

## 技术栈

- **框架**: Next.js 15
- **样式**: Tailwind CSS + shadcn/ui
- **地图服务**: 高德地图API
- **部署**: Vercel

## 数据处理流程

1. **用户输入**: 批量地址列表
2. **位置获取**: 自动获取用户GPS位置
3. **地址解析**: 调用高德地图API转换为坐标
4. **距离计算**: 使用球面距离公式计算距离
5. **结果排序**: 按距离远近排序
6. **地图标注**: 可视化显示所有位置
7. **数据导出**: 支持CSV格式导出

## 项目结构

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

## 数据处理核心代码

主要的数据处理逻辑都在 `app/page.tsx` 中：

- **地理编码**: `geocodeAddress()` - 地址转坐标
- **距离计算**: `getDistance()` - 球面距离算法  
- **批量处理**: `processAddresses()` - 主处理流程
- **位置获取**: `getUserLocation()` - GPS定位
- **数据导出**: `exportResults()` - CSV导出

## 开发指南

继续开发请访问: **[https://v0.dev/chat/projects/8LdFw13Wphf](https://v0.dev/chat/projects/8LdFw13Wphf)**

## 支持

如遇问题，请检查：
1. API Key配置是否正确
2. 网络连接是否正常
3. 浏览器是否支持地理定位