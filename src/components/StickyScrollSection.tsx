import React from 'react';
import { StickyScroll } from './ui/sticky-scroll-reveal';
import { SplineScene } from './ui/splite';
import WhisperText from './ui/whisper-text';

const content = [
  {
    title: "Increased Revenue",
    description: "Capture every lead and convert more prospects into paying customers with AI that never sleeps.",
    content: (
      <SplineScene 
        scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
        className="w-full h-full"
      />
    ),
  },
  {
    title: "Save Time",
    description: "Automate routine tasks so your team can focus on what matters most.",
    content: (
      <SplineScene 
        scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
        className="w-full h-full"
      />
    ),
  },
  {
    title: "Higher Closing Rates",
    description: "Intelligent follow-up and personalized communication that converts more leads into customers.",
    content: (
      <SplineScene 
        scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
        className="w-full h-full"
      />
    ),
  },
  {
    title: "Customer Satisfaction",
    description: "24/7 professional service that makes every customer feel valued and heard.",
    content: (
      <SplineScene 
        scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
        className="w-full h-full"
      />
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
