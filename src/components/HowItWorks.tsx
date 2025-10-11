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
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            <WhisperText
              text="Close leads in lightning speed"
              className="text-4xl md:text-6xl font-bold text-white"
              delay={125}
              duration={0.625}
              x={-20}
              y={0}
              triggerStart="top 85%"
            />
          </h2>
        </motion.div>

        {/* Features Component */}
        <Features />
      </div>
    </section>
  );
};

export default HowItWorks;