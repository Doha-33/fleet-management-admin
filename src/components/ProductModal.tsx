import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { X, Save, Image as ImageIcon, Info, Globe, Settings, Package, Truck, Barcode, List, FileText, CheckCircle2, ChevronDown, Plus, Edit2, Trash2 } from 'lucide-react';
import { Product, MainCategory, SubCategory, NestedCategory } from '../types';
import { useTranslation } from 'react-i18next';
import ConfirmModal from './ConfirmModal';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  product?: Product | null;
  categories: MainCategory[];
  subcategories: SubCategory[];
  childSubcategories: NestedCategory[];
  onAddCategory: (nameAr: string, nameEn: string) => void;
  onEditCategory: (id: string, nameAr: string, nameEn: string) => void;
  onDeleteCategory: (id: string) => void;
  onAddSubcategory: (nameAr: string, nameEn: string, fatherId: string) => void;
  onEditSubcategory: (id: string, nameAr: string, nameEn: string) => void;
  onDeleteSubcategory: (id: string) => void;
  onAddChildSub: (nameAr: string, nameEn: string, subCategoryId: string) => void;
  onEditChildSub: (id: string, nameAr: string, nameEn: string) => void;
  onDeleteChildSub: (id: string) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  product, 
  categories, 
  subcategories: allSubcategories,
  childSubcategories: allNestedCategories,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onAddSubcategory,
  onEditSubcategory,
  onDeleteSubcategory,
  onAddChildSub,
  onEditChildSub,
  onDeleteChildSub
}) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [formData, setFormData] = useState<Product>({
    category: '',
    subCategory: '',
    subSubCategory: '',
    name: '',
    nameAr: '',
    nameEn: '',
    promoTitle: '',
    promoTitleAr: '',
    promoTitleEn: '',
    subTitle: '',
    subTitleAr: '',
    subTitleEn: '',
    brand: '',
    brandAr: '',
    brandEn: '',
    price: 0,
    costPrice: 0,
    discountPrice: 0,
    weight: 0,
    requiresShipping: true,
    sku: '',
    trackQuantity: true,
    maxQuantityPerCustomer: 0,
    channels: ['online', 'store', 'meta', 'google', 'snapchat', 'tiktok'],
    description: '',
    descriptionAr: '',
    descriptionEn: '',
    media: [],
    image: '',
    imageUrl: '',
    seoTitle: '',
    seoTitleAr: '',
    seoTitleEn: '',
    seoUrl: '',
    seoDescription: '',
    seoDescriptionAr: '',
    seoDescriptionEn: '',
    network: '4G',
    sound: 'With Mike',
    interference: 'Not jam-resistant',
    power: 'Supports electricity',
    installation: 'No technician needed',
  });

  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [childSubcategories, setChildSubcategories] = useState<NestedCategory[]>([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [isAddingSubcategory, setIsAddingSubcategory] = useState(false);
  const [isEditingSubcategory, setIsEditingSubcategory] = useState(false);
  const [isAddingChildSub, setIsAddingChildSub] = useState(false);
  const [isEditingChildSub, setIsEditingChildSub] = useState(false);
  const [quickAddNameAr, setQuickAddNameAr] = useState('');
  const [quickAddNameEn, setQuickAddNameEn] = useState('');
  
  // Delete confirmation state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'category' | 'subcategory' | 'child', id: string } | null>(null);

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        nameAr: product.nameAr || product.name || '',
        nameEn: product.nameEn || product.name || '',
        promoTitleAr: product.promoTitleAr || product.promoTitle || '',
        promoTitleEn: product.promoTitleEn || product.promoTitle || '',
        subTitleAr: product.subTitleAr || product.subTitle || '',
        subTitleEn: product.subTitleEn || product.subTitle || '',
        brandAr: product.brandAr || product.brand || '',
        brandEn: product.brandEn || product.brand || '',
        descriptionAr: product.descriptionAr || product.description || '',
        descriptionEn: product.descriptionEn || product.description || '',
        seoTitleAr: product.seoTitleAr || product.seoTitle || '',
        seoTitleEn: product.seoTitleEn || product.seoTitle || '',
        seoDescriptionAr: product.seoDescriptionAr || product.seoDescription || '',
        seoDescriptionEn: product.seoDescriptionEn || product.seoDescription || '',
        image: product.image || product.imageUrl || '',
        imageUrl: product.imageUrl || product.image || '',
        channels: product.channels || ['online', 'store', 'meta', 'google', 'snapchat', 'tiktok'],
        network: product.network || '4G',
        sound: product.sound || 'With Mike',
        interference: product.interference || 'Not jam-resistant',
        power: product.power || 'Supports electricity',
        installation: product.installation || 'No technician needed',
        media: product.media || [],
      });
    } else {
      setFormData({
        category: '',
        subCategory: '',
        subSubCategory: '',
        name: '',
        nameAr: '',
        nameEn: '',
        promoTitle: '',
        promoTitleAr: '',
        promoTitleEn: '',
        subTitle: '',
        subTitleAr: '',
        subTitleEn: '',
        brand: '',
        brandAr: '',
        brandEn: '',
        price: 0,
        costPrice: 0,
        discountPrice: 0,
        weight: 0,
        requiresShipping: true,
        sku: '',
        trackQuantity: true,
        maxQuantityPerCustomer: 0,
        channels: ['online', 'store', 'meta', 'google', 'snapchat', 'tiktok'],
        description: '',
        descriptionAr: '',
        descriptionEn: '',
        media: [],
        image: '',
        imageUrl: '',
        seoTitle: '',
        seoTitleAr: '',
        seoTitleEn: '',
        seoUrl: '',
        seoDescription: '',
        seoDescriptionAr: '',
        seoDescriptionEn: '',
        network: '4G',
        sound: 'With Mike',
        interference: 'Not jam-resistant',
        power: 'Supports electricity',
        installation: 'No technician needed',
      });
    }
  }, [product, isOpen]);

  useEffect(() => {
    if (formData.category) {
      const filtered = allSubcategories.filter(
        sub => sub.fatherId === formData.category
      );
      setSubcategories(filtered);
    } else {
      setSubcategories([]);
      setFormData(prev => ({ ...prev, subCategory: '', subSubCategory: '' }));
    }
  }, [formData.category, allSubcategories]);

  useEffect(() => {
    if (formData.subCategory) {
      const filtered = allNestedCategories.filter(
        sub => sub.subCategoryId === formData.subCategory
      );
      setChildSubcategories(filtered);
    } else {
      setChildSubcategories([]);
      setFormData(prev => ({ ...prev, subSubCategory: '' }));
    }
  }, [formData.subCategory, allNestedCategories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Map Ar/En fields to single fields for backend
    const submissionData: Product = {
      ...formData,
      name: isRtl ? formData.nameAr || '' : formData.nameEn || '',
      promoTitle: isRtl ? formData.promoTitleAr || '' : formData.promoTitleEn || '',
      subTitle: isRtl ? formData.subTitleAr || '' : formData.subTitleEn || '',
      brand: isRtl ? formData.brandAr || '' : formData.brandEn || '',
      description: isRtl ? formData.descriptionAr || '' : formData.descriptionEn || '',
      seoTitle: isRtl ? formData.seoTitleAr || '' : formData.seoTitleEn || '',
      seoDescription: isRtl ? formData.seoDescriptionAr || '' : formData.seoDescriptionEn || '',
      imageUrl: formData.image || formData.imageUrl || '',
      media: formData.media && formData.media.length > 0 ? formData.media : (formData.image || formData.imageUrl ? [formData.image || formData.imageUrl || ''] : []),
    };

    if (!submissionData.subCategory) delete submissionData.subCategory;
    if (!submissionData.subSubCategory) delete submissionData.subSubCategory;
    
    onSave(submissionData);
  };

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      const isNumberField = ['price', 'costPrice', 'discountPrice', 'weight', 'maxQuantityPerCustomer'].includes(name);
      const finalValue = isNumberField && value !== '' ? Number(value) : value;
      setFormData(prev => ({ ...prev, [name]: finalValue }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({ ...prev, image: base64String, imageUrl: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQuickAddCategory = () => {
    if (quickAddNameAr.trim() && quickAddNameEn.trim()) {
      if (isEditingCategory && formData.category) {
        onEditCategory(formData.category, quickAddNameAr, quickAddNameEn);
        setIsEditingCategory(false);
      } else {
        onAddCategory(quickAddNameAr, quickAddNameEn);
      }
      setQuickAddNameAr('');
      setQuickAddNameEn('');
      setIsAddingCategory(false);
    }
  };

  const handleQuickAddSubcategory = () => {
    if (!formData.category) return;
    if (quickAddNameAr.trim() && quickAddNameEn.trim()) {
      if (isEditingSubcategory && formData.subCategory) {
        onEditSubcategory(formData.subCategory, quickAddNameAr, quickAddNameEn);
        setIsEditingSubcategory(false);
      } else {
        onAddSubcategory(quickAddNameAr, quickAddNameEn, formData.category);
      }
      setQuickAddNameAr('');
      setQuickAddNameEn('');
      setIsAddingSubcategory(false);
    }
  };

  const handleQuickAddChildSub = () => {
    if (!formData.category || !formData.subCategory) return;
    if (quickAddNameAr.trim() && quickAddNameEn.trim()) {
      if (isEditingChildSub && formData.subSubCategory) {
        onEditChildSub(formData.subSubCategory, quickAddNameAr, quickAddNameEn);
        setIsEditingChildSub(false);
      } else {
        onAddChildSub(quickAddNameAr, quickAddNameEn, formData.subCategory);
      }
      setQuickAddNameAr('');
      setQuickAddNameEn('');
      setIsAddingChildSub(false);
    }
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'category') {
      onDeleteCategory(deleteTarget.id);
      setFormData(prev => ({ ...prev, category: '', subCategory: '', subSubCategory: '' }));
    } else if (deleteTarget.type === 'subcategory') {
      onDeleteSubcategory(deleteTarget.id);
      setFormData(prev => ({ ...prev, subCategory: '', subSubCategory: '' }));
    } else if (deleteTarget.type === 'child') {
      onDeleteChildSub(deleteTarget.id);
      setFormData(prev => ({ ...prev, subSubCategory: '' }));
    }
    setDeleteTarget(null);
  };

  const handleChannelChange = (channel: string) => {
    setFormData(prev => {
      const channels = prev.channels || [];
      if (channels.includes(channel)) {
        return { ...prev, channels: channels.filter(c => c !== channel) };
      } else {
        return { ...prev, channels: [...channels, channel] };
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden my-4 flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <X size={20} className="text-slate-600 dark:text-slate-400" />
            </button>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-200">
              {product ? `${t('product_data')} (${product.name})` : t('add_new_product')}
            </h2>
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-slate-400 hover:text-slate-600"><Settings size={20} /></button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          <div className="space-y-8">
            {/* Category Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
              {/* Main Category */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('main_category')}</label>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="input-field flex-1"
                      required
                    >
                      <option value="">{t('select_category')}</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{isRtl ? cat.nameAr : cat.nameEn}</option>
                      ))}
                    </select>
                    <div className="flex gap-1">
                      <button 
                        type="button" 
                        onClick={() => {
                          setIsAddingCategory(!isAddingCategory);
                          setIsEditingCategory(false);
                          setQuickAddNameAr('');
                          setQuickAddNameEn('');
                        }}
                        className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-200 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                      {formData.category && (
                        <>
                          <button 
                            type="button" 
                            onClick={() => {
                              const cat = categories.find(c => c._id === formData.category);
                              setQuickAddNameAr(cat?.nameAr || '');
                              setQuickAddNameEn(cat?.nameEn || '');
                              setIsAddingCategory(true);
                              setIsEditingCategory(true);
                            }}
                            className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-100 transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            type="button" 
                            onClick={() => {
                              setDeleteTarget({ type: 'category', id: formData.category });
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  {isAddingCategory && (
                    <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl animate-in fade-in slide-in-from-top-2 duration-200">
                      <input
                        type="text"
                        value={quickAddNameAr}
                        onChange={(e) => setQuickAddNameAr(e.target.value)}
                        placeholder={t('name_ar')}
                        className="input-field text-sm"
                        autoFocus
                      />
                      <input
                        type="text"
                        value={quickAddNameEn}
                        onChange={(e) => setQuickAddNameEn(e.target.value)}
                        placeholder={t('name_en')}
                        className="input-field text-sm"
                      />
                      <button
                        type="button"
                        onClick={handleQuickAddCategory}
                        className="w-full py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-xl text-xs font-bold"
                      >
                        {t('save')}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Subcategory */}
              {formData.category && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      {subcategories.length > 0 ? t('subcategory') : t('no_subcategories_yet')} ({t('optional')})
                    </label>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      {subcategories.length > 0 && (
                        <select
                          name="subCategory"
                          value={formData.subCategory}
                          onChange={handleChange}
                          className="input-field flex-1"
                        >
                          <option value="">{t('select_subcategory')}</option>
                          {subcategories.map(sub => (
                            <option key={sub._id} value={sub._id}>{isRtl ? sub.nameAr : sub.nameEn}</option>
                          ))}
                        </select>
                      )}
                      <div className="flex gap-1">
                        <button 
                          type="button" 
                          onClick={() => {
                            setIsAddingSubcategory(!isAddingSubcategory);
                            setIsEditingSubcategory(false);
                            setQuickAddNameAr('');
                            setQuickAddNameEn('');
                          }}
                          className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-2"
                          title={t('add_subcategory')}
                        >
                          <Plus size={16} />
                          {subcategories.length === 0 && <span className="text-xs font-bold">{t('add_subcategory')}</span>}
                        </button>
                        {formData.subCategory && (
                          <>
                            <button 
                              type="button" 
                              onClick={() => {
                                const sub = allSubcategories.find(s => s._id === formData.subCategory);
                                setQuickAddNameAr(sub?.nameAr || '');
                                setQuickAddNameEn(sub?.nameEn || '');
                                setIsAddingSubcategory(true);
                                setIsEditingSubcategory(true);
                              }}
                              className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-100 transition-colors"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              type="button" 
                              onClick={() => {
                                setDeleteTarget({ type: 'subcategory', id: formData.subCategory });
                                setIsDeleteModalOpen(true);
                              }}
                              className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    {isAddingSubcategory && (
                      <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl animate-in fade-in slide-in-from-top-2 duration-200">
                        <input
                          type="text"
                          value={quickAddNameAr}
                          onChange={(e) => setQuickAddNameAr(e.target.value)}
                          placeholder={t('name_ar')}
                          className="input-field text-sm"
                          autoFocus
                        />
                        <input
                          type="text"
                          value={quickAddNameEn}
                          onChange={(e) => setQuickAddNameEn(e.target.value)}
                          placeholder={t('name_en')}
                          className="input-field text-sm"
                        />
                        <button
                          type="button"
                          onClick={handleQuickAddSubcategory}
                          className="w-full py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-xl text-xs font-bold"
                        >
                          {t('save')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Child Subcategory */}
              {formData.subCategory && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      {childSubcategories.length > 0 ? t('child_subcategory') : t('no_child_subcategories_yet')} ({t('optional')})
                    </label>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      {childSubcategories.length > 0 && (
                        <select
                          name="subSubCategory"
                          value={formData.subSubCategory}
                          onChange={handleChange}
                          className="input-field flex-1"
                        >
                          <option value="">{t('select_type')}</option>
                          {childSubcategories.map(sub => (
                            <option key={sub._id} value={sub._id}>{isRtl ? sub.nameAr : sub.nameEn}</option>
                          ))}
                        </select>
                      )}
                      <div className="flex gap-1">
                        <button 
                          type="button" 
                          onClick={() => {
                            setIsAddingChildSub(!isAddingChildSub);
                            setIsEditingChildSub(false);
                            setQuickAddNameAr('');
                            setQuickAddNameEn('');
                          }}
                          className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-2"
                          title={t('add_type')}
                        >
                          <Plus size={16} />
                          {childSubcategories.length === 0 && <span className="text-xs font-bold">{t('add_type')}</span>}
                        </button>
                        {formData.subSubCategory && (
                          <>
                            <button 
                              type="button" 
                              onClick={() => {
                                const sub = allNestedCategories.find(s => s._id === formData.subSubCategory);
                                setQuickAddNameAr(sub?.nameAr || '');
                                setQuickAddNameEn(sub?.nameEn || '');
                                setIsAddingChildSub(true);
                                setIsEditingChildSub(true);
                              }}
                              className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-100 transition-colors"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              type="button" 
                              onClick={() => {
                                setDeleteTarget({ type: 'child', id: formData.subSubCategory });
                                setIsDeleteModalOpen(true);
                              }}
                              className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    {isAddingChildSub && (
                      <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl animate-in fade-in slide-in-from-top-2 duration-200">
                        <input
                          type="text"
                          value={quickAddNameAr}
                          onChange={(e) => setQuickAddNameAr(e.target.value)}
                          placeholder={t('name_ar')}
                          className="input-field text-sm"
                          autoFocus
                        />
                        <input
                          type="text"
                          value={quickAddNameEn}
                          onChange={(e) => setQuickAddNameEn(e.target.value)}
                          placeholder={t('name_en')}
                          className="input-field text-sm"
                        />
                        <button
                          type="button"
                          onClick={handleQuickAddChildSub}
                          className="w-full py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-xl text-xs font-bold"
                        >
                          {t('save')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('product_name')} (AR)</label>
                <input
                  type="text"
                  name="nameAr"
                  value={formData.nameAr}
                  onChange={handleChange}
                  className="input-field"
                  required
                  placeholder={t('enter_product_name_ar')}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('product_name')} (EN)</label>
                <input
                  type="text"
                  name="nameEn"
                  value={formData.nameEn}
                  onChange={handleChange}
                  className="input-field"
                  required
                  placeholder={t('enter_product_name_en')}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('promo_title')} (AR)</label>
                <input
                  type="text"
                  name="promoTitleAr"
                  value={formData.promoTitleAr}
                  onChange={handleChange}
                  className="input-field"
                  placeholder={t('promo_title_ar')}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('promo_title')} (EN)</label>
                <input
                  type="text"
                  name="promoTitleEn"
                  value={formData.promoTitleEn}
                  onChange={handleChange}
                  className="input-field"
                  placeholder={t('promo_title_en')}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('brand')} (AR)</label>
                <input
                  type="text"
                  name="brandAr"
                  value={formData.brandAr}
                  onChange={handleChange}
                  className="input-field"
                  placeholder={t('brand_ar')}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('brand')} (EN)</label>
                <input
                  type="text"
                  name="brandEn"
                  value={formData.brandEn}
                  onChange={handleChange}
                  className="input-field"
                  placeholder={t('brand_en')}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('subtitle')} (AR)</label>
                <input
                  type="text"
                  name="subTitleAr"
                  value={formData.subTitleAr}
                  onChange={handleChange}
                  className="input-field"
                  placeholder={t('subtitle_ar')}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('subtitle')} (EN)</label>
                <input
                  type="text"
                  name="subTitleEn"
                  value={formData.subTitleEn}
                  onChange={handleChange}
                  className="input-field"
                  placeholder={t('subtitle_en')}
                />
              </div>
            </div>

            {/* Price Section (Optional) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('price')} ({t('optional')})</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('cost_price')} ({t('optional')})</label>
                <input
                  type="number"
                  name="costPrice"
                  value={formData.costPrice}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('reduced_price')} ({t('optional')})</label>
                <input
                  type="number"
                  name="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Shipping & Weight */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('requires_shipping')}</label>
                <select
                  name="requiresShipping"
                  value={formData.requiresShipping ? 'true' : 'false'}
                  onChange={(e) => setFormData(prev => ({ ...prev, requiresShipping: e.target.value === 'true' }))}
                  className="input-field"
                >
                  <option value="true">{isRtl ? 'نعم، يتطلب شحن' : 'Yes, requires shipping'}</option>
                  <option value="false">{isRtl ? 'لا، لا يتطلب شحن' : 'No, no shipping required'}</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('product_weight')}</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Truck className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      className="input-field pr-10"
                      placeholder="0.0"
                    />
                  </div>
                  <select className="input-field w-24 bg-slate-50 dark:bg-slate-800">
                    <option>{isRtl ? 'كجم' : 'kg'}</option>
                    <option>{isRtl ? 'جم' : 'g'}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Codes & Quantity */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('sku_storage')}</label>
                <div className="relative">
                  <Barcode className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    className="input-field pr-10"
                    placeholder="SKU-123"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('network')}</label>
                <select
                  name="network"
                  value={formData.network}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="4G">{t('network_4g')}</option>
                  <option value="2G">{t('network_2g')}</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('sound')}</label>
                <select
                  name="sound"
                  value={formData.sound}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="With Mike">{t('sound_with_mike')}</option>
                  <option value="Without Mike">{t('sound_without_mike')}</option>
                </select>
              </div>
            </div>

            {/* Additional Specs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('interference')}</label>
                <select
                  name="interference"
                  value={formData.interference}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="Not jam-resistant">{t('interference_not_jam')}</option>
                  <option value="jam-resistant">{t('interference_jam')}</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('power')}</label>
                <select
                  name="power"
                  value={formData.power}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="Supports electricity">{t('power_supports')}</option>
                  <option value="No Supports electricity">{t('power_no_supports')}</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('installation')}</label>
                <select
                  name="installation"
                  value={formData.installation}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="No technician needed">{t('installation_no_tech')}</option>
                  <option value="technician needed">{t('installation_tech')}</option>
                </select>
              </div>
            </div>
            {/* Quantity Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('quantity_determination')}</label>
                <select
                  name="trackQuantity"
                  value={formData.trackQuantity ? 'true' : 'false'}
                  onChange={(e) => setFormData(prev => ({ ...prev, trackQuantity: e.target.value === 'true' }))}
                  className="input-field"
                >
                  <option value="true">{t('enable_quantity_limit')}</option>
                  <option value="false">{t('unlimited_quantity')}</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('max_qty')} ({t('optional')})</label>
                <input
                  type="number"
                  name="maxQuantityPerCustomer"
                  value={formData.maxQuantityPerCustomer}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="10"
                />
              </div>
            </div>

            {/* Display Channels */}
            <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('display_channels')}</label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {(['online', 'store', 'meta', 'google', 'snapchat', 'tiktok'] as const).map(channel => (
                  <label key={channel} className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.channels?.includes(channel)}
                      onChange={() => handleChannelChange(channel)}
                      className="w-5 h-5 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                    />
                    <span className="text-sm font-bold capitalize text-slate-700 dark:text-slate-300">{channel}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Description (Rich Text Editor) */}
            <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('description')} (AR)</label>
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
                  <ReactQuill
                    theme="snow"
                    value={formData.descriptionAr}
                    onChange={(content) => setFormData(prev => ({ ...prev, descriptionAr: content }))}
                    className="quill-editor"
                    placeholder={t('enter_product_description_ar')}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('description')} (EN)</label>
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
                  <ReactQuill
                    theme="snow"
                    value={formData.descriptionEn}
                    onChange={(content) => setFormData(prev => ({ ...prev, descriptionEn: content }))}
                    className="quill-editor"
                    placeholder={t('enter_product_description_en')}
                  />
                </div>
              </div>
            </div>

            {/* Image URL */}
            <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('image')}</label>
              <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-800/20 hover:bg-slate-100 transition-colors cursor-pointer group relative">
                {formData.image || formData.imageUrl ? (
                  <div className="relative w-48 h-48">
                    <img src={formData.image || formData.imageUrl} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                    <button 
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image: '', imageUrl: '' }))}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow-lg"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <ImageIcon className="text-slate-900" size={32} />
                    </div>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('add_image_video')}</p>
                    <p className="text-xs text-slate-400 mt-1">{t('media_upload_helper')}</p>
                    <input
                      type="file"
                      className="hidden"
                      id="product-image-upload"
                      accept="image/*,video/*"
                      onChange={handleImageUpload}
                    />
                    <label
                      htmlFor="product-image-upload"
                      className="mt-2 inline-block px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-200 transition-colors text-xs font-bold"
                    >
                      {t('upload_file')}
                    </label>
                  </div>
                )}
                <input
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="mt-4 input-field text-center"
                  placeholder={t('or_enter_image_url')}
                />
              </div>
            </div>

            {/* SEO Section */}
            <div className="space-y-6 pt-8 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-slate-200 flex items-center gap-2">
                  {t('seo_settings')}
                  <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full uppercase font-bold">{t('pro')}</span>
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('page_title')} (AR)</label>
                    <div className="relative">
                      <FileText className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="text"
                        name="seoTitleAr"
                        value={formData.seoTitleAr}
                        onChange={handleChange}
                        className="input-field pr-10"
                        placeholder={t('page_title_ar')}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('page_title')} (EN)</label>
                    <div className="relative">
                      <FileText className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="text"
                        name="seoTitleEn"
                        value={formData.seoTitleEn}
                        onChange={handleChange}
                        className="input-field pr-10"
                        placeholder={t('page_title_en')}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('page_url')}</label>
                  <div className="relative">
                    <Globe className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      name="seoUrl"
                      value={formData.seoUrl}
                      onChange={handleChange}
                      className="input-field pr-10"
                      placeholder="https://asnaavl.com/..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('page_description')} (AR)</label>
                    <textarea
                      name="seoDescriptionAr"
                      value={formData.seoDescriptionAr}
                      onChange={handleChange}
                      rows={3}
                      className="input-field"
                      placeholder={t('page_description_ar')}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('page_description')} (EN)</label>
                    <textarea
                      name="seoDescriptionEn"
                      value={formData.seoDescriptionEn}
                      onChange={handleChange}
                      rows={3}
                      className="input-field"
                      placeholder={t('page_description_en')}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {t('cancel')}
          </button>
          <button
            onClick={handleSubmit}
            className="bg-slate-900 hover:bg-slate-800 text-white px-10 py-2.5 rounded-xl font-bold shadow-lg flex items-center gap-2 transition-all active:scale-95"
          >
            <CheckCircle2 size={20} />
            {t('save_product')}
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={t('delete_confirmation')}
      />
    </div>
  );
};

export default ProductModal;
