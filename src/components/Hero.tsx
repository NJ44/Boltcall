import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './ui/Button';
import Section from './ui/Section';
import ModalVideo from './ModalVideo';
import WhisperText from './ui/whisper-text';

const Hero: React.FC = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const navigate = useNavigate();
  const [showMainText, setShowMainText] = useState(false);
  const [showSubText, setShowSubText] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    // Main text appears 2 seconds after website loads
    const timer1 = setTimeout(() => {
      setShowMainText(true);
    }, 2000);

    // Sub text and buttons appear 3 minutes after website loads
    const timer2 = setTimeout(() => {
      setShowSubText(true);
      setShowButtons(true);
    }, 180000); // 3 minutes = 180,000ms

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <>
      <Section id="hero" background="gray" className="relative pt-20 pb-64 lg:pt-32 lg:pb-96 overflow-visible z-[1]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 92%, 0 100%)' }}>
        
        <div className="relative z-[10000] text-center" style={{ backfaceVisibility: 'hidden', WebkitFontSmoothing: 'antialiased' }}>
        {/* Main Headline */}
        {showMainText && (
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-text-main mb-6 pt-8 relative z-[9999]">
            <WhisperText
              text="NEVER MISS A"
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-text-main inline-block"
              delay={125}
              duration={0.625}
              x={-20}
              y={0}
              triggerStart="top 80%"
            />{' '}
            <WhisperText
              text="LEAD"
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-blue-500 inline-block"
              delay={125}
              duration={0.625}
              x={-20}
              y={0}
              triggerStart="top 80%"
            />{' '}
            <WhisperText
              text="AGAIN."
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-text-main inline-block"
              delay={125}
              duration={0.625}
              x={-20}
              y={0}
              triggerStart="top 80%"
            />
          </h1>
        )}

        {/* Subheadline */}
        {showSubText && (
          <p className="text-lg md:text-xl text-text-muted mb-8 max-w-2xl mx-auto leading-relaxed relative z-[9999]">
            24/7 lead capture via calls, forms, and chat. Instant SMS/call <br />
            follow-up and auto-booking.
          </p>
        )}


        {/* CTA Buttons */}
        {showButtons && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 relative z-[9999]">
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
            variant="outline"
            size="md"
            className="w-full sm:w-auto bg-transparent border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 hover:bg-transparent px-6 py-2 transition-all duration-75"
          >
            5-Min Free Setup
            </Button>
            </div>
          )}

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
