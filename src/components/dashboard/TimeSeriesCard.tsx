import React from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import Card from '../ui/Card';
import type { TimeSeriesPoint } from '../../types/dashboard';

interface TimeSeriesCardProps {
  data: TimeSeriesPoint[];
  className?: string;
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
  if (active && payload && payload.length) {
    const leads = payload[0]?.value || 0;
    const bookings = payload[1]?.value || 0;
    const conversion = leads > 0 ? ((bookings / leads) * 100).toFixed(1) : 0;
    
    return (
      <div className="bg-white p-3 border border-border rounded-xl shadow-lg">
        <p className="text-sm font-medium text-text-main mb-2">{label}</p>
        <div className="space-y-1">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-brand-blue rounded-full mr-2"></div>
            <span className="text-sm text-text-muted">Leads: {leads}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-brand-blueDark rounded-full mr-2"></div>
            <span className="text-sm text-text-muted">Bookings: {bookings}</span>
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

const TimeSeriesCard: React.FC<TimeSeriesCardProps> = ({ data, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-text-main">Bookings Over Time</h3>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-brand-blue rounded-full mr-2"></div>
              <span className="text-text-muted">Leads</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-brand-blueDark rounded-full mr-2"></div>
              <span className="text-text-muted">Bookings</span>
            </div>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1E40AF" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#1E40AF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="date" 
                stroke="#475569"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
              />
              <YAxis stroke="#475569" tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="leads"
                stroke="#2563EB"
                fill="url(#colorLeads)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="bookings"
                stroke="#1E40AF"
                fill="url(#colorBookings)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  );
};

export default TimeSeriesCard;
