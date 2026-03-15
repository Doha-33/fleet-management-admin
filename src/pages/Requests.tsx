import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search, Edit2, Trash2, Eye, Download, Filter, Save, X } from 'lucide-react';
import { Request } from '../types';
import { cn, formatDate } from '../utils';
import Modal from '../components/Modal';
import { toast } from 'sonner';

const initialRequests: Request[] = [
  {
    id: '1',
    type: 'demo',
    name: 'Ahmed Mansour',
    email: 'ahmed@logistics.com',
    phone: '+966 50 123 4567',
    message: 'Interested in FleetTrack Pro X1 for our 50 trucks fleet.',
    status: 'new',
    createdAt: '2024-03-01T08:30:00Z',
  },
  {
    id: '2',
    type: 'contact',
    name: 'Sarah Wilson',
    email: 'sarah@techcorp.uk',
    phone: '+44 20 7123 4567',
    message: 'Inquiry about API integration possibilities.',
    status: 'contacted',
    createdAt: '2024-02-28T15:45:00Z',
  },
  {
    id: '3',
    type: 'demo',
    name: 'Khalid Al-Fahad',
    email: 'khalid@transport.sa',
    phone: '+966 55 987 6543',
    message: 'Requesting a live demo for the cold chain monitoring system.',
    status: 'closed',
    createdAt: '2024-02-25T11:20:00Z',
  },
];

const Requests: React.FC = () => {
  const { t } = useTranslation();
  const [requests, setRequests] = useState<Request[]>(initialRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      const matchesSearch = req.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           req.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [requests, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewDetails = (req: Request) => {
    setSelectedRequest(req);
    setIsModalOpen(true);
  };

  const handleUpdateStatus = (id: string, status: Request['status']) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    toast.success(`Request status updated to ${status}`);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t('delete_confirmation'))) {
      setRequests(prev => prev.filter(r => r.id !== id));
      toast.success(t('request_deleted_successfully'));
    }
  };

  const handleExport = () => {
    toast.info('Exporting requests to CSV...');
    // Simulated export
    setTimeout(() => toast.success('Export complete!'), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">{t('requests')}</h2>
          <p className="text-slate-500">{t('manage_requests')}</p>
        </div>
        <button onClick={handleExport} className="btn-secondary flex items-center gap-2">
          <Download size={18} />
          {t('export_csv')}
        </button>
      </div>

      <div className="card p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 rtl:left-auto rtl:right-3" size={18} />
            <input
              type="text"
              placeholder={t('search')}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 rtl:pl-4 rtl:pr-10 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary/50 outline-none text-sm"
            />
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 w-full md:w-auto">
              <Filter size={16} className="text-slate-400" />
              <select 
                className="bg-transparent border-none outline-none text-sm w-full"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">{t('all_status')}</option>
                <option value="new">{t('new')}</option>
                <option value="contacted">{t('contacted')}</option>
                <option value="closed">{t('closed')}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
          <table className="w-full text-left rtl:text-right min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="pb-4 font-bold text-sm text-slate-500 uppercase tracking-wider px-4">{t('sender')}</th>
                <th className="pb-4 font-bold text-sm text-slate-500 uppercase tracking-wider px-4">{t('type')}</th>
                <th className="pb-4 font-bold text-sm text-slate-500 uppercase tracking-wider px-4">{t('status')}</th>
                <th className="pb-4 font-bold text-sm text-slate-500 uppercase tracking-wider px-4">{t('date')}</th>
                <th className="pb-4 font-bold text-sm text-slate-500 uppercase tracking-wider px-4 text-center">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {paginatedRequests.length > 0 ? paginatedRequests.map((request) => (
                <tr key={request.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-bold text-sm">{request.name}</p>
                      <p className="text-xs text-slate-500">{request.email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={cn(
                      "text-xs font-bold px-2 py-1 rounded-md uppercase",
                      request.type === 'demo' ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                    )}>
                      {request.type}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold",
                      request.status === 'new' ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" :
                      request.status === 'contacted' ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                    )}>
                      {t(request.status)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-500">
                    {formatDate(request.createdAt)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => handleViewDetails(request)} className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors" title={t('view_details')}>
                        <Eye size={16} />
                      </button>
                      <button onClick={() => handleDelete(request.id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-lg transition-colors" title={t('delete')}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">{t('no_results')}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-6 gap-4">
            <p className="text-sm text-slate-500">
              {t('showing')} {(currentPage - 1) * itemsPerPage + 1} {t('to')} {Math.min(currentPage * itemsPerPage, filteredRequests.length)} {t('of')} {filteredRequests.length} {t('entries')}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-slate-200 dark:border-slate-800 rounded-md text-sm disabled:opacity-50"
              >
                {t('previous')}
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={cn(
                    "px-3 py-1 rounded-md text-sm",
                    currentPage === i + 1 ? "bg-primary text-white" : "border border-slate-200 dark:border-slate-800"
                  )}
                >
                  {i + 1}
                </button>
              ))}
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-slate-200 dark:border-slate-800 rounded-md text-sm disabled:opacity-50"
              >
                {t('next')}
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t('request_details')}>
        {selectedRequest && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">{t('name')}</p>
                <p className="font-bold">{selectedRequest.name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">{t('type')}</p>
                <p className="font-bold capitalize">{selectedRequest.type}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">{t('email')}</p>
                <p className="font-bold">{selectedRequest.email}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">{t('phone')}</p>
                <p className="font-bold">{selectedRequest.phone}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold">{t('message')}</p>
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl mt-1 text-sm">
                {selectedRequest.message}
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <p className="text-sm font-bold mb-3">{t('update_status')}</p>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => handleUpdateStatus(selectedRequest.id, 'new')}
                  className={cn("px-4 py-2 rounded-lg text-sm font-bold transition-all", selectedRequest.status === 'new' ? "bg-orange-500 text-white" : "bg-slate-100 dark:bg-slate-800")}
                >
                  {t('new')}
                </button>
                <button 
                  onClick={() => handleUpdateStatus(selectedRequest.id, 'contacted')}
                  className={cn("px-4 py-2 rounded-lg text-sm font-bold transition-all", selectedRequest.status === 'contacted' ? "bg-blue-500 text-white" : "bg-slate-100 dark:bg-slate-800")}
                >
                  {t('contacted')}
                </button>
                <button 
                  onClick={() => handleUpdateStatus(selectedRequest.id, 'closed')}
                  className={cn("px-4 py-2 rounded-lg text-sm font-bold transition-all", selectedRequest.status === 'closed' ? "bg-slate-500 text-white" : "bg-slate-100 dark:bg-slate-800")}
                >
                  {t('closed')}
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Requests;

