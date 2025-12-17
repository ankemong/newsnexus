# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

NewsNexus 是一个基于 React 的新闻聚合和爬取平台，支持多语言新闻内容的获取、处理和展示。该项目使用 Google Gemini API 进行新闻爬取，并集成了 iFlow API (GLM-4.6) 用于内容扩展、摘要和翻译功能。

## 核心架构

### 应用结构
- **单页应用 (SPA)**：使用 React 19.2.0 和 TypeScript 构建
- **路由系统**：基于状态的视图管理（`ViewState` 类型），而非传统路由
- **国际化支持**：支持 20 种语言的完整本地化
- **认证系统**：模拟的用户认证流程，区分已登录和未登录状态

### 关键组件
- `App.tsx`：应用主入口，管理视图状态和用户认证状态
- `components/Sidebar.tsx`：侧边栏导航组件
- `components/TopBar.tsx`：顶部栏组件
- `views/`：各种视图组件（Dashboard、Crawler、Articles 等）
- `contexts/LanguageContext.tsx`：语言上下文管理
- `services/geminiService.ts`：新闻爬取和 AI 服务

### API 集成
- **Google Gemini API**：用于新闻搜索和爬取（支持 Google Search Grounding）
- **iFlow API (GLM-4.6)**：用于内容扩展、摘要和翻译
- 环境变量通过 Vite 配置注入到客户端

## 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器（默认运行在 http://localhost:3000）
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 环境配置

创建 `.env.local` 文件并设置以下环境变量：

```bash
# 必需 - Google Gemini API 密钥
GEMINI_API_KEY=your_gemini_api_key_here

# 可选 - Resend API 密钥（用于邮件功能）
RESEND_API_KEY=your_resend_api_key_here

# 可选 - Supabase 配置（用于数据存储）
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

注意：`.env.local` 文件已在 `.gitignore` 中，不会被提交到版本控制。

**重要**：iFlow API 密钥目前硬编码在 `services/geminiService.ts` 中，生产环境应将其移至环境变量。

开发服务器默认运行在 `http://localhost:3000`，配置为监听所有网络接口（`0.0.0.0`）。

## 技术栈与依赖

### 核心框架
- **React 19.2.0**：使用最新的 React 版本
- **TypeScript 5.8.2**：提供类型安全
- **Vite 6.2.0**：现代的前端构建工具

### 主要依赖
- `@google/genai`：Google Gemini AI API 客户端
- `@supabase/supabase-js`：Supabase 数据库和认证
- `lucide-react`：现代图标库
- `recharts`：数据可视化图表库
- `resend`：邮件发送服务

### 开发依赖
- `@vitejs/plugin-react`：Vite 的 React 插件
- `@types/node`：Node.js 类型定义

## 代码约定

### TypeScript 配置
- 目标：ES2022
- 模块系统：ESNext
- 路径别名：`@/*` 指向项目根目录
- JSX：React JSX 自动转换

### 状态管理
- 使用 React Hooks 进行本地状态管理
- 通过 Context API 管理全局语言状态
- 视图状态通过 `AppState` 类型严格约束

### 组件组织
- 组件文件使用 PascalCase 命名
- 视图组件存放在 `views/` 目录
- 可复用组件存放在 `components/` 目录
- 类型定义集中在 `types.ts`

## 关键功能实现

### 新闻爬取流程
1. 用户在 Crawler 视图中输入关键词和选择语言
2. 调用 `crawlNewsByKeyword` 函数使用 Gemini API 搜索新闻
3. 使用 Google Search Grounding 获取实时新闻数据
4. 解析响应并转换为 `Article` 对象

### 多语言支持
- 使用 `Language` 枚举定义支持的语言
- 翻译文本存储在 `translations.ts` 中
- 通过 `LanguageContext` 提供语言切换功能

### API 服务层
- `geminiService.ts` 封装所有外部 API 调用
- 支持文章内容扩展、摘要生成和文本翻译
- 错误处理和回退机制（模拟数据）

## 注意事项

- 该项目使用 Vite 而非 Create React App
- 环境变量通过 `process.env` 在客户端访问（Vite 特性）
- iFlow API 密钥需要根据实际使用情况进行配置
- 图片使用 Picsum 随机图片服务作为占位符

## 调试与故障排除

### 常见问题

1. **API 密钥错误**
   - 确保 `.env.local` 文件中的 `GEMINI_API_KEY` 已正确设置
   - 检查 API 密钥是否有足够的权限

2. **开发服务器无法启动**
   - 确保已运行 `npm install`
   - 检查端口 3000 是否被占用

3. **构建失败**
   - 检查 TypeScript 类型错误
   - 确保所有环境变量都已设置（即使是构建时）

### 日志查看
- 开发环境：控制台会显示详细的错误信息
- 生产环境：使用浏览器开发者工具查看控制台日志

在每次运行后更新progress.md,并在实现每个功能后进行测试，最重要的做法
是提交到git，最后Claude除了标记功能已实现外不应更改功能列表
测试使用Chrome mcp测试，不要生成测试代码文件，和将设计模式设置为模拟或开发环境，
代码中不许出现emoji，数据库使用的是supabase，需要时可以调用supabase mcp

真实邮箱账号为2847999405@qq.com 密码为18224822150x