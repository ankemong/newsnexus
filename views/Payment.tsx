import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, AlertCircle, Heart, Coffee, Users, Zap } from 'lucide-react';
import { PaymentButton } from '../components/PaymentButton';
import { PaymentResult } from '../types/payment';
import { ViewState } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface PaymentViewProps {
  onNavigate: (view: ViewState) => void;
}

export const Payment: React.FC<PaymentViewProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const suggestedAmounts = [
    {
      name: '咖啡支持',
      price: 5,
      icon: Coffee,
      description: '请我们喝杯咖啡，支持项目持续发展',
      color: 'bg-yellow-50 border-yellow-200'
    },
    {
      name: '月度支持',
      price: 20,
      icon: Heart,
      description: '帮助我们覆盖服务器成本',
      color: 'bg-red-50 border-red-200'
    },
    {
      name: '年度支持',
      price: 100,
      icon: Users,
      description: '支持新功能开发和社区建设',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      name: '超级赞助',
      price: 500,
      icon: Zap,
      description: '支持重大功能更新和技术升级',
      color: 'bg-purple-50 border-purple-200'
    }
  ];

  const handlePaymentSuccess = (result: PaymentResult) => {
    setPaymentStatus({
      type: 'success',
      message: `感谢您的赞助！您的支持将帮助我们持续改进 NewsNexus。订单号：${result.tradeNo}`
    });
  };

  const handlePaymentError = (error: string) => {
    setPaymentStatus({
      type: 'error',
      message: `赞助失败：${error}`
    });
  };

  const handleCustomAmountPayment = () => {
    const amount = parseFloat(customAmount);
    if (isNaN(amount) || amount < 1) {
      setPaymentStatus({
        type: 'error',
        message: '请输入有效的赞助金额（最少1元）'
      });
      return;
    }

    const product = {
      name: '自定义赞助',
      price: amount,
      type: 'donation' as const,
      features: [
        '您的慷慨赞助',
        '支持项目持续发展',
        '帮助改进用户体验',
        '感谢您的支持'
      ],
      popular: false
    };

    // 这里需要调用支付功能，暂时显示状态
    setPaymentStatus({
      type: 'success',
      message: `感谢您赞助 ¥${amount}！您的支持对我们意义重大。`
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
              <h1 className="text-xl font-semibold">捐款赞助</h1>
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
            支持 NewsNexus 项目发展
          </h2>
          <p className="text-lg text-gray-600">
            NewsNexus 是一个开源免费的新闻聚合平台，您的赞助将帮助我们持续改进和开发新功能
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {suggestedAmounts.map((tier, index) => {
            const Icon = tier.icon;
            return (
              <div
                key={index}
                className={`relative bg-white rounded-xl border-2 ${tier.color} shadow-lg overflow-hidden hover:shadow-xl transition-shadow`}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Icon className="w-8 h-8 text-gray-700" />
                    <div className="text-right">
                      <span className="text-3xl font-bold text-gray-900">
                        ¥{tier.price}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {tier.name}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4">
                    {tier.description}
                  </p>

                  <PaymentButton
                    product={{
                      name: tier.name,
                      price: tier.price,
                      type: 'donation' as const,
                      features: [
                        tier.description,
                        '支持开源项目发展',
                        '感谢您的慷慨支持'
                      ],
                      popular: false
                    }}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    className="w-full"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* 自定义金额赞助 */}
        <div className="max-w-md mx-auto mb-12">
          <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
              自定义赞助金额
            </h3>
            <div className="flex space-x-2">
              <div className="flex-1">
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="输入赞助金额"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleCustomAmountPayment}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                赞助
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2 text-center">
              感谢您的任何金额支持，每一份赞助都很重要！
            </p>
          </div>
        </div>

        {/* 项目说明和感谢 */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 text-gray-600 mb-4">
            <Heart className="w-5 h-5 text-red-500" />
            <span className="font-medium">感谢您的支持</span>
          </div>
          <p className="text-sm text-gray-500 max-w-3xl mx-auto mb-6">
            NewsNexus 是一个开源项目，致力于为用户提供免费、优质的新闻聚合服务。您的赞助将直接用于：
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto text-sm text-gray-600">
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium mb-2">服务器成本</h4>
              <p>覆盖服务器托管和带宽费用</p>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium mb-2">功能开发</h4>
              <p>开发新功能和改进用户体验</p>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium mb-2">社区建设</h4>
              <p>构建活跃的用户社区</p>
            </div>
          </div>
          <div className="mt-6">
            <p className="text-xs text-gray-400">
              所有赞助均为自愿行为，我们使用安全的支付渠道处理交易。支持支付宝、微信支付等方式。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};