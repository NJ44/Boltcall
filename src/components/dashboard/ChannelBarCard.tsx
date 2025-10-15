import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import Card from '../ui/Card';
import { CustomCheckbox } from '../ui/custom-checkbox';
import type { ChannelPerf } from '../../types/dashboard';

interface ChannelBarCardProps {
  data: ChannelPerf[];
  className?: string;
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
  if (active && payload && payload.length) {
    const qualified = payload[0]?.value || 0;
    const booked = payload[1]?.value || 0;
    const conversion = qualified > 0 ? ((booked / qualified) * 100).toFixed(1) : 0;
    
    return (
      <div className="bg-white p-3 border border-border rounded-xl shadow-lg">
        <p className="text-sm font-medium text-text-main mb-2">{label}</p>
        <div className="space-y-1">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-brand-sky rounded-full mr-2"></div>
            <span className="text-sm text-text-muted">Qualified: {qualified}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-brand-blue rounded-full mr-2"></div>
            <span className="text-sm text-text-muted">Booked: {booked}</span>
          </div>
          <div className="text-xs text-text-muted">
            Conversion: {conversion}%
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const ChannelBarCard: React.FC<ChannelBarCardProps> = ({ data, className = '' }) => {
  const [showQualified, setShowQualified] = useState(true);
  const [showBooked, setShowBooked] = useState(true);
  
  const formatChannelName = (channel: string) => {
    return channel.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-text-main">Channel Performance</h3>
          <div className="flex items-center space-x-4">
            <label className="flex items-center text-sm">
              <CustomCheckbox
                checked={showQualified}
                onChange={(e) => setShowQualified(e.target.checked)}
                className="mr-2"
              />
              <div className="w-3 h-3 bg-brand-sky rounded-full mr-2"></div>
              Qualified
            </label>
            <label className="flex items-center text-sm">
              <CustomCheckbox
                checked={showBooked}
                onChange={(e) => setShowBooked(e.target.checked)}
                className="mr-2"
              />
              <div className="w-3 h-3 bg-brand-blue rounded-full mr-2"></div>
              Booked
            </label>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="channel" 
                stroke="#475569"
                tick={{ fontSize: 12 }}
                tickFormatter={formatChannelName}
              />
              <YAxis stroke="#475569" tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              {showQualified && (
                <Bar
                  dataKey="qualified"
                  fill="#93C5FD"
                  name="Qualified"
                  radius={[4, 4, 0, 0]}
                />
              )}
              {showBooked && (
                <Bar
                  dataKey="booked"
                  fill="#2563EB"
                  name="Booked"
                  radius={[4, 4, 0, 0]}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  );
};

export default ChannelBarCard;
