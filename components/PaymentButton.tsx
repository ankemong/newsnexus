import React, { useState } from 'react';
import { CreditCard, Crown, Zap } from 'lucide-react';
import { PaymentModal } from './PaymentModal';
import { PaymentType, PaymentResult } from '../types/payment';

interface PaymentButtonProps {
  product: {
    name: string;
    price: number;
    type: 'basic' | 'pro' | 'enterprise';
    features?: string[];
  };
  className?: string;
  userEmail?: string;
  onSuccess?: (result: PaymentResult) => void;
  onError?: (error: string) => void;
}

export const PaymentButton: React.FC<PaymentButtonProps> = ({
  product,
  className = '',
  userEmail,
  onSuccess,
  onError
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getPlanIcon = (type: string) => {
    switch (type) {
      case 'pro':
        return <Crown className="w-5 h-5" />;
      case 'enterprise':
        return <Zap className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  const getPlanStyle = (type: string) => {
    switch (type) {
      case 'pro':
        return 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600';
      case 'enterprise':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600';
      default:
        return 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700';
    }
  };

  const handlePaymentSuccess = (result: PaymentResult) => {
    setIsModalOpen(false);
    onSuccess?.(result);
  };

  const handlePaymentError = (error: string) => {
    onError?.(error);
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`relative overflow-hidden text-white font-medium px-6 py-3 rounded-lg transition-all transform hover:scale-105 ${getPlanStyle(product.type)} ${className}`}
      >
        <div className="flex items-center justify-center space-x-2">
          {getPlanIcon(product.type)}
          <span>升级到 {product.name}</span>
        </div>

        {/* 价格标签 */}
        <div className="absolute -top-2 -right-2 bg-white text-gray-800 text-xs font-bold px-2 py-1 rounded-full">
          ¥{product.price}
        </div>
      </button>

      {/* 支付弹窗 */}
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productName={`${product.name} 订阅`}
        amount={product.price}
        userEmail={userEmail}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </>
  );
};