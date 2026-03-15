import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, Edit2, Search, Tag, Link as LinkIcon, Image as ImageIcon, Camera } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';
import Modal from '../components/Modal';
import { toast } from 'sonner';
import api from '../services/api';
import { Offer } from '../types';

const Offers = () => {
  const { t } = useTranslation();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [formData, setFormData] = useState({ 
    offerName: '', 
    desc: '', 
    link: '',
    image: '' 
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null,
  });

  const fetchOffers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/api/offers');
      setOffers(response.data);
    } catch (error) {
      console.error('Failed to fetch offers:', error);
      toast.error(t('failed_to_fetch_offers'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleSave = async () => {
    if (!formData.offerName || !formData.desc) {
      toast.error(t('please_fill_all_fields'));
      return;
    }

    try {
      if (editingOffer) {
        await api.put(`/api/offers/${editingOffer._id}`, formData);
        toast.success(t('updated_successfully'));
      } else {
        await api.post('/api/offers', formData);
        toast.success(t('added_successfully'));
      }
      fetchOffers();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save offer:', error);
      toast.error(t('failed_to_save_offer'));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingOffer(null);
    setFormData({ offerName: '', desc: '', link: '', image: '' });
  };

  const handleEdit = (offer: Offer) => {
    setEditingOffer(offer);
    setFormData({ 
      offerName: offer.offerName, 
      desc: offer.desc,
      link: offer.link,
      image: offer.image
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/offers/${id}`);
      setDeleteModal({ isOpen: false, id: null });
      toast.success(t('deleted_successfully'));
      fetchOffers();
    } catch (error) {
      console.error('Failed to delete offer:', error);
      toast.error(t('failed_to_delete_offer'));
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

  const filteredOffers = offers.filter(o => o.offerName.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('offers')}</h1>
          <p className="text-slate-500">{t('manage_special_offers')}</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          {t('add_offer')}
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
          {filteredOffers.map((offer) => (
            <div key={offer._id} className="card p-6 relative group">
              <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden mb-4">
                {offer.image ? (
                  <img src={offer.image} alt={offer.offerName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <ImageIcon size={48} />
                  </div>
                )}
              </div>
              
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{offer.offerName}</h3>
              
              {offer.link && (
                <div className="flex items-center gap-2 text-primary text-sm mb-4">
                  <LinkIcon size={14} />
                  <a href={offer.link} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
                    {offer.link}
                  </a>
                </div>
              )}
              
              <p className="text-slate-500 text-sm line-clamp-3 mb-6">{offer.desc}</p>
              
              <div className="flex gap-2">
                <button onClick={() => handleEdit(offer)} className="flex-1 btn-secondary flex items-center justify-center gap-2 text-xs">
                  <Edit2 size={14} />
                  {t('edit')}
                </button>
                <button onClick={() => setDeleteModal({ isOpen: true, id: offer._id })} className="flex-1 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-medium transition-colors">
                  {t('delete')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingOffer ? t('edit_offer') : t('add_offer')}>
        <div className="space-y-4 max-h-[80vh] overflow-y-auto px-1">
          <div>
            <label className="block text-sm font-medium mb-1">{t('offer_image')}</label>
            <div className="relative group">
              <div className="w-full h-48 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-900">
                {formData.image ? (
                  <img src={formData.image} alt="Offer" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <ImageIcon className="text-slate-300" size={48} />
                )}
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 rounded-xl cursor-pointer transition-opacity">
                <Camera size={24} />
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('offer_name')}</label>
            <input
              type="text"
              className="input-field"
              value={formData.offerName}
              onChange={(e) => setFormData({ ...formData, offerName: e.target.value })}
              placeholder={t('enter_offer_name')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('link')} ({t('optional')})</label>
            <input
              type="url"
              className="input-field"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="https://example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('description')}</label>
            <textarea
              className="input-field h-24"
              value={formData.desc}
              onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
              placeholder={t('enter_offer_details')}
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
        title={t('delete_offer')}
        message={t('delete_confirmation')}
      />
    </div>
  );
};

export default Offers;
