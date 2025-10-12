import React from 'react';
import { StickyScroll } from './ui/sticky-scroll-reveal';
import WhisperText from './ui/whisper-text';

const content = [
  {
    title: "Increased Revenue",
    description: "Capture every lead and convert more prospects into paying customers with AI that never sleeps.",
    content: (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
        <img 
          src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=600&fit=crop"
          alt="Revenue growth"
          className="w-full h-full object-cover rounded-lg opacity-80"
        />
      </div>
    ),
  },
  {
    title: "Save Time",
    description: "Automate routine tasks so your team can focus on what matters most.",
    content: (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-600 to-teal-600 rounded-lg">
        <img 
          src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=600&fit=crop"
          alt="Time management"
          className="w-full h-full object-cover rounded-lg opacity-80"
        />
      </div>
    ),
  },
  {
    title: "Higher Closing Rates",
    description: "Intelligent follow-up and personalized communication that converts more leads into customers.",
    content: (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-600 to-red-600 rounded-lg">
        <img 
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=600&fit=crop"
          alt="Closing rates"
          className="w-full h-full object-cover rounded-lg opacity-80"
        />
      </div>
    ),
  },
  {
    title: "Customer Satisfaction",
    description: "24/7 professional service that makes every customer feel valued and heard.",
    content: (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg">
        <img 
          src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=600&fit=crop"
          alt="Customer satisfaction"
          className="w-full h-full object-cover rounded-lg opacity-80"
        />
      </div>
    ),
  },
];

export const StickyScrollSection: React.FC = () => {
  return (
    <div className="py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          <WhisperText
            text="Why Businesses Choose BoltCall"
            className="text-4xl md:text-5xl font-bold text-white"
            delay={150}
            duration={0.625}
            x={-20}
            y={0}
            triggerStart="top 85%"
          />
        </h2>
      </div>
      <StickyScroll content={content} />
    </div>
  );
};

export default StickyScrollSection;
