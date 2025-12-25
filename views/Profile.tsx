
import React from 'react';
import { User, Shield, Download, Lock, Globe } from 'lucide-react';
import { Language, LANGUAGE_LABELS } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

const Profile: React.FC = () => {
  const { language: currentLang, setLanguage: setLang, t } = useLanguage();
  
  // Sort languages alphabetically
  const sortedLanguages = Object.entries(LANGUAGE_LABELS).sort(([, labelA], [, labelB]) => 
    labelA.localeCompare(labelB)
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
       <h2 className="text-2xl font-bold text-gray-900">{t('profile.title')}</h2>
       
       {/* Profile Info */}
       <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
           <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="w-10 h-10 text-gray-600" />
              </div>
              <div>
                  <button className="text-sm text-black font-medium hover:underline">{t('profile.changeAvatar')}</button>
              </div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.displayName')}</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none" defaultValue="Alex Johnson" />
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.email')}</label>
                  <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50" defaultValue="alex@example.com" disabled />
              </div>
           </div>
       </div>

       {/* Preferences / Localization */}
       <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
           <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
               <Globe className="w-5 h-5 text-gray-400" />
               {t('profile.localization')}
           </h3>
           <div className="grid md:grid-cols-2 gap-6">
               <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.language')}</label>
                   <select 
                      value={currentLang}
                      onChange={(e) => setLang(e.target.value as Language)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
                   >
                       {sortedLanguages.map(([code, label]) => (
                           <option key={code} value={code}>{label}</option>
                       ))}
                   </select>
                   <p className="text-xs text-gray-500 mt-1">{t('profile.languageHelp')}</p>
               </div>
               <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.timezone')}</label>
                   <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none">
                       <option>UTC (Coordinated Universal Time)</option>
                       <option>EST (Eastern Standard Time)</option>
                       <option>PST (Pacific Standard Time)</option>
                       <option>CET (Central European Time)</option>
                       <option>CST (China Standard Time)</option>
                       <option>JST (Japan Standard Time)</option>
                   </select>
               </div>
           </div>
       </div>

       {/* Security */}
       <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
           <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
               <Shield className="w-5 h-5 text-gray-400" />
               {t('profile.security')}
           </h3>
           <div className="space-y-4">
               <div className="flex items-center justify-between py-2">
                   <div>
                       <p className="font-medium text-gray-900">{t('profile.twoFactor')}</p>
                       <p className="text-sm text-gray-500">{t('profile.twoFactorHelp')}</p>
                   </div>
                   <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 text-black">{t('profile.enable')}</button>
               </div>
               <div className="flex items-center justify-between py-2 border-t border-gray-100">
                   <div>
                       <p className="font-medium text-gray-900">{t('auth.password')}</p>
                       <p className="text-sm text-gray-500">{t('profile.passwordLastChanged')}</p>
                   </div>
                   <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2 text-black">
                       <Lock className="w-3 h-3" /> {t('profile.changePassword')}
                   </button>
               </div>
           </div>
       </div>

       {/* Data */}
       <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
           <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
               <Download className="w-5 h-5 text-gray-400" />
               {t('profile.data')}
           </h3>
           <p className="text-sm text-gray-500 mb-4">
               {t('profile.dataHelp')}
           </p>
           <button className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800">{t('profile.download')}</button>
       </div>
    </div>
  );
};

export default Profile;
