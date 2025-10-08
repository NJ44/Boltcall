import React from 'react';
import { StickyScroll } from './ui/sticky-scroll-reveal';
import { SplineScene } from './ui/splite';

const content = [
  {
    title: "More Money",
    description: "Increase your revenue by capturing every lead that comes your way. Our AI never misses a call, never takes a break, and converts more prospects into paying customers.",
    content: (
      <SplineScene 
        scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
        className="w-full h-full"
      />
    ),
  },
  {
    title: "Save Time",
    description: "Free up your team's time by automating routine tasks. Our AI handles appointment scheduling, lead qualification, and customer inquiries, so your staff can focus on what matters most.",
    content: (
      <SplineScene 
        scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
        className="w-full h-full"
      />
    ),
  },
  {
    title: "Higher Closing Rates",
    description: "Convert more leads into customers with intelligent follow-up and personalized communication. Our AI nurtures prospects through the entire sales funnel, increasing your closing rates significantly.",
    content: (
      <SplineScene 
        scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
        className="w-full h-full"
      />
    ),
  },
  {
    title: "Better Customer Satisfaction",
    description: "Provide instant, 24/7 customer service that never sleeps. Our AI delivers consistent, professional responses that make every customer feel valued and heard.",
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
          Why choose Boltcall
        </h2>
      </div>
      <StickyScroll content={content} />
    </div>
  );
};

export default StickyScrollSection;
