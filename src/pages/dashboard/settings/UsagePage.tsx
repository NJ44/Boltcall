import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

const UsagePage: React.FC = () => {
  const currentPlan = {
    name: 'Pro Plan',
    features: [
      { name: 'AI Conversations', used: 2847, limit: 10000, unit: 'conversations' },
      { name: 'Phone Calls', used: 1234, limit: 5000, unit: 'calls' },
      { name: 'Website Visitors', used: 15678, limit: 50000, unit: 'visitors' },
      { name: 'Lead Storage', used: 456, limit: 2000, unit: 'leads' },
      { name: 'API Calls', used: 15234, limit: 100000, unit: 'calls' }
    ]
  };

  const getUsagePercentage = (used: number, limit: number) => {
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600 bg-red-100';
    if (percentage >= 75) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  return (
    <div className="space-y-8">
      {/* Header */}

      {/* Current Plan Usage */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Current Plan: {currentPlan.name}</h2>
            <p className="text-gray-600">Usage limits and current consumption</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Updated 2 minutes ago</span>
          </div>
        </div>

        <div className="space-y-4">
          {currentPlan.features.map((feature, index) => {
            const percentage = getUsagePercentage(feature.used, feature.limit);
            const colorClass = getUsageColor(percentage);
            
            return (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{feature.name}</span>
                  <span className="text-sm text-gray-500">
                    {feature.used.toLocaleString()} / {feature.limit.toLocaleString()} {feature.unit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ delay: index * 0.1 + 0.2, duration: 0.8 }}
                    className={`h-2 rounded-full ${
                      percentage >= 90 ? 'bg-red-500' : 
                      percentage >= 75 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full ${colorClass}`}>
                    {percentage.toFixed(1)}% used
                  </span>
                  <span className="text-xs text-gray-500">
                    {(feature.limit - feature.used).toLocaleString()} remaining
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Features</h3>
        <div className="space-y-3">
          {[
            { name: 'Website Chatbot', percentage: 85, value: '2,420 interactions' },
            { name: 'Phone Automation', percentage: 72, value: '1,234 calls' },
            { name: 'Lead Qualification', percentage: 68, value: '456 leads' },
            { name: 'Email Responses', percentage: 45, value: '890 emails' }
          ].map((feature, index) => (
            <div key={feature.name} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{feature.name}</span>
                  <span className="text-xs text-gray-500">{feature.value}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${feature.percentage}%` }}
                    transition={{ delay: index * 0.1, duration: 0.8 }}
                    className="h-2 bg-blue-500 rounded-full"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UsagePage;
