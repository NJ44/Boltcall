import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import Card from '../ui/Card';

interface KpiTileProps {
  title: string;
  value: string | number;
  delta: number;
  sparkline: number[];
  format?: 'number' | 'percentage' | 'currency' | 'time';
  className?: string;
}

const formatValue = (value: string | number, format: string): string => {
  if (typeof value === 'string') return value;
  
  switch (format) {
    case 'percentage':
      return `${(value * 100).toFixed(1)}%`;
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    case 'time':
      return `${value}s`;
    default:
      return new Intl.NumberFormat('en-US').format(value);
  }
};

const Sparkline: React.FC<{ data: number[] }> = ({ data }) => {
  if (data.length < 2) return null;
  
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <svg width="60" height="20" viewBox="0 0 60 20" className="absolute bottom-1 right-1">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-brand-blue"
      />
    </svg>
  );
};

const KpiTile: React.FC<KpiTileProps> = ({
  title,
  value,
  delta,
  sparkline,
  format = 'number',
  className = '',
}) => {
  const isPositive = delta >= 0;
  const deltaColor = isPositive ? 'text-green-600' : 'text-red-600';
  const deltaIcon = isPositive ? TrendingUp : TrendingDown;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card className="p-6 relative overflow-hidden">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-sm font-medium text-text-muted">{title}</h3>
          <div className={`flex items-center text-xs ${deltaColor}`}>
            {React.createElement(deltaIcon, { className: 'w-3 h-3 mr-1' })}
            {Math.abs(delta).toFixed(1)}%
          </div>
        </div>
        
        <div className="text-2xl font-bold text-text-main mb-2">
          {formatValue(value, format)}
        </div>
        
        <Sparkline data={sparkline} />
      </Card>
    </motion.div>
  );
};

export default KpiTile;
