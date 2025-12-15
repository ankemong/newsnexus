# NewsNexus 邮件配置指南

## 域名配置

### 已验证域名
- **域名**: `veyronix.asia`
- **状态**: 已在 Resend 控制台中验证

### 发件人地址配置

使用 `veyronix.asia` 域名的发件人地址：

| 功能 | 发件人地址 | 用途 |
|------|-----------|------|
| 通用邮件 | `noreply@veyronix.asia` | 系统通知、新闻订阅 |
| 欢迎邮件 | `welcome@veyronix.asia` | 用户注册欢迎 |
| 安全邮件 | `security@veyronix.asia` | 密码重置、安全提醒 |

## DNS 记录要求

为确保邮件正常发送，请在您的 DNS 提供商处配置以下记录：

### SPF 记录
```
TXT  v=spf1 include:sendgrid.net ~all
```

### DKIM 记录
```
k=rsa; t=s; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDPtW5i5X5X...
```
（完整的 DKIM 密钥请从 Resend 控制台获取）

### DMARC 记录
```
TXT  v=DMARC1; p=none; rua=mailto:dmarc@veyronix.asia
```

## 环境变量配置

在 `.env.local` 文件中配置：

```env
# Resend API 密钥
RESEND_API_KEY=re_hqp1vt2N_nsaqF4uc7uSBf7MuxZ4harvr

# 可选：自定义发件人域名（默认使用 veyronix.asia）
EMAIL_DOMAIN=veyronix.asia
```

## 使用示例

### 发送新闻订阅邮件

```typescript
import { sendNewsSubscriptionEmail } from '../services/emailService';

const articles = [
  {
    id: '1',
    title: '新闻标题',
    summary: '新闻摘要',
    url: 'https://example.com',
    publishedAt: '2024-01-15T10:00:00Z'
  }
];

await sendNewsSubscriptionEmail('user@example.com', articles);
```

### 发送欢迎邮件

```typescript
import { sendWelcomeEmail } from '../services/emailService';

await sendWelcomeEmail('newuser@example.com', '用户名');
```

### 发送密码重置邮件

```typescript
import { sendPasswordResetEmail } from '../services/emailService';

await sendPasswordResetEmail('user@example.com', 'reset_token_123');
```

## 邮件模板

### HTML 邮件最佳实践

1. **响应式设计**：使用媒体查询适配移动设备
2. **内联 CSS**：大多数邮件客户端不支持外部样式表
3. **图片处理**：使用绝对 URL，或 Base64 编码小图片
4. **避免 JavaScript**：邮件客户端不支持 JavaScript

### 邮件大小限制

- **总大小**：不超过 40MB
- **附件**：单个文件不超过 30MB
- **图片**：建议优化后小于 500KB

## 发送限制

根据您的 Resend 计划，可能有以下限制：

- **每日发送量**：免费版 100 封/天
- **每小时发送量**：免费版 3 封/小时
- **收件人数量**：每封邮件最多 1000 个收件人

## 测试邮件

使用提供的测试脚本验证配置：

```bash
# 运行所有邮件示例
npm run test:email

# 或直接运行示例文件
npx ts-node examples/email-examples.ts
```

## 故障排除

### 常见问题

1. **发送失败**
   - 检查 API 密钥是否正确
   - 确认域名已验证
   - 查看收件人地址是否有效

2. **邮件进入垃圾箱**
   - 检查 SPF/DKIM/DMARC 记录
   - 避免使用触发垃圾邮件过滤器的词汇
   - 确保邮件内容符合 CAN-SPAM 法规

3. **DNS 验证失败**
   - 等待 DNS 传播（最多 48 小时）
   - 使用 `dig` 或 `nslookup` 验证记录
   - 检查记录格式是否正确

### 调试模式

启用详细日志：

```typescript
// 在开发环境中
if (process.env.NODE_ENV === 'development') {
  console.log('邮件发送详情:', options);
}
```

## 安全建议

1. **API 密钥保护**
   - 不要在客户端代码中使用
   - 使用环境变量存储
   - 定期轮换密钥

2. **邮件内容安全**
   - 对用户输入进行 HTML 转义
   - 使用安全的链接
   - 避免敏感信息泄露

3. **速率限制**
   - 实现客户端发送限制
   - 使用队列处理大量邮件
   - 监控发送频率

## 监控和分析

### 发送状态追踪

```typescript
// 邮件发送后记录状态
const result = await sendEmail(options);
if (result.messageId) {
  // 保存 messageId 用于后续追踪
  await logEmailSent(result.messageId, options.to);
}
```

### 性能监控

- 监控发送成功率
- 跟踪邮件打开率
- 分析点击率
- 监控退信率

## 更多资源

- [Resend 官方文档](https://resend.com/docs)
- [HTML 邮件指南](https://www.campaignmonitor.com/resources/guides/html-email/)
- [邮件送达率优化](https://www.sparkpost.com/blog/email-deliverability-best-practices)