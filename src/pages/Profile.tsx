import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User as UserIcon, Mail, Lock, Shield, Camera, Save, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import api from '../services/api';
import { User } from '../types';
import { cn } from '../utils';

const Profile: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const { user: authUser, updateUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    nameAr: '',
    nameEn: '',
    email: '',
    status: '',
    image: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/api/users/me');
        setUser(response.data);
        setFormData({
          nameAr: response.data.nameAr || '',
          nameEn: response.data.nameEn || '',
          email: response.data.email || '',
          status: response.data.status || '',
          image: response.data.image || '',
        });
      } catch (error) {
        console.error('Failed to fetch user:', error);
        toast.error(t('failed_to_fetch_profile'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [t]);

  const handleSaveProfile = async () => {
    if (!user?._id) return;
    setIsSaving(true);
    try {
      const response = await api.put(`/api/users/${user._id}`, formData);
      setUser(response.data);
      updateUser(response.data);
      toast.success(t('profile_updated_successfully'));
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error(t('something_went_wrong'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
                src={formData.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=admin"}
                alt="Avatar"
                className="w-32 h-32 rounded-full border-4 border-primary/10 p-1 object-cover"
                referrerPolicy="no-referrer"
              />
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={handleUploadAvatar}
              />
              <label 
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:bg-primary-dark transition-colors cursor-pointer"
              >
                <Camera size={16} />
              </label>
            </div>
            <h3 className="font-bold text-lg">{isRtl ? formData.nameAr : formData.nameEn}</h3>
            <p className="text-sm text-slate-500 capitalize mb-4">{user?.isAdmin ? t('admin') : t('user')}</p>
            <div className="flex justify-center gap-2">
              <span className={cn(
                "px-2 py-1 text-[10px] font-bold uppercase rounded",
                formData.status === 'active' ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
              )}>
                {formData.status}
              </span>
              {user?.isAdmin && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-[10px] font-bold uppercase rounded">{t('admin')}</span>
              )}
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="card p-6">
            <h4 className="font-bold mb-6 flex items-center gap-2">
              <UserIcon size={18} className="text-primary" />
              {t('personal_info')}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('name_ar')}</label>
                <input 
                  type="text" 
                  value={formData.nameAr} 
                  onChange={(e) => setFormData(prev => ({ ...prev, nameAr: e.target.value }))}
                  className="input-field" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('name_en')}</label>
                <input 
                  type="text" 
                  value={formData.nameEn} 
                  onChange={(e) => setFormData(prev => ({ ...prev, nameEn: e.target.value }))}
                  className="input-field" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('email_address')}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 rtl:left-auto rtl:right-3" size={16} />
                  <input 
                    type="email" 
                    value={formData.email} 
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="input-field pl-10 rtl:pl-4 rtl:pr-10" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('status')}</label>
                <select 
                  value={formData.status} 
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="input-field"
                >
                  <option value="active">{t('active')}</option>
                  <option value="inactive">{t('inactive')}</option>
                </select>
              </div>
            </div>
            <button 
              onClick={handleSaveProfile} 
              disabled={isSaving}
              className="btn-primary mt-6 flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {t('save_changes')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
