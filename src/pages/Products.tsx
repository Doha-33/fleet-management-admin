import React, { useState, useEffect } from 'react';
import { Plus, Search, Package, ChevronLeft, ChevronRight, Edit2, Trash2 } from 'lucide-react';
import { Product, MainCategory, SubCategory, NestedCategory } from '../types';
import ProductModal from '../components/ProductModal';
import ConfirmModal from '../components/ConfirmModal';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import api from '../services/api';

const Products: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<MainCategory[]>([]);
  const [allSubcategories, setAllSubcategories] = useState<SubCategory[]>([]);
  const [allNestedCategories, setAllNestedCategories] = useState<NestedCategory[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  // Filter states
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterSubcategory, setFilterSubcategory] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, mainCatsRes, subCatsRes, nestedCatsRes] = await Promise.all([
        api.get('/api/products'),
        api.get('/api/mainCategories'),
        api.get('/api/subCategories'),
        api.get('/api/nestedCategories')
      ]);
      setProducts(productsRes.data);
      setCategories(mainCatsRes.data);
      setAllSubcategories(subCatsRes.data);
      setAllNestedCategories(nestedCatsRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error(t('failed_to_fetch_data'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let result = [...products];

    if (search) {
      result = result.filter(p => 
        p.nameAr?.toLowerCase().includes(search.toLowerCase()) || 
        p.nameEn?.toLowerCase().includes(search.toLowerCase()) ||
        p.sku?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterCategory) {
      result = result.filter(p => p.category === filterCategory);
    }

    if (filterSubcategory) {
      result = result.filter(p => p.subCategory === filterSubcategory);
    }

    setFilteredProducts(result);
    setPage(1);
  }, [products, search, filterCategory, filterSubcategory]);

  useEffect(() => {
    if (filterCategory) {
      const filtered = allSubcategories.filter(
        sub => sub.fatherId === filterCategory
      );
      setSubcategories(filtered);
    } else {
      setSubcategories([]);
    }
  }, [filterCategory, allSubcategories]);

  const handleAddCategory = async (nameAr: string, nameEn: string) => {
    try {
      const response = await api.post('/api/mainCategories', { nameAr, nameEn });
      setCategories(prev => [...prev, response.data]);
      toast.success(t('category_added_successfully'));
      return response.data;
    } catch (error) {
      console.error('Failed to add category:', error);
      toast.error(t('failed_to_add_category'));
    }
  };

  const handleEditCategory = async (id: string, nameAr: string, nameEn: string) => {
    try {
      const response = await api.put(`/api/mainCategories/${id}`, { nameAr, nameEn });
      setCategories(prev => prev.map(cat => cat._id === id ? response.data : cat));
      toast.success(t('category_updated_successfully'));
    } catch (error) {
      console.error('Failed to update category:', error);
      toast.error(t('failed_to_update_category'));
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await api.delete(`/api/mainCategories/${id}`);
      setCategories(prev => prev.filter(cat => cat._id !== id));
      setAllSubcategories(prev => prev.filter(sub => sub.fatherId !== id));
      toast.success(t('category_deleted_successfully'));
    } catch (error) {
      console.error('Failed to delete category:', error);
      toast.error(t('failed_to_delete_category'));
    }
  };

  const handleAddSubcategory = async (nameAr: string, nameEn: string, fatherId: string) => {
    try {
      const response = await api.post('/api/subCategories', { nameAr, nameEn, fatherId });
      setAllSubcategories(prev => [...prev, response.data]);
      toast.success(t('subcategory_added_successfully'));
      return response.data;
    } catch (error) {
      console.error('Failed to add subcategory:', error);
      toast.error(t('failed_to_add_subcategory'));
    }
  };

  const handleEditSubcategory = async (id: string, nameAr: string, nameEn: string) => {
    try {
      const response = await api.put(`/api/subCategories/${id}`, { nameAr, nameEn });
      setAllSubcategories(prev => prev.map(sub => sub._id === id ? response.data : sub));
      toast.success(t('subcategory_updated_successfully'));
    } catch (error) {
      console.error('Failed to update subcategory:', error);
      toast.error(t('failed_to_update_subcategory'));
    }
  };

  const handleDeleteSubcategory = async (id: string) => {
    try {
      await api.delete(`/api/subCategories/${id}`);
      setAllSubcategories(prev => prev.filter(sub => sub._id !== id));
      setAllNestedCategories(prev => prev.filter(nested => nested.subCategoryId !== id));
      toast.success(t('subcategory_deleted_successfully'));
    } catch (error) {
      console.error('Failed to delete subcategory:', error);
      toast.error(t('failed_to_delete_subcategory'));
    }
  };

  const handleAddChildSub = async (nameAr: string, nameEn: string, subCategoryId: string) => {
    try {
      const response = await api.post('/api/nestedCategories', { nameAr, nameEn, subCategoryId });
      setAllNestedCategories(prev => [...prev, response.data]);
      toast.success(t('child_subcategory_added_successfully'));
      return response.data;
    } catch (error) {
      console.error('Failed to add child subcategory:', error);
      toast.error(t('failed_to_add_child_subcategory'));
    }
  };

  const handleEditChildSub = async (id: string, nameAr: string, nameEn: string) => {
    try {
      const response = await api.put(`/api/nestedCategories/${id}`, { nameAr, nameEn });
      setAllNestedCategories(prev => prev.map(nested => nested._id === id ? response.data : nested));
      toast.success(t('child_subcategory_updated_successfully'));
    } catch (error) {
      console.error('Failed to update child subcategory:', error);
      toast.error(t('failed_to_update_child_subcategory'));
    }
  };

  const handleDeleteChildSub = async (id: string) => {
    try {
      await api.delete(`/api/nestedCategories/${id}`);
      setAllNestedCategories(prev => prev.filter(nested => nested._id !== id));
      toast.success(t('child_subcategory_deleted_successfully'));
    } catch (error) {
      console.error('Failed to delete child subcategory:', error);
      toast.error(t('failed_to_delete_child_subcategory'));
    }
  };

  const handleSave = async (productData: Product) => {
    try {
      if (productData._id) {
        const response = await api.put(`/api/products/${productData._id}`, productData);
        setProducts(prev => prev.map(p => p._id === productData._id ? response.data : p));
        toast.success(t('product_updated_successfully'));
      } else {
        const response = await api.post('/api/products', productData);
        setProducts(prev => [response.data, ...prev]);
        toast.success(t('product_added_successfully'));
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save product:', error);
      toast.error(t('failed_to_save_product'));
    }
  };

  const confirmDelete = async () => {
    if (productToDelete !== null) {
      try {
        await api.delete(`/api/products/${productToDelete}`);
        setProducts(prev => prev.filter(p => p._id !== productToDelete));
        toast.success(t('product_deleted_successfully'));
        setProductToDelete(null);
      } catch (error) {
        console.error('Failed to delete product:', error);
        toast.error(t('failed_to_delete_product'));
      }
    }
  };

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const getCategoryName = (id: string) => {
    const cat = categories.find(c => c._id === id);
    return isRtl ? cat?.nameAr : cat?.nameEn;
  };

  const getSubcategoryName = (id: string) => {
    const sub = allSubcategories.find(s => s._id === id);
    return isRtl ? sub?.nameAr : sub?.nameEn;
  };

  const getNestedCategoryName = (id: string) => {
    const nested = allNestedCategories.find(n => n._id === id);
    return isRtl ? nested?.nameAr : nested?.nameEn;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('products')}</h1>
          <p className="text-slate-500 dark:text-slate-400">{t('manage_products_desc')}</p>
        </div>
        <button
          onClick={() => {
            setSelectedProduct(null);
            setIsModalOpen(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          {t('add_new_product')}
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder={t('search_products_placeholder')}
            className="input-field pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="input-field"
          value={filterCategory}
          onChange={(e) => {
            setFilterCategory(e.target.value);
            setFilterSubcategory('');
          }}
        >
          <option value="">{t('all_categories')}</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{isRtl ? cat.nameAr : cat.nameEn}</option>
          ))}
        </select>
        <select
          className="input-field"
          value={filterSubcategory}
          onChange={(e) => setFilterSubcategory(e.target.value)}
          disabled={!filterCategory}
        >
          <option value="">{t('all_subcategories')}</option>
          {subcategories.map(sub => (
            <option key={sub._id} value={sub._id}>{isRtl ? sub.nameAr : sub.nameEn}</option>
          ))}
        </select>
        <div className="flex items-center justify-end text-sm text-slate-500">
          {t('إجمالي المنتجات')}: {filteredProducts.length}
        </div>
      </div>

      {/* Products Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4 font-bold text-slate-700 dark:text-slate-300">{t('المنتج')}</th>
                <th className="p-4 font-bold text-slate-700 dark:text-slate-300">{t('التصنيف')}</th>
                <th className="p-4 font-bold text-slate-700 dark:text-slate-300">{t('SKU')}</th>
                <th className="p-4 font-bold text-slate-700 dark:text-slate-300">{t('الوزن')}</th>
                <th className="p-4 font-bold text-slate-700 dark:text-slate-300">{t('تاريخ الإضافة')}</th>
                <th className="p-4 font-bold text-slate-700 dark:text-slate-300 text-center">{t('إجراءات')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="p-4"><div className="h-12 bg-slate-100 dark:bg-slate-800 rounded-lg"></div></td>
                  </tr>
                ))
              ) : paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-500">
                    <Package size={48} className="mx-auto mb-4 opacity-20" />
                    {t('لا توجد منتجات مطابقة للبحث')}
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                          {product.image || product.imageUrl ? (
                            <img src={product.image || product.imageUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400"><Package size={20} /></div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{isRtl ? product.nameAr || product.name : product.nameEn || product.name}</div>
                          <div className="text-xs text-slate-500">{isRtl ? product.subTitleAr || product.subTitle : product.subTitleEn || product.subTitle}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          {getCategoryName(product.category)}
                        </span>
                        {product.subCategory && (
                          <>
                            <span className="mx-1 text-slate-400">›</span>
                            <span className="text-slate-500 text-xs">
                              {getSubcategoryName(product.subCategory)}
                            </span>
                          </>
                        )}
                        {product.subSubCategory && (
                          <>
                            <span className="mx-1 text-slate-400">›</span>
                            <span className="text-slate-500 text-xs">
                              {getNestedCategoryName(product.subSubCategory)}
                            </span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-sm font-mono text-slate-600 dark:text-slate-400">{product.sku || '-'}</td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{product.weight ? `${product.weight} كجم` : '-'}</td>
                    <td className="p-4 text-sm text-slate-500">
                      {product.created_at ? new Date(product.created_at).toLocaleDateString(isRtl ? 'ar-SA' : 'en-US') : '-'}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsModalOpen(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title={t('تعديل')}
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => {
                            if (product._id) {
                              setProductToDelete(product._id);
                              setIsDeleteModalOpen(true);
                            }
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title={t('حذف')}
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="text-sm text-slate-500">
              {t('صفحة')} {page} {t('من')} {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-white dark:hover:bg-slate-800 transition-colors"
              >
                {isRtl ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-white dark:hover:bg-slate-800 transition-colors"
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
        product={selectedProduct}
        categories={categories}
        subcategories={allSubcategories}
        childSubcategories={allNestedCategories}
        onAddCategory={handleAddCategory}
        onEditCategory={handleEditCategory}
        onDeleteCategory={handleDeleteCategory}
        onAddSubcategory={handleAddSubcategory}
        onEditSubcategory={handleEditSubcategory}
        onDeleteSubcategory={handleDeleteSubcategory}
        onAddChildSub={handleAddChildSub}
        onEditChildSub={handleEditChildSub}
        onDeleteChildSub={handleDeleteChildSub}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={t('delete_product')}
        message={t('delete_confirmation')}
      />
    </div>
  );
};

export default Products;
