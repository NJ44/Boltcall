import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Moon, Sun, Palette, Bell, Eye, Shield, Save, RefreshCw } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { Magnetic } from '../../../components/ui/magnetic';
import { PremiumToggle } from '../../../components/ui/bouncy-toggle';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../contexts/ToastContext';
import { supabase } from '../../../lib/supabase';

const defaultPreferences = {
  theme: 'light',
  language: 'en',
  timezone: 'America/New_York',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  notifications: {
    email: true,
    push: true,
    sms: false,
    weeklyDigest: true,
    marketing: false
  },
  privacy: {
    profileVisibility: 'team',
    dataSharing: false,
    analytics: true
  },
  accessibility: {
    highContrast: false,
    reducedMotion: false,
    fontSize: 'medium'
  }
};

const PreferencesPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [businessProfileId, setBusinessProfileId] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Fetch existing preferences on mount
  // Preferences are stored as a JSON object in the business_profiles.user_preferences column.
  // If that column doesn't exist yet, the fetch will still succeed (returns null for unknown cols)
  // and we fall back to defaults.
  useEffect(() => {
    const fetchPreferences = async () => {
      if (!user?.id) return;
      try {
        const { data: profile } = await supabase
          .from('business_profiles')
          .select('id, user_preferences')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true })
          .limit(1)
          .maybeSingle();

        if (profile) {
          setBusinessProfileId(profile.id);
          if (profile.user_preferences) {
            // Deep merge with defaults so new keys are always present
            setPreferences(prev => ({
              ...prev,
              ...profile.user_preferences,
              notifications: { ...prev.notifications, ...(profile.user_preferences.notifications || {}) },
              privacy: { ...prev.privacy, ...(profile.user_preferences.privacy || {}) },
              accessibility: { ...prev.accessibility, ...(profile.user_preferences.accessibility || {}) },
            }));
          }
        }
      } catch (err) {
        console.error('Error fetching preferences:', err);
      }
    };
    fetchPreferences();
  }, [user?.id]);

  const handleSave = async () => {
    if (!user?.id) return;
    setIsSaving(true);
    try {
      if (businessProfileId) {
        const { error } = await supabase
          .from('business_profiles')
          .update({ user_preferences: preferences })
          .eq('id', businessProfileId);
        if (error) throw error;
      } else {
        // No business profile yet — create one with just preferences
        const { data: newProfile, error } = await supabase
          .from('business_profiles')
          .insert([{ user_id: user.id, business_name: 'My Business', user_preferences: preferences }])
          .select()
          .single();
        if (error) throw error;
        if (newProfile) setBusinessProfileId(newProfile.id);
      }
      showToast({ title: 'Saved', message: 'Preferences saved successfully!', variant: 'success', duration: 3000 });
      setSaveMessage('Preferences saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      console.error('Error saving preferences:', err);
      showToast({ title: 'Error', message: 'Failed to save preferences. Please try again.', variant: 'error', duration: 4000 });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreferenceChange = (section: string, key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof typeof prev] as any),
        [key]: value
      }
    }));
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' }
  ];

  const timezones = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'London (GMT)' },
    { value: 'Europe/Paris', label: 'Paris (CET)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
    { value: 'Asia/Shanghai', label: 'Shanghai (CST)' }
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
            {isSaving ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isSaving ? 'Saving...' : 'Save Changes'}
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

      {/* Appearance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <Palette className="w-4 h-4 text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Appearance</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
            <div className="space-y-2">
              {[
                { value: 'light', label: 'Light', icon: Sun },
                { value: 'dark', label: 'Dark', icon: Moon },
                { value: 'auto', label: 'Auto', icon: Globe }
              ].map((theme) => {
                const Icon = theme.icon;
                return (
                  <label key={theme.value} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="theme"
                      value={theme.value}
                      checked={preferences.theme === theme.value}
                      onChange={(e) => setPreferences(prev => ({ ...prev, theme: e.target.value }))}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <Icon className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-900">{theme.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

      <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Font Size</label>
            <select
              value={preferences.accessibility.fontSize}
              onChange={(e) => handlePreferenceChange('accessibility', 'fontSize', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="extra-large">Extra Large</option>
            </select>
          </div>
        </div>
      </div>

      {/* Language & Region */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Globe className="w-4 h-4 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Language & Region</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select
              value={preferences.language}
              onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
            <select
              value={preferences.timezone}
              onChange={(e) => setPreferences(prev => ({ ...prev, timezone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {timezones.map((tz) => (
                <option key={tz.value} value={tz.value}>{tz.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
            <select
              value={preferences.dateFormat}
              onChange={(e) => setPreferences(prev => ({ ...prev, dateFormat: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Format</label>
            <select
              value={preferences.timeFormat}
              onChange={(e) => setPreferences(prev => ({ ...prev, timeFormat: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="12h">12-hour (AM/PM)</option>
              <option value="24h">24-hour</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Bell className="w-4 h-4 text-yellow-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
        </div>

        <div className="space-y-4">
          {[
            { key: 'email', label: 'Email Notifications', description: 'Receive notifications via email' },
            { key: 'push', label: 'Push Notifications', description: 'Receive push notifications in your browser' },
            { key: 'sms', label: 'SMS Notifications', description: 'Receive notifications via SMS' },
            { key: 'weeklyDigest', label: 'Weekly Digest', description: 'Get a weekly summary of your activity' },
            { key: 'marketing', label: 'Marketing Updates', description: 'Receive updates about new features and offers' }
          ].map((notification) => (
            <div key={notification.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">{notification.label}</h3>
                <p className="text-sm text-gray-600">{notification.description}</p>
              </div>
              <PremiumToggle checked={preferences.notifications[notification.key as keyof typeof preferences.notifications]} onChange={(checked) => handlePreferenceChange('notifications', notification.key, checked)} />
            </div>
          ))}
        </div>
      </div>

      {/* Privacy & Security */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Privacy & Security</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Visibility</label>
            <select
              value={preferences.privacy.profileVisibility}
              onChange={(e) => handlePreferenceChange('privacy', 'profileVisibility', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="public">Public</option>
              <option value="team">Team Only</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Data Sharing</h3>
              <p className="text-sm text-gray-600">Allow sharing of anonymous usage data to improve our services</p>
            </div>
            <PremiumToggle checked={preferences.privacy.dataSharing} onChange={(checked) => handlePreferenceChange('privacy', 'dataSharing', checked)} />
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Analytics</h3>
              <p className="text-sm text-gray-600">Help us improve by sharing analytics data</p>
            </div>
            <PremiumToggle checked={preferences.privacy.analytics} onChange={(checked) => handlePreferenceChange('privacy', 'analytics', checked)} />
        </div>
        </div>
      </div>

      {/* Accessibility */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Eye className="w-4 h-4 text-indigo-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Accessibility</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">High Contrast Mode</h3>
              <p className="text-sm text-gray-600">Increase contrast for better readability</p>
            </div>
            <PremiumToggle checked={preferences.accessibility.highContrast} onChange={(checked) => handlePreferenceChange('accessibility', 'highContrast', checked)} />
      </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Reduced Motion</h3>
              <p className="text-sm text-gray-600">Minimize animations and transitions</p>
            </div>
            <PremiumToggle checked={preferences.accessibility.reducedMotion} onChange={(checked) => handlePreferenceChange('accessibility', 'reducedMotion', checked)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferencesPage;
