# EPAY 新接口支付系统配置指南

## 接口迁移说明

**重要通知**：原有的支付集成已停止运营，现已迁移到新的 EPAY 接口。本指南适用于新的 EPAY 接口配置。

## 新接口特性

### 接口地址
- **POST** `/xpay/epay/mapi.php`
- **请求方式**：FormData 提交
- **返回格式**：JSON

### 主要特性
1. **简化配置**：主要使用 MD5 签名
2. **多种支付方式**：支持支付宝、微信支付
3. **灵活返回**：根据支付方式返回不同类型的链接
4. **易于集成**：POST 请求，FormData 提交

## 环境变量配置

### 必需配置
在您的 `.env.local` 文件中添加以下 EPAY 支付配置：

```bash
# ===========================================
# EPAY 支付配置（新接口）
# ===========================================

# EPAY 支付接口地址
EPAY_API_URL=https://mzf.yuvps.com/xpay/epay/

# 商户ID（必需）
EPAY_PID=your_merchant_id_here

# 签名类型（推荐使用 MD5）
EPAY_SIGN_TYPE=MD5

# 商户密钥（如果使用 MD5 签名）
EPAY_KEY=your_merchant_key_here
```

## 支付方式

新接口支持以下支付方式：

| 支付方式 | 参数值 | 说明 |
|---------|--------|------|
| 支付宝 | `alipay` | 支付宝网页支付 |
| 微信支付 | `wxpay` | 微信支付 |

## 请求参数

### 必需参数
- **pid**：商户ID
- **type**：支付方式（alipay/wxpay）
- **out_trade_no**：商户订单号
- **name**：商品名称
- **money**：商品金额

### 可选参数
- **notify_url**：异步通知地址
- **return_url**：跳转通知地址
- **clientip**：用户IP地址
- **device**：设备类型（默认pc）
- **param**：业务扩展参数

## 返回结果

### 成功返回（code = 1）
```json
{
  "code": 1,
  "msg": "success",
  "trade_no": "支付订单号",
  "payurl": "支付跳转URL", // 或以下二者之一
  "qrcode": "二维码链接",
  "urlscheme": "小程序跳转URL",
  "money": "100.00"
}
```

### 失败返回（code ≠ 1）
```json
{
  "code": 0,
  "msg": "错误信息"
}
```

## 配置示例

### 基础配置
```bash
# 基础配置
EPAY_API_URL=https://mzf.yuvps.com/xpay/epay/
EPAY_PID=12345678
EPAY_SIGN_TYPE=MD5
EPAY_KEY=abcdef1234567890abcdef1234567890
```

### 完整配置示例
```bash
# 完整配置
EPAY_API_URL=https://mzf.yuvps.com/xpay/epay/
EPAY_PID=12345678
EPAY_SIGN_TYPE=MD5
EPAY_KEY=abcdef1234567890abcdef1234567890

# 回调地址（可选）
EPAY_NOTIFY_URL=https://yourdomain.com/api/payment/notify
EPAY_RETURN_URL=https://yourdomain.com/payment/result
```

## 签名算法

### MD5 签名规则
1. **参数排序**：按参数名 ASCII 码升序排序
2. **参数过滤**：过滤空值参数和 `sign`、`sign_type` 字段
3. **拼接字符串**：按格式 `key1=value1&key2=value2&...&key=商户密钥`
4. **MD5 哈希**：对整个字符串进行 MD5 计算

### 示例签名
假设有以下参数：
```
pid=123456
type=alipay
out_trade_no=20160806151343349
name=VIP会员
money=1.00
key=your_secret_key
```

排序后的参数串：
```
money=1.00&name=VIP会员&out_trade_no=20160806151343349&pid=123456&type=alipay&key=your_secret_key
```

MD5 哈希结果即为签名字符串。

## 迁移指南

### 从旧接口迁移
1. **更新 API 地址**：使用新的 `/xpay/epay/` 地址
2. **简化签名配置**：主要使用 MD5 签名
3. **调整请求方式**：使用 POST + FormData
4. **更新返回处理**：适应新的返回格式

### 配置迁移检查清单
- [ ] 更新 EPAY_API_URL 为新地址
- [ ] 设置 EPAY_SIGN_TYPE=MD5
- [ ] 配置 EPAY_KEY（商户密钥）
- [ ] 测试支付流程
- [ ] 验证回调处理

## 支付流程

### 1. 创建支付订单
```javascript
// 前端调用
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
根据返回的字段进行不同处理：
- **payurl**：直接跳转到该URL
- **qrcode**：生成二维码图片
- **urlscheme**：小程序跳转

### 3. 支付回调处理
处理支付完成后的异步通知：
- 验证签名
- 更新订单状态
- 返回处理结果

## 故障排除

### 常见错误

1. **"EPAY 配置缺失：需要 EPAY_PID"**
   - 检查是否设置了 EPAY_PID 环境变量
   - 确认变量名拼写正确

2. **"创建支付订单失败"**
   - 检查商户ID是否有效
   - 确认商户密钥是否正确
   - 验证签名算法

3. **"签名验证失败"**
   - 检查 MD5 签名算法实现
   - 确认参数排序和拼接规则
   - 验证商户密钥

### 调试步骤

1. **检查环境变量**
   ```bash
   echo $EPAY_PID
   echo $EPAY_API_URL
   echo $EPAY_SIGN_TYPE
   ```

2. **测试API连接**
   - 使用工具测试 API 地址可访问性
   - 验证商户ID和密钥有效性

3. **检查签名生成**
   - 打印签名字符串进行验证
   - 对比官方示例签名

## 安全注意事项

### 密钥安全
- **绝对不要**将商户密钥提交到版本控制
- **绝对不要**在前端代码中暴露密钥
- **绝对不要**通过不安全的渠道传输密钥

### 环境管理
- 开发、测试、生产环境使用独立密钥
- 定期轮换商户密钥
- 使用安全的密钥管理系统

### API 安全
- 限制 API 访问频率
- 实施 IP 白名单
- 监控异常请求

## 获取配置信息

1. **登录新 EPAY 管理后台**
2. **查看商户配置或 API 配置**
3. **获取以下信息：**
   - 商户ID (PID)
   - 商户密钥
   - API 接口地址

## 支持和帮助

### 技术支持
- **EPAY 官方文档**：查看最新接口文档
- **社区支持**：联系 EPAY 技术支持
- **项目文档**：查看项目 README

### 配置文件
- **`.env.example`** - 包含 EPAY 配置示例
- **`config/epay-config.template.env`** - 详细的 EPAY 配置模板

---

**重要提醒**：支付系统涉及资金安全，请务必谨慎配置，确保所有安全措施到位。新接口已优化了配置流程，建议尽快迁移以确保服务稳定性。
