import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import Card from './ui/Card';
import Section from './ui/Section';
import Button from './ui/Button';
import Badge from './ui/Badge';

const Pricing: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for small businesses getting started',
      monthlyPrice: 297,
      annualPrice: 2970, // 10 months price
      setupPrice: 497,
      features: [
        'Up to 100 leads/month',
        '30-second response time',
        'SMS & WhatsApp integration',
        'Basic reporting',
        'Email support'
      ],
      limitations: [
        'No calendar integration',
        'Limited customization'
      ],
      popular: false
    },
    {
      name: 'Growth',
      description: 'Ideal for growing businesses',
      monthlyPrice: 497,
      annualPrice: 4970,
      setupPrice: 1500,
      features: [
        'Up to 500 leads/month',
        '15-second response time',
        'Full channel integration',
        'Calendar booking',
        'Advanced reporting',
        'Priority support',
        'Custom workflows'
      ],
      limitations: [
        'No API access'
      ],
      popular: true
    },
    {
      name: 'Pro',
      description: 'For enterprise-level businesses',
      monthlyPrice: 697,
      annualPrice: 6970,
      setupPrice: 2500,
      features: [
        'Unlimited leads',
        '10-second response time',
        'All integrations',
        'Advanced AI features',
        'Custom reporting',
        'Dedicated support',
        'API access',
        'White-label options'
      ],
      limitations: [],
      popular: false
    }
  ];

  const toggleBilling = () => {
    setIsAnnual(!isAnnual);
  };

  return (
    <Section id="pricing">
      <div className="text-center mb-16">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-text-main mb-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Simple, Transparent Pricing
        </motion.h2>
        <motion.p
          className="text-lg text-text-muted max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Choose the plan that fits your business needs. All plans include our 30-day guarantee.
        </motion.p>

        {/* Billing Toggle */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <span className={`text-lg font-medium ${!isAnnual ? 'text-text-main' : 'text-text-muted'}`}>
            Monthly
          </span>
          <button
            onClick={toggleBilling}
            className="relative w-14 h-7 bg-gray-200 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
          >
            <motion.div
              className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md"
              animate={{ x: isAnnual ? 28 : 0 }}
              transition={{ duration: 0.2 }}
            />
          </button>
          <span className={`text-lg font-medium ${isAnnual ? 'text-text-main' : 'text-text-muted'}`}>
            Annual
          </span>
          {isAnnual && (
            <Badge variant="success">Save 17%</Badge>
          )}
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="relative"
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                <Badge variant="brand" size="md">
                  Most Popular
                </Badge>
              </div>
            )}
            
            <Card className={`h-full ${plan.popular ? 'ring-2 ring-brand-blue shadow-lg' : ''}`}>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-text-main mb-2">{plan.name}</h3>
                <p className="text-text-muted mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  <div className="text-4xl font-bold text-text-main">
                    ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                    <span className="text-lg font-normal text-text-muted">
                      /{isAnnual ? 'year' : 'month'}
                    </span>
                  </div>
                  <div className="text-sm text-text-muted mt-2">
                    + ${plan.setupPrice} setup fee
                  </div>
                </div>

                <Button
                  variant={plan.popular ? 'primary' : 'outline'}
                  size="lg"
                  className="w-full"
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Get Started
                </Button>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-text-main mb-4">What's included:</h4>
                
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-text-muted">{feature}</span>
                  </div>
                ))}

                {plan.limitations.length > 0 && (
                  <div className="pt-4 border-t border-border">
                    <h5 className="font-medium text-text-main mb-2">Not included:</h5>
                    {plan.limitations.map((limitation, limitationIndex) => (
                      <div key={limitationIndex} className="flex items-start gap-3">
                        <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <span className="text-text-muted text-sm">{limitation}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Guarantee */}
      <motion.div
        className="text-center mt-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="bg-brand-sky/10 rounded-xl p-8 max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold text-text-main mb-2">
            30-Day Money-Back Guarantee
          </h3>
          <p className="text-text-muted">
            If you don't get 15 qualified leads in 30 days, we work free until you do. 
            No questions asked.
          </p>
        </div>
      </motion.div>
    </Section>
  );
};

export default Pricing;
