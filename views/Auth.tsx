
import React, { useState, useEffect } from 'react';
import { ViewState } from '../types';
import { Globe, RefreshCw, Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { AuthService } from '../services/authService';
import { emailService } from '../lib/supabaseClient';

interface AuthProps {
  view: ViewState;
  setView: (view: ViewState) => void;
  onLogin: () => void;
}

const Auth: React.FC<AuthProps> = ({ view, setView, onLogin }) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Verification state
  const [verificationCode, setVerificationCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [sendingCode, setSendingCode] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState<string>('');
  const [verificationError, setVerificationError] = useState<string>('');

  const [errors, setErrors] = useState<{email?: string, password?: string, confirm?: string, verification?: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string>('');

  const isLogin = view === 'login';
  const isRegister = view === 'register';
  const isForgot = view === 'forgot-password';
  const isReset = view === 'reset-password';

  const handleSendCode = async () => {
    // Validate email first
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setErrors({...errors, email: t('auth.emailRequired')});
      return;
    }
    setErrors({...errors, email: undefined});
    setEmailError('');

    setSendingCode(true);

    try {
      // Call Edge Function to send verification email
      const { data, error } = await emailService.sendVerificationEmail(email);

      if (error) {
        console.error('Edge Function error:', error);
        setEmailError(error.message || t('auth.emailSendFailed'));
      } else if (data && data.success) {
        setEmailSent(true);
        setCountdown(60);

        // Start countdown
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setEmailError(data?.error || '邮件发送失败，请稍后重试');
      }
    } catch (error) {
      console.error('发送验证码邮件时出错:', error);
      setEmailError(t('auth.emailSendFailed'));
    } finally {
      setSendingCode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: any = {};
    setAuthError('');

    if (!isReset) {
       if (!email) newErrors.email = t('auth.emailRequired');
       else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = t('auth.invalidEmail');
    }

    if (isLogin || isRegister || isReset) {
       if (!password) newErrors.password = t('auth.passwordRequired');
       else if (password.length < 6) newErrors.password = '密码至少需要6个字符';
    }

    if (isRegister || isReset) {
       if (!confirmPassword) newErrors.confirm = t('auth.passwordRequired');
       else if (password !== confirmPassword) newErrors.confirm = t('auth.passwordMismatch');
    }

    if (isRegister) {
        if (!verificationCode) {
          newErrors.verification = t('auth.captchaError');
        } else {
          // 验证验证码格式
          if (!/^\d{6}$/.test(verificationCode)) {
            newErrors.verification = '请输入6位数字验证码';
          }
        }
    }

    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
    }

    // Clear errors and proceed
    setErrors({});
    setIsSubmitting(true);

    try {
        if (view === 'forgot-password') {
            setView('reset-password');
        } else if (isLogin) {
            // 真实的登录验证
            const { user, error } = await AuthService.signIn(email, password);

            if (error) {
                setAuthError(error);
            } else if (user) {
                onLogin();
            }
        } else if (isRegister) {
            // 先检查邮箱是否已注册
            try {
                const { supabase } = await import('../lib/supabaseClient');
                const { data: existingUser } = await supabase
                    .from('users')
                    .select('email')
                    .eq('email', email)
                    .single();

                if (existingUser) {
                    setAuthError('该邮箱已被注册，请直接登录');
                    return;
                }

                // 验证验证码
                const verifyResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-code`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                    },
                    body: JSON.stringify({ email, code: verificationCode }),
                });

                const verifyData = await verifyResponse.json();

                if (!verifyData.success) {
                    setAuthError(verifyData.error || '验证码验证失败');
                    return;
                }

                // 验证码通过，进行注册
                const { user, error } = await AuthService.signUp(email, password, verificationCode, email.split('@')[0]);

                if (error) {
                    // 检查是否是重复注册错误
                    if (error.includes('already registered') || error.includes('already been registered') || error.includes('User already registered')) {
                        setAuthError('该邮箱已被注册，请直接登录');
                    } else {
                        setAuthError(error);
                    }
                } else if (user) {
                    // 注册成功，自动登录
                    onLogin();
                }
            } catch (error) {
                console.error('注册错误:', error);
                setAuthError('注册失败，请稍后重试');
            }
        } else if (isReset) {
            // 重置密码
            const { error } = await AuthService.updatePassword(password);

            if (error) {
                setAuthError(error);
            } else {
                setView('login');
            }
        }
    } catch (error) {
        console.error('Auth error:', error);
        setAuthError('操作失败，请稍后重试');
    } finally {
        setIsSubmitting(false);
    }
  };

  const getTitle = () => {
      if (isLogin) return t('auth.loginTitle');
      if (isRegister) return t('auth.registerTitle');
      if (isForgot) return t('auth.forgotTitle');
      if (isReset) return t('auth.resetTitle');
      return 'Auth';
  };

  const getSubtitle = () => {
      if (isLogin) return t('auth.loginSubtitle');
      if (isRegister) return t('auth.registerSubtitle');
      if (isForgot) return t('auth.forgotSubtitle');
      if (isReset) return t('auth.resetSubtitle');
      return '';
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mx-auto mb-4 cursor-pointer" onClick={() => setView('home')}>
            <Globe className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{getTitle()}</h2>
          <p className="text-gray-500 text-sm mt-2">
            {getSubtitle()}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {!isReset && (
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.email')}</label>
                <input 
                type="email" 
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({...errors, email: undefined});
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="you@company.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
          )}

          {(isLogin || isRegister || isReset) && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">{t('auth.password')}</label>
                {isLogin && (
                  <button 
                    type="button" 
                    onClick={() => setView('forgot-password')}
                    className="text-xs text-gray-600 hover:text-black underline"
                  >
                    {t('auth.forgotPasswordLink')}
                  </button>
                )}
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({...errors, password: undefined});
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
          )}

          {(isRegister || isReset) && (
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.confirmPassword')}</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirm) setErrors({...errors, confirm: undefined});
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none ${errors.confirm ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="••••••••"
              />
              {errors.confirm && <p className="text-red-500 text-xs mt-1">{errors.confirm}</p>}
            </div>
          )}

          {isRegister && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">{t('auth.captcha')}</label>
                {emailSent && (
                  <div className="flex items-center text-green-600 text-xs">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    验证码已发送
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => {
                    setVerificationCode(e.target.value);
                    if (errors.verification) setErrors({...errors, verification: undefined});
                  }}
                  className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none placeholder:text-gray-400 ${errors.verification ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder={t('auth.captchaPlaceholder')}
                />
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={sendingCode || countdown > 0 || !email}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed text-sm font-medium min-w-[120px] flex items-center justify-center"
                >
                  {sendingCode ? (
                    <>
                      <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                      发送中
                    </>
                  ) : countdown > 0 ? (
                    `${countdown}s`
                  ) : (
                    <>
                      <Mail className="w-3 h-3 mr-1" />
                      {t('auth.sendCode')}
                    </>
                  )}
                </button>
              </div>

              {/* Error and status messages */}
              {emailError && (
                <div className="flex items-center text-red-500 text-xs">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {emailError}
                </div>
              )}

              {!emailError && emailSent && (
                <div className="text-xs text-gray-500">
                  验证码已发送到您的邮箱，请查收邮件并输入验证码。
                  <br />
                  <span className="text-gray-400">（验证码有效期为10分钟）</span>
                </div>
              )}

              {errors.verification && <p className="text-red-500 text-xs mt-1">{errors.verification}</p>}
            </div>
          )}

          {isLogin && (
            <div className="flex items-center">
              <input 
                id="remember-me" 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                {t('auth.rememberMe')}
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white font-medium py-2.5 rounded-lg hover:bg-gray-800 transition-colors shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                处理中...
              </>
            ) : (
              <>
                {isLogin ? t('auth.submitLogin') : isRegister ? t('auth.submitRegister') : isForgot ? t('auth.sendLink') : t('auth.resetBtn')}
              </>
            )}
          </button>

          {/* 认证错误消息 */}
          {authError && (
            <div className="flex items-center text-red-500 text-sm mt-2">
              <AlertCircle className="w-4 h-4 mr-1" />
              {authError}
            </div>
          )}
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-500">
            {isLogin ? t('auth.noAccount') : t('auth.hasAccount')}
          </span>
          <button 
            onClick={() => {
                setView(isLogin ? 'register' : 'login');
                setErrors({});
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setVerificationCode('');
                setEmailSent(false);
                setEmailError('');
                setVerificationError('');
                setRememberMe(false);
            }}
            className="text-black font-medium hover:underline"
          >
            {isLogin ? t('auth.signupAction') : t('auth.loginAction')}
          </button>
        </div>
        
        <div className="mt-4 text-center">
             <button onClick={() => setView('home')} className="text-xs text-gray-400 hover:text-gray-600">{t('auth.backToHome')}</button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
