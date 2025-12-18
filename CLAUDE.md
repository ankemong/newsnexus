# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 开发规范

### 工作流程
1. 每次运行后更新 progress.md 文件
2. 实现每个功能后进行测试（使用 Chrome MCP 测试）
3. 测试通过后立即提交到 git
4. 不要生成测试代码文件
5. 代码中不允许出现 emoji
6. 设计模式设置为真实环境（生产模式）
7. 只标记功能已实现，不更改功能列表

### 测试要求
- 使用 Chrome MCP 进行测试
- 不编写独立的测试文件
- 每个功能实现后必须手动测试

### Git 提交规范
- 测试通过后立即提交
- 提交信息应清晰描述实现的功能

## 项目概述

NewsNexus 是一个新闻聚合和管理工具型网站，提供新闻爬取、多语言处理、内容分析和订阅管理功能。核心特点是使用 Google Gemini API 进行实时新闻搜索，集成 iFlow API (GLM-4.6) 用于内容扩展和翻译，支持多语言国际化。

## 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器（运行在 http://localhost:3000）
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 核心架构

### 视图状态管理
- 使用 `ViewState` 类型定义所有页面状态，而非传统路由
- App.tsx 作为中央状态管理器，处理认证和视图切换
- 未登录用户只能访问 home 和认证相关页面
- 已登录用户可访问所有功能模块

### API 服务架构
- **geminiService.ts**：核心服务层
  - Google Gemini API：新闻爬取（支持 Google Search Grounding）
  - iFlow API：内容扩展、摘要、翻译
  - API 密钥管理：Gemini 从环境变量读取，iFlow 硬编码在服务中

### 多源爬虫架构
项目支持集成多种爬虫工具以实现多源爬取：

1. **现有 API 爬虫**
   - 使用 Google Gemini API 进行新闻搜索
   - 通过 Google Search Grounding 获取实时新闻
   - 适合快速获取新闻摘要和基本信息

2. **可扩展的爬虫架构**
   - 预留了 Crawlee 框架集成接口（CRAWLEE_SETUP.md）
   - 支持三种爬虫类型：
     - CheerioCrawler：快速 HTTP 爬虫，适合静态内容
     - PuppeteerCrawler：浏览器自动化，支持动态内容
     - PlaywrightCrawler：功能更全面的浏览器控制
   - 可根据不同网站特性选择合适的爬虫策略

3. **数据源管理**
   - 支持按地区和语言配置多源爬取
   - 通过 REGION_MAP 配置不同地区的目标语言
   - 每个爬取任务可配置多个数据源

### 数据库集成
- 使用 Supabase 作为后端数据库
- 可通过 Supabase MCP 进行数据库操作
- 邮件服务使用真实邮箱：2847999405@qq.com

### 数据流
1. 用户输入关键词 → Crawler 视图
2. 选择目标地区和语言
3. 调用 crawlNewsByKeyword → Gemini API 搜索
4. 可选：启动 Crawlee 爬虫进行深度爬取
5. 解析响应 → Article 对象数组
6. 存储到 myCrawledArticles 状态和 Supabase
7. 可在 MyCrawls 视图查看和管理

### 认证系统
- AuthService 封装认证逻辑
- Supabase 作为后端认证和存储
- 本地存储用户状态，页面刷新时自动恢复

## 核心功能模块

### 新闻爬取
- 支持关键词搜索和多语言选择
- 使用 Google Search Grounding 获取实时新闻
- 可扩展支持网站特定爬虫
- 自动解析和结构化新闻数据

### 文章管理
- 查看爬取的文章列表
- 文章详情页面
- 保存和管理个人文章库
- 支持多种格式导出（JSON、CSV、TXT）

### 订阅系统
- RSS 源订阅管理
- 自动抓取订阅内容
- 订阅状态监控
- 支持多源聚合订阅

### 数据分析
- 新闻统计图表
- 爬取任务分析
- 可视化展示
- 趋势分析

## 环境配置

创建 `.env.local` 文件：

```bash
# 必需
GEMINI_API_KEY=your_gemini_api_key

# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# 邮件服务
RESEND_API_KEY=your_resend_api_key

# 生产环境配置
VITE_DEBUG=false
NODE_ENV=production
```

## 多源爬虫实现指南

### 添加新的爬虫源

1. 在 `services/` 目录下创建新的爬虫服务文件
2. 实现统一的爬虫接口：
   ```typescript
   interface CrawlerService {
     crawl(keyword: string, languages: Language[]): Promise<Article[]>
     getName(): string
     getType(): 'api' | 'web' | 'rss'
   }
   ```

3. 在 Crawler 视图中集成新的爬虫选项
4. 更新任务状态管理以支持多源爬取

### Crawlee 集成示例

```typescript
// services/crawleeService.ts
import { CheerioCrawler } from 'crawlee';

export class CrawleeService implements CrawlerService {
  async crawl(keyword: string, languages: Language[]): Promise<Article[]> {
    const crawler = new CheerioCrawler({
      async requestHandler({ request, $ }) {
        // 解析页面内容
        const title = $('title').text();
        const content = $('article').text();
        // 返回结构化数据
      }
    });

    await crawler.run([/* 目标 URLs */]);
    return [];
  }
}
```

## 关键实现细节

### 新闻爬取实现
- 使用 Gemini 2.5 Flash 模型
- Google Search Grounding 获取实时数据
- 返回格式化的 JSON 数组，包含标题、来源、日期、内容等
- 失败时回退到模拟数据

### 多语言支持
- 20 种语言支持（Language 枚举）
- LanguageContext 提供全局语言切换
- 翻译功能通过 iFlow API 实现

### 错误处理
- ErrorBoundary 组件捕获渲染错误
- API 调用失败时提供降级方案
- 状态不一致时自动修复（如 article-detail 无选中文章）

## 技术栈

- React 19.2.0 + TypeScript
- Vite 6.2.0（构建工具）
- Tailwind CSS（样式）
- Supabase（认证/存储）
- 外部 API：Google Gemini、iFlow (GLM-4.6)
- 爬虫框架：Crawlee（可选集成）

## 重要提醒

- iFlow API 密钥硬编码在 geminiService.ts，生产环境需移至环境变量
- 开发服务器监听 0.0.0.0:3000，可从外部访问
- 使用 Picsum 作为图片占位符服务
- 环境变量通过 Vite 注入到客户端（process.env）
- 无向后兼容性要求，可自由破坏旧格式
- 多源爬虫功能可根据需求逐步集成

在每次运行后更新progress.md,并在实现每个功能后进行测试，最重要的做法
是提交到git，最后Claude除了标记功能已实现外不应更改功能列表
测试使用Chrome mcp测试，不要生成测试代码文件，和将设计模式设置为模拟或开发环境，
代码中不许出现emoji，数据库使用的是supabase，需要时可以调用supabase mcp

真实邮箱账号为2847999405@qq.com 密码为18224822150x

**No backward compatibility** - Break old formats freely
不要绕过任何代码进行测试，如果遇到失败请修复他