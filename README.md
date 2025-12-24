# NewsNexus

[中文](#-中文) | [English](#-english)

---

## 🇨🇳 中文

NewsNexus 是一个现代化的新闻检索与内容收集平台，提供**实时搜索**、**文章在线预览**与**多格式下载导出**能力，并支持多语言界面。

> 声明：本项目主要由 AI 编程助手协助完成开发与迭代。作者本人几乎没有任何编程基础，本仓库更多用于学习与实践；如有不足，欢迎通过 Issue / PR 指正与改进。

### 功能特性

- **新闻 / 网页搜索**：集成博查（Bocha）Web Search API，可按时间范围筛选结果
  - 支持时间范围：过去 24 小时 / 7 天 / 30 天 /
- **文章预览**：在应用内查看搜索结果的摘要、来源、发布时间等信息
- **结果下载导出**：支持将单篇结果导出为 **JSON / CSV / TXT**
- **URL 内容爬取（Website Crawler）**：可对指定站点进行内容收集（优先使用博查 API；无 Key 时可降级为模拟爬取）
- **多语言界面**：基于 `contexts/LanguageContext.tsx`

### 技术栈

- React 19 + TypeScript
- Vite 6
- Tailwind CSS 4
- lucide-react
- 可选：Supabase（Auth / Edge Functions）、Resend（邮件）

### 快速开始

#### 1) 克隆项目

```bash
git clone https://github.com/ankemong/newsnexus.git
cd newsnexus
```

> 如果你的仓库目录名不同，请以实际为准。

#### 2) 安装依赖

```bash
npm install
```

#### 3) 配置环境变量

在项目根目录创建 `.env.local`：

```env
# 必需：博查 Web Search API Key
VITE_BOCHA_API_KEY=your_bocha_api_key

# 可选：如你启用了 Supabase 相关功能
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# 可选：如你使用 Resend 邮件能力（通常用于服务端 / Edge Function）
RESEND_API_KEY=your_resend_api_key
```

#### 4) 启动开发服务器

```bash
npm run dev
```

Vite 默认会输出本地访问地址（通常是 `http://localhost:5173`）。

### 构建与预览

```bash
npm run build
npm run preview
```

### 项目结构（概览）

```text
.
├─ views/                   # 页面（ArticleDownloads、UrlSubscriptions 等）
├─ components/              # 组件（Sidebar、TopBar、PaymentModal 等）
├─ services/                # 服务层（bochaService、websiteCrawlerService、auth/payment 等）
├─ contexts/                # Context（LanguageContext 等）
├─ config/                  # 配置（regions.ts 等）
├─ supabase/                # Supabase Functions & migrations（可选）
├─ gateway/                 # 网关/服务（可选）
└─ ...
```

### 重要说明

- 本项目的搜索与爬取能力依赖外部 API（如博查）。请确保正确配置 `VITE_BOCHA_API_KEY`。
- `WebsiteCrawlerService.getArticleContent()` 当前通过本地代理地址请求文章内容（`http://localhost:3006/api/fetch-article-content`）。如你需要该能力，请确保对应服务已启动并允许跨域访问。

---

## 🇺🇸 English

NewsNexus is a modern news search and content collection app that provides **real-time search**, **in-app article preview**, and **multi-format export**. It also supports a multilingual UI.

> Note: This project was built and iterated primarily with the help of AI coding assistants. The author started with virtually no programming background, so this repository is mainly for learning and experimentation. Issues/PRs are welcome.

### Key Features

- **News/Web Search** powered by Bocha Web Search API, with time-based filtering
  - Supported ranges: last 24 hours / 7 days / 30 days / 1 year
- **Article Preview**: view key metadata (summary/snippet, source, publish time, etc.)
- **Export Downloads**: export a single result as **JSON / CSV / TXT**
- **URL Content Crawling (Website Crawler)**: collect content from a given site (Bocha-first; falls back to mock crawl if no API key is provided)
- **Multilingual UI**: powered by `contexts/LanguageContext.tsx`

### Tech Stack

- React 19 + TypeScript
- Vite 6
- Tailwind CSS 4
- lucide-react
- Optional: Supabase (Auth / Edge Functions), Resend (email)

### Quick Start

#### 1) Clone

```bash
git clone https://github.com/ankemong/newsnexus.git
cd newsnexus
```

> If your folder name is different, use your actual path.

#### 2) Install

```bash
npm install
```

#### 3) Environment Variables

Create `.env.local` in the project root:

```env
# Required: Bocha Web Search API Key
VITE_BOCHA_API_KEY=your_bocha_api_key

# Optional: if you enabled Supabase-related features
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: if you use Resend for email (usually server/edge)
RESEND_API_KEY=your_resend_api_key
```

#### 4) Run Dev Server

```bash
npm run dev
```

Vite will print the local URL (commonly `http://localhost:5173`).

### Build & Preview

```bash
npm run build
npm run preview
```

### Project Structure (Overview)

```text
.
├─ views/                   # pages (ArticleDownloads, UrlSubscriptions, ...)
├─ components/              # UI components (Sidebar, TopBar, PaymentModal, ...)
├─ services/                # service layer (bochaService, websiteCrawlerService, auth/payment, ...)
├─ contexts/                # React contexts (LanguageContext, ...)
├─ config/                  # configs (regions.ts, ...)
├─ supabase/                # Supabase functions & migrations (optional)
├─ gateway/                 # gateway/service (optional)
└─ ...
```

### Notes

- Search & crawling depend on external APIs (e.g. Bocha). Make sure `VITE_BOCHA_API_KEY` is configured.
- `WebsiteCrawlerService.getArticleContent()` currently calls a local proxy endpoint (`http://localhost:3006/api/fetch-article-content`). If you need this feature, ensure the proxy server is running and CORS is configured properly.

---

## License

MIT (see `LICENSE`).
