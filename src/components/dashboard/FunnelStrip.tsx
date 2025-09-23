import React from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import type { FunnelStep } from '../../types/dashboard';

interface FunnelStripProps {
  steps: FunnelStep[];
  className?: string;
}

const FunnelStrip: React.FC<FunnelStripProps> = ({ steps, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-text-main mb-6">Conversion Funnel</h3>
        
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.name} className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="relative"
              >
                <div className="bg-brand-blue text-white px-4 py-2 rounded-full text-sm font-medium mb-2 min-w-[80px] text-center">
                  {step.count.toLocaleString()}
                </div>
                <div className="text-xs text-text-muted text-center">
                  {step.name}
                </div>
                {index < steps.length - 1 && (
                  <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-0.5 bg-border"></div>
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-2 border-l-border border-t-1 border-t-border border-b-1 border-b-border"></div>
                  </div>
                )}
              </motion.div>
              
              <div className="mt-2 text-center">
                <div className="text-xs text-text-muted">
                  {step.rate.toFixed(1)}% from prev
                </div>
                <div className="text-xs text-brand-blue font-medium">
                  {step.totalRate.toFixed(1)}% total
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export default FunnelStrip;
