import React from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { Download } from 'lucide-react';
import Card from '../ui/Card';
import type { SourceAttribution } from '../../lib/analyticsApi';
import { exportToCsv } from '../../lib/exportUtils';

interface SourceAttributionChartProps {
  data: SourceAttribution[];
  loading?: boolean;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.[0]) {
    const { source, count, percentage } = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-border rounded-xl shadow-lg">
        <p className="text-sm font-medium text-text-main capitalize">{source.replace(/_/g, ' ')}</p>
        <p className="text-sm text-text-muted">{count} leads ({percentage}%)</p>
      </div>
    );
  }
  return null;
};

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }: any) => {
  if (percentage < 5) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>
      {`${percentage}%`}
    </text>
  );
};

const SourceAttributionChart: React.FC<SourceAttributionChartProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <Card className="p-6">
        <div className="h-6 w-48 bg-gray-100 rounded animate-pulse mb-4" />
        <div className="h-64 bg-gray-100 rounded-full w-64 mx-auto animate-pulse" />
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-text-main mb-4">Lead Sources</h3>
        <div className="flex items-center justify-center h-48 text-sm text-text-muted">
          No source data available yet.
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6" id="source-attribution-chart">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-main">Lead Sources</h3>
        <button
          onClick={() => exportToCsv(
            data.map(d => ({ Source: d.source, Count: d.count, Percentage: `${d.percentage}%` })),
            'lead-sources',
            'Source Attribution'
          )}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-muted hover:text-text-main border border-border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Export
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="w-full md:w-1/2 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data as any}
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={50}
                dataKey="count"
                nameKey="source"
                label={renderCustomLabel}
                labelLine={false}
                animationBegin={0}
                animationDuration={800}
              >
                {data.map((entry) => (
                  <Cell key={entry.source} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full md:w-1/2 space-y-2">
          {data.map((item, i) => (
            <motion.div
              key={item.source}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between py-1.5"
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-text-main capitalize">{item.source.replace(/_/g, ' ')}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-text-main">{item.count}</span>
                <span className="text-xs text-text-muted w-10 text-right">{item.percentage}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default SourceAttributionChart;
