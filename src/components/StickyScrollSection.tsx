import React from 'react';
import { StickyScroll } from './ui/sticky-scroll-reveal';

const content = [
  {
    title: "AI-Powered Receptionist",
    description: "Our advanced AI receptionist handles calls 24/7 with natural conversation flow. It understands context, answers questions, and provides personalized responses that feel human. Never miss another call or lead again.",
    content: (
      <div className="h-full w-full flex items-center justify-center text-white">
        <img
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=300&fit=crop&crop=center"
          alt="AI Receptionist"
          className="h-full w-full object-cover rounded-md"
        />
      </div>
    ),
  },
  {
    title: "Smart Call Routing",
    description: "Intelligently route calls to the right department or person based on caller intent and context. Our AI analyzes conversation patterns to ensure every caller reaches the most qualified person to help them.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white">
        Smart Call Routing
      </div>
    ),
  },
  {
    title: "Lead Qualification",
    description: "Automatically qualify leads during conversations, capture contact information, and schedule appointments. Our AI asks the right questions to determine lead quality and intent, ensuring your sales team focuses on the most promising prospects.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--orange-500),var(--yellow-500))] flex items-center justify-center text-white">
        Lead Qualification
      </div>
    ),
  },
  {
    title: "Seamless Integration",
    description: "Connect with your existing CRM, calendar, and business tools. Our AI receptionist integrates seamlessly with popular platforms like Salesforce, HubSpot, Google Calendar, and more, ensuring a smooth workflow.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--pink-500),var(--indigo-500))] flex items-center justify-center text-white">
        Seamless Integration
      </div>
    ),
  },
];

export const StickyScrollSection: React.FC = () => {
  return (
    <div className="py-20">
      <StickyScroll content={content} />
    </div>
  );
};

export default StickyScrollSection;
