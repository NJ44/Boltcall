import React from 'react';
import WhisperText from './ui/whisper-text';
import { Feature } from './ui/feature-section-with-bento-grid';

export const StickyScrollSection: React.FC = () => {
  return (
    <div className="py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          <WhisperText
            text="Why Businesses Choose BoltCall"
            className="text-4xl md:text-5xl font-bold text-white"
            delay={150}
            duration={0.625}
            x={-20}
            y={0}
            triggerStart="top 85%"
          />
        </h2>
      </div>
      <div className="bg-white rounded-t-[80px] -mx-4">
        <Feature />
      </div>
    </div>
  );
};

export default StickyScrollSection;
