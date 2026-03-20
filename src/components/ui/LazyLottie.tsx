/**
 * LazyLottie - Lazy-loaded wrapper for DotLottieReact.
 * Prevents the 540KB dotlottie-player.wasm from loading on initial page load.
 * Only loads when the component enters the viewport.
 */
import React, { Suspense, useState, useEffect, useRef } from 'react';

// Lazy import of the actual Lottie component
const DotLottieReactLazy = React.lazy(() =>
  import('@lottiefiles/dotlottie-react').then(m => ({ default: m.DotLottieReact }))
);

interface LazyLottieProps {
  src: string;
  loop?: boolean;
  autoplay?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

const LazyLottie: React.FC<LazyLottieProps> = ({ src, loop, autoplay, style, className }) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Use IntersectionObserver to only load when near viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // Start loading 200px before entering viewport
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={className} style={style}>
      {isVisible && (
        <Suspense fallback={<div style={{ width: '100%', height: '100%' }} />}>
          <DotLottieReactLazy
            src={src}
            loop={loop}
            autoplay={autoplay}
            style={{ width: '100%', height: '100%' }}
          />
        </Suspense>
      )}
    </div>
  );
};

export default LazyLottie;
