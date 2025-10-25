import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Mail, Phone, MessageSquare, Calendar, AlertTriangle, CheckCircle, Settings, Volume2, VolumeX, Clock } from 'lucide-react';
import Button from '../../../components/ui/Button';
import CardTable from '../../../components/ui/CardTable';

const NotificationPage: React.FC = () => {
  const [notificationSettings, setNotificationSettings] = useState({
    general: {
      enableNotifications: true,
      soundEnabled: true,
      vibrationEnabled: true
    },
    channels: {
      email: {
        enabled: true,
        newLead: true,
        appointmentBooked: true,
        appointmentCancelled: true,
        missedCall: true,
        systemAlerts: true,
        weeklyDigest: true,
        marketing: false
      },
      push: {
        enabled: true,
        newLead: true,
        appointmentBooked: true,
        appointmentCancelled: true,
        missedCall: true,
        systemAlerts: true
      },
      sms: {
        enabled: false,
        newLead: false,
        appointmentBooked: false,
        appointmentCancelled: false,
        missedCall: true,
        systemAlerts: false
      }
    },
    timing: {
      quietHours: {
        enabled: true,
        start: '22:00',
        end: '08:00'
      },
      timezone: 'America/New_York'
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveMessage('Notification settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    }, 1000);
  };

  const handleSettingChange = (path: string[], value: any) => {
    setNotificationSettings(prev => {
      const newSettings = { ...prev };
      let current = newSettings as any;
      
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      
      current[path[path.length - 1]] = value;
      return newSettings;
    });
  };

  const notificationTypes = [
    {
      key: 'newLead',
      title: 'New Lead',
      description: 'When a new lead is captured',
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'text-green-600 bg-green-100'
    },
    {
      key: 'appointmentBooked',
      title: 'Appointment Booked',
      description: 'When someone books an appointment',
      icon: <Calendar className="w-5 h-5" />,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      key: 'appointmentCancelled',
      title: 'Appointment Cancelled',
      description: 'When an appointment is cancelled',
      icon: <Calendar className="w-5 h-5" />,
      color: 'text-orange-600 bg-orange-100'
    },
    {
      key: 'missedCall',
      title: 'Missed Call',
      description: 'When a call is missed',
      icon: <Phone className="w-5 h-5" />,
      color: 'text-red-600 bg-red-100'
    },
    {
      key: 'systemAlerts',
      title: 'System Alerts',
      description: 'Important system notifications',
      icon: <AlertTriangle className="w-5 h-5" />,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      key: 'weeklyDigest',
      title: 'Weekly Digest',
      description: 'Weekly summary of activities',
      icon: <MessageSquare className="w-5 h-5" />,
      color: 'text-indigo-600 bg-indigo-100'
    },
    {
      key: 'marketing',
      title: 'Marketing Updates',
      description: 'Updates about new features and offers',
      icon: <Bell className="w-5 h-5" />,
      color: 'text-pink-600 bg-pink-100'
    }
  ];

  const channels = [
    {
      key: 'email',
      name: 'Email',
      icon: <Mail className="w-5 h-5" />,
      description: 'Receive notifications via email',
      color: 'text-blue-600 bg-blue-100'
    },
    {
      key: 'push',
      name: 'Push Notifications',
      icon: <Bell className="w-5 h-5" />,
      description: 'Browser push notifications',
      color: 'text-green-600 bg-green-100'
    },
    {
      key: 'sms',
      name: 'SMS',
      icon: <Phone className="w-5 h-5" />,
      description: 'Text message notifications',
      color: 'text-orange-600 bg-orange-100'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={isSaving}
        >
          <Settings className="w-4 h-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      {saveMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-800 font-medium">{saveMessage}</span>
          </div>
        </motion.div>
      )}

      {/* General Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Settings className="w-4 h-4 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">General Settings</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Enable Notifications</h3>
              <p className="text-sm text-gray-600">Master switch for all notifications</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.general.enableNotifications}
                onChange={(e) => handleSettingChange(['general', 'enableNotifications'], e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              {notificationSettings.general.soundEnabled ? (
                <Volume2 className="w-5 h-5 text-blue-600" />
              ) : (
                <VolumeX className="w-5 h-5 text-gray-400" />
              )}
              <div>
                <h3 className="font-medium text-gray-900">Sound Notifications</h3>
                <p className="text-sm text-gray-600">Play sound when notifications arrive</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.general.soundEnabled}
                onChange={(e) => handleSettingChange(['general', 'soundEnabled'], e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Vibration</h3>
              <p className="text-sm text-gray-600">Vibrate device for notifications</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.general.vibrationEnabled}
                onChange={(e) => handleSettingChange(['general', 'vibrationEnabled'], e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Channel Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <Bell className="w-4 h-4 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Notification Channels</h2>
        </div>

        <div className="space-y-6">
          {channels.map((channel) => (
            <div key={channel.key} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${channel.color}`}>
                    {channel.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{channel.name}</h3>
                    <p className="text-sm text-gray-600">{channel.description}</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings.channels[channel.key as keyof typeof notificationSettings.channels].enabled}
                    onChange={(e) => handleSettingChange(['channels', channel.key, 'enabled'], e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {notificationSettings.channels[channel.key as keyof typeof notificationSettings.channels].enabled && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {notificationTypes.map((type) => (
                    <div key={type.key} className="flex items-center gap-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.channels[channel.key as keyof typeof notificationSettings.channels][type.key as keyof typeof notificationSettings.channels[keyof typeof notificationSettings.channels]]}
                          onChange={(e) => handleSettingChange(['channels', channel.key, type.key], e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-4 h-4 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded peer peer-checked:bg-blue-600"></div>
                      </label>
                      <span className="text-sm text-gray-700">{type.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quiet Hours */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <Clock className="w-4 h-4 text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Quiet Hours</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Enable Quiet Hours</h3>
              <p className="text-sm text-gray-600">Pause notifications during specified hours</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.timing.quietHours.enabled}
                onChange={(e) => handleSettingChange(['timing', 'quietHours', 'enabled'], e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {notificationSettings.timing.quietHours.enabled && (
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                <input
                  type="time"
                  value={notificationSettings.timing.quietHours.start}
                  onChange={(e) => handleSettingChange(['timing', 'quietHours', 'start'], e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                <input
                  type="time"
                  value={notificationSettings.timing.quietHours.end}
                  onChange={(e) => handleSettingChange(['timing', 'quietHours', 'end'], e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Test Notifications */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Bell className="w-4 h-4 text-yellow-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Test Notifications</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {notificationTypes.slice(0, 4).map((type) => (
            <button
              key={type.key}
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${type.color}`}>
                {type.icon}
              </div>
              <div className="text-left">
                <h3 className="font-medium text-gray-900">{type.title}</h3>
                <p className="text-sm text-gray-600">Send test notification</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Notifications Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-8"
      >
        <CardTable
          data={[]}
          columns={[
            { key: 'type', label: 'Notification Type', width: '25%' },
            { key: 'message', label: 'Message', width: '40%' },
            { key: 'channel', label: 'Channel', width: '15%' },
            { key: 'status', label: 'Status', width: '10%' },
            { key: 'timestamp', label: 'Time', width: '10%' }
          ]}
          renderRow={(notification) => (
            <div className="flex items-center gap-6">
              {/* Checkbox */}
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              
              {/* Notification Type */}
              <div className="flex items-center gap-3 flex-1">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Bell className="w-4 h-4 text-blue-600" />
                </div>
                <div className="font-medium text-gray-900">{notification.type}</div>
              </div>
              
              {/* Message */}
              <div className="text-sm text-gray-600 flex-1 truncate">
                {notification.message}
              </div>
              
              {/* Channel */}
              <div className="text-sm text-gray-500 flex-1">
                {notification.channel}
              </div>
              
              {/* Status */}
              <div className="flex-1">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  notification.status === 'Sent' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {notification.status}
                </span>
              </div>
              
              {/* Timestamp */}
              <div className="text-sm text-gray-500 flex-1">
                {notification.timestamp}
              </div>
            </div>
          )}
          emptyStateText="No notifications found"
          emptyStateAnimation="/No_Data_Preview.lottie"
          onAddNew={() => console.log('Add new notification')}
          addNewText="Send Test Notification"
        />
      </motion.div>
    </div>
  );
};

export default NotificationPage;
