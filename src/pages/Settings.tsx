import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Save, Globe, Phone, Mail, MapPin, MessageCircle, Facebook, Twitter, Instagram, Linkedin, Youtube, Info } from 'lucide-react';
import { toast } from 'sonner';
import api from '../services/api';
import { Setting } from '../types';

const Settings = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Partial<Setting>>({
    whatsapp: '',
    instagram: '',
    facebook: '',
    youtube: '',
    aboutUsAr: '',
    aboutUsEn: '',
    phoneNumber: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/api/settings');
      if (response.data && response.data.length > 0) {
        setFormData(response.data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      toast.error(t('failed_to_fetch_settings'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData._id) {
        await api.put(`/api/settings/${formData._id}`, formData);
      } else {
        await api.post('/api/settings', formData);
      }
      toast.success(t('settings_updated_successfully'));
      fetchSettings();
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error(t('failed_to_save_settings'));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('settings')}</h1>
          <p className="text-slate-500">{t('manage_company_info_links')}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">

        <div className="card p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Phone size={20} className="text-primary" />
            {t('contact_info')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">{t('phone')}</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  className="input-field pl-10"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">WhatsApp</label>
              <div className="relative">
                <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  className="input-field pl-10"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Globe size={20} className="text-primary" />
            {t('social_links')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Facebook</label>
              <div className="relative">
                <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  className="input-field pl-10"
                  value={formData.facebook}
                  onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Instagram</label>
              <div className="relative">
                <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  className="input-field pl-10"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">YouTube</label>
              <div className="relative">
                <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  className="input-field pl-10"
                  value={formData.youtube}
                  onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="btn-primary flex items-center gap-2 px-8">
            <Save size={18} />
            {t('save_changes')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
