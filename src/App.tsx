import { lazy, Suspense } from 'react';
import AppRoutes from './routes/AppRoutes';
import { ToastProvider } from './contexts/ToastContext';
import EnsureImageTitles from './components/seo/EnsureImageTitles';
import CookieBanner from './components/CookieBanner';

const PWAUpdatePrompt = lazy(() => import('./components/PWAUpdatePrompt'));
const OfflineBanner = lazy(() => import('./components/OfflineBanner'));

function App() {
  return (
    <ToastProvider>
      <EnsureImageTitles />
      <Suspense fallback={null}>
        <OfflineBanner />
      </Suspense>
      <AppRoutes />
      <Suspense fallback={null}>
        <PWAUpdatePrompt />
      </Suspense>
      <CookieBanner />
    </ToastProvider>
  );
}

export default App;
