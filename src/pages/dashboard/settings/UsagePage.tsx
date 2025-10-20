import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, Users, MessageSquare, Phone, Globe } from 'lucide-react';

const UsagePage: React.FC = () => {
  const usageStats = [
    {
      title: 'Total Conversations',
      value: '2,847',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: <MessageSquare className="w-5 h-5" />,
      description: 'AI conversations this month'
    },
    {
      title: 'Phone Calls Handled',
      value: '1,234',
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: <Phone className="w-5 h-5" />,
      description: 'Automated phone interactions'
    },
    {
      title: 'Website Visitors',
      value: '15,678',
      change: '+23.1%',
      changeType: 'positive' as const,
      icon: <Globe className="w-5 h-5" />,
      description: 'Unique visitors this month'
    },
    {
      title: 'Leads Generated',
      value: '456',
      change: '+15.7%',
      changeType: 'positive' as const,
      icon: <Users className="w-5 h-5" />,
      description: 'Qualified leads captured'
    }
  ];

  const monthlyUsage = [
    { month: 'Jan', conversations: 2100, calls: 900, visitors: 12000, leads: 320 },
    { month: 'Feb', conversations: 2300, calls: 950, visitors: 13000, leads: 350 },
    { month: 'Mar', conversations: 2500, calls: 1000, visitors: 14000, leads: 380 },
    { month: 'Apr', conversations: 2700, calls: 1100, visitors: 15000, leads: 420 },
    { month: 'May', conversations: 2800, calls: 1150, visitors: 15500, leads: 440 },
    { month: 'Jun', conversations: 2847, calls: 1234, visitors: 15678, leads: 456 }
  ];

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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Usage & Analytics</h1>
        <p className="text-gray-600 mt-2">
          Monitor your AI agent's performance and usage statistics
        </p>
      </div>

      {/* Usage Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {usageStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                {stat.icon}
              </div>
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                stat.changeType === 'positive' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-600">{stat.title}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
          </motion.div>
        ))}
      </div>

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

      {/* Monthly Trends */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Monthly Trends</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <TrendingUp className="w-4 h-4" />
            <span>Last 6 months</span>
          </div>
        </div>

        <div className="space-y-4">
          {monthlyUsage.map((month, index) => (
            <motion.div
              key={month.month}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="grid grid-cols-5 gap-4 items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900">{month.month}</div>
              <div className="text-center">
                <div className="text-sm font-semibold text-blue-600">{month.conversations.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Conversations</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-green-600">{month.calls.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Calls</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-purple-600">{month.visitors.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Visitors</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-orange-600">{month.leads.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Leads</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Performance Insights */}
      <div className="grid md:grid-cols-2 gap-6">
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

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-900">Upgrade Plan</div>
              <div className="text-sm text-gray-500">Increase your usage limits</div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-900">Export Data</div>
              <div className="text-sm text-gray-500">Download usage reports</div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-900">Set Alerts</div>
              <div className="text-sm text-gray-500">Get notified when approaching limits</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsagePage;
