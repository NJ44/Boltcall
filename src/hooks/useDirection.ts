import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getDirection, type TextDirection } from '../i18n';

/**
 * Returns the current text direction ('ltr' | 'rtl') based on the active i18n language.
 * Also applies `dir` and `lang` attributes to <html> and adds/removes the `rtl` class
 * so Tailwind RTL utilities work out of the box.
 */
export function useDirection(): TextDirection {
  const { i18n } = useTranslation();

  const dir = useMemo(() => {
    return getDirection(i18n.language);
  }, [i18n.language]);

  useEffect(() => {
    const html = document.documentElement;
    html.dir = dir;
    html.lang = i18n.language.split('-')[0];

    if (dir === 'rtl') {
      html.classList.add('rtl');
    } else {
      html.classList.remove('rtl');
    }
  }, [dir, i18n.language]);

  return dir;
}

export default useDirection;
