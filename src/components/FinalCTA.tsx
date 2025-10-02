import React from 'react';
import { motion } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Section from './ui/Section';
import Button from './ui/Button';

const FinalCTA: React.FC = () => {
  const scrollToPricing = () => {
    const element = document.getElementById('pricing');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Section id="contact" background="white">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center lg:text-left"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-text-main mb-6 leading-tight">
              <div className="whitespace-nowrap">Don't get left behind.</div>
              <div className="whitespace-nowrap">Get The Advantage.</div>
            </h2>
            <Button
              onClick={scrollToPricing}
              variant="primary"
              size="lg"
              className="bg-gradient-to-r from-brand-blue to-brand-sky hover:from-brand-blue/90 hover:to-brand-sky/90 shadow-lg hover:shadow-xl transition-all duration-300 font-medium px-8 py-3 text-lg"
            >
              Get started for free
            </Button>
          </motion.div>

          {/* Right Side - Animation */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex justify-center lg:justify-end"
          >
            <div className="w-96 h-96">
              <DotLottieReact
                src="/dental-clinic.lottie"
                loop
                autoplay
                style={{
                  width: '100%',
                  height: '100%'
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
};

export default FinalCTA;
