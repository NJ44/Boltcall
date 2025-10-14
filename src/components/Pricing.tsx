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
    { name: "Dedicated account manager", included: "custom" },
    { name: "Custom integrations", included: "custom" },
    { name: "SLA guarantee", included: "custom" },
  ];

  const pricingPlans = [
    {
      name: "STARTER",
      level: "starter",
      price: { monthly: 197, yearly: 1970 },
      description: "Good for testing things out, something like that.",
    },
    {
      name: "PRO",
      level: "pro",
      price: { monthly: 497, yearly: 4970 },
      popular: true,
      description: "Everything on Starter plus:",
    },
    {
      name: "AGENCY",
      level: "all",
      price: { monthly: 1497, yearly: 14970 },
      description: "Everything on PRO plus:",
    },
    {
      name: "ENTERPRISE",
      level: "custom",
      price: { monthly: 0, yearly: 0 },
      description: "Tailored solutions for your business:",
      isCustom: true,
    },
  ];



  return (
    <>
      <Section id="pricing" background="white" roundedTop={true} className="shadow-[inset_0_10px_20px_-10px_rgba(0,0,0,0.1)]">
      {/* Pricing Header */}
      <div className="text-center -mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 -mb-14">
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
            navigate('/setup');
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