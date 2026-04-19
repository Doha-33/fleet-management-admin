import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, Edit2, Search, Truck, Loader2 } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';
import Modal from '../components/Modal';
import { toast } from 'sonner';
import api from '../services/api';
import { Compound } from '../types';

const Vehicles = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [vehicles, setVehicles] = useState<Compound[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Compound | null>(null);
  const [formData, setFormData] = useState({ compoundsAr: '', compoundsEn: '' });
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null,
  });

  const fetchVehicles = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/api/pricing');
      setVehicles(response.data);
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
      toast.error(t('failed_to_fetch_vehicles'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleSave = async () => {
    if (!formData.compoundsAr || !formData.compoundsEn) {
      toast.error(t('please_fill_all_fields'));
      return;
    }

    try {
      if (editingVehicle) {
        const response = await api.put(`/api/pricing/${editingVehicle._id}`, formData);
        setVehicles(prev => prev.map(v => v._id === editingVehicle._id ? response.data : v));
        toast.success(t('updated_successfully'));
      } else {
        const response = await api.post('/api/pricing', formData);
        setVehicles(prev => [response.data, ...prev]);
        toast.success(t('added_successfully'));
      }
      setIsModalOpen(false);
      setEditingVehicle(null);
      setFormData({ compoundsAr: '', compoundsEn: '' });
    } catch (error) {
      console.error('Failed to save vehicle:', error);
      toast.error(t('something_went_wrong'));
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.id) return;
    try {
      await api.delete(`/api/pricing/${deleteModal.id}`);
      setVehicles(prev => prev.filter(v => v._id !== deleteModal.id));
      toast.success(t('deleted_successfully'));
      setDeleteModal({ isOpen: false, id: null });
    } catch (error) {
      console.error('Failed to delete vehicle:', error);
      toast.error(t('something_went_wrong'));
    }
  };

  const filteredVehicles = vehicles.filter(v => 
    v.compoundsAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.compoundsEn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('vehicles')}</h1>
          <p className="text-slate-500 dark:text-slate-400">{t('manage_vehicles')}</p>
        </div>
        <button
          onClick={() => {
            setEditingVehicle(null);
            setFormData({ compoundsAr: '', compoundsEn: '' });
            setIsModalOpen(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          {t('add_vehicle')}
        </button>
      </div>

      <div className="card">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
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

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                <th className="px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-300">{t('name')}</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-300">{t('date')}</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-300 text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                  </td>
                </tr>
              ) : filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                    {t('no_results')}
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((vehicle) => (
                  <tr key={vehicle._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <Truck size={20} />
                        </div>
                        <span className="font-medium">
                          {isRtl ? vehicle.compoundsAr : vehicle.compoundsEn}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {vehicle.createdAt ? new Date(vehicle.createdAt).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US') : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingVehicle(vehicle);
                            setFormData({
                              compoundsAr: vehicle.compoundsAr,
                              compoundsEn: vehicle.compoundsEn
                            });
                            setIsModalOpen(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title={t('edit')}
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, id: vehicle._id || null })}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title={t('delete')}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingVehicle ? t('edit_vehicle') : t('add_vehicle')}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('vehicle_name_ar')}</label>
            <input
              type="text"
              value={formData.compoundsAr}
              onChange={(e) => setFormData(prev => ({ ...prev, compoundsAr: e.target.value }))}
              className="input-field"
              placeholder="مركبة..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('vehicle_name_en')}</label>
            <input
              type="text"
              value={formData.compoundsEn}
              onChange={(e) => setFormData(prev => ({ ...prev, compoundsEn: e.target.value }))}
              className="input-field"
              placeholder="Vehicle..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleSave}
              className="btn-primary px-8"
            >
              {t('save')}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title={t('delete_vehicle')}
      />
    </div>
  );
};

export default Vehicles;
