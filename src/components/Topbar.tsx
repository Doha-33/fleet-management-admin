import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Bell, User, Menu } from 'lucide-react';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';

interface TopbarProps {
  onMenuClick: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <button 
          onClick={onMenuClick}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg lg:hidden"
        >
          <Menu size={20} />
        </button>
        <div className="relative flex-1 hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 rtl:left-auto rtl:right-3" size={18} />
          <input
            type="text"
            placeholder={t('search')}
            className="w-full pl-10 pr-4 py-2 rtl:pl-4 rtl:pr-10 rounded-full bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/50 outline-none text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <LanguageToggle />
        <ThemeToggle />
        
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full border-2 border-white dark:border-slate-900"></span>
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-bold">{t('notifications')}</h3>
                <span className="text-xs text-primary font-medium cursor-pointer">{t('mark_all_as_read')}</span>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                    <p className="text-sm font-medium">{t('new_demo_request')}</p>
                    <p className="text-xs text-slate-500 mt-1">{t('new_demo_request_desc')}</p>
                    <p className="text-[10px] text-slate-400 mt-2">{t('time_ago_2m')}</p>
                  </div>
                ))}
              </div>
              <div className="p-3 text-center border-t border-slate-200 dark:border-slate-800">
                <button className="text-sm text-primary font-medium">{t('view_all_notifications')}</button>
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>

        <div className="flex items-center gap-3">
          <div className="text-right rtl:text-left hidden sm:block">
            <p className="text-sm font-bold">{user?.name}</p>
            <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
          </div>
          <img
            src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=admin"}
            alt="Avatar"
            className="w-10 h-10 rounded-full border-2 border-primary/20 p-0.5"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
