import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Section from './ui/Section';
import { PricingTable } from './ui/pricing-table';
import WhisperText from './ui/whisper-text';
import type { PlanLevel } from '../lib/stripe';
import { redirectToCheckout } from '../lib/stripe-checkout';

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // PricingTable data
  const pricingFeatures = [
    // Starter Plan Features
    { name: "AI receptionist", included: "starter" },
    { name: "Missed call text-back", included: "starter" },
    { name: "Instant lead reply", included: "starter" },
    { name: "Appointment reminders", included: "starter" },
    { name: "Reports dashboard", included: "starter" },

    // Pro Plan Features (includes everything from Starter)
    { name: "Full lead follow-up system", included: "pro" },
    { name: "SMS conversations", included: "pro" },
    { name: "Automatic follow-ups after jobs", included: "pro" },
    { name: "Website chat widget", included: "pro" },
    
    // Agency Plan Features (includes everything from Pro)
    { name: "Locations", included: "all" },
    { name: "AI audits", included: "all" },
  ];

  const pricingPlans = [
    {
      name: "Starter",
      level: "starter",
      price: { monthly: 99, yearly: 948 },
      description: "Perfect for getting started with lead management.",
      tokens: "1,000 tokens/mo",
    },
    {
      name: "Pro",
      level: "pro",
      price: { monthly: 179, yearly: 1716 },
      popular: true,
      description: "Everything in Starter plus:",
      tokens: "3,000 tokens/mo",
    },
    {
      name: "Ultimate",
      level: "all",
      price: { monthly: 249, yearly: 2388 },
      description: "Everything in Pro plus:",
      tokens: "10,000 tokens/mo",
    },
    {
      name: "ENTERPRISE",
      level: "custom",
      price: { monthly: 997, yearly: 11964 },
      description: "Tailored solutions for your business:",
      isCustom: true,
      excludeFromTable: true,
    },
  ];



  return (
    <>
      <Section id="pricing" background="white" roundedTop={true} className="!py-8 lg:!py-12">
      {/* Pricing Header */}
      <div className="text-center mb-1">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 leading-[1.2]">
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
          onPlanSelect={async (plan, interval) => {
            if (isLoading) return;
            setIsLoading(true);
            try {
              // Map plan levels to Stripe plan names
              const planMap: Record<string, string> = {
                starter: 'starter',
                pro: 'pro',
                all: 'ultimate',
              };
              const stripePlan = planMap[plan] || plan;
              await redirectToCheckout({
                plan: stripePlan as PlanLevel,
                interval: interval || 'monthly',
              });
            } catch (error) {
              console.error('Checkout error:', error);
              // Fallback to signup page if Stripe isn't configured yet
              navigate('/signup');
            } finally {
              setIsLoading(false);
            }
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