import AppRoutes from './routes/AppRoutes';
import PWAUpdatePrompt from './components/PWAUpdatePrompt';
import OfflineBanner from './components/OfflineBanner';

function App() {
  return (
    <>
      <OfflineBanner />
      <AppRoutes />
      <PWAUpdatePrompt />
    </>
  );
}

export default App;
