/**
 * LazySection — viewport-gated section wrapper.
 *
 * Prevents React from rendering (and therefore fetching) lazy-loaded
 * components until they're near the viewport. Without this, a page with
 * multiple React.lazy() sections starts downloading ALL their JS chunks
 * the moment the page loads, even for content far below the fold.
 *
 * Usage:
 *   <LazySection minHeight="400px">
 *     <Suspense fallback={<div className="h-[400px]" />}>
 *       <HeavyComponent />
 *     </Suspense>
 *   </LazySection>
 */
import React, { useState, useEffect, useRef } from 'react';

interface LazySectionProps {
  children: React.ReactNode;
  /** CSS min-height to hold space while the section hasn't loaded yet. */
  minHeight?: string;
  /** How far outside the viewport to start loading (default 400px). */
  rootMargin?: string;
  className?: string;
}

const LazySection: React.FC<LazySectionProps> = ({
  children,
  minHeight,
  rootMargin = '400px',
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If IntersectionObserver isn't available (very old browser) just show immediately.
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} className={className} style={minHeight && !isVisible ? { minHeight } : undefined}>
      {isVisible ? children : null}
    </div>
  );
};

export default LazySection;
