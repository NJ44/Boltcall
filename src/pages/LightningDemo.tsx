import React from 'react';
import { HomeLightning } from '../components/HomeLightning';

const LightningDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-white-smoke relative">
      {/* Lightning Background */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-pink-50 via-pink-200 to-pink-900" style={{ willChange: 'auto' }}>
        <HomeLightning className="w-full h-full" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-4">Lightning Background Demo</h1>
          <p className="text-xl">Pink lightning effect with WebGL shader</p>
          <p className="text-sm mt-4 opacity-70">Optimized: 30fps, 50% resolution</p>
        </div>
      </div>
    </div>
  );
};

export default LightningDemo;


