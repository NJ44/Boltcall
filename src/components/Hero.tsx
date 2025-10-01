import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Button from './ui/Button';
import Section from './ui/Section';
import ModalVideo from './ModalVideo';

const Hero: React.FC = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);


  return (
    <Section id="hero" background="gray" className="relative pt-20 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <DotLottieReact
          src="/Hero_spiral_animation.lottie"
          loop
          autoplay
          style={{ 
            width: '88%', 
            height: '88%',
            opacity: 0.3
          }}
        />
      </div>
      
      <div className="relative z-10 text-center">
        {/* Main Headline */}
        <motion.h1
          className="text-3xl md:text-5xl lg:text-6xl font-bold text-text-main mb-6 pt-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          NEVER MISS A LEAD AGAIN.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="text-xl md:text-2xl text-text-muted mb-8 max-w-4xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          The AI booking + receptionist cosmetic dentists need
        </motion.p>


        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            variant="primary"
            size="lg"
            className="w-full sm:w-auto"
          >
            Start now
          </Button>
          <Button
            onClick={() => setIsVideoOpen(true)}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto bg-transparent border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 hover:bg-transparent px-8 py-3"
          >
            <Play className="w-5 h-5 mr-2" />
            See 60-sec demo
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
