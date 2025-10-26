import React from 'react';
import { TrendingUp, TrendingDown, Phone, Calendar } from 'lucide-react';
import LineChartDemo from '../../components/ui/line-chart-demo';

const AnalyticsPage: React.FC = () => {

  const stats = [
    {
      title: 'Total Calls',
      value: '1,234',
      change: '+12.5%',
      trend: 'up',
      icon: Phone,
      color: 'bg-blue-500'
    },
    {
      title: 'Appointments Booked',
      value: '456',
      change: '+8.2%',
      trend: 'up',
      icon: Calendar,
      color: 'bg-green-500'
    },
    {
      title: 'Conversion Rate',
      value: '23.4%',
      change: '-2.1%',
      trend: 'down',
      icon: TrendingUp,
      color: 'bg-purple-500'
    },
    {
      title: 'Avg Call Duration',
      value: '4m 32s',
      change: '+5.3%',
      trend: 'up',
      icon: TrendingDown,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          return (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 shadow-lg flex flex-col">
              <div className="flex items-center justify-between mb-auto">
                <p className="text-xs text-gray-600">{stat.title}</p>
                <div className={`flex items-center gap-1 text-xs font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {stat.change}
                </div>
              </div>
              <div className="mt-auto text-center">
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChartDemo />
        <LineChartDemo />
      </div>
    </div>
  );
};

export default AnalyticsPage;
