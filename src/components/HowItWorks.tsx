import React from 'react';
import { motion } from 'framer-motion';
import WhisperText from './ui/whisper-text';
import { Features } from './ui/features-10';

const HowItWorks: React.FC = () => {
  return (
    <section 
      id="how-it-works" 
      className="relative py-16 overflow-hidden bg-transparent -mt-32"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        {/* Section Header */}
        <div className="text-left mb-20">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
            <WhisperText
              text="Close leads in"
              className="text-5xl md:text-7xl font-bold text-white inline-block"
              delay={125}
              duration={0.625}
              x={-20}
              y={0}
              triggerStart="top 85%"
            />
            <br />
            <WhisperText
              text="lightning speed."
              className="text-5xl md:text-7xl font-bold text-blue-500 inline-block"
              delay={125}
              duration={0.625}
              x={-20}
              y={0}
              triggerStart="top 85%"
            />
          </h2>
        </div>

        {/* Features Component */}
        <Features />
      </div>
    </section>
  );
};

export default HowItWorks;