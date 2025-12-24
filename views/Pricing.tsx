
import React, { useState } from 'react';
import { Check, CreditCard, Lock, Crown, Zap, Heart, Coffee, Users, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { PaymentButton, PaymentModal } from '../components/PaymentButton';
import { PaymentModal as PaymentModalComponent } from '../components/PaymentModal';
import { PaymentType, PaymentResult } from '../types/payment';

const Pricing: React.FC = () => {
  const { t } = useLanguage();
  const [showPayment, setShowPayment] = useState(false);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedPlan, setSelectedPlan] = useState<{
    name: string;
    price: number;
    type: 'donation' | string;
  } | null>(null);
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
      color: 'bg-yellow-50 border-yellow-200 hover:border-yellow-300'
    },
    {
      name: '月度支持',
      price: 20,
      icon: Heart,
      description: '帮助我们覆盖服务器成本',
      color: 'bg-red-50 border-red-200 hover:border-red-300'
    },
    {
      name: '年度支持',
      price: 100,
      icon: Users,
      description: '支持新功能开发和社区建设',
      color: 'bg-blue-50 border-blue-200 hover:border-blue-300'
    },
    {
      name: '超级赞助',
      price: 500,
      icon: Star,
      description: '支持重大功能更新和技术升级',
      color: 'bg-purple-50 border-purple-200 hover:border-purple-300'
    }
  ];

  const plans = [
    {
      name: t('pricing.basicPlan'),
      basePrice: 0,
      type: 'basic' as const,
      features: [
        `10 次关键词搜索`,
        '5 篇文章下载',
        '20 种语言支持',
        'RSS订阅功能',
        '基础仪表板'
      ],
      cta: t('pricing.currentPlan'),
      current: true,
    },
    {
      name: t('pricing.proPlan'),
      basePrice: 39.99,
      type: 'pro' as const,
      features: [
        `1,000 次关键词搜索`,
        '无限文章下载',
        '20 种语言支持',
        'AI智能摘要',
        '高级搜索过滤',
        '优先技术支持'
      ],
      cta: t('pricing.upgrade'),
      highlight: true,
    },
    {
      name: '高级版',
      basePrice: 199.99,
      type: 'enterprise' as const,
      features: [
        `5,000 次关键词搜索`,
        '无限文章下载',
        '20 种语言支持',
        'AI智能摘要',
        '多语言翻译',
        '高级搜索过滤',
        '搜索历史导出',
        '优先技术支持'
      ],
      cta: t('pricing.contactSales'),
    }
  ];

  const handlePaymentSuccess = (result: PaymentResult) => {
    setPaymentStatus({
      type: 'success',
      message: `感谢您的赞助！您的支持将帮助我们持续改进 NewsNexus。订单号：${result.tradeNo}`
    });
    setShowPayment(false);
    setSelectedPlan(null);
  };

  const handlePaymentError = (error: string) => {
    setPaymentStatus({
      type: 'error',
      message: `赞助失败：${error}`
    });
  };

  const handleDonate = (tier: typeof suggestedAmounts[0]) => {
    setSelectedPlan({
      name: tier.name,
      price: tier.price,
      type: 'donation'
    });
    setShowPayment(true);
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

    setSelectedPlan({
      name: '自定义赞助',
      price: amount,
      type: 'donation'
    });
    setShowPayment(true);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">{t('nav.payment')}</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          NewsNexus 是一个开源免费的新闻聚合平台，您的赞助将帮助我们持续改进和开发新功能
        </p>
      </div>

      {/* 赞助金额选择 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {suggestedAmounts.map((tier, index) => {
          const Icon = tier.icon;
          return (
            <div
              key={index}
              className={`relative bg-white rounded-xl border-2 ${tier.color} shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer`}
              onClick={() => handleDonate(tier)}
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

                <button className="w-full bg-gray-800 text-white font-medium py-2 rounded-lg hover:bg-gray-700 transition-colors">
                  赞助支持
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 自定义金额赞助 */}
      <div className="max-w-md mx-auto mb-8">
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
      <div className="text-center">
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

      {/* 支付状态提示 */}
      {paymentStatus.type && (
        <div className={`flex items-center justify-center space-x-2 p-4 rounded-lg ${
          paymentStatus.type === 'success'
            ? 'bg-green-50 text-green-800'
            : 'bg-red-50 text-red-800'
        }`}>
          {paymentStatus.type === 'success' ? (
            <Check className="w-5 h-5" />
          ) : (
            <CreditCard className="w-5 h-5" />
          )}
          <span>{paymentStatus.message}</span>
        </div>
      )}

      {/* 支付模态框 */}
      {showPayment && selectedPlan && (
        <PaymentModalComponent
          isOpen={showPayment}
          onClose={() => setShowPayment(false)}
          productName={selectedPlan.name}
          amount={selectedPlan.price}
          userEmail="user@example.com" // TODO: 从认证状态获取用户邮箱
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      )}
    </div>
  );
};

export default Pricing;
