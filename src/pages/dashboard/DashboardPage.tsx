import React from 'react';
import { 
  Calendar, 
  Clock, 
  TrendingUp, 
  DollarSign 
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const kpis = [
    {
      title: 'Booked',
      value: '24',
      change: '+12%',
      icon: <Calendar className="w-5 h-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Missed',
      value: '3',
      change: '-25%',
      icon: <Clock className="w-5 h-5" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Speed-to-Lead',
      value: '28s',
      change: '+5%',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Revenue Est.',
      value: '$2,400',
      change: '+18%',
      icon: <DollarSign className="w-5 h-5" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Dashboard</h1>
        <p className="text-zinc-600 mt-1">Overview of your AI receptionist performance</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600">{kpi.title}</p>
                <p className="text-2xl font-bold text-zinc-900 mt-1">{kpi.value}</p>
                <p className={`text-sm mt-1 ${kpi.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {kpi.change} from last month
                </p>
              </div>
              <div className={`p-3 rounded-xl ${kpi.bgColor}`}>
                <div className={kpi.color}>
                  {kpi.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-zinc-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-zinc-600">New appointment booked for 2:30 PM</span>
            </div>
            <span className="text-xs text-zinc-500">5 min ago</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-zinc-600">Lead qualified and transferred to sales</span>
            </div>
            <span className="text-xs text-zinc-500">12 min ago</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-zinc-600">Follow-up call scheduled for tomorrow</span>
            </div>
            <span className="text-xs text-zinc-500">1 hour ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
