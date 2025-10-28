import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Smartphone,
  Clock,
  Calendar,
  Phone,
  Users,
  CreditCard,
  Star,
  Settings,
  Save,
  RefreshCw
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../contexts/ToastContext';

interface NotificationPreferences {
  id?: string;
  // Appointment notifications
  appointment_booked: boolean;
  appointment_cancelled: boolean;
  appointment_rescheduled: boolean;
  appointment_reminder: boolean;
  
  // Call notifications
  missed_calls: boolean;
  new_voicemail: boolean;
  call_completed: boolean;
  call_failed: boolean;
  
  // Lead notifications
  new_lead: boolean;
  lead_converted: boolean;
  lead_lost: boolean;
  
  // Message notifications
  sms_received: boolean;
  sms_failed: boolean;
  whatsapp_received: boolean;
  whatsapp_failed: boolean;
  
  // Payment notifications
  payment_received: boolean;
  payment_failed: boolean;
  invoice_overdue: boolean;
  
  // System notifications
  agent_offline: boolean;
  agent_error: boolean;
  system_maintenance: boolean;
  
  // Review notifications
  review_received: boolean;
  negative_review: boolean;
  
  // Delivery methods
  email_notifications: boolean;
  sms_notifications: boolean;
  push_notifications: boolean;
  in_app_notifications: boolean;
  
  // Timing
  instant_notifications: boolean;
  daily_digest: boolean;
  weekly_digest: boolean;
  
  // Quiet hours
  quiet_hours_enabled: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
  quiet_hours_timezone: string;
  
  // Weekend settings
  weekend_notifications: boolean;
  
  // Contact info
  notification_email: string;
  notification_phone: string;
}

const NotificationPreferencesPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    appointment_booked: true,
    appointment_cancelled: true,
    appointment_rescheduled: true,
    appointment_reminder: false,
    missed_calls: true,
    new_voicemail: true,
    call_completed: false,
    call_failed: true,
    new_lead: true,
    lead_converted: true,
    lead_lost: false,
    sms_received: true,
    sms_failed: true,
    whatsapp_received: true,
    whatsapp_failed: true,
    payment_received: true,
    payment_failed: true,
    invoice_overdue: true,
    agent_offline: true,
    agent_error: true,
    system_maintenance: false,
    review_received: true,
    negative_review: true,
    email_notifications: true,
    sms_notifications: false,
    push_notifications: true,
    in_app_notifications: true,
    instant_notifications: true,
    daily_digest: false,
    weekly_digest: false,
    quiet_hours_enabled: false,
    quiet_hours_start: '22:00',
    quiet_hours_end: '08:00',
    quiet_hours_timezone: 'UTC',
    weekend_notifications: true,
    notification_email: '',
    notification_phone: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPreferences();
  }, [user]);

  const fetchPreferences = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setPreferences({
          ...preferences,
          ...data,
          quiet_hours_start: data.quiet_hours_start || '22:00',
          quiet_hours_end: data.quiet_hours_end || '08:00',
          notification_email: data.notification_email || '',
          notification_phone: data.notification_phone || ''
        });
      }
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      showToast({
        title: 'Error',
        message: 'Failed to load notification preferences',
        variant: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    if (!user?.id) return;

    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          ...preferences,
          user_id: user.id,
          updated_by: user.id
        });

      if (error) throw error;

      showToast({
        title: 'Success',
        message: 'Notification preferences saved successfully',
        variant: 'success'
      });
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      showToast({
        title: 'Error',
        message: 'Failed to save notification preferences',
        variant: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (key: keyof NotificationPreferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleInputChange = (key: keyof NotificationPreferences, value: string) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Loading preferences...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Notification Preferences</h1>
        <p className="text-gray-600 dark:text-gray-300">Customize when and how you receive notifications</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notification Types */}
        <div className="space-y-6">
          {/* Appointment Notifications */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Appointments</h3>
            </div>
            <div className="space-y-3">
              {[
                { key: 'appointment_booked', label: 'New appointment booked' },
                { key: 'appointment_cancelled', label: 'Appointment cancelled' },
                { key: 'appointment_rescheduled', label: 'Appointment rescheduled' },
                { key: 'appointment_reminder', label: 'Appointment reminders' }
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                  <input
                    type="checkbox"
                    checked={preferences[key as keyof NotificationPreferences] as boolean}
                    onChange={() => handleToggle(key as keyof NotificationPreferences)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Call Notifications */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Phone className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Calls</h3>
            </div>
            <div className="space-y-3">
              {[
                { key: 'missed_calls', label: 'Missed calls' },
                { key: 'new_voicemail', label: 'New voicemails' },
                { key: 'call_completed', label: 'Call completed' },
                { key: 'call_failed', label: 'Call failed' }
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                  <input
                    type="checkbox"
                    checked={preferences[key as keyof NotificationPreferences] as boolean}
                    onChange={() => handleToggle(key as keyof NotificationPreferences)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Lead Notifications */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Leads</h3>
            </div>
            <div className="space-y-3">
              {[
                { key: 'new_lead', label: 'New lead received' },
                { key: 'lead_converted', label: 'Lead converted' },
                { key: 'lead_lost', label: 'Lead lost' }
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                  <input
                    type="checkbox"
                    checked={preferences[key as keyof NotificationPreferences] as boolean}
                    onChange={() => handleToggle(key as keyof NotificationPreferences)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Message Notifications */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Messages</h3>
            </div>
            <div className="space-y-3">
              {[
                { key: 'sms_received', label: 'SMS received' },
                { key: 'sms_failed', label: 'SMS failed' },
                { key: 'whatsapp_received', label: 'WhatsApp received' },
                { key: 'whatsapp_failed', label: 'WhatsApp failed' }
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                  <input
                    type="checkbox"
                    checked={preferences[key as keyof NotificationPreferences] as boolean}
                    onChange={() => handleToggle(key as keyof NotificationPreferences)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Delivery Settings */}
        <div className="space-y-6">
          {/* Delivery Methods */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Delivery Methods</h3>
            </div>
            <div className="space-y-3">
              {[
                { key: 'email_notifications', label: 'Email notifications', icon: Mail },
                { key: 'sms_notifications', label: 'SMS notifications', icon: MessageSquare },
                { key: 'push_notifications', label: 'Push notifications', icon: Smartphone },
                { key: 'in_app_notifications', label: 'In-app notifications', icon: Bell }
              ].map(({ key, label, icon: Icon }) => (
                <label key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences[key as keyof NotificationPreferences] as boolean}
                    onChange={() => handleToggle(key as keyof NotificationPreferences)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Contact Information</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notification Email
                </label>
                <input
                  type="email"
                  value={preferences.notification_email}
                  onChange={(e) => handleInputChange('notification_email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notification Phone
                </label>
                <input
                  type="tel"
                  value={preferences.notification_phone}
                  onChange={(e) => handleInputChange('notification_phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* Timing Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Timing</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-3">
                {[
                  { key: 'instant_notifications', label: 'Instant notifications' },
                  { key: 'daily_digest', label: 'Daily digest' },
                  { key: 'weekly_digest', label: 'Weekly digest' },
                  { key: 'weekend_notifications', label: 'Weekend notifications' }
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                    <input
                      type="checkbox"
                      checked={preferences[key as keyof NotificationPreferences] as boolean}
                      onChange={() => handleToggle(key as keyof NotificationPreferences)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </label>
                ))}
              </div>

              {/* Quiet Hours */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                <label className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quiet Hours</span>
                  <input
                    type="checkbox"
                    checked={preferences.quiet_hours_enabled}
                    onChange={() => handleToggle('quiet_hours_enabled')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>
                {preferences.quiet_hours_enabled && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Start</label>
                      <input
                        type="time"
                        value={preferences.quiet_hours_start}
                        onChange={(e) => handleInputChange('quiet_hours_start', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">End</label>
                      <input
                        type="time"
                        value={preferences.quiet_hours_end}
                        onChange={(e) => handleInputChange('quiet_hours_end', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Categories */}
          <div className="space-y-4">
            {/* Payment Notifications */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-3 mb-3">
                <CreditCard className="w-4 h-4 text-green-600" />
                <h4 className="font-medium text-gray-900 dark:text-gray-100">Payments</h4>
              </div>
              <div className="space-y-2">
                {[
                  { key: 'payment_received', label: 'Payment received' },
                  { key: 'payment_failed', label: 'Payment failed' },
                  { key: 'invoice_overdue', label: 'Invoice overdue' }
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
                    <input
                      type="checkbox"
                      checked={preferences[key as keyof NotificationPreferences] as boolean}
                      onChange={() => handleToggle(key as keyof NotificationPreferences)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 scale-75"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* System & Reviews */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Settings className="w-4 h-4 text-gray-600" />
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">System</h4>
                </div>
                <div className="space-y-2">
                  {[
                    { key: 'agent_offline', label: 'Agent offline' },
                    { key: 'agent_error', label: 'Agent error' },
                    { key: 'system_maintenance', label: 'Maintenance' }
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center justify-between">
                      <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
                      <input
                        type="checkbox"
                        checked={preferences[key as keyof NotificationPreferences] as boolean}
                        onChange={() => handleToggle(key as keyof NotificationPreferences)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 scale-75"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-yellow-600" />
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">Reviews</h4>
                </div>
                <div className="space-y-2">
                  {[
                    { key: 'review_received', label: 'New review' },
                    { key: 'negative_review', label: 'Negative review' }
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center justify-between">
                      <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
                      <input
                        type="checkbox"
                        checked={preferences[key as keyof NotificationPreferences] as boolean}
                        onChange={() => handleToggle(key as keyof NotificationPreferences)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 scale-75"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={savePreferences}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {saving ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? 'Saving...' : 'Save Preferences'}
        </motion.button>
      </div>
    </div>
  );
};

export default NotificationPreferencesPage;
