import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, Edit2, Search, HelpCircle, ChevronDown, ChevronUp, Loader2, X } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import ConfirmModal from '../components/ConfirmModal';
import { FAQ } from '../types';
import api from '../services/api';
import { toast } from 'sonner';

const FAQManager = () => {
  const { t, i18n } = useTranslation();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [formData, setFormData] = useState({
    questionAr: '',
    questionEn: '',
    answerAr: '',
    answerEn: '',
  });
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null,
  });

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/fqa');
      setFaqs(response.data);
    } catch (error) {
      console.error('Failed to fetch FAQs:', error);
      toast.error(t('failed_to_fetch_faqs'));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (formData.questionAr && formData.questionEn && formData.answerAr && formData.answerEn) {
      try {
        if (editingFaq && editingFaq._id) {
          const response = await api.put(`/api/fqa/${editingFaq._id}`, formData);
          setFaqs(faqs.map((f) => (f._id === editingFaq._id ? response.data : f)));
          toast.success(t('faq_updated_successfully'));
        } else {
          const response = await api.post('/api/fqa', formData);
          setFaqs([...faqs, response.data]);
          toast.success(t('faq_added_successfully'));
        }
        handleCloseModal();
      } catch (error) {
        console.error('Failed to save FAQ:', error);
        toast.error(t('failed_to_save_faq'));
      }
    } else {
      toast.error(t('please_fill_all_fields'));
    }
  };

  const handleEdit = (faq: FAQ) => {
    setEditingFaq(faq);
    setFormData({
      questionAr: faq.questionAr,
      questionEn: faq.questionEn,
      answerAr: faq.answerAr,
      answerEn: faq.answerEn,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/fqa/${id}`);
      setFaqs(faqs.filter((f) => f._id !== id));
      toast.success(t('faq_deleted_successfully'));
      setDeleteModal({ isOpen: false, id: null });
    } catch (error) {
      console.error('Failed to delete FAQ:', error);
      toast.error(t('failed_to_delete_faq'));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingFaq(null);
    setFormData({
      questionAr: '',
      questionEn: '',
      answerAr: '',
      answerEn: '',
    });
  };

  const filteredFaqs = faqs.filter((f) =>
    (f.questionAr + f.questionEn).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{t('faq_manager')}</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2 ml-2" />
          {t('add_faq')}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={t('search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-slate-400" />
            </div>
          ) : filteredFaqs.map((faq) => (
            <div key={faq._id} className="bg-white">
              <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div
                  className="flex-1 cursor-pointer flex items-center gap-3"
                  onClick={() => setExpandedId(expandedId === faq._id ? null : faq._id)}
                >
                  <HelpCircle className="w-5 h-5 text-slate-400" />
                  <span className="font-medium text-slate-900">
                    {i18n.language === 'ar' ? faq.questionAr : faq.questionEn}
                  </span>
                  {expandedId === faq._id ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(faq)}
                    className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (faq._id) setDeleteModal({ isOpen: true, id: faq._id });
                    }}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {expandedId === faq._id && (
                <div className="px-12 pb-4 text-slate-600 text-sm leading-relaxed prose prose-slate max-w-none dark:prose-invert">
                  <div dangerouslySetInnerHTML={{ __html: i18n.language === 'ar' ? faq.answerAr : faq.answerEn }} />
                </div>
              )}
            </div>
          ))}
        </div>

        {!loading && filteredFaqs.length === 0 && (
          <div className="p-12 text-center">
            <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">{t('no_results')}</p>
          </div>
        )}
      </div>

      {/* FAQ Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">
                {editingFaq ? t('edit_faq') : t('add_faq')}
              </h2>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t('question_ar')}
                  </label>
                  <input
                    type="text"
                    value={formData.questionAr}
                    onChange={(e) => setFormData({ ...formData, questionAr: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t('question_en')}
                  </label>
                  <input
                    type="text"
                    value={formData.questionEn}
                    onChange={(e) => setFormData({ ...formData, questionEn: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t('answer_ar')}
                  </label>
                  <div className="quill-wrapper" dir="rtl">
                    <ReactQuill
                      theme="snow"
                      value={formData.answerAr}
                      onChange={(content) => setFormData({ ...formData, answerAr: content })}
                      className="bg-white rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t('answer_en')}
                  </label>
                  <div className="quill-wrapper">
                    <ReactQuill
                      theme="snow"
                      value={formData.answerEn}
                      onChange={(content) => setFormData({ ...formData, answerEn: content })}
                      className="bg-white rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                {t('save')}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={() => deleteModal.id && handleDelete(deleteModal.id)}
        title={t('delete_faq')}
        message={t('delete_confirmation')}
      />
    </div>
  );
};

export default FAQManager;
