import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from './ui/Button';
import Section from './ui/Section';
import ModalVideo from './ModalVideo';

const Hero: React.FC = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const navigate = useNavigate();
  const [titleNumber, setTitleNumber] = useState(1);

  const titles = useMemo(
    () => ["CALL", "LEAD", "TEXT", "REVIEW", "REPLY"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <>
      <Section id="hero" background="gray" className="relative -mt-24 pb-64 lg:-mt-32 lg:pb-96 overflow-visible z-[1]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 92%, 0 100%)' }}>
        
        <div className="relative z-10 text-center pt-16 lg:pt-20">
        {/* Main Headline */}
        <div className="flex justify-center mb-6 relative z-10">
          <div className="flex gap-4 flex-col items-center w-full max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-5xl lg:text-6xl max-w-4xl tracking-tighter font-bold text-text-main flex items-center justify-center gap-2 flex-nowrap ml-48 md:ml-56">
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.625, delay: 0.2, ease: "easeOut" }}
              >
                NEVER
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.625, delay: 0.3, ease: "easeOut" }}
              >
                MISS
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.625, delay: 0.4, ease: "easeOut" }}
              >
                A
              </motion.span>

              <span className="relative inline-flex items-center justify-start overflow-hidden min-w-[240px] md:min-w-[380px] h-[1.2em] ml-[2px]">
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute text-3xl md:text-5xl lg:text-6xl font-bold text-blue-600 whitespace-nowrap"
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
        </h1>
          </div>
        </div>

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
