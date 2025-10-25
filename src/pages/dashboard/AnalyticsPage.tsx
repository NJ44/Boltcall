import React from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';
import LineChartDemo from '../../components/ui/line-chart-demo';

const AnalyticsPage: React.FC = () => {

  return (
    <div className="space-y-8">
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gray-100 rounded-lg">
              <div className="text-gray-600">
                <BarChart3 className="w-6 h-6" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Sales Overview</h3>
              <p className="text-sm text-gray-600">Monthly sales performance and goals tracking</p>
            </div>
          </div>
          
          <div className="h-80">
            <LineChartDemo />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gray-100 rounded-lg">
              <div className="text-gray-600">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
              <p className="text-sm text-gray-600">Key performance indicators and trends</p>
            </div>
          </div>
          
          <div className="h-80">
            <LineChartDemo />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
