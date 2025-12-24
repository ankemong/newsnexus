# 贡献指南

感谢您对 NewsNexus 项目的关注！我们欢迎所有形式的贡献，包括但不限于代码、文档、测试和反馈。

## 🤝 如何贡献

### 报告问题

如果您发现了 bug 或有功能建议，请：

1. 检查 [Issues](https://github.com/your-username/newsnexus/issues) 确认问题尚未被报告
2. 创建新的 Issue，使用清晰的标题和详细的描述
3. 如果是 bug，请包含：
   - 复现步骤
   - 预期行为
   - 实际行为
   - 环境信息（操作系统、浏览器版本等）
   - 相关的错误日志

### 提交代码

1. **Fork 项目**
   ```bash
   # 在 GitHub 上 Fork 项目
   # 然后克隆你的 Fork
   git clone https://github.com/your-username/newsnexus.git
   cd newsnexus
   ```

2. **设置开发环境**
   ```bash
   # 安装依赖
   npm install

   # 复制环境变量文件
   cp .env.example .env.local

   # 配置必要的环境变量
   # 启动开发服务器
   npm run dev
   ```

3. **创建功能分支**
   ```bash
   git checkout -b feature/your-feature-name
   # 或者修复 bug
   git checkout -b fix/bug-description
   ```

4. **开发和测试**
   - 编写代码
   - 确保代码通过类型检查：`npm run type-check`
   - 运行测试：`npm test`（如果有）
   - 手动测试功能

5. **提交更改**
   ```bash
   git add .
   git commit -m "feat: 添加新功能描述"
   ```

6. **推送并创建 PR**
   ```bash
   git push origin feature/your-feature-name
   ```

   然后在 GitHub 上创建 Pull Request。

## 📝 代码规范

### TypeScript/JavaScript

- 使用 TypeScript 进行开发
- 优先使用函数式组件和 Hooks
- 遵循 ESLint 和 Prettier 配置
- 使用有意义的变量和函数名

```tsx
// ✅ 好的示例
const ArticleList: React.FC<ArticleListProps> = ({ articles, onArticleClick }) => {
  return (
    <div className="article-list">
      {articles.map(article => (
        <ArticleItem
          key={article.id}
          article={article}
          onClick={onArticleClick}
        />
      ))}
    </div>
  );
};

// ❌ 避免的写法
function ArticleList(props) {
  return (
    <div className="article-list">
      {props.articles.map(article => (
        <div key={article.id} onClick={() => props.onArticleClick(article)}>
          {article.title}
        </div>
      ))}
    </div>
  );
}
```

### CSS 样式

- 优先使用 Tailwind CSS 类
- 避免内联样式
- 使用响应式设计

```tsx
// ✅ 好的示例
<div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">

// ❌ 避免的写法
<div style={{ maxWidth: '896px', margin: '0 auto', padding: '16px', backgroundColor: 'white' }}>
```

### 提交信息格式

使用 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

类型包括：
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式化
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建工具、依赖更新等

示例：
```
feat(search): 添加搜索历史功能

- 实现本地存储搜索历史
- 添加清除历史功能
- 优化搜索建议展示

Closes #123
```

## 🧪 测试指南

### 手动测试清单

在提交 PR 前，请确保：

- [ ] 应用可以正常启动
- [ ] 用户注册和登录功能正常
- [ ] 搜索功能返回预期结果
- [ ] 页面在不同屏幕尺寸下显示正常
- [ ] 没有控制台错误
- [ ] 所有链接和按钮可正常工作

### 测试不同环境

- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- 移动端浏览器 (Chrome Mobile, Safari Mobile)

## 📚 文档贡献

### 文档类型

- **README.md**: 项目概述和快速开始
- **API 文档**: 接口说明和使用示例
- **组件文档**: 组件 props 和使用方法
- **部署指南**: 部署和配置说明

### 文档规范

- 使用清晰简洁的语言
- 提供代码示例
- 包含必要的截图或图表
- 保持文档与代码同步

## 🏷️ 发布流程

1. 更新版本号（`package.json`）
2. 更新 CHANGELOG.md
3. 创建 Git 标签
4. 发布到 npm（如果是包）
5. 创建 GitHub Release

## 💬 沟通交流

- **GitHub Issues**: 报告 bug 和功能请求
- **GitHub Discussions**: 一般讨论和问答
- **Pull Request**: 代码审查和技术讨论

## 🙏 致谢

感谢所有为 NewsNexus 项目做出贡献的开发者！

### 贡献者列表

<!-- 这里会自动显示贡献者 -->

### 特别感谢

- 所有提交 Issue 和 PR 的用户
- 提供反馈和建议的社区成员
- 开源项目的维护者们

## 📞 获取帮助

如果您在贡献过程中遇到问题：

1. 查看现有的 Issues 和 Discussions
2. 阅读项目文档
3. 在 Discussions 中提问
4. 联系项目维护者

---

再次感谢您的贡献！每一个贡献都让 NewsNexus 变得更好。