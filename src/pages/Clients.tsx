import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, Edit2, Search, Image as ImageIcon, Camera } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';
import Modal from '../components/Modal';
import { toast } from 'sonner';
import api from '../services/api';
import { Client } from '../types';

const Clients = () => {
  const { t } = useTranslation();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({ clientName: '', logo: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null,
  });

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/api/clients');
      setClients(response.data);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
      
      // Fallback to mock data for demo
      const mockClients: Client[] = [
        { _id: '1', clientName: 'Aramco', logo: 'https://picsum.photos/seed/aramco/200/200', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { _id: '2', clientName: 'SABIC', logo: 'https://picsum.photos/seed/sabic/200/200', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { _id: '3', clientName: 'STC', logo: 'https://picsum.photos/seed/stc/200/200', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { _id: '4', clientName: 'Maaden', logo: 'https://picsum.photos/seed/maaden/200/200', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      ];
      setClients(mockClients);
      toast.info('Using demo data (Backend connection failed)');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleSave = async () => {
    if (!formData.clientName) {
      toast.error(t('please_fill_all_fields'));
      return;
    }

    try {
      if (editingClient) {
        await api.put(`/api/clients/${editingClient._id}`, formData);
        toast.success(t('updated_successfully'));
      } else {
        await api.post('/api/clients', formData);
        toast.success(t('added_successfully'));
      }
      fetchClients();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save client:', error);
      toast.error(t('failed_to_save_client'));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
    setFormData({ clientName: '', logo: '' });
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({ clientName: client.clientName, logo: client.logo });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/clients/${id}`);
      setDeleteModal({ isOpen: false, id: null });
      toast.success(t('deleted_successfully'));
      fetchClients();
    } catch (error) {
      console.error('Failed to delete client:', error);
      toast.error(t('failed_to_delete_client'));
    }
  };

  const filteredClients = clients.filter(c => c.clientName.toLowerCase().includes(searchTerm.toLowerCase()));

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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('clients')}</h1>
          <p className="text-slate-500">{t('manage_clients_logos')}</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          {t('add_client')}
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
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {filteredClients.map((client) => (
            <div key={client._id} className="card group relative p-4 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-xl overflow-hidden mb-4 border border-slate-100 dark:border-slate-800">
                <img src={client.logo} alt={client.clientName} className="w-full h-full object-contain p-2" referrerPolicy="no-referrer" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate w-full">{client.clientName}</h3>
              
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(client)} className="p-1.5 bg-white dark:bg-slate-800 shadow-sm rounded-lg text-blue-600 hover:bg-blue-50">
                  <Edit2 size={14} />
                </button>
                <button onClick={() => setDeleteModal({ isOpen: true, id: client._id })} className="p-1.5 bg-white dark:bg-slate-800 shadow-sm rounded-lg text-red-600 hover:bg-red-50">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingClient ? t('edit_client') : t('add_client')}>
        <div className="space-y-4">
          <div className="flex justify-center mb-4">
            <div className="relative group">
              <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden">
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
          <div>
            <label className="block text-sm font-medium mb-1">{t('name')}</label>
            <input
              type="text"
              className="input-field"
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              placeholder={t('enter_client_name')}
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
        title={t('delete_client')}
        message={t('delete_confirmation')}
      />
    </div>
  );
};

export default Clients;
