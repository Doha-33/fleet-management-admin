import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  Cpu, 
  Settings, 
  FileText, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  User,
  Loader2,
  Truck,
  Award,
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { formatDate } from '../utils';
import { toast } from 'sonner';
import api from '../services/api';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState([
    { label: t('total_products'), value: '0', icon: Cpu, color: 'bg-blue-500', trend: '0%', up: true },
    { label: t('vehicles'), value: '0', icon: Truck, color: 'bg-orange-500', trend: '0%', up: true },
    { label: t('blog_posts'), value: '0', icon: FileText, color: 'bg-emerald-500', trend: '0%', up: true },
    { label: t('certificates_licenses'), value: '0', icon: Award, color: 'bg-amber-500', trend: '0%', up: true },
  ]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productsRes, postsRes, clientsRes, pricingRes, certsRes] = await Promise.all([
          api.get('/api/products'),
          api.get('/api/posts'),
          api.get('/api/clients'),
          api.get('/api/pricing'),
          api.get('/api/certificateOrLicense'),
        ]);

        setStats([
          { label: t('total_products'), value: productsRes.data.length.toString(), icon: Cpu, color: 'bg-blue-500', trend: '+12%', up: true },
          { label: t('vehicles'), value: pricingRes.data.length.toString(), icon: Truck, color: 'bg-orange-500', trend: '+5%', up: true },
          { label: t('blog_posts'), value: postsRes.data.length.toString(), icon: FileText, color: 'bg-emerald-500', trend: '+2%', up: true },
          { label: t('certificates_licenses'), value: certsRes.data.length.toString(), icon: Award, color: 'bg-amber-500', trend: '+8%', up: true },
        ]);

        // Mocking recent activity since there's no specific endpoint for it yet, 
        // but using some real names from the fetched data if possible
        const activities = [
          { user: 'Admin', action: 'added new product', target: productsRes.data[0]?.nameEn || 'Device', date: new Date().toISOString() },
          { user: 'Admin', action: 'published post', target: postsRes.data[0]?.titleEn || 'Article', date: new Date(Date.now() - 3600000).toISOString() },
          { user: 'Admin', action: 'updated client', target: clientsRes.data[0]?.clientName || 'Partner', date: new Date(Date.now() - 7200000).toISOString() },
        ];
        setRecentActivity(activities);

      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        toast.error(t('something_went_wrong'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [t]);

  const handleGenerateReport = () => {
    toast.promise(new Promise(resolve => setTimeout(resolve, 2000)), {
      loading: t('generating_report'),
      success: t('report_generated_successfully'),
      error: t('report_generation_failed'),
    });
  };

  const chartData = [
    { name: 'Mon', requests: 4 },
    { name: 'Tue', requests: 7 },
    { name: 'Wed', requests: 5 },
    { name: 'Thu', requests: 12 },
    { name: 'Fri', requests: 9 },
    { name: 'Sat', requests: 15 },
    { name: 'Sun', requests: 10 },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{t('dashboard')}</h2>
          <p className="text-slate-500">{t('welcome_message')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="card p-4 md:p-6 flex items-center gap-4">
            <div className={`w-10 h-10 md:w-12 md:h-12 ${stat.color} rounded-xl flex items-center justify-center text-white shadow-lg shadow-${stat.color.split('-')[1]}-500/20`}>
              <stat.icon size={20} className="md:w-6 md:h-6" />
            </div>
            <div className="flex-1">
              <p className="text-xs md:text-sm text-slate-500 font-medium">{stat.label}</p>
              <div className="flex items-end justify-between">
                <h3 className="text-xl md:text-2xl font-bold mt-1">{stat.value}</h3>
                <span className={`text-[10px] md:text-xs font-bold flex items-center gap-0.5 ${stat.up ? 'text-emerald-500' : 'text-red-500'}`}>
                  {stat.up ? <ArrowUpRight size={12} className="md:w-3.5 md:h-3.5" /> : <ArrowDownRight size={12} className="md:w-3.5 md:h-3.5" />}
                  {stat.trend}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 card p-4 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h3 className="font-bold text-lg">{t('requests_overview')}</h3>
            <select className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm px-3 py-1.5 outline-none w-full sm:w-auto">
              <option>{t('last_7_days')}</option>
              <option>{t('last_30_days')}</option>
              <option>{t('last_year')}</option>
            </select>
          </div>
          <div className="h-60 md:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="requests" stroke="#F97316" strokeWidth={3} fillOpacity={1} fill="url(#colorReq)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-4 md:p-6">
          <h3 className="font-bold text-lg mb-6">{t('recent_activity')}</h3>
          <div className="space-y-6">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, i) => (
                <div key={i} className="flex gap-3 md:gap-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    <User size={16} className="text-slate-500 md:w-[18px] md:h-[18px]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm break-words">
                      <span className="font-bold">{activity.user}</span> {activity.action} <span className="font-bold text-primary">{activity.target}</span>
                    </p>
                    <p className="text-[10px] md:text-xs text-slate-400 mt-1">{formatDate(activity.date)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500 text-sm">
                {t('no_recent_activity')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
