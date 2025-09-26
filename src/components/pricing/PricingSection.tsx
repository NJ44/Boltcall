import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import PlanCard from './PlanCard';
import ComparisonTable from './ComparisonTable';
import FAQ from './FAQ';

const PricingSection: React.FC = () => {
  const [currency, setCurrency] = useState<'USD' | 'ILS'>('USD');

  const plans = [
    {
      title: 'Starter',
      subtitle: 'Speed-to-Lead',
      priceUsd: 197,
      priceIls: 740,
      features: [
        'Instant SMS to new leads',
        'Qualification + nurturing (3–5 smart questions)',
        'Auto-booking to Google Calendar',
        'Owner notifications (SMS + email)'
      ],
      limits: '1 calendar, 300 conversations, 1,000 SMS/mo',
      support: 'Chat/email (24–48h)',
      ctaLabel: 'Start now',
      popular: false,
      anchor: false
    },
    {
      title: 'Pro',
      subtitle: 'AI Front Desk',
      priceUsd: 497,
      priceIls: 1870,
      features: [
        'Everything in Starter',
        'AI receptionist (voice) + live transfer',
        'Dashboard (response time, booked jobs, missed leads, transcripts)',
        'Call transcripts with intent tags'
      ],
      limits: '2 calendars, 2 users, 300 voice mins, 2,500 SMS/mo',
      support: 'Priority chat (24h target)',
      guarantee: '10 extra bookings in 30 days or your money back.',
      ctaLabel: 'Start winning calls',
      popular: true,
      anchor: false
    },
    {
      title: 'Elite',
      subtitle: 'Growth Ops',
      priceUsd: 1497,
      priceIls: 5650,
      features: [
        'Everything in Pro (same core outcomes)',
        'White-glove onboarding (done-for-you in 48h)',
        'VIP support (same-day + phone/WhatsApp)',
        'Quarterly strategy review (scripts, funnels, offers)',
        'Branded voice (custom greeting voice + name)',
        'Compliance pack (recording notice & retention presets)'
      ],
      limits: '4 calendars, 5 users, 900 voice mins, 6,000 SMS/mo',
      support: 'Multi-location ready (add locations at $199/₪750 each)',
      ctaLabel: 'Concierge onboarding',
      popular: false,
      anchor: true
    }
  ];

  const comparisonData = {
    headers: ['Feature', 'Starter', 'Pro ⭐️', 'Elite'],
    rows: [
      { feature: 'Instant SMS + booking', starter: '✅', pro: '✅', elite: '✅' },
      { feature: 'AI receptionist (voice)', starter: '—', pro: '✅', elite: '✅' },
      { feature: 'Live transfer to human', starter: '—', pro: '✅', elite: '✅' },
      { feature: 'Dashboard + transcripts', starter: '—', pro: '✅', elite: '✅' },
      { feature: 'Money-back guarantee', starter: '—', pro: '✅', elite: '✅' },
      { feature: 'VIP phone/WhatsApp support', starter: '—', pro: '—', elite: '✅' },
      { feature: 'White-glove setup (48h)', starter: '—', pro: '—', elite: '✅' },
      { feature: 'Quarterly strategy call', starter: '—', pro: '—', elite: '✅' },
      { feature: 'Custom branded voice', starter: '—', pro: '—', elite: '✅' },
      { feature: 'Calendars / Users', starter: '1 / 1', pro: '2 / 2', elite: '4 / 5' },
      { feature: 'Voice minutes / SMS', starter: '— / 1,000', pro: '300 / 2,500', elite: '900 / 6,000' },
      { feature: 'Price (mo)', starter: '$197', pro: '$497', elite: '$1,497' }
    ]
  };

  const scrollToComparison = () => {
    document.getElementById('comparison')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white-smoke via-white-smoke to-white-smoke">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Pick your plan.
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Pro has everything most teams need. Elite adds white-glove polish.
          </motion.p>

          {/* Currency Toggle */}
          <motion.div
            className="flex items-center justify-center gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="text-sm font-medium text-gray-700">Currency:</span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                  currency === 'USD'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                aria-label="Switch to USD currency"
              >
                USD
              </button>
              <button
                onClick={() => setCurrency('ILS')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                  currency === 'ILS'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                aria-label="Switch to ILS currency"
              >
                ₪
              </button>
            </div>
          </motion.div>
        </div>

        {/* Plan Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.title}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
            >
              <PlanCard
                {...plan}
                currency={currency}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Compare Plans Link */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <button
            onClick={scrollToComparison}
            className="inline-flex items-center gap-2 text-brand-blue hover:text-brand-sky font-medium transition-colors"
            aria-label="Scroll to comparison table"
          >
            Compare plans
            <ArrowDown className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          id="comparison"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <ComparisonTable data={comparisonData} />
        </motion.div>

        {/* FAQ */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <FAQ />
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;

