import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Users, CreditCard, Package, BarChart3, Bell, Palette, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();

  const settingsSections = [
    {
      id: 'preferences',
      title: 'Preferences',
      description: 'Customize your experience and account settings',
      icon: <Palette className="w-6 h-6" />,
      color: 'text-purple-600 bg-purple-100',
      route: '/dashboard/settings/preferences'
    },
    {
      id: 'members',
      title: 'Members',
      description: 'Manage team members and their access levels',
      icon: <Users className="w-6 h-6" />,
      color: 'text-blue-600 bg-blue-100',
      route: '/dashboard/settings/members'
    },
    {
      id: 'plan-billing',
      title: 'Plan & Billing',
      description: 'Manage your subscription and payment information',
      icon: <CreditCard className="w-6 h-6" />,
      color: 'text-green-600 bg-green-100',
      route: '/dashboard/settings/plan-billing'
    },
    {
      id: 'packages',
      title: 'Packages',
      description: 'Browse and manage available service packages',
      icon: <Package className="w-6 h-6" />,
      color: 'text-orange-600 bg-orange-100',
      route: '/dashboard/settings/packages'
    },
    {
      id: 'usage',
      title: 'Usage',
      description: 'Monitor your AI agent\'s performance and usage',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'text-indigo-600 bg-indigo-100',
      route: '/dashboard/settings/usage'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Configure notification preferences and channels',
      icon: <Bell className="w-6 h-6" />,
      color: 'text-pink-600 bg-pink-100',
      route: '/dashboard/settings/notifications'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your account preferences and system settings
        </p>
      </div>

      {/* Settings Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <Settings className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Settings Overview</h2>
            <p className="text-sm text-gray-600">Quick access to all your settings and preferences</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {settingsSections.map((section, index) => (
            <motion.button
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(section.route)}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${section.color}`}>
                  {section.icon}
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {section.title}
                  </h3>
                  <p className="text-sm text-gray-600">{section.description}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <button 
            onClick={() => navigate('/dashboard/settings/plan-billing')}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-left">
              <h3 className="font-medium text-gray-900">Manage Billing</h3>
              <p className="text-sm text-gray-600">Update payment methods and view invoices</p>
            </div>
          </button>
          
          <button 
            onClick={() => navigate('/dashboard/settings/members')}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-left">
              <h3 className="font-medium text-gray-900">Invite Team Member</h3>
              <p className="text-sm text-gray-600">Add new members to your team</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Settings Changes</h2>
        <div className="space-y-3">
          {[
            { action: 'Notification preferences updated', time: '2 hours ago', type: 'notifications' },
            { action: 'Team member added', time: '1 day ago', type: 'members' },
            { action: 'Billing information updated', time: '3 days ago', type: 'billing' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-xs text-gray-600">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
