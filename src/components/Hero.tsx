import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from './ui/Button';
import Section from './ui/Section';
import ModalVideo from './ModalVideo';
import WhisperText from './ui/whisper-text';

const Hero: React.FC = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);


  return (
    <Section id="hero" background="gray" className="relative pt-20 pb-64 lg:pt-32 lg:pb-96 overflow-hidden">
      
      <div className="relative z-10 text-center">
        {/* Main Headline */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-text-main mb-6 pt-8">
          <WhisperText
            text="NEVER MISS A LEAD AGAIN."
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-text-main"
            delay={125}
            duration={0.625}
            x={-20}
            y={0}
            triggerStart="top 80%"
          />
        </h1>

        {/* Subheadline */}
        <motion.p
          className="text-lg md:text-xl text-text-muted mb-8 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.7 }}
        >
          24/7 lead capture via calls, forms, and chat. Instant SMS/call <br />
          follow-up and auto-booking.
        </motion.p>


        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0 }}
        >
          <Button
            onClick={() => window.location.href = '/setup'}
            variant="primary"
            size="md"
            className="w-full sm:w-auto"
          >
            Learn more
          </Button>
          <Button
            onClick={() => setIsVideoOpen(true)}
            variant="outline"
            size="md"
            className="w-full sm:w-auto bg-transparent border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 hover:bg-transparent px-6 py-2 transition-all duration-150"
          >
            5-Min Free Setup
          </Button>
        </motion.div>

      </div>

      {/* Video Modal */}
      <ModalVideo
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
      />
    </Section>
  );
};

export default Hero;
