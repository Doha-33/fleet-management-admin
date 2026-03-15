import React from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, CheckCircle, AlertCircle, Info, Trash2 } from 'lucide-react';
import { Notification } from '../types';
import { cn, formatDate } from '../utils';

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'request',
    title: 'New Demo Request',
    message: 'Ahmed Mansour requested a demo for FleetTrack Pro X1.',
    isRead: false,
    createdAt: '2024-03-01T08:30:00Z',
  },
  {
    id: '2',
    type: 'alert',
    title: 'System Update',
    message: 'Server maintenance scheduled for tomorrow at 2:00 AM UTC.',
    isRead: true,
    createdAt: '2024-02-28T12:00:00Z',
  },
  {
    id: '3',
    type: 'contact',
    title: 'New Contact Message',
    message: 'Sarah Wilson sent a message regarding API integration.',
    isRead: false,
    createdAt: '2024-02-28T15:45:00Z',
  },
];

const Notifications: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">{t('notifications')}</h2>
          <p className="text-slate-500">{t('stay_updated')}</p>
        </div>
        <button className="text-sm font-bold text-primary hover:underline w-full sm:w-auto text-left sm:text-right">{t('mark_all_as_read')}</button>
      </div>

      <div className="space-y-4">
        {mockNotifications.map((notification) => (
          <div 
            key={notification.id} 
            className={cn(
              "card p-3 md:p-4 flex gap-3 md:gap-4 items-start transition-all",
              !notification.isRead && "border-s-4 border-s-primary bg-primary/5 dark:bg-primary/10"
            )}
          >
            <div className={cn(
              "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0",
              notification.type === 'request' ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30" :
              notification.type === 'alert' ? "bg-red-100 text-red-600 dark:bg-red-900/30" :
              "bg-purple-100 text-purple-600 dark:bg-purple-900/30"
            )}>
              {notification.type === 'request' ? <CheckCircle size={16} className="md:w-5 md:h-5" /> :
               notification.type === 'alert' ? <AlertCircle size={16} className="md:w-5 md:h-5" /> :
               <Info size={16} className="md:w-5 md:h-5" />}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-1 sm:gap-4">
                <h3 className={cn("font-bold text-sm md:text-base truncate w-full", !notification.isRead && "text-primary")}>
                  {notification.title}
                </h3>
                <span className="text-[9px] md:text-[10px] text-slate-400 font-medium whitespace-nowrap">
                  {formatDate(notification.createdAt)}
                </span>
              </div>
              <p className="text-xs md:text-sm text-slate-500 mt-1 line-clamp-2 md:line-clamp-none">{notification.message}</p>
            </div>

            <div className="flex gap-1 md:gap-2">
              {!notification.isRead && (
                <button className="p-1.5 md:p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 rounded-lg transition-colors" title={t('mark_as_read')}>
                  <CheckCircle size={14} className="md:w-4 md:h-4" />
                </button>
              )}
              <button className="p-1.5 md:p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-400 rounded-lg transition-colors" title={t('delete_notification')}>
                <Trash2 size={14} className="md:w-4 md:h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
