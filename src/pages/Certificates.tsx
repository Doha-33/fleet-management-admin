import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, Edit2, Search, Image as ImageIcon, Camera, Award, Loader2 } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';
import Modal from '../components/Modal';
import { toast } from 'sonner';
import api from '../services/api';
import { CertificateOrLicense } from '../types';

const Certificates = () => {
  const { t } = useTranslation();
  const [certificates, setCertificates] = useState<CertificateOrLicense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState<CertificateOrLicense | null>(null);
  const [formData, setFormData] = useState({ name: '', logo: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null,
  });

  const fetchCertificates = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/api/certificateOrLicense');
      setCertificates(response.data);
    } catch (error) {
      console.error('Failed to fetch certificates:', error);
      toast.error(t('failed_to_fetch_certificates'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleSave = async () => {
    if (!formData.name) {
      toast.error(t('please_fill_all_fields'));
      return;
    }

    setIsSaving(true);
    try {
      if (editingCertificate) {
        const response = await api.put(`/api/certificateOrLicense/${editingCertificate._id}`, formData);
        setCertificates(prev => prev.map(c => c._id === editingCertificate._id ? response.data : c));
        toast.success(t('updated_successfully'));
      } else {
        const response = await api.post('/api/certificateOrLicense', formData);
        setCertificates(prev => [response.data, ...prev]);
        toast.success(t('added_successfully'));
      }
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save certificate:', error);
      toast.error(t('something_went_wrong'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCertificate(null);
    setFormData({ name: '', logo: '' });
  };

  const handleEdit = (certificate: CertificateOrLicense) => {
    setEditingCertificate(certificate);
    setFormData({ name: certificate.name, logo: certificate.logo });
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteModal.id) return;
    try {
      await api.delete(`/api/certificateOrLicense/${deleteModal.id}`);
      setCertificates(prev => prev.filter(c => c._id !== deleteModal.id));
      toast.success(t('deleted_successfully'));
      setDeleteModal({ isOpen: false, id: null });
    } catch (error) {
      console.error('Failed to delete certificate:', error);
      toast.error(t('something_went_wrong'));
    }
  };

  const filteredCertificates = certificates.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logo: reader.result as string }));
        toast.success(t('image_uploaded'));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('certificates_licenses')}</h1>
          <p className="text-slate-500 dark:text-slate-400">{t('manage_certificates_desc')}</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          {t('add_certificate')}
        </button>
      </div>

      <div className="card p-4">
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
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCertificates.map((cert) => (
            <div key={cert._id} className="card group relative p-6 flex flex-col items-center gap-4 text-center hover:shadow-lg transition-all border-b-4 border-b-transparent hover:border-b-primary">
              <div className="w-24 h-24 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center p-2 group-hover:scale-105 transition-transform">
                {cert.logo ? (
                  <img src={cert.logo} alt={cert.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                ) : (
                  <Award size={40} className="text-slate-300" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">{cert.name}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  {cert.createdAt ? new Date(cert.createdAt).toLocaleDateString() : '-'}
                </p>
              </div>

              <div className="flex gap-2 w-full pt-4 mt-auto border-t border-slate-100 dark:border-slate-800">
                <button 
                  onClick={() => handleEdit(cert)}
                  className="flex-1 flex items-center justify-center gap-2 p-2 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors border border-blue-100 dark:border-blue-900/30"
                >
                  <Edit2 size={14} />
                  {t('edit')}
                </button>
                <button 
                  onClick={() => setDeleteModal({ isOpen: true, id: cert._id || null })}
                  className="flex-1 flex items-center justify-center gap-2 p-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors border border-red-100 dark:border-red-900/30"
                >
                  <Trash2 size={14} />
                  {t('delete')}
                </button>
              </div>
            </div>
          ))}

          {filteredCertificates.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500">
              {t('no_results')}
            </div>
          )}
        </div>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={editingCertificate ? t('edit_certificate') : t('add_certificate')}
      >
        <div className="space-y-4">
          <div className="flex justify-center mb-6">
            <div className="relative group">
              <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-900">
                {formData.logo ? (
                  <img src={formData.logo} alt="Preview" className="w-full h-full object-contain p-2" referrerPolicy="no-referrer" />
                ) : (
                  <ImageIcon className="text-slate-300" size={48} />
                )}
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 rounded-2xl cursor-pointer transition-opacity">
                <Camera size={24} />
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('certificate_name')}</label>
            <input
              type="text"
              className="input-field"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={t('certificate_name')}
            />
          </div>

          <div className="flex gap-3 pt-6">
            <button 
              onClick={handleCloseModal} 
              className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              {t('cancel')}
            </button>
            <button 
              onClick={handleSave} 
              disabled={isSaving}
              className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSaving && <Loader2 size={16} className="animate-spin" />}
              {t('save')}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title={t('delete_certificate')}
      />
    </div>
  );
};

export default Certificates;
