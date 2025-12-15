// 支付相关类型定义

export enum PaymentType {
  ALIPAY = 'alipay',
  WXPAY = 'wxpay',
  QQPAY = 'qqpay',
  BANK = 'bank',
  JDPAY = 'jdpay'
}

export interface PaymentRequest {
  out_trade_no: string; // 商户订单号
  name: string; // 商品名称
  money: string | number; // 支付金额
  type: PaymentType; // 支付方式
  notify_url?: string; // 异步通知地址
  return_url?: string; // 同步跳转地址
  clientip?: string; // 用户IP
  device?: string; // 设备类型
}

export interface PaymentResponse {
  code: number;
  msg: string;
  data?: {
    trade_no?: string; // 平台交易号
    out_trade_no?: string; // 商户订单号
    url?: string; // 支付链接
    qrcode?: string; // 二维码内容
    money?: string; // 金额
    type?: string; // 支付方式
    status?: number; // 订单状态
  };
  sign?: string;
  timestamp?: number;
}

export interface PaymentConfig {
  apiurl: string; // 支付接口地址
  pid: string; // 商户ID
  platform_public_key: string; // 平台公钥
  merchant_private_key: string; // 商户私钥
}

export interface OrderQuery {
  trade_no?: string; // 平台交易号
  out_trade_no?: string; // 商户订单号
}

export interface RefundRequest {
  out_refund_no: string; // 商户退款单号
  trade_no: string; // 平台交易号
  money: string | number; // 退款金额
}

export interface PaymentNotification {
  trade_no: string; // 平台交易号
  out_trade_no: string; // 商户订单号
  total_fee: string; // 支付金额
  trade_status: string; // 交易状态
  sign: string; // 签名
  timestamp: number; // 时间戳
}

export interface PaymentResult {
  success: boolean;
  tradeNo?: string;
  message?: string;
  error?: string;
}