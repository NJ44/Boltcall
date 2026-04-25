import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function isIOS(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
}

function isInStandaloneMode(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true;
}

function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);

  useEffect(() => {
    // Don't show if already installed
    if (isInStandaloneMode()) return;

    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedAt = parseInt(dismissed, 10);
      if (Date.now() - dismissedAt < 7 * 24 * 60 * 60 * 1000) return;
    }

    // iOS: no beforeinstallprompt, show manual instructions
    if (isIOS()) {
      setIsIOSDevice(true);
      setTimeout(() => setShowPrompt(true), 5000);
      return;
    }

    // Android/Desktop: use beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowPrompt(true), 5000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  if (!showPrompt) return null;
  if (!isIOSDevice && !deferredPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:right-auto z-[9999] bg-white border border-blue-200 rounded-xl shadow-2xl p-4 max-w-sm animate-in slide-in-from-bottom-4">
      <div className="flex items-start gap-3">
        <img src="/boltcall_icon.png" alt="Boltcall" className="w-12 h-12 rounded-xl" width={48} height={48} loading="lazy" decoding="async" />
        <div className="flex-1">
          <p className="font-semibold text-gray-900 text-sm">Install Boltcall</p>
          {isIOSDevice ? (
            <p className="text-gray-500 text-xs mt-0.5">
              Tap <span className="inline-block mx-0.5">
                <svg className="inline w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              </span> then <strong>"Add to Home Screen"</strong> for quick access.
            </p>
          ) : (
            <p className="text-gray-500 text-xs mt-0.5">Add to your home screen for quick access to your dashboard.</p>
          )}
          <div className="flex gap-2 mt-3">
            {!isIOSDevice && (
              <button
                onClick={handleInstall}
                className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Install App
              </button>
            )}
            <button
              onClick={handleDismiss}
              className="px-3 py-1.5 text-gray-500 text-xs font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isIOSDevice ? 'Got it' : 'Not Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PWAInstallPrompt;
