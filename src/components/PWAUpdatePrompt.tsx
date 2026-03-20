import { useRegisterSW } from 'virtual:pwa-register/react';

function PWAUpdatePrompt() {
  // Auto-update: service worker updates silently in the background
  useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      if (registration) {
        // Check for updates every 30 minutes
        setInterval(() => {
          registration.update();
        }, 30 * 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.error('SW registration error:', error);
    },
  });

  // No UI — updates happen automatically
  return null;
}

export default PWAUpdatePrompt;
