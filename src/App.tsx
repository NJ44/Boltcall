import { lazy, Suspense } from 'react';
import AppRoutes from './routes/AppRoutes';
import { ToastProvider } from './contexts/ToastContext';

const PWAUpdatePrompt = lazy(() => import('./components/PWAUpdatePrompt'));
const OfflineBanner = lazy(() => import('./components/OfflineBanner'));

function App() {
  return (
    <ToastProvider>
      <Suspense fallback={null}>
        <OfflineBanner />
      </Suspense>
      <AppRoutes />
      <Suspense fallback={null}>
        <PWAUpdatePrompt />
      </Suspense>
    </ToastProvider>
  );
}

export default App;
