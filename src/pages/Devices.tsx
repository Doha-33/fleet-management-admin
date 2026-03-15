import React, { useState, useEffect } from 'react';
import { Plus, Search, Package, ChevronLeft, ChevronRight, Edit2, Trash2 } from 'lucide-react';
import { Product, Category, Subcategory } from '../types';
import ProductModal from '../components/ProductModal';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { MOCK_CATEGORIES, MOCK_SUBCATEGORIES } from '../services/mockData';

const initialDevices: Product[] = [
  {
    id: 1,
    name: 'FleetTrack Pro X1',
    category_id: 1,
    subcategory_id: 1,
    child_subcategory_id: '',
    weight: '0.5',
    sku: 'GPS-X1-001',
    mpn: 'MPN-X1',
    gtin: 'GTIN-X1',
    max_qty_per_customer: 5,
    subtitle: 'High-precision GPS tracker',
    promo_title: 'Special Offer',
    description: 'High-precision GPS tracker with LTE connectivity.',
    image_url: 'https://picsum.photos/seed/gps1/200/200',
    seo_title: 'FleetTrack Pro X1 - Best GPS Tracker',
    seo_url: 'fleettrack-pro-x1',
    seo_description: 'Buy the best GPS tracker for your fleet.',
    requires_shipping: true,
    is_quantity_determined: true,
    show_in_store: true,
    attach_file: false,
    allow_notes: true,
    created_at: '2024-01-15T10:00:00Z',
  },
];

