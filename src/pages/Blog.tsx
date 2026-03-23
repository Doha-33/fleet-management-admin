import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search, Edit2, Trash2, Calendar, Tag, User, Save, Camera } from 'lucide-react';
import { BlogPost } from '../types';
import { cn, formatDate, generateSlug } from '../utils';
import Modal from '../components/Modal';
import { toast } from 'sonner';
import api from '../services/api';

const Blog: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    titleAr: '',
    titleEn: '',
    contentAr: '',
    contentEn: '',
    category: '',
    status: 'Published',
    image: '',
    slug: '',
    authorName: '',
  });

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/api/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      toast.error(t('failed_to_fetch_posts'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const title = isRtl ? post.titleAr : post.titleEn;
      const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           post.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [posts, searchTerm, statusFilter, isRtl]);

  const handleOpenModal = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post);
      setFormData(post);
    } else {
      setEditingPost(null);
      setFormData({
        titleAr: '',
        titleEn: '',
        contentAr: '',
        contentEn: '',
        category: '',
        status: 'Published',
        image: '',
        slug: '',
        authorName: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.titleAr || !formData.category) {
      toast.error(t('please_fill_all_fields'));
      return;
    }

    try {
      const payload = {
        ...formData,
        slug: formData.slug || generateSlug(formData.titleEn || formData.titleAr || ''),
      };

      if (editingPost) {
        await api.put(`/api/posts/${editingPost._id}`, payload);
        toast.success(t('post_updated_successfully'));
      } else {
        await api.post('/api/posts', payload);
        toast.success(t('post_created_successfully'));
      }
      fetchPosts();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save post:', error);
      toast.error(t('failed_to_save_post'));
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t('delete_confirmation'))) {
      try {
        await api.delete(`/api/posts/${id}`);
        toast.success(t('post_deleted_successfully'));
        fetchPosts();
      } catch (error) {
        console.error('Failed to delete post:', error);
        toast.error(t('failed_to_delete_post'));
      }
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
          <h2 className="text-2xl font-bold">{t('blog')}</h2>
          <p className="text-slate-500">{t('manage_articles')}</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          {t('create_post')}
        </button>
      </div>

      <div className="card p-4 md:p-6 flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 rtl:left-auto rtl:right-3" size={18} />
          <input
            type="text"
            placeholder={t('search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rtl:pl-4 rtl:pr-10 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary/50 outline-none text-sm"
          />
        </div>
        <select 
          className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm outline-none w-full md:w-auto"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">{t('all_status')}</option>
          <option value="Published">{t('published')}</option>
          <option value="Draft">{t('draft')}</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div key={post._id} className="card group flex flex-col">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={isRtl ? post.titleAr : post.titleEn} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg",
                    post.status === 'Published' ? "bg-emerald-500 text-white" : "bg-slate-500 text-white"
                  )}>
                    {post.status}
                  </span>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                  <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-primary font-bold uppercase">
                    {post.category}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {formatDate(post.createdAt)}
                  </span>
                </div>
                
                <h3 className="font-bold text-lg mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  {isRtl ? post.titleAr : post.titleEn}
                </h3>
                
                <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                      <User size={12} className="text-slate-500" />
                    </div>
                    <span className="text-xs font-medium">{post.authorName || 'Admin'}</span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleOpenModal(post)} className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 rounded-lg transition-colors" title={t('edit')}>
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(post._id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-lg transition-colors" title={t('delete')}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingPost ? t('edit_post') : t('create_post')}>
        <div className="space-y-4 max-h-[80vh] overflow-y-auto p-1">
          <div className="flex justify-center mb-4">
            <div className="relative group">
              <img 
                src={formData.image || 'https://via.placeholder.com/150'} 
                alt="Preview" 
                className="w-32 h-20 rounded-xl object-cover border-2 border-slate-200 dark:border-slate-800"
                referrerPolicy="no-referrer"
              />
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 rounded-xl cursor-pointer transition-opacity">
                <Camera size={20} />
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t('title_ar')}</label>
              <input 
                type="text" 
                className="input-field" 
                value={formData.titleAr}
                onChange={e => setFormData({ ...formData, titleAr: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('title_en')}</label>
              <input 
                type="text" 
                className="input-field" 
                value={formData.titleEn}
                onChange={e => setFormData({ ...formData, titleEn: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t('category')}</label>
              <input 
                type="text" 
                className="input-field" 
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('status')}</label>
              <select 
                className="input-field"
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Draft">{t('draft')}</option>
                <option value="Published">{t('published')}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('author_name')}</label>
            <input 
              type="text" 
              className="input-field" 
              value={formData.authorName}
              onChange={e => setFormData({ ...formData, authorName: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('content_ar')}</label>
            <textarea 
              className="input-field h-32" 
              value={formData.contentAr}
              onChange={e => setFormData({ ...formData, contentAr: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('content_en')}</label>
            <textarea 
              className="input-field h-32" 
              value={formData.contentEn}
              onChange={e => setFormData({ ...formData, contentEn: e.target.value })}
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

export default Blog;

