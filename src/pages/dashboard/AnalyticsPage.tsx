import React from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';

const AnalyticsPage: React.FC = () => {
  const chartPlaceholders = [
    {
      title: 'Call Volume Trends',
      description: 'Daily call volume over the last 30 days',
      icon: <BarChart3 className="w-6 h-6" />
    },
    {
      title: 'Conversion Rates',
      description: 'Lead to appointment conversion metrics',
      icon: <TrendingUp className="w-6 h-6" />
    }
  ];

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Analytics</h1>
        <p className="text-zinc-600 mt-1">Detailed insights into your AI receptionist performance</p>
      </div>

      {/* Chart placeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {chartPlaceholders.map((chart, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-zinc-100 rounded-lg">
                <div className="text-zinc-600">
                  {chart.icon}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-zinc-900">{chart.title}</h3>
                <p className="text-sm text-zinc-600">{chart.description}</p>
              </div>
            </div>
            
            {/* Chart placeholder */}
            <div className="h-64 bg-zinc-50 rounded-lg border-2 border-dashed border-zinc-300 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-zinc-400 mx-auto mb-2" />
                <p className="text-zinc-500 font-medium">Chart coming soon</p>
                <p className="text-sm text-zinc-400">Interactive charts will be available here</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsPage;