const Devices: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [devices, setDevices] = useState<Product[]>(initialDevices);
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [allSubcategories, setAllSubcategories] = useState<Subcategory[]>(MOCK_SUBCATEGORIES);
  const [filteredDevices, setFilteredDevices] = useState<Product[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Product | null>(null);

  // Filter states
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    let result = [...devices];

    if (search) {
      result = result.filter(d => 
        d.name.toLowerCase().includes(search.toLowerCase()) || 
        d.sku.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterCategory) {
      result = result.filter(d => Number(d.category_id) === Number(filterCategory));
    }

    setFilteredDevices(result);
    setPage(1);
  }, [devices, search, filterCategory]);

  const handleAddCategory = (name_ar: string, name_en: string) => {
    const newCat: Category = {
      id: Math.max(0, ...categories.map(c => c.id)) + 1,
      name_ar,
      name_en,
      slug: name_en.toLowerCase().replace(/\s+/g, '-')
    };
    setCategories(prev => [...prev, newCat]);
    toast.success(t('category_added_successfully'));
    return newCat;
  };

  const handleEditCategory = (id: number, name_ar: string, name_en: string) => {
    setCategories(prev => prev.map(cat => cat.id === id ? { ...cat, name_ar, name_en } : cat));
    toast.success(t('category_updated_successfully'));
  };

  const handleDeleteCategory = (id: number) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
    setAllSubcategories(prev => prev.filter(sub => sub.category_id !== id));
    setDevices(prev => prev.map(d => Number(d.category_id) === id ? { ...d, category_id: '', subcategory_id: '', child_subcategory_id: '' } : d));
    toast.success(t('category_deleted_successfully'));
  };

  const handleAddSubcategory = (name_ar: string, name_en: string, category_id: number, parent_id: number | null = null) => {
    const newSub: Subcategory = {
      id: Math.max(0, ...allSubcategories.map(s => s.id)) + 1,
      name_ar,
      name_en,
      category_id,
      parent_id,
      slug: name_en.toLowerCase().replace(/\s+/g, '-')
    };
    setAllSubcategories(prev => [...prev, newSub]);
    toast.success(t('subcategory_added_successfully'));
    return newSub;
  };

  const handleEditSubcategory = (id: number, name_ar: string, name_en: string) => {
    setAllSubcategories(prev => prev.map(sub => sub.id === id ? { ...sub, name_ar, name_en } : sub));
    toast.success(t('subcategory_updated_successfully'));
  };

  const handleDeleteSubcategory = (id: number) => {
    setAllSubcategories(prev => prev.filter(sub => sub.id !== id && sub.parent_id !== id));
    setDevices(prev => prev.map(d => Number(d.subcategory_id) === id || Number(d.child_subcategory_id) === id ? { ...d, subcategory_id: '', child_subcategory_id: '' } : d));
    toast.success(t('subcategory_deleted_successfully'));
  };

  const handleSave = (deviceData: Product) => {
    if (deviceData.id) {
      setDevices(prev => prev.map(d => d.id === deviceData.id ? deviceData : d));
      toast.success(t('device_updated_successfully'));
    } else {
      const newDevice = {
        ...deviceData,
        id: Math.max(0, ...devices.map(d => Number(d.id) || 0)) + 1,
        created_at: new Date().toISOString()
      };
      setDevices(prev => [newDevice, ...prev]);
      toast.success(t('device_added_successfully'));
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (!window.confirm(t('delete_confirmation'))) return;
    setDevices(prev => prev.filter(d => d.id !== id));
    toast.success(t('device_deleted_successfully'));
  };

  const totalPages = Math.ceil(filteredDevices.length / itemsPerPage);
  const paginatedDevices = filteredDevices.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const getCategoryName = (id: number | '') => {
    const cat = categories.find(c => c.id === Number(id));
    return isRtl ? cat?.name_ar : cat?.name_en;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('devices')}</h1>
          <p className="text-slate-500 dark:text-slate-400">{t('manage_devices')}</p>
        </div>
        <button
          onClick={() => {
            setSelectedDevice(null);
            setIsModalOpen(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          {t('add_device')}
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder={t('search')}
            className="input-field pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="input-field"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">{t('all_categories')}</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{isRtl ? cat.name_ar : cat.name_en}</option>
          ))}
        </select>
        <div className="flex items-center justify-end text-sm text-slate-500">
          {t('total_devices')}: {filteredDevices.length}
        </div>
      </div>

      {/* Devices Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4 font-bold text-slate-700 dark:text-slate-300">{t('name')}</th>
                <th className="p-4 font-bold text-slate-700 dark:text-slate-300">{t('category')}</th>
                <th className="p-4 font-bold text-slate-700 dark:text-slate-300">{t('SKU')}</th>
                <th className="p-4 font-bold text-slate-700 dark:text-slate-300">{t('date')}</th>
                <th className="p-4 font-bold text-slate-700 dark:text-slate-300 text-center">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedDevices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-500">
                    <Package size={48} className="mx-auto mb-4 opacity-20" />
                    {t('no_results')}
                  </td>
                </tr>
              ) : (
                paginatedDevices.map((device) => (
                  <tr key={device.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                          {device.image_url ? (
                            <img src={device.image_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400"><Package size={20} /></div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{device.name}</div>
                          <div className="text-xs text-slate-500">{device.subtitle}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        {getCategoryName(device.category_id)}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-mono text-slate-600 dark:text-slate-400">{device.sku || '-'}</td>
                    <td className="p-4 text-sm text-slate-500">
                      {device.created_at ? new Date(device.created_at).toLocaleDateString(isRtl ? 'ar-SA' : 'en-US') : '-'}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedDevice(device);
                            setIsModalOpen(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => device.id && handleDelete(Number(device.id))}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
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

        {totalPages > 1 && (
          <div className="p-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="text-sm text-slate-500">
              {t('showing')} {(page - 1) * itemsPerPage + 1} {t('to')} {Math.min(page * itemsPerPage, filteredDevices.length)} {t('of')} {filteredDevices.length}
            </div>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30"
              >
                {isRtl ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30"
              >
                {isRtl ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
              </button>
            </div>
          </div>
        )}
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        product={selectedDevice}
        categories={categories}
        subcategories={allSubcategories}
        onAddCategory={handleAddCategory}
        onEditCategory={handleEditCategory}
        onDeleteCategory={handleDeleteCategory}
        onAddSubcategory={handleAddSubcategory}
        onEditSubcategory={handleEditSubcategory}
        onDeleteSubcategory={handleDeleteSubcategory}
      />
    </div>
  );
};

export default Devices;
