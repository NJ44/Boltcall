import React from 'react';
import { motion } from 'framer-motion';
import { PhoneMissed, AlertCircle, Download } from 'lucide-react';
import Card from '../ui/Card';
import type { MissedOpportunity } from '../../lib/analyticsApi';
import { exportToCsv } from '../../lib/exportUtils';

interface MissedOpportunitiesProps {
  data: MissedOpportunity[];
  loading?: boolean;
}

const MissedOpportunities: React.FC<MissedOpportunitiesProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <Card className="p-6">
        <div className="h-6 w-48 bg-gray-100 rounded animate-pulse mb-4" />
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6" id="missed-opportunities">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <PhoneMissed className="w-5 h-5 text-red-500" />
          <h3 className="text-lg font-semibold text-text-main">Missed Opportunities</h3>
          {data.length > 0 && (
            <span className="text-xs font-medium px-2 py-0.5 bg-red-100 text-red-700 rounded-full">
              {data.length}
            </span>
          )}
        </div>
        <button
          onClick={() => exportToCsv(
            data.map(d => ({
              Name: d.name,
              Phone: d.phone,
              'Missed At': new Date(d.missedAt).toLocaleString(),
              Source: d.source,
              'Followed Up': d.followedUp ? 'Yes' : 'No',
            })),
            'missed-opportunities',
            'Missed Opportunities'
          )}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-muted hover:text-text-main border border-border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Export
        </button>
      </div>

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
            <AlertCircle className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-sm font-medium text-text-main">No missed opportunities!</p>
          <p className="text-xs text-text-muted mt-1">All calls are being handled.</p>
        </div>
      ) : (
        <div className="max-h-72 overflow-y-auto">
          <div className="space-y-2">
            {data.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center justify-between p-3 rounded-lg bg-red-50/50 hover:bg-red-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                    <PhoneMissed className="w-4 h-4 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-main">{item.name}</p>
                    <p className="text-xs text-text-muted font-mono">{item.phone}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-text-muted">
                    {new Date(item.missedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </p>
                  <p className="text-xs text-text-muted">
                    {new Date(item.missedAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default MissedOpportunities;
