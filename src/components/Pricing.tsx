import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Section from './ui/Section';
import { PricingTable } from './ui/pricing-table';

const Pricing: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const navigate = useNavigate();

  // PricingTable data
  const pricingFeatures = [
    // Starter features (from old STARTER card)
    { name: "1 editor", included: "starter" },
    { name: "1 connection", included: "starter" },
    { name: "2 dashboards", included: "starter" },
    { name: "Answer questions with IndexAI", included: "starter" },
    
    // Pro features (from old PRO card)
    { name: "Unlimited connections", included: "pro" },
    { name: "Unlimited dashboards", included: "pro" },
    { name: "10-20x higher AI question limit", included: "pro" },
    
    // Enterprise features (from old ENTERPRISE card)
    { name: "Embedded analytics", included: "all" },
    { name: "Custom domains", included: "all" },
    { name: "Whitelabeling", included: "all" },
    { name: "Dedicated support", included: "all" },
    
    // Additional features from the new structure
    { name: "Instant SMS to new leads", included: "starter" },
    { name: "Qualification + nurturing (3–5 smart questions)", included: "starter" },
    { name: "Auto-booking to Google Calendar", included: "starter" },
    { name: "Owner notifications (SMS + email)", included: "starter" },
    { name: "AI receptionist (voice) + live transfer", included: "pro" },
    { name: "Dashboard (response time, booked jobs, missed leads, transcripts)", included: "pro" },
    { name: "Call transcripts with intent tags", included: "pro" },
    { name: "White-glove onboarding (done-for-you in 48h)", included: "all" },
    { name: "VIP support (same-day + phone/WhatsApp)", included: "all" },
    { name: "Quarterly strategy review (scripts, funnels, offers)", included: "all" },
    { name: "Branded voice (custom greeting voice + name)", included: "all" },
    { name: "Compliance pack (recording notice & retention presets)", included: "all" },
  ];

  const pricingPlans = [
    {
      name: "STARTER",
      level: "starter",
      price: { monthly: 197, yearly: 1970 },
      description: "Perfect for small dental practices getting started with AI receptionist.",
    },
    {
      name: "PRO",
      level: "pro",
      price: { monthly: 497, yearly: 4970 },
      popular: true,
      description: "Everything on Starter plus:",
    },
    {
      name: "ENTERPRISE",
      level: "all",
      price: { monthly: 1497, yearly: 14970 },
      description: "Everything on PRO plus:",
    },
  ];


  const toggleBilling = () => {
    setIsAnnual(!isAnnual);
  };

  return (
    <Section id="pricing" background="white">
      <div className="text-center mb-16">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Pricing
        </motion.h2>

        {/* Billing Toggle */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <span className={`text-lg font-medium ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
            Monthly
          </span>
          <button
            onClick={toggleBilling}
            className={`relative w-16 h-8 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isAnnual ? 'bg-blue-500' : 'bg-gray-200'
            }`}
          >
            <motion.div
              className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
              animate={{ x: isAnnual ? 32 : 2 }}
              transition={{ 
                duration: 0.4, 
                ease: [0.4, 0, 0.2, 1],
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
            />
          </button>
          <span className={`text-lg font-medium ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
            Annually 3 month free
          </span>
        </motion.div>
      </div>




      {/* New PricingTable Component */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        viewport={{ once: true }}
      >
        <PricingTable
          features={pricingFeatures}
          plans={pricingPlans}
          defaultPlan="pro"
          defaultInterval="monthly"
          onPlanSelect={(plan) => {
            console.log("Selected plan:", plan);
            navigate('/setup');
          }}
          containerClassName="py-12"
          buttonClassName="bg-blue-600 hover:bg-blue-700"
        />
      </motion.div>
    </Section>
  );
};

export default Pricing;