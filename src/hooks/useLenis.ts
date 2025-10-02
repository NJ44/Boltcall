import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

// Extend Window interface to include lenis
declare global {
  interface Window {
    lenis?: Lenis;
  }
}

export const useLenis = () => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Custom easing function as specified
    const customEasing = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

    // Initialize Lenis with the specified configuration
    const lenis = new Lenis({
      duration: 1.2,
      easing: customEasing,
      touchMultiplier: 2,
      infinite: false,
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
  }, []);

  return lenisRef.current;
};
