import { PaymentType, PaymentResult } from '../types/payment';
import { createClient } from '@supabase/supabase-js';

export class PaymentService {
  private supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL || '',
    import.meta.env.VITE_SUPABASE_ANON_KEY || ''
  );

  // 获取支付函数URL
  private getPaymentFunctionUrl(functionName: string): string {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
    const projectRef = supabaseUrl?.match(/https:\/\/(.+)\.supabase\.co/)?.[1];
    return `https://${projectRef}.supabase.co/functions/v1/${functionName}`;
  }

  // 创建支付订单
  async createPayment(
    productName: string,
    amount: number,
    paymentType: PaymentType,
    userEmail?: string
  ): Promise<PaymentResult> {
    try {
      // 生成商户订单号
      const outTradeNo = this.generateOrderNo();

      // 构建请求参数
      const paymentRequest = {
        out_trade_no: outTradeNo,
        name: productName,
        money: amount.toFixed(2),
        type: paymentType,
        notify_url: `${window.location.origin}/api/payment/notify`,
        return_url: `${window.location.origin}/payment/result`,
        clientip: await this.getClientIP(),
        device: this.getDeviceType(),
        user_email: userEmail
      };

      // 调用后端API创建支付
      const response = await fetch(this.getPaymentFunctionUrl('payment-api'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          ...paymentRequest,
          action: 'create-payment'
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // 跳转到支付页面
        window.location.href = result.paymentUrl;

        return {
          success: true,
          message: '正在跳转到支付页面...'
        };
      } else {
        return {
          success: false,
          error: result.error || '创建支付订单失败'
        };
      }
    } catch (error) {
      console.error('创建支付订单失败:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  }

  // 获取支付链接（不跳转）
  async getPaymentUrl(
    productName: string,
    amount: number,
    paymentType: PaymentType,
    userEmail?: string
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      const outTradeNo = this.generateOrderNo();

      const paymentRequest = {
        out_trade_no: outTradeNo,
        name: productName,
        money: amount.toFixed(2),
        type: paymentType,
        notify_url: `${window.location.origin}/api/payment/notify`,
        return_url: `${window.location.origin}/payment/result`,
        clientip: await this.getClientIP(),
        device: this.getDeviceType(),
        user_email: userEmail
      };

      const response = await fetch(this.getPaymentFunctionUrl('payment-api'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          ...paymentRequest,
          action: 'create-payment'
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        return {
          success: true,
          url: result.paymentUrl
        };
      } else {
        return {
          success: false,
          error: result.error || '获取支付链接失败'
        };
      }
    } catch (error) {
      console.error('获取支付链接失败:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取支付链接失败'
      };
    }
  }

  // 查询订单状态
  async queryOrderStatus(tradeNo: string): Promise<PaymentResult> {
    try {
      const response = await fetch(this.getPaymentFunctionUrl('payment-api'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          trade_no: tradeNo,
          action: 'query-order'
        })
      });

      const result = await response.json();

      if (response.ok && result.code === 0) {
        return {
          success: true,
          tradeNo: result.trade_no || tradeNo,
          message: result.msg || '查询成功'
        };
      } else {
        return {
          success: false,
          error: result.msg || '查询订单失败'
        };
      }
    } catch (error) {
      console.error('查询订单失败:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '查询订单失败'
      };
    }
  }

  // 验证支付回调（前端通常不需要，后端处理）
  async verifyNotification(data: any): Promise<boolean> {
    try {
      const response = await fetch(this.getPaymentFunctionUrl('payment-api'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          ...data,
          action: 'verify-callback'
        })
      });

      const result = await response.json();
      return response.ok && result.valid;
    } catch (error) {
      console.error('验证支付回调失败:', error);
      return false;
    }
  }

  // 获取用户的支付历史
  async getUserPaymentHistory(userEmail: string): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from('payment_orders')
        .select('*')
        .eq('user_email', userEmail)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('获取支付历史失败:', error);
      return [];
    }
  }

  // 获取客户端IP（前端获取的IP仅供参考）
  private async getClientIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip || '127.0.0.1';
    } catch {
      return '127.0.0.1';
    }
  }

  // 获取设备类型
  private getDeviceType(): string {
    const ua = navigator.userAgent;
    if (/Mobile|Android|iPhone|iPad/i.test(ua)) {
      return 'mobile';
    } else if (/Tablet|iPad/i.test(ua)) {
      return 'tablet';
    } else {
      return 'pc';
    }
  }

  // 生成商户订单号
  private generateOrderNo(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');

    return `${year}${month}${day}${hour}${minute}${second}${random}`;
  }

  // 获取支付方式列表
  static getPaymentTypes(): Array<{ value: PaymentType; label: string; icon: string }> {
    return [
      {
        value: PaymentType.ALIPAY,
        label: '支付宝',
        icon: 'alipay'
      },
      {
        value: PaymentType.WXPAY,
        label: '微信支付',
        icon: 'wechat'
      },
      {
        value: PaymentType.QQPAY,
        label: 'QQ钱包',
        icon: 'qq'
      },
      {
        value: PaymentType.BANK,
        label: '云闪付',
        icon: 'bank'
      }
    ];
  }
}

// 创建支付服务实例
export const paymentService = new PaymentService();