import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Download,
  X,
} from 'lucide-react';
import Card from '../ui/Card';
import type { FunnelStage } from '../../lib/analyticsApi';
import { exportToCsv } from '../../lib/exportUtils';

interface ConversionFunnelProps {
  stages: FunnelStage[];
  loading?: boolean;
  onStageClick?: (stageName: string) => void;
  drilldownData?: any[];
  drilldownStage?: string | null;
  onCloseDrilldown?: () => void;
}

const STAGE_COLORS = [
  'bg-blue-500',
  'bg-blue-400',
  'bg-sky-400',
  'bg-cyan-400',
  'bg-teal-400',
  'bg-emerald-400',
];

const ConversionFunnel: React.FC<ConversionFunnelProps> = ({
  stages,
  loading,
  onStageClick,
  drilldownData,
  drilldownStage,
  onCloseDrilldown,
}) => {
  const [hoveredStage, setHoveredStage] = useState<number | null>(null);
  const maxCount = Math.max(...stages.map(s => s.count), 1);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="h-6 w-48 bg-gray-100 rounded animate-pulse mb-6" />
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-12 bg-gray-100 rounded animate-pulse" style={{ width: `${100 - i * 12}%` }} />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6" id="funnel-chart">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-main">Conversion Funnel</h3>
        <button
          onClick={() => exportToCsv(
            stages.map(s => ({
              Stage: s.name,
              Count: s.count,
              'Conv. Rate': `${s.rate}%`,
              'Total Rate': `${s.totalRate}%`,
              'Previous Period': s.previousCount,
              'Change %': `${s.change}%`,
            })),
            'conversion-funnel',
            'Conversion Funnel'
          )}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-muted hover:text-text-main border border-border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Export
        </button>
      </div>

      <div className="space-y-3">
        {stages.map((stage, i) => {
          const widthPct = Math.max(8, (stage.count / maxCount) * 100);
          const isHovered = hoveredStage === i;

          return (
            <motion.div
              key={stage.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="group cursor-pointer"
              onMouseEnter={() => setHoveredStage(i)}
              onMouseLeave={() => setHoveredStage(null)}
              onClick={() => onStageClick?.(stage.name)}
            >
              <div className="flex items-center gap-3 mb-1">
                <span className="text-sm font-medium text-text-main w-32 shrink-0 truncate">
                  {stage.name}
                </span>
                <div className="flex-1 relative h-10">
                  <motion.div
                    className={`h-full rounded-lg ${STAGE_COLORS[i]} transition-all ${isHovered ? 'opacity-100' : 'opacity-85'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${widthPct}%` }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                  />
                  <div className="absolute inset-0 flex items-center px-3">
                    <span className="text-sm font-bold text-white drop-shadow-sm">
                      {stage.count.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="w-28 shrink-0 flex items-center gap-2">
                  {i > 0 && (
                    <span className="text-xs text-text-muted">
                      {stage.rate}%
                    </span>
                  )}
                  <div className={`flex items-center text-xs ${stage.change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {stage.change >= 0 ? (
                      <TrendingUp className="w-3 h-3 mr-0.5" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-0.5" />
                    )}
                    {Math.abs(stage.change)}%
                  </div>
                </div>
              </div>
              {i < stages.length - 1 && (
                <div className="flex items-center ml-32 pl-2">
                  <ChevronRight className="w-3 h-3 text-gray-300" />
                  <span className="text-[10px] text-text-muted ml-1">
                    {stages[i + 1].rate}% continue
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Drilldown panel */}
      {drilldownStage && drilldownData && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6 pt-6 border-t border-border"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-text-main">
              {drilldownStage} — {drilldownData.length} records
            </h4>
            <button onClick={onCloseDrilldown} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-4 h-4 text-text-muted" />
            </button>
          </div>
          <div className="max-h-60 overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-text-muted border-b border-border">
                  <th className="pb-2 pr-4">Name</th>
                  <th className="pb-2 pr-4">Phone</th>
                  <th className="pb-2 pr-4">Source</th>
                  <th className="pb-2 pr-4">Status</th>
                  <th className="pb-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {drilldownData.slice(0, 20).map((row: any, idx: number) => (
                  <tr key={idx} className="border-b border-gray-50">
                    <td className="py-2 pr-4 text-text-main">{row.caller_name || 'Unknown'}</td>
                    <td className="py-2 pr-4 text-text-muted font-mono text-xs">{row.caller_number || '-'}</td>
                    <td className="py-2 pr-4">
                      <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">{row.source || '-'}</span>
                    </td>
                    <td className="py-2 pr-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        row.status === 'completed' ? 'bg-green-100 text-green-700' :
                        row.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>{row.status}</span>
                    </td>
                    <td className="py-2 text-text-muted text-xs">
                      {new Date(row.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </Card>
  );
};

export default ConversionFunnel;
