import React, { useEffect, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface PageLoaderProps {
  isLoading: boolean;
}

const PageLoader: React.FC<PageLoaderProps> = ({ isLoading }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setIsVisible(true);
    } else {
      // Delayed hide with smooth transition
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!isVisible && !isLoading) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-500 ease-in-out ${
        isLoading ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ 
        transition: 'opacity 500ms ease-in-out',
        backdropFilter: isLoading ? 'blur(0px)' : 'blur(2px)'
      }}
    >
      <div 
        className="flex flex-col items-center justify-center transition-transform duration-300 ease-in-out"
        style={{
          transform: isLoading ? 'scale(1)' : 'scale(0.95)',
        }}
      >
        <DotLottieReact
          src="/Loading_animation_lottie.lottie"
          loop
          autoplay
          style={{ width: '200px', height: '200px' }}
        />
      </div>
    </div>
  );
};

export default PageLoader;
