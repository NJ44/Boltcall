import React from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import Card from '../ui/Card';
import type { HeatmapCell } from '../../lib/analyticsApi';
import { exportToCsv } from '../../lib/exportUtils';

interface PeakHoursHeatmapProps {
  data: HeatmapCell[];
  loading?: boolean;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

function getColor(count: number, max: number): string {
  if (count === 0) return 'bg-gray-50';
  const intensity = count / (max || 1);
  if (intensity <= 0.2) return 'bg-blue-100';
  if (intensity <= 0.4) return 'bg-blue-200';
  if (intensity <= 0.6) return 'bg-blue-300';
  if (intensity <= 0.8) return 'bg-blue-400';
  return 'bg-blue-600';
}

function getTextColor(count: number, max: number): string {
  if (count === 0) return 'text-gray-300';
  const intensity = count / (max || 1);
  return intensity > 0.6 ? 'text-white' : 'text-blue-900';
}

const PeakHoursHeatmap: React.FC<PeakHoursHeatmapProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <Card className="p-6">
        <div className="h-6 w-48 bg-gray-100 rounded animate-pulse mb-4" />
        <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
      </Card>
    );
  }

  const max = Math.max(...data.map(d => d.count), 1);

  const grid: Record<string, number> = {};
  data.forEach(d => {
    grid[`${d.day}-${d.hour}`] = d.count;
  });

  return (
    <Card className="p-6" id="peak-hours-heatmap">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-main">Peak Hours</h3>
        <button
          onClick={() => {
            const rows = data
              .filter(d => d.count > 0)
              .map(d => ({ Day: DAYS[d.day], Hour: `${d.hour}:00`, Volume: d.count }));
            exportToCsv(rows, 'peak-hours', 'Peak Hours');
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-muted hover:text-text-main border border-border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Export
        </button>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          <div className="flex items-center mb-1">
            <div className="w-10 shrink-0" />
            {HOURS.filter((_, i) => i % 2 === 0).map(h => (
              <div key={h} className="flex-1 text-center text-[9px] text-text-muted" style={{ minWidth: 0 }}>
                {h.toString().padStart(2, '0')}
              </div>
            ))}
          </div>

          {DAYS.map((day, dayIdx) => (
            <div key={day} className="flex items-center mb-0.5">
              <div className="w-10 shrink-0 text-xs text-text-muted font-medium">{day}</div>
              <div className="flex-1 flex gap-0.5">
                {HOURS.map(hour => {
                  const count = grid[`${dayIdx}-${hour}`] || 0;
                  return (
                    <motion.div
                      key={`${dayIdx}-${hour}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: (dayIdx * 24 + hour) * 0.002 }}
                      className={`flex-1 aspect-square rounded-sm ${getColor(count, max)} flex items-center justify-center cursor-default transition-transform hover:scale-125 hover:z-10 relative`}
                      title={`${day} ${hour}:00 — ${count} events`}
                    >
                      {count > 0 && (
                        <span className={`text-[7px] font-medium ${getTextColor(count, max)} leading-none`}>
                          {count}
                        </span>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="flex items-center justify-end gap-1 mt-3">
            <span className="text-[10px] text-text-muted mr-1">Less</span>
            {['bg-gray-50', 'bg-blue-100', 'bg-blue-200', 'bg-blue-300', 'bg-blue-400', 'bg-blue-600'].map(c => (
              <div key={c} className={`w-3 h-3 rounded-sm ${c}`} />
            ))}
            <span className="text-[10px] text-text-muted ml-1">More</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PeakHoursHeatmap;
