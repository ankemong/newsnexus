# YZfPay 支付系统集成指南

## 接口信息

根据您提供的 YZfPay 接口信息，系统已完全适配 YZfPay 支付接口。

### 接口地址
- **基础地址**：`https://api.yzfpay.com/`
- **商户ID**：`10600`

### 签名方式

#### V1 接口（MD5 签名）
- **商户MD5密钥**：`r55YiyPIgxUysXPugxve8eUSyUSV8zpx`
- **提交地址**：`https://api.yzfpay.com/v1/submit.php`
- **查询地址**：`https://api.yzfpay.com/v1/query.php`
- **特点**：配置简单，集成快速

#### V2 接口（RSA 签名）
- **平台公钥**：`MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0U7RoPhzoiAXqhJBzKP1o1dWv1TzSDVs2Q1pDc4P3PkZraosNiyIZHw7Y86/MQDT2t3Py5nwcmvaRxQmuY0AdDQkcBmHV5ohOd0s9/yTQHhnGA+If0frF2+vEP4tzWQWriBbTAL8u7LrrPttt86BH0vQyRNG7SHGoFcemGTpQAEVg6idm8/3T55PE9JIAxsvRZBBGjw1Gssk9wo2UdmLWwAfX38yUf7QaEacBhsXBzMuB101zj3c+daZR+JFWFw3M1Xj1TdAhrhTOU5Gll/sE2RfV0UTYg11Z3FCLeKKjtfKeOwekloFUVtdpksyXHWOsSoSX6cYT6W6jNkgYl77iQIDAQAB`
- **提交地址**：`https://api.yzfpay.com/v2/submit.php`
- **查询地址**：`https://api.yzfpay.com/v2/query.php`
- **特点**：安全性更高，推荐生产环境使用

## 环境变量配置

### 推荐配置（V1 接口 - MD5）

在您的 `.env.local` 文件中添加：

```bash
# YZfPay 基础配置
YZFPAY_API_URL=https://api.yzfpay.com/
YZFPAY_PID=10600
YZFPAY_SIGN_TYPE=MD5

# V1 接口配置（MD5）
YZFPAY_MERCHANT_KEY=r55YiyPIgxUysXPugxve8eUSyUSV8zpx
```

### 生产环境配置（V2 接口 - RSA）

如果您需要更高安全性，使用 V2 接口：

```bash
# YZfPay 基础配置
YZFPAY_API_URL=https://api.yzfpay.com/
YZFPAY_PID=10600
YZFPAY_SIGN_TYPE=RSA

# V2 接口配置（RSA）
YZFPAY_PLATFORM_PUBLIC_KEY=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0U7RoPhzoiAXqhJBzKP1o1dWv1TzSDVs2Q1pDc4P3PkZraosNiyIZHw7Y86/MQDT2t3Py5nwcmvaRxQmuY0AdDQkcBmHV5ohOd0s9/yTQHhnGA+If0frF2+vEP4tzWQWriBbTAL8u7LrrPttt86BH0vQyRNG7SHGoFcemGTpQAEVg6idm8/3T55PE9JIAxsvRZBBGjw1Gssk9wo2UdmLWwAfX38yUf7QaEacBhsXBzMuB101zj3c+daZR+JFWFw3M1Xj1TdAhrhTOU5Gll/sE2RfV0UTYg11Z3FCLeKKjtfKeOwekloFUVtdpksyXHWOsSoSX6cYT6W6jNkgYl77iQIDAQAB
YZFPAY_MERCHANT_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----
[您的商户私钥（PKCS#8格式）]
-----END PRIVATE KEY-----
```

## 部署步骤

### 1. 配置环境变量

```bash
# 在 .env.local 中添加配置
YZFPAY_API_URL=https://api.yzfpay.com/
YZFPAY_PID=10600
YZFPAY_SIGN_TYPE=MD5
YZFPAY_MERCHANT_KEY=r55YiyPIgxUysXPugxve8eUSyUSV8zpx
```

### 2. 部署 Edge Functions

```bash
# 部署 payment-api 函数
supabase functions deploy payment-api

# 部署 payment-notify 函数
supabase functions deploy payment-notify
```

### 3. 设置 Supabase 环境变量

在 Supabase Dashboard 中设置相同的 YZfPay 环境变量。

### 4. 测试支付功能

测试支付宝和微信支付流程。

## 支持的支付方式

根据 YZfPay 接口支持：

- **alipay** - 支付宝
- **wxpay** - 微信支付
- 其他支付方式请参考 YZfPay 官方文档

## 签名算法

### MD5 签名规则（V1）
1. 按参数名 ASCII 码升序排序
2. 过滤空值参数和 `sign`、`sign_type` 字段
3. 拼接为 `key1=value1&key2=value2...&key=商户密钥`
4. 对整个字符串进行 MD5 计算

### RSA 签名规则（V2）
1. 按参数名 ASCII 码升序排序
2. 过滤空值参数和 `sign`、`sign_type` 字段
3. 使用商户私钥（PKCS#8 格式）对参数串进行 RSA-SHA256 签名
4. 签名结果 Base64 编码

## 支付流程

### 1. 创建支付订单
```javascript
const paymentData = {
  out_trade_no: '订单号',
  name: '商品名称',
  money: '1.00',
  type: 'alipay', // 或 'wxpay'
  notify_url: '回调地址',
  return_url: '返回地址'
};
```

### 2. 处理返回结果
- **payurl**：直接跳转到该URL
- **qrcode**：生成二维码图片
- **urlscheme**：小程序跳转

### 3. 支付回调处理
系统自动验证签名并更新订单状态。

## 错误排除

### 常见错误

1. **"YZfPay 配置缺失：需要 YZFPAY_PID"**
   - 检查 `YZFPAY_PID` 是否设置为 `10600`

2. **"YZfPay 配置缺失：使用 MD5 签名需要 YZFPAY_MERCHANT_KEY"**
   - 检查 `YZFPAY_MERCHANT_KEY` 是否设置

3. **"私钥格式错误"**
   - RSA 签名需要 PKCS#8 格式的私钥
   - 如果是 PKCS#1 格式，需要使用 OpenSSL 转换

### 调试步骤

1. **检查环境变量**
   ```bash
   echo $YZFPAY_PID
   echo $YZFPAY_SIGN_TYPE
   ```

2. **验证接口连接**
   - 测试 API 地址可访问性
   - 确认商户ID和密钥有效性

3. **检查日志**
   - 在 Supabase Dashboard 中查看 Edge Function 日志
   - 查看支付回调处理日志

## 安全注意事项

### 密钥安全
- **绝对不要**将商户密钥提交到版本控制
- **绝对不要**在前端代码中暴露密钥
- **绝对不要**通过不安全的渠道传输密钥

### 环境管理
- 开发、测试、生产环境使用独立密钥
- 定期轮换商户密钥
- 使用安全的密钥管理系统

### 推荐配置
- **开发环境**：使用 V1 接口（MD5）
- **生产环境**：使用 V2 接口（RSA）

## 文件参考

- **`.env.example`** - 包含 YZfPay 配置示例
- **`config/yzfpay-config.template.env`** - 详细配置模板
- **`supabase/functions/payment-api/index.ts`** - 支付API实现
- **`supabase/functions/payment-notify/index.ts`** - 支付回调处理

## 技术支持

如果遇到问题：

1. 检查环境变量配置
2. 查看 Supabase Edge Function 日志
3. 验证 YZfPay 接口状态
4. 测试支付流程

---

**YZfPay 接口已完全集成，支持 MD5 和 RSA 两种签名方式，推荐生产环境使用 RSA 签名以获得更高安全性。**
