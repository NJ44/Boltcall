import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Moon, Sun, Save, RefreshCw, Smartphone, Monitor, Check, Clock, Calendar, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/ui/Button';
import LanguageSwitcher from '../../../components/dashboard/LanguageSwitcher';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../contexts/ToastContext';
import { supabase } from '../../../lib/supabase';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

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

  // PWA install state
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

  useEffect(() => {
    // Check if already running as installed PWA
    if (window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Detect when app gets installed
    window.addEventListener('appinstalled', () => setIsInstalled(true));

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    setIsInstalling(true);
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        showToast({ title: 'Installed', message: 'Boltcall has been installed on your device!', variant: 'success', duration: 3000 });
      }
      setDeferredPrompt(null);
    } finally {
      setIsInstalling(false);
    }
  };

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
            const prefs = profile.user_preferences;
            setPreferences(prev => ({
              ...prev,
              ...prefs,
            }));
            // Apply saved theme on load
            if (prefs.theme === 'dark') {
              document.documentElement.classList.add('dark');
              localStorage.setItem('darkMode', 'true');
            } else if (prefs.theme === 'light') {
              document.documentElement.classList.remove('dark');
              localStorage.setItem('darkMode', 'false');
            }
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
      // Apply theme immediately
      if (preferences.theme === 'dark') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('darkMode', 'true');
      } else if (preferences.theme === 'light') {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('darkMode', 'false');
      } else {
        // Auto: follow system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.toggle('dark', prefersDark);
        localStorage.setItem('darkMode', String(prefersDark));
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

  const selectClass = "w-full h-11 px-4 pr-10 bg-white dark:bg-[#161619] border border-gray-200 dark:border-[#2a2a30] rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer outline-none";

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header with sticky save bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">Preferences</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Customize your workspace appearance and regional settings.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl shadow-sm shadow-blue-600/20 transition-all active:scale-[0.98]"
        >
          {isSaving ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaving ? t('common:saving') : t('common:saveChanges')}
        </button>
      </div>

      {/* Save success message */}
      <AnimatePresence>
        {saveMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2.5 px-4 py-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl"
          >
            <div className="flex items-center justify-center w-5 h-5 bg-emerald-500 rounded-full">
              <Check className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">{saveMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Appearance */}
      <div className="bg-white dark:bg-[#111114] rounded-2xl shadow-sm border border-gray-200 dark:border-[#2a2a30] p-6">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">{t('settings:preferences.appearance')}</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 mb-5">Choose how Boltcall looks on your device.</p>

        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('settings:preferences.theme')}</label>
        <div className="relative flex bg-gray-100 dark:bg-[#1a1a1f] rounded-xl p-1">
          {[
            { value: 'light', label: t('settings:preferences.themeLight'), icon: Sun },
            { value: 'dark', label: t('settings:preferences.themeDark'), icon: Moon },
            { value: 'auto', label: t('settings:preferences.themeAuto'), icon: Monitor },
          ].map((theme) => {
            const Icon = theme.icon;
            const isSelected = preferences.theme === theme.value;
            return (
              <button
                key={theme.value}
                onClick={() => setPreferences(prev => ({ ...prev, theme: theme.value }))}
                className={`relative flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors z-10 ${
                  isSelected ? 'text-white' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="theme-selector"
                    className="absolute inset-0 bg-blue-600 rounded-lg"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {theme.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Language & Region */}
      <div className="bg-white dark:bg-[#111114] rounded-2xl shadow-sm border border-gray-200 dark:border-[#2a2a30] p-6">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">{t('settings:preferences.languageRegion')}</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 mb-5">Set your language, timezone, and formatting preferences.</p>

        <div className="grid md:grid-cols-2 gap-5">
          {/* Language */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Globe className="w-3.5 h-3.5 text-gray-400" />
              {t('settings:preferences.language')}
            </label>
            <LanguageSwitcher variant="select" />
          </div>

          {/* Timezone */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Globe className="w-3.5 h-3.5 text-gray-400" />
              {t('settings:preferences.timezone')}
            </label>
            <div className="relative">
              <select
                value={preferences.timezone}
                onChange={(e) => setPreferences(prev => ({ ...prev, timezone: e.target.value }))}
                className={selectClass}
              >
                {timezones.map((tz) => (
                  <option key={tz.value} value={tz.value}>{tz.label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Date Format */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              {t('settings:preferences.dateFormat')}
            </label>
            <div className="relative">
              <select
                value={preferences.dateFormat}
                onChange={(e) => setPreferences(prev => ({ ...prev, dateFormat: e.target.value }))}
                className={selectClass}
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Time Format */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              {t('settings:preferences.timeFormat')}
            </label>
            <div className="relative">
              <select
                value={preferences.timeFormat}
                onChange={(e) => setPreferences(prev => ({ ...prev, timeFormat: e.target.value }))}
                className={selectClass}
              >
                <option value="12h">{t('settings:preferences.timeFormat12')}</option>
                <option value="24h">{t('settings:preferences.timeFormat24')}</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop App */}
      <div className="bg-white dark:bg-[#111114] rounded-2xl shadow-sm border border-gray-200 dark:border-[#2a2a30] p-6">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Desktop App</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Install Boltcall as a native-like app on your device.</p>

        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#161619] border border-gray-200 dark:border-[#2a2a30] rounded-xl">
          <div className="flex items-center gap-4">
            <img src="/boltcall_icon.png" alt="Boltcall" className="w-12 h-12 rounded-xl" loading="lazy" />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Install Boltcall</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isInstalled
                  ? 'Boltcall is installed on your device.'
                  : isIOS
                    ? 'Tap the share button in Safari, then "Add to Home Screen".'
                    : 'Install Boltcall as a desktop app for quick access.'}
              </p>
            </div>
          </div>

          {isInstalled ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-medium rounded-lg">
              <Check className="w-4 h-4" />
              Installed
            </span>
          ) : !isIOS && deferredPrompt ? (
            <Button
              variant="primary"
              onClick={handleInstallApp}
              disabled={isInstalling}
            >
              <Smartphone className="w-4 h-4 mr-2" />
              {isInstalling ? 'Installing...' : 'Install'}
            </Button>
          ) : !isIOS ? (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Not available in this browser
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default PreferencesPage;
