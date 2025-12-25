import React, { useState } from 'react';
import { Bell, Check, Mail, Settings } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Notifications: React.FC = () => {
  const { t } = useLanguage();

  const [notifications, setNotifications] = useState([
    { id: 1, title: t('notifications.sample.keywordAlertTitle'), msg: t('notifications.sample.keywordAlertMsg'), time: t('notifications.sample.time2m'), read: false },
    { id: 2, title: t('notifications.sample.systemUpdateTitle'), msg: t('notifications.sample.systemUpdateMsg'), time: t('notifications.sample.time1h'), read: false },
    { id: 3, title: t('notifications.sample.subscriptionErrorTitle'), msg: t('notifications.sample.subscriptionErrorMsg'), time: t('notifications.sample.time5h'), read: true },
  ]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">{t('notifications.title')}</h2>
        <button className="text-sm text-gray-600 hover:text-black font-medium underline">{t('notifications.markAllRead')}</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
           {notifications.map(n => (
             <div key={n.id} className={`p-4 rounded-xl border flex gap-4 transition-all ${n.read ? 'bg-white border-gray-100 opacity-75' : 'bg-white border-gray-300 shadow-sm'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${n.read ? 'bg-gray-100' : 'bg-black'}`}>
                   <Bell className={`w-5 h-5 ${n.read ? 'text-gray-500' : 'text-white'}`} />
                </div>
                <div className="flex-1">
                   <div className="flex justify-between items-start">
                      <h3 className={`font-semibold ${n.read ? 'text-gray-500' : 'text-gray-900'}`}>{n.title}</h3>
                      <span className="text-xs text-gray-400">{n.time}</span>
                   </div>
                   <p className="text-sm text-gray-600 mt-1">{n.msg}</p>
                </div>
                {!n.read && (
                    <button className="text-black hover:bg-gray-100 p-1 rounded">
                        <Check className="w-4 h-4" />
                    </button>
                )}
             </div>
           ))}
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 h-fit">
           <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              {t('notifications.preferences')}
           </h3>
           <div className="space-y-4">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{t('notifications.push')}</span>
                 </div>
                 <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                    <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 right-5" checked readOnly/>
                    <label htmlFor="toggle" className="toggle-label block overflow-hidden h-5 rounded-full bg-black cursor-pointer"></label>
                 </div>
              </div>
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{t('notifications.emailDigest')}</span>
                 </div>
                 <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                    <input type="checkbox" className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer right-5"/>
                    <label className="toggle-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer"></label>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;