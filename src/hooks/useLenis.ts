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

    // RequestAnimationFrame loop for smooth performance
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup function
    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
        delete window.lenis;
      }
    };
  }, [location.pathname]);

  return lenisRef.current;
};
