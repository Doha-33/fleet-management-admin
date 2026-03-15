import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search, Edit2, Trash2, GripVertical, Settings, Globe, Save, Camera } from 'lucide-react';
import { Service } from '../types';
import { cn, generateSlug } from '../utils';
import Modal from '../components/Modal';
import { toast } from 'sonner';

const initialServices: Service[] = [
  {
    id: '1',
    titleEn: 'Real-time Fleet Tracking',
    titleAr: 'تتبع الأسطول في الوقت الحقيقي',
    slug: 'real-time-fleet-tracking',
    descriptionEn: 'Monitor your vehicles live on the map with precision.',
    descriptionAr: 'راقب مركباتك مباشرة على الخريطة بدقة عالية.',
    features: ['Live Map', 'Geofencing', 'Speed Alerts'],
    benefits: ['Reduced Fuel Cost', 'Improved Safety'],
    order: 1,
    metaTitle: 'Fleet Tracking Service',
    metaDescription: 'Best fleet tracking service in the region.',
  },
  {
    id: '2',
    titleEn: 'Fuel Management System',
    titleAr: 'نظام إدارة الوقود',
    slug: 'fuel-management-system',
    descriptionEn: 'Prevent fuel theft and optimize consumption.',
    descriptionAr: 'منع سرقة الوقود وتحسين الاستهلاك.',
    features: ['Fuel Sensors', 'Consumption Reports', 'Drain Alerts'],
    benefits: ['Cost Savings', 'Detailed Analytics'],
    order: 2,
    metaTitle: 'Fuel Management Solutions',
    metaDescription: 'Optimize your fleet fuel consumption.',
  },
];

const Services: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [services, setServices] = useState<Service[]>(initialServices);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<Partial<Service>>({
    titleEn: '',
    titleAr: '',
    descriptionEn: '',
    descriptionAr: '',
    slug: '',
    image: '',
    order: 0,
    features: [],
    benefits: [],
  });

  const filteredServices = useMemo(() => {
    return services.filter(s => 
      s.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.titleAr.includes(searchTerm)
    ).sort((a, b) => a.order - b.order);
  }, [services, searchTerm]);

  const handleOpenModal = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData(service);
    } else {
      setEditingService(null);
      setFormData({
        titleEn: '',
        titleAr: '',
        descriptionEn: '',
        descriptionAr: '',
        slug: '',
        image: '',
        order: services.length + 1,
        features: [],
        benefits: [],
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.titleEn || !formData.titleAr) {
      toast.error(t('please_fill_all_fields'));
      return;
    }

    const slug = formData.slug || generateSlug(formData.titleEn);

    if (editingService) {
      setServices(prev => prev.map(s => s.id === editingService.id ? { ...s, ...formData, slug } as Service : s));
      toast.success(t('service_updated_successfully'));
    } else {
      const newService: Service = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        slug,
        image: formData.image || `https://picsum.photos/seed/${Math.random()}/400/250`,
      } as Service;
      setServices(prev => [...prev, newService]);
      toast.success(t('service_added_successfully'));
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t('delete_confirmation'))) {
      setServices(prev => prev.filter(s => s.id !== id));
      toast.success(t('service_deleted_successfully'));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
        toast.success(t('image_uploaded'));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">{t('services')}</h2>
          <p className="text-slate-500">{t('manage_services')}</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          {t('add_service')}
        </button>
      </div>

      <div className="card p-4 md:p-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 rtl:left-auto rtl:right-3" size={18} />
          <input
            type="text"
            placeholder={t('search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rtl:pl-4 rtl:pr-10 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary/50 outline-none text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredServices.map((service) => (
          <div key={service.id} className="card p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 group">
            <div className="hidden md:block cursor-grab text-slate-300 hover:text-slate-500 transition-colors">
              <GripVertical size={24} />
            </div>
            
            <div className="w-full md:w-20 h-40 md:h-20 rounded-lg overflow-hidden shrink-0 border border-slate-200 dark:border-slate-800">
              <img 
                src={service.image || 'https://via.placeholder.com/150'} 
                alt={service.titleEn} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-2">
                <h3 className="font-bold text-base md:text-lg truncate">
                  {i18n.language === 'ar' ? service.titleAr : service.titleEn}
                </h3>
                <span className="text-[10px] md:text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-500 font-mono truncate max-w-[150px]">
                  /{service.slug}
                </span>
              </div>
              <p className="text-xs md:text-sm text-slate-500 line-clamp-2 mb-4">
                {i18n.language === 'ar' ? service.descriptionAr : service.descriptionEn}
              </p>
              
              <div className="flex flex-wrap gap-1.5 md:gap-2">
                {service.features.map((feature, idx) => (
                  <span key={idx} className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-primary/10 text-primary rounded">
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 border-t md:border-t-0 md:border-s border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:ps-6 w-full md:w-auto justify-between md:justify-start">
              <div className="flex flex-col items-center gap-1">
                <Globe size={14} className="text-slate-400 md:w-4 md:h-4" />
                <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase">SEO</span>
              </div>
              <div className="flex gap-1 md:gap-2">
                <button onClick={() => handleOpenModal(service)} className="p-1.5 md:p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 rounded-lg transition-colors" title={t('edit_service')}>
                  <Edit2 size={16} className="md:w-[18px] md:h-[18px]" />
                </button>
                <button onClick={() => handleDelete(service.id)} className="p-1.5 md:p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-lg transition-colors" title={t('delete_service')}>
                  <Trash2 size={16} className="md:w-[18px] md:h-[18px]" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingService ? t('edit_service') : t('add_service')}>
        <div className="space-y-4">
          <div className="flex justify-center mb-4">
            <div className="relative group">
              <img 
                src={formData.image || 'https://via.placeholder.com/150'} 
                alt="Preview" 
                className="w-24 h-24 rounded-xl object-cover border-2 border-slate-200 dark:border-slate-800"
                referrerPolicy="no-referrer"
              />
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 rounded-xl cursor-pointer transition-opacity">
                <Camera size={20} />
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t('title')} (EN)</label>
              <input 
                type="text" 
                className="input-field" 
                value={formData.titleEn}
                onChange={e => setFormData({ ...formData, titleEn: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('title')} (AR)</label>
              <input 
                type="text" 
                className="input-field rtl:text-right" 
                value={formData.titleAr}
                onChange={e => setFormData({ ...formData, titleAr: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('slug')} ({t('optional')})</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="auto-generated-from-title"
              value={formData.slug}
              onChange={e => setFormData({ ...formData, slug: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('description_en')}</label>
            <textarea 
              className="input-field h-20" 
              value={formData.descriptionEn}
              onChange={e => setFormData({ ...formData, descriptionEn: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('description_ar')}</label>
            <textarea 
              className="input-field h-20 rtl:text-right" 
              value={formData.descriptionAr}
              onChange={e => setFormData({ ...formData, descriptionAr: e.target.value })}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg font-medium">
              {t('cancel')}
            </button>
            <button onClick={handleSave} className="flex-1 btn-primary flex items-center justify-center gap-2">
              <Save size={18} />
              {t('save')}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Services;

