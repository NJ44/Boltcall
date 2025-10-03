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
    // Don't initialize Lenis on dashboard pages to avoid conflicts
    if (location.pathname.startsWith('/dashboard')) {
      return;
    }

    // Custom easing function as specified
    const customEasing = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

    // Initialize Lenis with the specified configuration
    const lenis = new Lenis({
      duration: 1.2,
      easing: customEasing,
      infinite: false,
      // Performance optimizations
      lerp: 0.1, // Smoother interpolation
      wheelMultiplier: 1, // Reduce wheel sensitivity
      touchMultiplier: 1.5, // Reduce touch sensitivity
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
