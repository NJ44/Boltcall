import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Moon, Sun, Palette, Save, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/ui/Button';
import LanguageSwitcher from '../../../components/dashboard/LanguageSwitcher';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../contexts/ToastContext';
import { supabase } from '../../../lib/supabase';

const defaultPreferences = {
  theme: 'light',
  language: 'en',
  timezone: 'America/New_York',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
};

const PreferencesPage: React.FC = () => {
  const { t, i18n } = useTranslation(['settings', 'common']);
  const { user } = useAuth();
  const { showToast } = useToast();
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [businessProfileId, setBusinessProfileId] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Sync language preference from i18n on mount
  useEffect(() => {
    const lang = (i18n.language || 'en').split('-')[0];
    setPreferences(prev => ({ ...prev, language: lang }));
  }, [i18n.language]);

  // Fetch existing preferences on mount
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
            setPreferences(prev => ({
              ...prev,
              ...profile.user_preferences,
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
        const { data: newProfile, error } = await supabase
          .from('business_profiles')
          .insert([{ user_id: user.id, business_name: 'My Business', user_preferences: preferences }])
          .select()
          .single();
        if (error) throw error;
        if (newProfile) setBusinessProfileId(newProfile.id);
      }
      showToast({ title: t('common:save'), message: t('settings:prefsSavedSuccess'), variant: 'success', duration: 3000 });
      setSaveMessage(t('settings:prefsSavedSuccess'));
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      console.error('Error saving preferences:', err);
      showToast({ title: t('common:error'), message: t('settings:prefsSaveError'), variant: 'error', duration: 4000 });
    } finally {
      setIsSaving(false);
    }
  };

  const timezones = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'London (GMT)' },
    { value: 'Europe/Paris', label: 'Paris (CET)' },
    { value: 'Asia/Jerusalem', label: 'Jerusalem (IST)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
    { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
    { value: 'America/Mexico_City', label: 'Mexico City (CST)' },
    { value: 'America/Bogota', label: 'Bogota (COT)' },
    { value: 'America/Buenos_Aires', label: 'Buenos Aires (ART)' },
    { value: 'Europe/Madrid', label: 'Madrid (CET)' },
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
          {isSaving ? (
            <RefreshCw className="w-4 h-4 ltr:mr-2 rtl:ml-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
          )}
          {isSaving ? t('common:saving') : t('common:saveChanges')}
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

      {/* Appearance */}
      <div className="bg-white dark:bg-[#111114] rounded-xl shadow-sm border border-gray-200 dark:border-[#2a2a30] p-4 md:p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
            <Palette className="w-4 h-4 text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('settings:preferences.appearance')}</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('settings:preferences.theme')}</label>
            <div className="space-y-2">
              {[
                { value: 'light', label: t('settings:preferences.themeLight'), icon: Sun },
                { value: 'dark', label: t('settings:preferences.themeDark'), icon: Moon },
                { value: 'auto', label: t('settings:preferences.themeAuto'), icon: Globe }
              ].map((theme) => {
                const Icon = theme.icon;
                return (
                  <label key={theme.value} className="flex items-center gap-3 p-3 border border-gray-200 dark:border-[#2a2a30] rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-[#1a1a1f]">
                    <input
                      type="radio"
                      name="theme"
                      value={theme.value}
                      checked={preferences.theme === theme.value}
                      onChange={(e) => setPreferences(prev => ({ ...prev, theme: e.target.value }))}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{theme.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Language & Region */}
      <div className="bg-white dark:bg-[#111114] rounded-xl shadow-sm border border-gray-200 dark:border-[#2a2a30] p-4 md:p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <Globe className="w-4 h-4 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('settings:preferences.languageRegion')}</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings:preferences.language')}</label>
            <LanguageSwitcher variant="select" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings:preferences.timezone')}</label>
            <select
              value={preferences.timezone}
              onChange={(e) => setPreferences(prev => ({ ...prev, timezone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-[#2a2a30] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-[#161619] text-gray-900 dark:text-white"
            >
              {timezones.map((tz) => (
                <option key={tz.value} value={tz.value}>{tz.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings:preferences.dateFormat')}</label>
            <select
              value={preferences.dateFormat}
              onChange={(e) => setPreferences(prev => ({ ...prev, dateFormat: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-[#2a2a30] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-[#161619] text-gray-900 dark:text-white"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings:preferences.timeFormat')}</label>
            <select
              value={preferences.timeFormat}
              onChange={(e) => setPreferences(prev => ({ ...prev, timeFormat: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-[#2a2a30] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-[#161619] text-gray-900 dark:text-white"
            >
              <option value="12h">{t('settings:preferences.timeFormat12')}</option>
              <option value="24h">{t('settings:preferences.timeFormat24')}</option>
            </select>
          </div>
        </div>
      </div>

    </div>
  );
};

export default PreferencesPage;
