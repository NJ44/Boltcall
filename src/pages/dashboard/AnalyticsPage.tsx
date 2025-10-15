import React from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';
import { EmptyState } from '../../components/ui/empty-state';

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
            <div className="h-64 flex items-center justify-center">
              <EmptyState
                title="Chart Coming Soon"
                description="Interactive charts will be available here once you start receiving calls and leads."
                icons={[BarChart3]}
                action={{
                  label: "Learn More",
                  onClick: () => console.log("Learn more about analytics clicked")
                }}
                className="max-w-none p-8"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsPage;
