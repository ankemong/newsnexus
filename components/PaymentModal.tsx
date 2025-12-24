import React, { useState } from 'react';
import { X, CreditCard, Smartphone, QrCode, AlertCircle, Check } from 'lucide-react';
import { PaymentType, PaymentResult } from '../types/payment';
import { paymentService } from '../services/paymentService';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  amount: number;
  userEmail?: string;
  onSuccess?: (result: PaymentResult) => void;
  onError?: (error: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  productName,
  amount,
  userEmail,
  onSuccess,
  onError
}) => {
  const [selectedPayment, setSelectedPayment] = useState<PaymentType>(PaymentType.ALIPAY);
  const [loading, setLoading] = useState(false);
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);

  const paymentTypes = paymentService.constructor.getPaymentTypes();

  const handlePayment = async () => {
    setLoading(true);
    setPaymentResult(null);

    try {
      // 获取支付链接
      const result = await paymentService.getPaymentUrl(
        productName,
        amount,
        selectedPayment,
        userEmail
      );

      if (result.success && result.url) {
        // 跳转到支付页面
        window.location.href = result.url;
      } else {
        const error = result.error || '创建支付失败';
        setPaymentResult({
          success: false,
          error
        });
        onError?.(error);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '支付失败';
      setPaymentResult({
        success: false,
        error: errorMessage
      });
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getPaymentIcon = (type: PaymentType) => {
    switch (type) {
      case PaymentType.ALIPAY:
        return <CreditCard className="w-6 h-6 text-blue-500" />;
      case PaymentType.WXPAY:
        return <Smartphone className="w-6 h-6 text-green-500" />;
      case PaymentType.QQPAY:
        return <QrCode className="w-6 h-6 text-blue-400" />;
      case PaymentType.BANK:
        return <CreditCard className="w-6 h-6 text-red-500" />;
      default:
        return <CreditCard className="w-6 h-6 text-gray-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 标题 */}
        <h2 className="text-xl font-bold mb-6">选择支付方式</h2>

        {/* 订单信息 */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">商品名称</span>
            <span className="font-medium">{productName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">支付金额</span>
            <span className="text-2xl font-bold text-red-500">¥{amount.toFixed(2)}</span>
          </div>
        </div>

        {/* 支付方式选择 */}
        <div className="space-y-3 mb-6">
          {paymentTypes.map((type) => (
            <div
              key={type.value}
              onClick={() => setSelectedPayment(type.value)}
              className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                selectedPayment === type.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="mr-3">
                {getPaymentIcon(type.value)}
              </div>
              <div className="flex-1">
                <div className="font-medium">{type.label}</div>
              </div>
              <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center">
                {selectedPayment === type.value && (
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 错误提示 */}
        {paymentResult && !paymentResult.success && (
          <div className="flex items-center space-x-2 text-red-500 mb-4">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">{paymentResult.error}</span>
          </div>
        )}

        {/* 支付按钮 */}
        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>处理中...</span>
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              <span>立即支付 ¥{amount.toFixed(2)}</span>
            </>
          )}
        </button>

        {/* 安全提示 */}
        <div className="mt-4 text-center text-xs text-gray-500">
          <p>支付环境安全，资金由第三方平台担保</p>
        </div>
      </div>
    </div>
  );
};