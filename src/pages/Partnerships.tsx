import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, Edit2, Search, Building2, Calendar, Image as ImageIcon, Camera } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';
import Modal from '../components/Modal';
import { toast } from 'sonner';
import api from '../services/api';
import { Portfolio } from '../types';

const Partnerships = () => {
  const { t } = useTranslation();
  const [partnerships, setPartnerships] = useState<Portfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartnership, setEditingPartnership] = useState<Portfolio | null>(null);
  const [formData, setFormData] = useState({ 
    companyName: '', 
    contractDate: '', 
    desc: '', 
    logo: '',
    image: '' 
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null,
  });

  const fetchPartnerships = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/api/portfolio');
      setPartnerships(response.data);
    } catch (error) {
      console.error('Failed to fetch partnerships:', error);
      toast.error(t('failed_to_fetch_partnerships'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPartnerships();
  }, []);

  const handleSave = async () => {
    if (!formData.companyName || !formData.contractDate) {
      toast.error(t('please_fill_all_fields'));
      return;
    }

    try {
      if (editingPartnership) {
        await api.put(`/api/portfolio/${editingPartnership._id}`, formData);
        toast.success(t('updated_successfully'));
      } else {
        await api.post('/api/portfolio', formData);
        toast.success(t('added_successfully'));
      }
      fetchPartnerships();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save partnership:', error);
      toast.error(t('failed_to_save_partnership'));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPartnership(null);
    setFormData({ companyName: '', contractDate: '', desc: '', logo: '', image: '' });
  };

  const handleEdit = (partnership: Portfolio) => {
    setEditingPartnership(partnership);
    setFormData({ 
      companyName: partnership.companyName, 
      contractDate: partnership.contractDate ? partnership.contractDate.split('T')[0] : '', 
      desc: partnership.desc,
      logo: partnership.logo,
      image: partnership.image
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/portfolio/${id}`);
      setDeleteModal({ isOpen: false, id: null });
      toast.success(t('deleted_successfully'));
      fetchPartnerships();
    } catch (error) {
      console.error('Failed to delete partnership:', error);
      toast.error(t('failed_to_delete_partnership'));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'image') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result as string }));
        toast.success(t('image_uploaded'));
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredPartnerships = partnerships.filter(p => p.companyName.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('partnerships')}</h1>
          <p className="text-slate-500">{t('manage_contracts_partnerships')}</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          {t('add_partnership')}
        </button>
      </div>

      <div className="card p-4 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder={t('search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPartnerships.map((partnership) => (
            <div key={partnership._id} className="card p-6 relative group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-xl overflow-hidden">
                  {partnership.logo ? (
                    <img src={partnership.logo} alt={partnership.companyName} className="w-full h-full object-contain p-2" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary">
                      <Building2 size={24} />
                    </div>
                  )}
                </div>
              </div>
              
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{partnership.companyName}</h3>
              
              <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                <Calendar size={14} />
                <span>{partnership.contractDate ? new Date(partnership.contractDate).toLocaleDateString() : ''}</span>
              </div>
              
              <p className="text-slate-500 text-sm line-clamp-3 mb-6">{partnership.desc}</p>
              
              <div className="flex gap-2">
                <button onClick={() => handleEdit(partnership)} className="flex-1 btn-secondary flex items-center justify-center gap-2 text-xs">
                  <Edit2 size={14} />
                  {t('edit')}
                </button>
                <button onClick={() => setDeleteModal({ isOpen: true, id: partnership._id })} className="flex-1 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-medium transition-colors">
                  {t('delete')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingPartnership ? t('edit_partnership') : t('add_partnership')}>
        <div className="space-y-4 max-h-[80vh] overflow-y-auto px-1">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">{t('logo')}</label>
              <div className="relative group">
                <div className="w-full h-32 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-900">
                  {formData.logo ? (
                    <img src={formData.logo} alt="Logo" className="w-full h-full object-contain p-2" referrerPolicy="no-referrer" />
                  ) : (
                    <ImageIcon className="text-slate-300" size={32} />
                  )}
                </div>
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 rounded-xl cursor-pointer transition-opacity">
                  <Camera size={20} />
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'logo')} />
                </label>
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">{t('image')}</label>
              <div className="relative group">
                <div className="w-full h-32 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-900">
                  {formData.image ? (
                    <img src={formData.image} alt="Image" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <ImageIcon className="text-slate-300" size={32} />
                  )}
                </div>
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 rounded-xl cursor-pointer transition-opacity">
                  <Camera size={20} />
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'image')} />
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('company_name')}</label>
            <input
              type="text"
              className="input-field"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              placeholder={t('enter_company_name')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('contract_date')}</label>
            <input
              type="date"
              className="input-field"
              value={formData.contractDate}
              onChange={(e) => setFormData({ ...formData, contractDate: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('description')}</label>
            <textarea
              className="input-field h-24"
              value={formData.desc}
              onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
              placeholder={t('enter_partnership_details')}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button onClick={handleCloseModal} className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg font-medium">
              {t('cancel')}
            </button>
            <button onClick={handleSave} className="flex-1 btn-primary">
              {t('save')}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={() => deleteModal.id && handleDelete(deleteModal.id)}
        title={t('delete_partnership')}
        message={t('delete_confirmation')}
      />
    </div>
  );
};

export default Partnerships;
