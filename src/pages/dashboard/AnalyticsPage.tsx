import React from 'react';
import LineChartDemo from '../../components/ui/line-chart-demo';

const AnalyticsPage: React.FC = () => {

  return (
    <div className="space-y-8">
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChartDemo />
        <LineChartDemo />
      </div>
    </div>
  );
};

export default AnalyticsPage;
