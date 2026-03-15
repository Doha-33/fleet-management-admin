import React from 'react';
import { useTranslation } from 'react-i18next';
import { History, User, Clock, Activity, Search, Filter } from 'lucide-react';
import { ActivityLog } from '../types';
import { formatDate } from '../utils';

const mockLogs: ActivityLog[] = [
  {
    id: '1',
    adminName: 'Fleet Admin',
    action: 'Updated Device',
    target: 'GPS Tracker X1',
    timestamp: '2024-03-01T08:45:00Z',
  },
  {
    id: '2',
    adminName: 'Fleet Admin',
    action: 'Created Blog Post',
    target: 'Future of Telematics',
    timestamp: '2024-03-01T07:30:00Z',
  },
  {
    id: '3',
    adminName: 'Editor User',
    action: 'Changed Status',
    target: 'Demo Request #842',
    timestamp: '2024-02-29T16:20:00Z',
  },
];

const ActivityLogs: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{t('activity_logs')}</h2>
        <p className="text-slate-500">{t('manage_activity_logs')}</p>
      </div>

      <div className="card p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 rtl:left-auto rtl:right-3" size={18} />
            <input
              type="text"
              placeholder={t('search')}
              className="w-full pl-10 pr-4 py-2 rtl:pl-4 rtl:pr-10 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary/50 outline-none text-sm"
            />
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm w-full md:w-auto justify-center">
              <Filter size={16} />
              {t('filter_by_admin')}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {mockLogs.map((log) => (
            <div key={log.id} className="flex items-start md:items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Activity size={16} className="md:w-5 md:h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-4">
                  <p className="text-xs md:text-sm">
                    <span className="font-bold">{log.adminName}</span> {log.action.toLowerCase()} <span className="font-bold text-primary">{log.target}</span>
                  </p>
                  <span className="text-[9px] md:text-[10px] text-slate-400 flex items-center gap-1 whitespace-nowrap">
                    <Clock size={10} />
                    {formatDate(log.timestamp)}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] md:text-[10px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-500 font-bold uppercase">
                    {log.action.split(' ')[0]}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button className="text-sm font-bold text-primary hover:underline">{t('load_more')}</button>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;
