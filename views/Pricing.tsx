
import React, { useState } from 'react';
import { Check, CreditCard, Lock, Crown, Zap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { PaymentButton, PaymentModal } from '../components/PaymentButton';
import { PaymentModal as PaymentModalComponent } from '../components/PaymentModal';
import { PaymentType, PaymentResult } from '../types/payment';

type BillingCycle = 'monthly' | 'quarterly' | 'biannual' | 'yearly';

const Pricing: React.FC = () => {
  const { t } = useLanguage();
  const [showPayment, setShowPayment] = useState(false);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<{
    name: string;
    price: number;
    type: 'basic' | 'pro' | 'enterprise';
  } | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // Define multipliers/discounts
  const cycleConfig: Record<BillingCycle, { multiplier: number, label: string, discount?: string }> = {
    monthly: { multiplier: 1, label: t('pricing.perMonth') },
    quarterly: { multiplier: 3, label: t('pricing.perQuarter'), discount: '5%' },
    biannual: { multiplier: 6, label: t('pricing.perHalfYear'), discount: '10%' },
    yearly: { multiplier: 12, label: t('pricing.perYear'), discount: '20%' },
  };

  const getPrice = (basePrice: number) => {
    if (basePrice === 0) return '¥0';
    const total = basePrice * cycleConfig[billingCycle].multiplier;
    // Apply rough discount if applicable for visual effect (or just multiply logic)
    // Here we just do direct multiplication for simplicity in demo, assuming base is monthly
    let discounted = total;
    if (billingCycle === 'quarterly') discounted = total * 0.95;
    if (billingCycle === 'biannual') discounted = total * 0.90;
    if (billingCycle === 'yearly') discounted = total * 0.80;

    return `¥${Math.floor(discounted)}`;
  };

  const getActualPrice = (basePrice: number) => {
    if (basePrice === 0) return 0;
    const total = basePrice * cycleConfig[billingCycle].multiplier;
    let discounted = total;
    if (billingCycle === 'quarterly') discounted = total * 0.95;
    if (billingCycle === 'biannual') discounted = total * 0.90;
    if (billingCycle === 'yearly') discounted = total * 0.80;
    return Math.floor(discounted);
  };

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
      message: `支付成功！订单号：${result.tradeNo}`
    });
    setShowPayment(false);
    setSelectedPlan(null);
  };

  const handlePaymentError = (error: string) => {
    setPaymentStatus({
      type: 'error',
      message: `支付失败：${error}`
    });
  };

  const handleUpgrade = (plan: typeof plans[0]) => {
    if (!plan.current) {
      setSelectedPlan({
        name: plan.name,
        price: getActualPrice(plan.basePrice),
        type: plan.type
      });
      setShowPayment(true);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">{t('nav.payment')}</h2>
        
        {/* Billing Cycle Switcher */}
        <div className="inline-flex bg-gray-100 p-1 rounded-xl">
           {(['monthly', 'quarterly', 'biannual', 'yearly'] as BillingCycle[]).map((cycle) => (
             <button
                key={cycle}
                onClick={() => setBillingCycle(cycle)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all relative
                   ${billingCycle === cycle ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-900'}
                `}
             >
                {t(`pricing.${cycle}`)}
                {cycleConfig[cycle].discount && (
                    <span className="absolute -top-3 -right-2 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                        -{cycleConfig[cycle].discount}
                    </span>
                )}
             </button>
           ))}
        </div>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div key={plan.name} className={`
            relative p-8 rounded-2xl border flex flex-col
            ${plan.highlight ? 'border-black shadow-xl bg-white scale-105 z-10' : 'border-gray-200 bg-white shadow-sm'}
          `}>
            {plan.highlight && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black text-white px-4 py-1 rounded-full text-sm font-semibold whitespace-nowrap">
                {t('pricing.mostPopular')}
              </div>
            )}
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
            <div className="flex items-baseline mb-6">
              <span className="text-4xl font-bold text-gray-900">{getPrice(plan.basePrice)}</span>
              <span className="text-gray-500 ml-1">{cycleConfig[billingCycle].label}</span>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <Check className="w-5 h-5 text-black mr-2 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            {plan.current ? (
              <button
                className="w-full py-3 rounded-lg font-medium bg-gray-100 text-gray-400 cursor-default"
                disabled
              >
                {plan.cta}
              </button>
            ) : plan.type === 'enterprise' ? (
              <button
                className="w-full py-3 rounded-lg font-medium bg-white border-2 border-black text-black hover:bg-gray-50"
                onClick={() => alert('请联系销售团队：sales@newsnexus.app')}
              >
                {plan.cta}
              </button>
            ) : (
              <PaymentButton
                product={{
                  name: plan.name,
                  price: getActualPrice(plan.basePrice),
                  type: plan.type
                }}
                userEmail="user@example.com" // TODO: 从认证状态获取用户邮箱
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                className="w-full"
              />
            )}
          </div>
        ))}
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

      {/* History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
           <h3 className="font-bold text-gray-900">Billing History</h3>
        </div>
        <table className="w-full text-left text-sm text-gray-600">
           <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
              <tr>
                 <th className="px-6 py-3">Date</th>
                 <th className="px-6 py-3">Description</th>
                 <th className="px-6 py-3">Amount</th>
                 <th className="px-6 py-3">Status</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-gray-100">
              <tr>
                 <td className="px-6 py-4">Oct 01, 2023</td>
                 <td className="px-6 py-4">Pro Plan - Monthly</td>
                 <td className="px-6 py-4">$5.00</td>
                 <td className="px-6 py-4"><span className="text-gray-900 font-bold">Paid</span></td>
              </tr>
              <tr>
                 <td className="px-6 py-4">Sep 01, 2023</td>
                 <td className="px-6 py-4">Pro Plan - Monthly</td>
                 <td className="px-6 py-4">$5.00</td>
                 <td className="px-6 py-4"><span className="text-gray-900 font-bold">Paid</span></td>
              </tr>
           </tbody>
        </table>
      </div>
    </div>
  );
};

export default Pricing;
