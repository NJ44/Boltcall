import React, { useEffect, useState } from 'react';

const ReadingProgress: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [headerBottom, setHeaderBottom] = useState(107); // Default: 43px (GiveawayBar) + 64px (Header)

  useEffect(() => {
    const calculateScrollProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      
      // Calculate the total scrollable height
      const scrollableHeight = documentHeight - windowHeight;
      
      // Calculate progress percentage
      const progress = scrollableHeight > 0 
        ? (scrollTop / scrollableHeight) * 100 
        : 0;
      
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };

    const updateHeaderPosition = () => {
      const header = document.querySelector('header');
      if (header) {
        const headerRect = header.getBoundingClientRect();
        setHeaderBottom(headerRect.bottom);
      }
    };

    // Calculate on mount
    calculateScrollProgress();
    updateHeaderPosition();
    
    // Use requestAnimationFrame for smooth scroll tracking
    let rafId: number | null = null;
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(() => {
          calculateScrollProgress();
          updateHeaderPosition();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', () => {
      calculateScrollProgress();
      updateHeaderPosition();
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', calculateScrollProgress);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <div 
      className="fixed left-0 right-0 h-1 bg-blue-200/30 z-[100]"
      style={{ 
        top: `${headerBottom}px` // Stuck to the bottom of the header
      }}
    >
      <div
        className="h-full bg-blue-600 shadow-sm"
        style={{ 
          width: `${scrollProgress}%`,
          transition: 'width 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }}
      />
    </div>
  );
};

export default ReadingProgress;

