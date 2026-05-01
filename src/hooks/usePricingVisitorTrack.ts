import { useEffect, useRef } from 'react';

const THRESHOLD_MS = 120_000; // 2 minutes
const SESSION_KEY = 'bc_pricing_tracked';
const FP_KEY = 'bc_fp';

function getFingerprint(): string {
  let fp = sessionStorage.getItem(FP_KEY);
  if (!fp) {
    fp = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem(FP_KEY, fp);
  }
  return fp;
}

export function usePricingVisitorTrack() {
  const convertedRef = useRef(false);
  const firedRef = useRef(false);

  useEffect(() => {
    // Don't double-fire within the same browser session
    if (sessionStorage.getItem(SESSION_KEY)) return;

    const startTime = Date.now();

    // Intercept React Router pushState to detect conversion navigations
    const origPushState = window.history.pushState.bind(window.history);
    window.history.pushState = function (...args) {
      const url = String(args[2] ?? '');
      if (url.includes('/signup') || url.includes('/book-a-call')) {
        convertedRef.current = true;
      }
      return origPushState(...args);
    };

    const fire = async (converted: boolean) => {
      if (firedRef.current) return;
      firedRef.current = true;
      sessionStorage.setItem(SESSION_KEY, '1');

      const sessionDuration = Math.round((Date.now() - startTime) / 1000);
      try {
        await fetch('/.netlify/functions/track-pricing-visit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionDuration,
            converted,
            referrer: document.referrer,
            fingerprint: getFingerprint(),
          }),
        });
      } catch {
        // fail silently — never break the page
      }
    };

    const timer = setTimeout(() => fire(convertedRef.current), THRESHOLD_MS);

    return () => {
      clearTimeout(timer);
      window.history.pushState = origPushState;
    };
  }, []);
}
