import React from 'react';
import { motion } from 'framer-motion';
import WhisperText from './ui/whisper-text';
import { Feature } from './ui/feature-section-with-bento-grid';

export const StickyScrollSection: React.FC = () => {
  return (
    <div className="py-20">
      <div className="text-left mb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="mb-4 ml-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <span className="text-sm uppercase tracking-wider font-medium text-white/70">PRODUCT</span>
        </motion.div>
        <h2 className="font-bold ml-5" style={{ fontSize: '54px', lineHeight: '1.2' }}>
          <div>
            <WhisperText
              text="Why Businesses"
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white inline-block"
              delay={150}
              duration={0.625}
              x={-20}
              y={0}
              triggerStart="top 85%"
              style={{ fontSize: '1.155em' }}
            />
          </div>
          <div>
            <WhisperText
              text="Choose"
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white inline-block"
              delay={150}
              duration={0.625}
              x={-20}
              y={0}
              triggerStart="top 85%"
              style={{ fontSize: '1.155em' }}
            />{' '}
            <WhisperText
              text="BoltCall"
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-500 inline-block"
              delay={150}
              duration={0.625}
              x={-20}
              y={0}
              triggerStart="top 85%"
              style={{ fontSize: '1.155em' }}
            />
          </div>
        </h2>
      </div>
      <Feature />
    </div>
  );
};

export default StickyScrollSection;
