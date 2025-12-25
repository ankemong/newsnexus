# Supabase Edge Functions 部署指南

## 重新部署支付相关 Edge Functions

如果遇到 "EPAY_MERCHANT_PRIVATE_KEY 未配置" 错误，这是因为旧的 Edge Functions 仍在使用。请按以下步骤重新部署：

### 步骤 1：安装 Supabase CLI

```bash
npm install -g supabase
```

### 步骤 2：登录 Supabase

```bash
supabase login
```

### 步骤 3：链接到项目

```bash
supabase link --project-ref your-project-ref
```

将 `your-project-ref` 替换为您的 Supabase 项目引用 ID（从 URL 中获取）

### 步骤 4：部署支付相关的 Edge Functions

```bash
# 部署支付 API
supabase functions deploy payment-api

# 部署支付通知处理
supabase functions deploy payment-notify
```

### 步骤 5：设置环境变量

在 Supabase 项目设置中添加以下环境变量：

1. 访问 https://supabase.com/dashboard/project/your-project-ref/settings/functions
2. 添加以下环境变量：

```bash
EPAY_API_URL=https://mzf.yuvps.com/xpay/epay/
EPAY_PID=your_merchant_id_here
EPAY_SIGN_TYPE=MD5
EPAY_KEY=your_merchant_key_here
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 步骤 6：验证部署

部署完成后，访问您的支付功能并测试是否正常工作。

## 常见问题

### 问题：部署失败

**解决方案：**
- 检查网络连接
- 确认已登录 Supabase
- 验证项目引用 ID 正确

### 问题：仍然显示 "EPAY_MERCHANT_PRIVATE_KEY 未配置"

**解决方案：**
1. 确认已重新部署 Edge Functions
2. 清除浏览器缓存
3. 检查 Supabase 项目设置中的环境变量
4. 等待几分钟让部署生效

### 问题：支付创建失败

**解决方案：**
1. 检查 `EPAY_PID` 和 `EPAY_KEY` 是否正确
2. 验证 EPAY API 地址可访问
3. 查看 Edge Functions 日志

## 查看 Edge Functions 日志

```bash
supabase functions logs payment-api
supabase functions logs payment-notify
```

或在 Supabase Dashboard 中查看：https://supabase.com/dashboard/project/your-project-ref/functions/logs
