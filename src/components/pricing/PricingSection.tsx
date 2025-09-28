import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import FAQ from '../FAQ';

const PricingSection: React.FC = () => {
  const [currency, setCurrency] = useState<'USD' | 'ILS'>('USD');
  const [isAnnual, setIsAnnual] = useState(false);
  const navigate = useNavigate();

  const plans = [
    {
      title: 'Starter',
      subtitle: 'Speed-to-Lead',
      priceMonthlyUsd: 197,
      priceAnnualUsd: 1970, // 20% discount
      priceMonthlyIls: 740,
      priceAnnualIls: 7400,
      features: [
        'Instant SMS to new leads',
        'Qualification + nurturing (3–5 smart questions)',
        'Auto-booking to Google Calendar',
        'Owner notifications (SMS + email)'
      ],
      limits: '1 calendar, 300 conversations, 1,000 SMS/mo',
      support: 'Chat/email (24–48h)',
      ctaLabel: 'Start now',
      popular: false
    },
    {
      title: 'Pro',
      subtitle: 'AI Front Desk',
      priceMonthlyUsd: 497,
      priceAnnualUsd: 4970,
      priceMonthlyIls: 1870,
      priceAnnualIls: 18700,
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
      popular: true
    },
    {
      title: 'Elite',
      subtitle: 'Growth Ops',
      priceMonthlyUsd: 1497,
      priceAnnualUsd: 14970,
      priceMonthlyIls: 5650,
      priceAnnualIls: 56500,
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
      popular: false
    }
  ];

  const comparisonFeatures = [
    { name: 'Instant SMS + booking', starter: true, pro: true, elite: true },
    { name: 'AI receptionist (voice)', starter: false, pro: true, elite: true },
    { name: 'Live transfer to human', starter: false, pro: true, elite: true },
    { name: 'Dashboard + transcripts', starter: false, pro: true, elite: true },
    { name: 'Money-back guarantee', starter: false, pro: true, elite: true },
    { name: 'VIP phone/WhatsApp support', starter: false, pro: false, elite: true },
    { name: 'White-glove setup (48h)', starter: false, pro: false, elite: true },
    { name: 'Quarterly strategy call', starter: false, pro: false, elite: true },
    { name: 'Custom branded voice', starter: false, pro: false, elite: true },
    { name: 'Calendars / Users', starter: '1 / 1', pro: '2 / 2', elite: '4 / 5' },
    { name: 'Voice minutes / SMS', starter: '— / 1,000', pro: '300 / 2,500', elite: '900 / 6,000' }
  ];

  const handlePlanSelect = () => {
    navigate('/setup');
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white to-light-blue">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
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

          {/* Billing Toggle */}
          <motion.div
            className="flex items-center justify-center gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className={`text-lg font-medium transition-colors duration-300 ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-16 h-8 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-blue ${
                isAnnual ? 'bg-brand-blue' : 'bg-gray-200 hover:bg-gray-300'
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
            <span className={`text-lg font-medium transition-colors duration-300 ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
              Annual
            </span>
            {isAnnual && (
              <Badge className="bg-green-100 text-green-800 px-3 py-1">
                3 months free
              </Badge>
            )}
          </motion.div>

          {/* Currency Toggle */}
          <motion.div
            className="flex items-center justify-center gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
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

        {/* Plan Headers */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              className={`text-center p-6 rounded-xl bg-white shadow-lg ${
                plan.popular ? 'ring-2 ring-brand-blue shadow-xl scale-[1.02]' : ''
              }`}
            >
              {plan.popular && (
                <div className="mb-4">
                  <Badge className="bg-gradient-to-r from-brand-blue to-brand-sky text-white px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.title}</h3>
              <p className="text-gray-600 mb-4">{plan.subtitle}</p>
              
              <div className="mb-6">
                <div className="text-4xl font-bold text-gray-900">
                  {currency === 'USD' 
                    ? `$${(isAnnual ? plan.priceAnnualUsd : plan.priceMonthlyUsd).toLocaleString()}`
                    : `₪${(isAnnual ? plan.priceAnnualIls : plan.priceMonthlyIls).toLocaleString()}`
                  }
                  <span className="text-lg font-normal text-gray-600">
                    /{isAnnual ? 'year' : 'month'}
                  </span>
                </div>
                {isAnnual && (
                  <p className="text-green-600 text-sm mt-1">3 months free</p>
                )}
              </div>

              <Button
                onClick={handlePlanSelect}
                variant={plan.popular ? 'primary' : 'outline'}
                size="lg"
                className="w-full"
              >
                {plan.ctaLabel}
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {/* Table Header */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6">
            <div className="grid grid-cols-4 gap-4">
              <div className="text-left">
                <h4 className="text-lg font-semibold text-gray-900">Features</h4>
              </div>
              <div className="text-center">
                <h4 className="text-lg font-semibold text-gray-900">Starter</h4>
              </div>
              <div className="text-center">
                <h4 className="text-lg font-semibold text-gray-900">Pro</h4>
                {plans[1].popular && (
                  <Badge className="bg-gradient-to-r from-brand-blue to-brand-sky text-white text-xs mt-1">
                    Most Popular
                  </Badge>
                )}
              </div>
              <div className="text-center">
                <h4 className="text-lg font-semibold text-gray-900">Elite</h4>
              </div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {comparisonFeatures.map((feature, index) => (
              <motion.div
                key={feature.name}
                className="grid grid-cols-4 gap-4 px-8 py-6 hover:bg-gray-50 transition-colors duration-200"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="text-left">
                  <span className="text-gray-900 font-medium">{feature.name}</span>
                </div>
                
                <div className="text-center">
                  {typeof feature.starter === 'boolean' ? (
                    feature.starter ? (
                      <Check className="w-6 h-6 text-green-500 mx-auto" />
                    ) : (
                      <X className="w-6 h-6 text-red-400 mx-auto" />
                    )
                  ) : (
                    <span className="text-gray-900">{feature.starter}</span>
                  )}
                </div>
                
                <div className="text-center">
                  {typeof feature.pro === 'boolean' ? (
                    feature.pro ? (
                      <Check className="w-6 h-6 text-green-500 mx-auto" />
                    ) : (
                      <X className="w-6 h-6 text-red-400 mx-auto" />
                    )
                  ) : (
                    <span className="text-gray-900">{feature.pro}</span>
                  )}
                </div>
                
                <div className="text-center">
                  {typeof feature.elite === 'boolean' ? (
                    feature.elite ? (
                      <Check className="w-6 h-6 text-green-500 mx-auto" />
                    ) : (
                      <X className="w-6 h-6 text-red-400 mx-auto" />
                    )
                  ) : (
                    <span className="text-gray-900">{feature.elite}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <FAQ />
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;

