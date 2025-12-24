# NewsNexus - 智能新闻聚合平台

<div align="center">
  <img src="https://picsum.photos/800/400?random=newsnexus" alt="NewsNexus Banner" width="800"/>

  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-6.4.1-purple.svg)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.0-38B2AC.svg)](https://tailwindcss.com/)

  **🌍 全球新闻，触手可及 | 18种语言支持 | AI智能搜索**
</div>

## 📖 项目简介

NewsNexus 是一个现代化的智能新闻聚合平台，致力于为用户提供实时、准确、全球化的新闻信息服务。通过集成先进的AI技术和多源数据聚合，NewsNexus 能够帮助用户快速获取感兴趣的新闻内容，并进行智能分析和处理。

### ✨ 核心特性

- 🌍 **全球化覆盖** - 支持18种语言，覆盖全球主要新闻源
- 🔍 **智能搜索** - 基于博查AI的实时新闻搜索引擎
- 📊 **数据可视化** - 直观的统计图表和趋势分析
- 🎯 **个性化订阅** - 关键词订阅和RSS源管理
- 🔐 **企业级安全** - 银行级加密和双重认证
- 📱 **响应式设计** - 完美适配桌面端和移动端
- 🚀 **高性能** - 基于Vite的快速构建和热重载

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/your-username/newsnexus.git
   cd newsnexus
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **环境配置**

   复制环境变量模板：
   ```bash
   cp .env.example .env.local
   ```

   编辑 `.env.local` 文件，配置必要的环境变量：
   ```env
   # 博查AI API密钥 (必需)
   VITE_BOCHA_API_KEY=your_bocha_api_key

   # Supabase配置 (必需)
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

   # 邮件服务配置
   RESEND_API_KEY=your_resend_api_key
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   ```

   访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 🏗️ 技术架构

### 前端技术栈

- **React 19.2.0** - 现代化UI框架
- **TypeScript** - 类型安全的JavaScript
- **Vite 6.4.1** - 快速构建工具
- **Tailwind CSS** - 实用优先的CSS框架
- **Lucide React** - 精美的图标库

### 后端服务

- **博查AI API** - 智能搜索引擎
- **Supabase** - 认证和数据库服务
- **Resend** - 邮件发送服务
- **Express.js** - 代理服务器

### 核心组件

```
src/
├── components/          # 可复用组件
│   ├── ModernStats.tsx  # 统计数据展示
│   ├── PaymentModal.tsx # 支付模态框
│   └── ...
├── views/               # 页面组件
│   ├── Dashboard.tsx    # 仪表板
│   ├── UrlSubscriptions.tsx # URL订阅
│   └── ...
├── services/            # 业务逻辑
│   ├── geminiService.ts # 新闻搜索服务
│   ├── bochaService.ts  # 博查API服务
│   └── ...
├── contexts/            # React上下文
│   └── LanguageContext.tsx # 多语言支持
└── types/               # TypeScript类型定义
    └── index.ts
```

## 🔧 配置说明

### API密钥获取

1. **博查AI API**
   - 访问 [博查AI官网](https://bocha.cn)
   - 注册账户并获取API密钥
   - 配置到 `VITE_BOCHA_API_KEY`

2. **Supabase**
   - 访问 [Supabase官网](https://supabase.com)
   - 创建新项目
   - 获取项目URL和匿名密钥

3. **Resend (可选)**
   - 访问 [Resend官网](https://resend.com)
   - 注册并获取API密钥用于邮件服务

### 环境变量详解

| 变量名 | 必需 | 说明 |
|--------|------|------|
| `VITE_BOCHA_API_KEY` | ✅ | 博查AI API密钥 |
| `VITE_SUPABASE_URL` | ✅ | Supabase项目URL |
| `VITE_SUPABASE_ANON_KEY` | ✅ | Supabase匿名密钥 |
| `RESEND_API_KEY` | ❌ | 邮件服务API密钥 |
| `VITE_DEBUG` | ❌ | 调试模式开关 |

## 📖 使用指南

### 基本功能

1. **搜索新闻**
   - 在搜索框输入关键词
   - 选择目标语言和地区
   - 点击搜索获取相关文章

2. **订阅管理**
   - 添加关键词订阅
   - 管理RSS源
   - 查看订阅历史

3. **数据分析**
   - 查看搜索统计
   - 分析趋势图表
   - 导出数据报告

### 高级功能

- **文章预览** - 在线预览文章内容
- **多语言翻译** - 支持20种语言互译
- **智能摘要** - AI生成的文章摘要
- **个性化推荐** - 基于搜索历史的内容推荐

## 🛠️ 开发指南

### 项目结构

```
newsnexus/
├── public/              # 静态资源
├── src/                 # 源代码
├── gateway/             # API网关
├── supabase/            # 数据库函数
├── docs/                # 文档
└── tests/               # 测试文件
```

### 开发命令

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 代码检查
npm run lint

# 类型检查
npm run type-check
```

### 添加新功能

1. 在 `src/views/` 中创建新页面
2. 在 `src/services/` 中添加业务逻辑
3. 在 `src/types/` 中定义类型
4. 更新路由和导航

### 代码规范

- 使用TypeScript进行类型检查
- 遵循ESLint和Prettier配置
- 组件使用函数式写法
- 保持代码简洁和可读性

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 贡献方式

1. **报告问题** - 在Issues中提交bug报告
2. **功能建议** - 提出新功能的想法和建议
3. **代码贡献** - 提交Pull Request
4. **文档改进** - 完善文档和教程

### 提交流程

1. Fork项目到你的GitHub账户
2. 创建功能分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'Add amazing feature'`
4. 推送分支：`git push origin feature/amazing-feature`
5. 提交Pull Request

### 代码贡献指南

- 确保代码通过所有测试
- 遵循项目的代码规范
- 添加必要的注释和文档
- 更新相关的README部分

## 📊 项目状态

- ✅ **基础搜索功能** - 博查AI集成完成
- ✅ **用户认证系统** - Supabase认证
- ✅ **多语言支持** - 18种语言界面
- ✅ **响应式设计** - 移动端适配
- 🚧 **高级分析功能** - 开发中
- 🚧 **移动端应用** - 计划中
- 📋 **API开放平台** - 计划中

## 📄 开源协议

本项目采用 [MIT License](LICENSE) 开源协议。

## 🙏 致谢

感谢以下开源项目和服务：

- [React](https://reactjs.org/) - UI框架
- [Vite](https://vitejs.dev/) - 构建工具
- [Tailwind CSS](https://tailwindcss.com/) - CSS框架
- [Supabase](https://supabase.com/) - 后端服务
- [博查AI](https://bocha.cn/) - 搜索API
- [Lucide](https://lucide.dev/) - 图标库

## 📞 联系我们

- 📧 **邮箱**: [your-email@example.com](mailto:your-email@example.com)
- 🐛 **问题反馈**: [GitHub Issues](https://github.com/your-username/newsnexus/issues)
- 💬 **讨论**: [GitHub Discussions](https://github.com/your-username/newsnexus/discussions)

---

<div align="center">
  <p>如果这个项目对你有帮助，请给我们一个 ⭐️</p>
  <p>Made with ❤️ by NewsNexus Team</p>
</div>