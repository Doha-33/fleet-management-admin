import React from 'react';
import { useTranslation } from 'react-i18next';
import { User, Mail, Lock, Shield, Camera, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const handleSaveProfile = () => {
    toast.success(t('profile_updated_successfully'));
  };

  const handleUpdatePassword = () => {
    toast.success(t('password_updated_successfully'));
  };

  const handleUploadAvatar = () => {
    toast.info(t('opening_file_picker'));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold">{t('profile')}</h2>
        <p className="text-slate-500">{t('manage_profile')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="card p-6 text-center">
            <div className="relative inline-block mb-4">
              <img
                src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=admin"}
                alt="Avatar"
                className="w-32 h-32 rounded-full border-4 border-primary/10 p-1"
                referrerPolicy="no-referrer"
              />
              <button 
                onClick={handleUploadAvatar}
                className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:bg-primary-dark transition-colors"
              >
                <Camera size={16} />
              </button>
            </div>
            <h3 className="font-bold text-lg">{user?.name}</h3>
            <p className="text-sm text-slate-500 capitalize mb-4">{user?.role}</p>
            <div className="flex justify-center gap-2">
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-[10px] font-bold uppercase rounded">{t('verified')}</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-[10px] font-bold uppercase rounded">{t('admin')}</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="card p-6">
            <h4 className="font-bold mb-6 flex items-center gap-2">
              <User size={18} className="text-primary" />
              {t('personal_info')}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('full_name')}</label>
                <input type="text" defaultValue={user?.name} className="input-field" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('email_address')}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 rtl:left-auto rtl:right-3" size={16} />
                  <input type="email" defaultValue={user?.email} className="input-field pl-10 rtl:pl-4 rtl:pr-10" />
                </div>
              </div>
            </div>
            <button onClick={handleSaveProfile} className="btn-primary mt-6 flex items-center gap-2">
              <Save size={18} />
              {t('save_changes')}
            </button>
          </div>

          <div className="card p-6">
            <h4 className="font-bold mb-6 flex items-center gap-2">
              <Lock size={18} className="text-primary" />
              {t('security_settings')}
            </h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('current_password')}</label>
                <input type="password" placeholder="••••••••" className="input-field" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('new_password')}</label>
                  <input type="password" placeholder="••••••••" className="input-field" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('confirm_password')}</label>
                  <input type="password" placeholder="••••••••" className="input-field" />
                </div>
              </div>
            </div>
            <button onClick={handleUpdatePassword} className="btn-secondary mt-6 flex items-center gap-2">
              <Shield size={18} />
              {t('update_password')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
