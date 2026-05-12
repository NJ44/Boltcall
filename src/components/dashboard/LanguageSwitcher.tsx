import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '../../i18n';

interface LanguageSwitcherProps {
  /** Render as a compact icon button (sidebar) or a full select (settings page) */
  variant?: 'icon' | 'select';
  /** Additional CSS class */
  className?: string;
  /** Which direction the dropdown opens ('up' for sidebar/topbar, 'down' for header nav) */
  dropdownDirection?: 'up' | 'down';
  /** Subset of language codes to show. Defaults to all supported languages. */
  visibleLanguages?: readonly string[];
  /** Light color scheme — for use over dark/image backgrounds */
  light?: boolean;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'icon',
  className = '',
  dropdownDirection = 'up',
  visibleLanguages,
  light = false,
}) => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentLang = (i18n.language || 'en').split('-')[0] as SupportedLanguage;
  const filteredLanguages = visibleLanguages
    ? SUPPORTED_LANGUAGES.filter(l => visibleLanguages.includes(l.code))
    : SUPPORTED_LANGUAGES;
  const currentMeta = filteredLanguages.find(l => l.code === currentLang) ?? filteredLanguages[0];

  const changeLanguage = (code: SupportedLanguage) => {
    i18n.changeLanguage(code);
    localStorage.setItem('i18nextLng', code);
    setOpen(false);
  };

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ---- Select variant (for settings page) ----
  if (variant === 'select') {
    return (
      <select
        value={currentLang}
        onChange={(e) => changeLanguage(e.target.value as SupportedLanguage)}
        className={`w-full px-3 py-2 border border-gray-300 dark:border-[#2a2a30] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-[#161619] text-gray-900 dark:text-white ${className}`}
      >
        {filteredLanguages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.nativeName} ({lang.name})
          </option>
        ))}
      </select>
    );
  }

  const dropdownPositionClass = dropdownDirection === 'down'
    ? 'top-full mt-2 ltr:left-0 rtl:right-0'
    : 'bottom-full mb-2 ltr:left-0 rtl:right-0';

  const triggerColorClass = light
    ? 'text-white/80 hover:text-white hover:bg-white/10'
    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-300/30 dark:hover:bg-[#1a1a1f]';

  // ---- Icon variant (for sidebar / topbar / header) ----
  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 p-2 rounded-lg transition-colors ${triggerColorClass}`}
        aria-label="Change language"
        title={currentMeta?.nativeName}
      >
        <Globe className="w-4 h-4" />
        <span className="text-xs font-medium uppercase">{currentLang}</span>
      </button>

      {open && (
        <div className={`absolute ${dropdownPositionClass} w-48 rounded-xl shadow-xl border bg-white dark:bg-[#111114] border-gray-200 dark:border-[#2a2a30] py-1 z-50 animate-in fade-in-0 zoom-in-95`}>
          {filteredLanguages.map((lang) => {
            const isActive = lang.code === currentLang;
            return (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code as SupportedLanguage)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a1a1f]'
                }`}
              >
                <span className="text-base">{lang.flag}</span>
                <div className="flex flex-col items-start">
                  <span className="font-medium">{lang.nativeName}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{lang.name}</span>
                </div>
                {isActive && <Check className="w-4 h-4 ltr:ml-auto rtl:mr-auto text-blue-600" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
