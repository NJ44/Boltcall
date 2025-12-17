import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Section from './ui/Section';
import { PricingTable } from './ui/pricing-table';
import WhisperText from './ui/whisper-text';

const Pricing: React.FC = () => {
  const navigate = useNavigate();

  // PricingTable data
  const pricingFeatures = [
    // Starter Plan Features
    { name: "Missed calls", included: "starter" },
    { name: "Speed to lead", included: "starter" },
    { name: "Reminders (bonus)", included: "starter" },
    { name: "Analytics dashboard", included: "starter" },
    
    // Pro Plan Features (includes everything from Starter)
    { name: "AI receptionist", included: "pro" },
    { name: "Speed to lead - full funnel", included: "pro" },
    { name: "SMS chat", included: "pro" },
    { name: "Post service follow ups (bonus)", included: "pro" },
    { name: "Free website widget (bonus)", included: "pro" },
    
    // Agency Plan Features (includes everything from Pro)
    { name: "Locations", included: "all" },
    { name: "AI audits", included: "all" },
  ];

  const pricingPlans = [
    {
      name: "Starter",
      level: "starter",
      price: { monthly: 197, yearly: 1970 },
      description: "Perfect for getting started with lead management.",
    },
    {
      name: "Pro",
      level: "pro",
      price: { monthly: 497, yearly: 4970 },
      popular: true,
      description: "Everything in Starter plus:",
    },
    {
      name: "AGENCY",
      level: "all",
      price: { monthly: 1497, yearly: 14970 },
      description: "Everything in Pro plus:",
    },
    {
      name: "ENTERPRISE",
      level: "custom",
      price: { monthly: 0, yearly: 0 },
      description: "Tailored solutions for your business:",
      isCustom: true,
      excludeFromTable: true, // Add this flag to exclude from comparison table
    },
  ];



  return (
    <>
      <Section id="pricing" background="white" roundedTop={true}>
      {/* Pricing Header */}
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-[1.2]">
          <WhisperText
            text="Pricing That"
            className="text-4xl md:text-5xl font-bold text-gray-900 inline-block"
            delay={187}
            duration={0.625}
            x={-20}
            y={0}
            triggerStart="top 95%"
          />{' '}
          <WhisperText
            text="Scales"
            className="text-4xl md:text-5xl font-bold text-blue-500 inline-block"
            delay={187}
            duration={0.625}
            x={-20}
            y={0}
            triggerStart="top 95%"
          />{' '}
          <WhisperText
            text="With You"
            className="text-4xl md:text-5xl font-bold text-gray-900 inline-block"
            delay={187}
            duration={0.625}
            x={-20}
            y={0}
            triggerStart="top 95%"
          />
        </h2>
      </div>

      {/* New PricingTable Component */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        viewport={{ once: true, amount: 0.1 }}
      >
        <PricingTable
          features={pricingFeatures}
          plans={pricingPlans}
          defaultPlan="pro"
          defaultInterval="monthly"
          onPlanSelect={(plan) => {
            console.log("Selected plan:", plan);
            navigate('/coming-soon');
          }}
          containerClassName="py-0"
          buttonClassName="bg-blue-600 hover:bg-blue-700"
        />
      </motion.div>
      </Section>
    </>
  );
};

export default Pricing;