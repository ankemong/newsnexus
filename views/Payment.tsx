import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, AlertCircle, CreditCard } from 'lucide-react';
import { PaymentButton } from '../components/PaymentButton';
import { PaymentResult } from '../types/payment';
import { ViewState } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface PaymentViewProps {
  onNavigate: (view: ViewState) => void;
}

export const Payment: React.FC<PaymentViewProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const [paymentStatus, setPaymentStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const plans = [
    {
      name: '基础版',
      price: 0,
      type: 'basic' as const,
      features: [
        '每天 10 条新闻',
        '基础搜索功能',
        '1 个订阅源',
        '邮件通知'
      ],
      popular: false
    },
    {
      name: '专业版',
      price: 29.99,
      type: 'pro' as const,
      features: [
        '每天 100 条新闻',
        '高级搜索功能',
        '10 个订阅源',
        '邮件通知',
        '数据分析报告',
        'API 访问'
      ],
      popular: true
    },
    {
      name: '企业版',
      price: 99.99,
      type: 'enterprise' as const,
      features: [
        '无限新闻获取',
        '高级搜索功能',
        '无限订阅源',
        '优先邮件通知',
        '详细数据分析',
        '完整 API 访问',
        '专属客服支持',
        '自定义品牌'
      ],
      popular: false
    }
  ];

  const handlePaymentSuccess = (result: PaymentResult) => {
    setPaymentStatus({
      type: 'success',
      message: `支付成功！订单号：${result.tradeNo}`
    });
  };

  const handlePaymentError = (error: string) => {
    setPaymentStatus({
      type: 'error',
      message: `支付失败：${error}`
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部栏 */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('dashboard')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>返回</span>
              </button>
              <h1 className="text-xl font-semibold">升级订阅</h1>
            </div>
          </div>
        </div>
      </div>

      {/* 支付状态提示 */}
      {paymentStatus.type && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div
            className={`flex items-center space-x-2 p-4 rounded-lg ${
              paymentStatus.type === 'success'
                ? 'bg-green-50 text-green-800'
                : 'bg-red-50 text-red-800'
            }`}
          >
            {paymentStatus.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{paymentStatus.message}</span>
          </div>
        </div>
      )}

      {/* 价格方案 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            选择适合您的方案
          </h2>
          <p className="text-lg text-gray-600">
            解锁更多功能，提升新闻获取体验
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.type}
              className={`relative bg-white rounded-2xl shadow-lg overflow-hidden ${
                plan.popular ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {/* 热门标签 */}
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 rounded-bl-lg text-sm font-medium">
                  最受欢迎
                </div>
              )}

              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">
                    ¥{plan.price}
                  </span>
                  <span className="text-gray-600">/月</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.price === 0 ? (
                  <button
                    className="w-full bg-gray-100 text-gray-800 font-medium py-3 rounded-lg cursor-not-allowed"
                    disabled
                  >
                    当前方案
                  </button>
                ) : (
                  <PaymentButton
                    product={plan}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    className="w-full"
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 安全保障说明 */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 text-gray-600 mb-4">
            <CreditCard className="w-5 h-5" />
            <span className="font-medium">安全支付保障</span>
          </div>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            我们使用业界标准的加密技术保护您的支付信息。所有支付交易均由第三方支付平台处理，
            我们不会存储您的信用卡信息。支持支付宝、微信支付、QQ钱包等多种支付方式。
          </p>
        </div>
      </div>
    </div>
  );
};