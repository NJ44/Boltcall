import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from './ui/Button';
import Section from './ui/Section';
import ModalVideo from './ModalVideo';

const Hero: React.FC = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);


  return (
    <Section id="hero" background="gray" className="relative pt-20 pb-64 lg:pt-32 lg:pb-96 overflow-hidden">
      {/* Aurora Background Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="
            [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)]
            [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)]
            [--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,var(--indigo-300)_15%,var(--blue-300)_20%,var(--violet-200)_25%,var(--blue-400)_30%)]
            [background-image:var(--white-gradient),var(--aurora)]
            dark:[background-image:var(--dark-gradient),var(--aurora)]
            [background-size:300%,_200%]
            [background-position:50%_50%,50%_50%]
            filter blur-[10px] invert dark:invert-0
            after:content-[''] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)] 
            after:dark:[background-image:var(--dark-gradient),var(--aurora)]
            after:[background-size:200%,_100%] 
            after:animate-aurora after:[background-attachment:fixed] after:mix-blend-difference
            pointer-events-none
            absolute -inset-[10px] opacity-30 will-change-transform
          "
        ></div>
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
            onClick={() => window.location.href = '/setup'}
            variant="primary"
            size="lg"
            className="w-full sm:w-auto"
          >
            Get started free
          </Button>
          <Button
            onClick={() => setIsVideoOpen(true)}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto bg-transparent border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 hover:bg-transparent px-8 py-3"
          >
            See features
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
