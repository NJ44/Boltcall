import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, Users } from 'lucide-react';
import Icon from './ui/Icon';

const DashboardMetrics: React.FC = () => {
  const metrics = [
    {
      icon: Users,
      title: 'Total Leads',
      value: '1,247',
      subtitle: 'This month',
      trend: '+12%',
      trendType: 'positive' as const
    },
    {
      icon: CheckCircle,
      title: 'Converted',
      value: '423',
      subtitle: '34% conversion rate',
      trend: '+8%',
      trendType: 'positive' as const
    },
    {
      icon: XCircle,
      title: 'Lost Leads',
      value: '156',
      subtitle: '12% loss rate',
      trend: '-3%',
      trendType: 'negative' as const
    },
    {
      icon: Clock,
      title: 'Avg Response',
      value: '28s',
      subtitle: 'Lightning fast',
      trend: '-15%',
      trendType: 'positive' as const
    }
  ];

  const channelMetrics = [
    { channel: 'SMS', leads: 456, percentage: 37 },
    { channel: 'WhatsApp', leads: 389, percentage: 31 },
    { channel: 'Phone', leads: 234, percentage: 19 },
    { channel: 'Website', leads: 168, percentage: 13 }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-gray-50 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-brand-blue/10 rounded-lg flex items-center justify-center">
                  <Icon
                    icon={metric.icon}
                    size="sm"
                    color="brand"
                  />
                </div>
                <span className="font-medium text-text-main">{metric.title}</span>
              </div>
              <span className={`text-sm font-medium ${
                metric.trendType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.trend}
              </span>
            </div>
            <div className="text-2xl font-bold text-text-main mb-1">
              {metric.value}
            </div>
            <div className="text-sm text-text-muted">
              {metric.subtitle}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Channel Breakdown */}
      <div>
        <h4 className="text-lg font-semibold text-text-main mb-4">
          Leads by Channel
        </h4>
        <div className="space-y-3">
          {channelMetrics.map((channel, index) => (
            <motion.div
              key={channel.channel}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-brand-blue rounded-full"></div>
                <span className="font-medium text-text-main">{channel.channel}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-brand-blue h-2 rounded-full transition-all duration-500"
                    style={{ width: `${channel.percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-text-muted w-12 text-right">
                  {channel.leads}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">98%</div>
          <div className="text-sm text-green-700">Uptime</div>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">24/7</div>
          <div className="text-sm text-blue-700">Availability</div>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-600 mb-1">4.9★</div>
          <div className="text-sm text-purple-700">Satisfaction</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMetrics;
