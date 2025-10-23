import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from './ui/Button';
import Section from './ui/Section';
import ModalVideo from './ModalVideo';
import WhisperText from './ui/whisper-text';

const Hero: React.FC = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <Section id="hero" background="gray" className="relative -mt-24 pb-64 lg:-mt-32 lg:pb-96 overflow-visible z-[1]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 92%, 0 100%)' }}>
        
        <div className="relative z-10 text-center pt-16 lg:pt-20">
        {/* Main Headline */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-text-main mb-6 relative z-10">
          <WhisperText
            text="NEVER MISS A LEAD AGAIN."
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-text-main inline-block"
            delay={200}
            duration={0.625}
            x={-20}
            y={0}
            triggerStart="top 80%"
            wordStyles={{
              "LEAD": { color: "#3b82f6" }
            }}
          />
        </h1>

        {/* Subheadline */}
        <motion.p
          className="text-lg md:text-xl text-text-muted mb-8 max-w-2xl mx-auto leading-relaxed relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          24/7 lead capture via calls, forms, and chat. Instant SMS/call <br />
          follow-up and auto-booking.
        </motion.p>


        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0 }}
        >
          <Button
            onClick={() => {
              const howItWorksSection = document.getElementById('how-it-works');
              if (howItWorksSection) {
                howItWorksSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            variant="primary"
            size="md"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white transition-all duration-75"
            style={{ backgroundColor: '#3b82f6', color: 'white' }}
          >
            Learn more
          </Button>
          <Button
            onClick={() => navigate('/setup')}
            variant="primary"
            size="md"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white transition-all duration-75"
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
    </>
  );
};

export default Hero;
