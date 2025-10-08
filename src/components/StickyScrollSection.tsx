import React from 'react';
import { StickyScroll } from './ui/sticky-scroll-reveal';

const content = [
  {
    title: "More Money",
    description: "Increase your revenue by capturing every lead that comes your way. Our AI never misses a call, never takes a break, and converts more prospects into paying customers.",
    content: (
      <div className="h-full w-full flex items-center justify-center text-white">
        <img
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=300&fit=crop&crop=center"
          alt="More Money"
          className="h-full w-full object-cover rounded-md"
        />
      </div>
    ),
  },
  {
    title: "Save Time",
    description: "Free up your team's time by automating routine tasks. Our AI handles appointment scheduling, lead qualification, and customer inquiries, so your staff can focus on what matters most.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white">
        Save Time
      </div>
    ),
  },
  {
    title: "Higher Closing Rates",
    description: "Convert more leads into customers with intelligent follow-up and personalized communication. Our AI nurtures prospects through the entire sales funnel, increasing your closing rates significantly.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--orange-500),var(--yellow-500))] flex items-center justify-center text-white">
        Higher Closing Rates
      </div>
    ),
  },
  {
    title: "Better Customer Satisfaction",
    description: "Provide instant, 24/7 customer service that never sleeps. Our AI delivers consistent, professional responses that make every customer feel valued and heard.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--pink-500),var(--indigo-500))] flex items-center justify-center text-white">
        Better Customer Satisfaction
      </div>
    ),
  },
];

export const StickyScrollSection: React.FC = () => {
  return (
    <div className="py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Why choose Boltcall
        </h2>
      </div>
      <StickyScroll content={content} />
    </div>
  );
};

export default StickyScrollSection;
