import React, { useState, useEffect } from 'react';
import { Bell, Mail, Phone, MessageSquare, Calendar, AlertTriangle, CheckCircle, Volume2, VolumeX, Clock } from 'lucide-react';
import { PremiumToggle } from '../../../components/ui/bouncy-toggle';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../contexts/ToastContext';
import { supabase } from '../../../lib/supabase';
import { UnsavedChanges } from '../../../components/ui/unsaved-changes';

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

const notificationTypes = [
  { key: 'newLead', title: 'New Lead', icon: CheckCircle, color: 'text-green-600 bg-green-50' },
  { key: 'appointmentBooked', title: 'Appointment Booked', icon: Calendar, color: 'text-blue-600 bg-blue-50' },
  { key: 'appointmentCancelled', title: 'Appointment Cancelled', icon: Calendar, color: 'text-orange-600 bg-orange-50' },
  { key: 'missedCall', title: 'Missed Call', icon: Phone, color: 'text-red-600 bg-red-50' },
  { key: 'systemAlerts', title: 'System Alerts', icon: AlertTriangle, color: 'text-purple-600 bg-purple-50' },
  { key: 'weeklyDigest', title: 'Weekly Digest', icon: MessageSquare, color: 'text-indigo-600 bg-indigo-50' },
  { key: 'marketing', title: 'Marketing Updates', icon: Bell, color: 'text-pink-600 bg-pink-50' },
];

const channels = [
  { key: 'email', name: 'Email', icon: Mail, description: 'Receive notifications via email', accentColor: 'bg-blue-100 text-blue-600' },
  { key: 'push', name: 'Push Notifications', icon: Bell, description: 'Browser push notifications', accentColor: 'bg-green-100 text-green-600' },
  { key: 'sms', name: 'SMS', icon: Phone, description: 'Text message notifications', accentColor: 'bg-orange-100 text-orange-600' },
];

const NotificationPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [settings, setSettings] = useState(defaultNotificationSettings);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(false);

  useEffect(() => {
    const fetchPrefs = async () => {
      if (!user?.id) return;
      try {
        const { data } = await supabase
          .from('notification_preferences')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        if (data) {
          setSettings({
            general: {
              enableNotifications: true,
              soundEnabled: data.push_notifications ?? true,
              vibrationEnabled: true,
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
    fetchPrefs();
  }, [user?.id]);

  const handleSave = async () => {
    if (!user?.id) return;
    setIsSaving(true);
    try {
      const s = settings;
      const payload = {
        user_id: user.id,
        email_notifications: s.channels.email.enabled,
        sms_notifications: s.channels.sms.enabled,
        push_notifications: s.channels.push.enabled,
        in_app_notifications: true,
        new_lead: s.channels.email.newLead || s.channels.push.newLead || s.channels.sms.newLead,
        appointment_booked: s.channels.email.appointmentBooked || s.channels.push.appointmentBooked || s.channels.sms.appointmentBooked,
        appointment_cancelled: s.channels.email.appointmentCancelled || s.channels.push.appointmentCancelled || s.channels.sms.appointmentCancelled,
        missed_calls: s.channels.email.missedCall || s.channels.push.missedCall || s.channels.sms.missedCall,
        system_maintenance: s.channels.email.systemAlerts || s.channels.push.systemAlerts,
        weekly_digest: s.channels.email.weeklyDigest ?? true,
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
      showToast({ title: 'Saved', message: 'Notification settings saved!', variant: 'success', duration: 3000 });
      setSaveSuccess(true);
      setTimeout(() => { setSaveSuccess(false); setIsDirty(false); }, 2000);
    } catch (err) {
      console.error('Error saving notification settings:', err);
      showToast({ title: 'Error', message: 'Failed to save. Please try again.', variant: 'error', duration: 4000 });
      setSaveError(true);
      setTimeout(() => setSaveError(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (path: string[], value: any) => {
    setSettings(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      let cur = next as any;
      for (let i = 0; i < path.length - 1; i++) cur = cur[path[i]];
      cur[path[path.length - 1]] = value;
      return next;
    });
    setIsDirty(true);
  };

  return (
    <div className="space-y-6">
      {/* General */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">General</h2>
          <p className="text-xs text-gray-500 mt-0.5">Master notification controls</p>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="text-sm font-medium text-gray-900">Enable Notifications</p>
              <p className="text-xs text-gray-500 mt-0.5">Master switch for all notifications</p>
            </div>
            <PremiumToggle checked={settings.general.enableNotifications} onChange={(v) => handleChange(['general', 'enableNotifications'], v)} />
          </div>
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2">
              {settings.general.soundEnabled ? <Volume2 className="w-4 h-4 text-blue-500" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
              <div>
                <p className="text-sm font-medium text-gray-900">Sound</p>
                <p className="text-xs text-gray-500 mt-0.5">Play sound when notifications arrive</p>
              </div>
            </div>
            <PremiumToggle checked={settings.general.soundEnabled} onChange={(v) => handleChange(['general', 'soundEnabled'], v)} />
          </div>
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="text-sm font-medium text-gray-900">Vibration</p>
              <p className="text-xs text-gray-500 mt-0.5">Vibrate device for notifications</p>
            </div>
            <PremiumToggle checked={settings.general.vibrationEnabled} onChange={(v) => handleChange(['general', 'vibrationEnabled'], v)} />
          </div>
        </div>
      </div>

      {/* Channels */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-gray-900">Notification Channels</h2>
        {channels.map((ch) => {
          const ChIcon = ch.icon;
          const channelSettings = settings.channels[ch.key as keyof typeof settings.channels];
          return (
            <div key={ch.key} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${ch.accentColor}`}>
                    <ChIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{ch.name}</p>
                    <p className="text-xs text-gray-500">{ch.description}</p>
                  </div>
                </div>
                <PremiumToggle
                  checked={channelSettings.enabled}
                  onChange={(v) => handleChange(['channels', ch.key, 'enabled'], v)}
                />
              </div>
              {channelSettings.enabled && (
                <div className="px-6 py-4">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Notify me for</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {notificationTypes.map((type) => {
                      const TypeIcon = type.icon;
                      const checked = (channelSettings as any)[type.key] ?? false;
                      return (
                        <label
                          key={type.key}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                            checked ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => handleChange(['channels', ch.key, type.key], e.target.checked)}
                            className="sr-only"
                          />
                          <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${checked ? 'bg-blue-600' : 'bg-white border border-gray-300'}`}>
                            {checked && <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 12 12"><path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
                          </div>
                          <span className="text-xs font-medium text-gray-700">{type.title}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quiet Hours */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-500" />
            <h2 className="text-sm font-semibold text-gray-900">Quiet Hours</h2>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">Pause notifications during specified hours</p>
        </div>
        <div className="px-6 py-4 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900">Enable Quiet Hours</p>
            <PremiumToggle checked={settings.timing.quietHours.enabled} onChange={(v) => handleChange(['timing', 'quietHours', 'enabled'], v)} />
          </div>
          {settings.timing.quietHours.enabled && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Start Time</label>
                <input
                  type="time"
                  value={settings.timing.quietHours.start}
                  onChange={(e) => handleChange(['timing', 'quietHours', 'start'], e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">End Time</label>
                <input
                  type="time"
                  value={settings.timing.quietHours.end}
                  onChange={(e) => handleChange(['timing', 'quietHours', 'end'], e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <UnsavedChanges
        open={isDirty}
        isSaving={isSaving}
        success={saveSuccess}
        error={saveError}
        onReset={() => { setIsDirty(false); window.location.reload(); }}
        onSave={handleSave}
      />
    </div>
  );
};

export default NotificationPage;
