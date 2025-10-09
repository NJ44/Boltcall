import React from 'react';
import Section from './ui/Section';
import Button from './ui/Button';
import WhisperText from './ui/whisper-text';

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
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-text-main mb-6 leading-tight">
            <WhisperText
              text="Don't get left behind. Get The Advantage."
              className="text-4xl md:text-5xl font-bold text-text-main"
              delay={125}
              duration={0.625}
              x={-20}
              y={0}
              triggerStart="top 85%"
            />
          </h2>
          <Button
            onClick={scrollToPricing}
            variant="primary"
            size="lg"
            className="bg-gradient-to-r from-brand-blue to-brand-sky hover:from-brand-blue/90 hover:to-brand-sky/90 shadow-lg hover:shadow-xl transition-all duration-300 font-medium px-8 py-3 text-lg"
          >
            Get started for free
          </Button>
        </div>
      </div>
    </Section>
  );
};

export default FinalCTA;
