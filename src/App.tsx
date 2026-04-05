import AppRoutes from './routes/AppRoutes';
import PWAUpdatePrompt from './components/PWAUpdatePrompt';
import OfflineBanner from './components/OfflineBanner';
import { ToastProvider } from './contexts/ToastContext';

function App() {
  return (
    <ToastProvider>
      <OfflineBanner />
      <AppRoutes />
      <PWAUpdatePrompt />
    </ToastProvider>
  );
}

export default App;
