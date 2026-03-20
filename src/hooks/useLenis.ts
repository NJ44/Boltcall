import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';

// Extend Window interface to include lenis
declare global {
  interface Window {
    lenis?: Lenis;
  }
}

export const useLenis = () => {
  const lenisRef = useRef<Lenis | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Only initialize Lenis on homepage and marketing pages
    // Disable on dashboard, login, signup, and other app pages
    const isDashboardPage = location.pathname.startsWith('/dashboard');
    const isAppPage = ['/login', '/signup', '/setup'].includes(location.pathname);

    if (isDashboardPage || isAppPage) {
      return;
    }

    // Respect user's reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    // Custom easing function as specified
    const customEasing = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

    // Initialize Lenis with the specified configuration
    const lenis = new Lenis({
      duration: 1.5,
      easing: customEasing,
      infinite: false,
      // Performance optimizations for smoother scrolling
      lerp: 0.15, // Smoother interpolation (higher = smoother)
      wheelMultiplier: 0.8, // Lower wheel sensitivity
      touchMultiplier: 1.2, // Lower touch sensitivity
      smoothWheel: true, // Enable smooth wheel scrolling
    });

    // Store the instance globally
    window.lenis = lenis;
    lenisRef.current = lenis;

    // RAF loop that pauses when tab is hidden
    let rafId: number;
    let isRunning = true;

    function raf(time: number) {
      if (isRunning) {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      }
    }

    rafId = requestAnimationFrame(raf);

    // Pause/resume when tab visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isRunning = false;
        cancelAnimationFrame(rafId);
      } else {
        isRunning = true;
        rafId = requestAnimationFrame(raf);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup function
    return () => {
      isRunning = false;
      cancelAnimationFrame(rafId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
        delete window.lenis;
      }
    };
  }, [location.pathname]);

  return lenisRef.current;
};
