import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Mail, Phone, MessageSquare, Calendar, AlertTriangle, CheckCircle, Settings, Volume2, VolumeX, Clock } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { PremiumToggle } from '../../../components/ui/bouncy-toggle';
import CardTable from '../../../components/ui/CardTable';
import { Magnetic } from '../../../components/ui/magnetic';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../contexts/ToastContext';
import { supabase } from '../../../lib/supabase';

const defaultNotificationSettings = {
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
};

const NotificationPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [notificationSettings, setNotificationSettings] = useState(defaultNotificationSettings);

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Fetch existing notification preferences on mount.
  // We use the notification_preferences table which has dedicated boolean columns.
  // We map them to our local UI state shape.
  useEffect(() => {
    const fetchNotificationPrefs = async () => {
      if (!user?.id) return;
      try {
        const { data } = await supabase
          .from('notification_preferences')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (data) {
          setNotificationSettings({
            general: {
              enableNotifications: true, // master switch not in DB, default true
              soundEnabled: data.push_notifications ?? true,
              vibrationEnabled: true, // no DB column, default true
            },
            channels: {
              email: {
                enabled: data.email_notifications ?? true,
                newLead: data.new_lead ?? true,
                appointmentBooked: data.appointment_booked ?? true,
                appointmentCancelled: data.appointment_cancelled ?? true,
                missedCall: data.missed_calls ?? true,
                systemAlerts: data.system_maintenance ?? true,
                weeklyDigest: data.weekly_digest ?? true,
                marketing: false,
              },
              push: {
                enabled: data.push_notifications ?? true,
                newLead: data.new_lead ?? true,
                appointmentBooked: data.appointment_booked ?? true,
                appointmentCancelled: data.appointment_cancelled ?? true,
                missedCall: data.missed_calls ?? true,
                systemAlerts: data.system_maintenance ?? true,
              },
              sms: {
                enabled: data.sms_notifications ?? false,
                newLead: data.sms_notifications ? (data.new_lead ?? false) : false,
                appointmentBooked: data.sms_notifications ? (data.appointment_booked ?? false) : false,
                appointmentCancelled: data.sms_notifications ? (data.appointment_cancelled ?? false) : false,
                missedCall: data.missed_calls ?? true,
                systemAlerts: false,
              },
            },
            timing: {
              quietHours: {
                enabled: data.quiet_hours_enabled ?? true,
                start: data.quiet_hours_start || '22:00',
                end: data.quiet_hours_end || '08:00',
              },
              timezone: data.quiet_hours_timezone || 'America/New_York',
            },
          });
        }
      } catch (err) {
        console.error('Error fetching notification preferences:', err);
      }
    };
    fetchNotificationPrefs();
  }, [user?.id]);

  const handleSave = async () => {
    if (!user?.id) return;
    setIsSaving(true);
    try {
      const s = notificationSettings;
      const payload = {
        user_id: user.id,
        // Delivery methods
        email_notifications: s.channels.email.enabled,
        sms_notifications: s.channels.sms.enabled,
        push_notifications: s.channels.push.enabled,
        in_app_notifications: true,
        // Notification types (combine across channels — if enabled in any channel)
        new_lead: s.channels.email.newLead || s.channels.push.newLead || s.channels.sms.newLead,
        appointment_booked: s.channels.email.appointmentBooked || s.channels.push.appointmentBooked || s.channels.sms.appointmentBooked,
        appointment_cancelled: s.channels.email.appointmentCancelled || s.channels.push.appointmentCancelled || s.channels.sms.appointmentCancelled,
        missed_calls: s.channels.email.missedCall || s.channels.push.missedCall || s.channels.sms.missedCall,
        system_maintenance: s.channels.email.systemAlerts || s.channels.push.systemAlerts,
        weekly_digest: s.channels.email.weeklyDigest ?? true,
        // Timing
        quiet_hours_enabled: s.timing.quietHours.enabled,
        quiet_hours_start: s.timing.quietHours.start,
        quiet_hours_end: s.timing.quietHours.end,
        quiet_hours_timezone: s.timing.timezone,
        weekend_notifications: true,
        instant_notifications: true,
        daily_digest: false,
      };

      const { error } = await supabase
        .from('notification_preferences')
        .upsert(payload, { onConflict: 'user_id' });

      if (error) throw error;

      showToast({ title: 'Saved', message: 'Notification settings saved successfully!', variant: 'success', duration: 3000 });
      setSaveMessage('Notification settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      console.error('Error saving notification settings:', err);
      showToast({ title: 'Error', message: 'Failed to save notification settings. Please try again.', variant: 'error', duration: 4000 });
    } finally {
      setIsSaving(false);
    }
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
        <Magnetic>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isSaving}
          >
            <Settings className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </Magnetic>
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
            <PremiumToggle checked={notificationSettings.general.enableNotifications} onChange={(checked) => handleSettingChange(['general', 'enableNotifications'], checked)} />
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
            <PremiumToggle checked={notificationSettings.general.soundEnabled} onChange={(checked) => handleSettingChange(['general', 'soundEnabled'], checked)} />
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Vibration</h3>
              <p className="text-sm text-gray-600">Vibrate device for notifications</p>
            </div>
            <PremiumToggle checked={notificationSettings.general.vibrationEnabled} onChange={(checked) => handleSettingChange(['general', 'vibrationEnabled'], checked)} />
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
                <PremiumToggle checked={notificationSettings.channels[channel.key as keyof typeof notificationSettings.channels].enabled} onChange={(checked) => handleSettingChange(['channels', channel.key, 'enabled'], checked)} />
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
            <PremiumToggle checked={notificationSettings.timing.quietHours.enabled} onChange={(checked) => handleSettingChange(['timing', 'quietHours', 'enabled'], checked)} />
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
          onAddNew={() => {}}
          addNewText="Send Test Notification"
        />
      </motion.div>
    </div>
  );
};

export default NotificationPage;
