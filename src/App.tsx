import AppRoutes from './routes/AppRoutes';
import PWAUpdatePrompt from './components/PWAUpdatePrompt';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import OfflineBanner from './components/OfflineBanner';

function App() {
  return (
    <>
      <OfflineBanner />
      <AppRoutes />
      <PWAUpdatePrompt />
      <PWAInstallPrompt />
    </>
  );
}

export default App;
