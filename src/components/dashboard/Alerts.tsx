import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, XCircle, Info, ExternalLink } from 'lucide-react';
import Card from '../ui/Card';
import type { Alert } from '../../types/dashboard';

interface AlertsProps {
  alerts: Alert[];
  className?: string;
}

const getAlertIcon = (type: Alert['type']) => {
  switch (type) {
    case 'error':
      return XCircle;
    case 'warning':
      return AlertTriangle;
    case 'info':
      return Info;
    default:
      return Info;
  }
};

const getAlertColor = (type: Alert['type']) => {
  switch (type) {
    case 'error':
      return 'text-red-600 bg-red-100 border-red-200';
    case 'warning':
      return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    case 'info':
      return 'text-blue-600 bg-blue-100 border-blue-200';
    default:
      return 'text-gray-600 bg-gray-100 border-gray-200';
  }
};

const Alerts: React.FC<AlertsProps> = ({ alerts, className = '' }) => {
  if (alerts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={className}
      >
        <Card className="p-6">
          <div className="text-center text-text-muted">
            <Info className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p>No alerts at this time</p>
          </div>
        </Card>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card className="p-6">
        <div className="flex items-center mb-6">
          <AlertTriangle className="w-5 h-5 text-brand-blue mr-2" />
          <h3 className="text-xl font-semibold text-text-main">Alerts</h3>
        </div>
        
        <div className="space-y-3">
          {alerts.map((alert, index) => {
            const Icon = getAlertIcon(alert.type);
            const colorClass = getAlertColor(alert.type);
            
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className={`border rounded-xl p-4 ${colorClass}`}
              >
                <div className="flex items-start">
                  <Icon className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                    {alert.link && (
                      <a
                        href={alert.link}
                        className="inline-flex items-center text-xs mt-2 hover:underline"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        View details
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
};

export default Alerts;
