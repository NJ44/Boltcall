import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n';
import './index.css'
import './styles/nav.css'
import App from './App.tsx'
import i18n from './i18n';
import { detectCountryCode } from './utils/geoDetect';

// Auto-switch to Hebrew for Israeli visitors (only if no explicit preference is saved)
const savedLang = localStorage.getItem('i18nextLng');
if (!savedLang) {
  detectCountryCode().then((cc) => {
    if (cc === 'IL' && !localStorage.getItem('i18nextLng')) {
      i18n.changeLanguage('he');
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
