import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import Card from './ui/Card';
import Section from './ui/Section';
import Button from './ui/Button';
import Badge from './ui/Badge';

const Pricing: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: 'Starter',
      price: 'Free',
      description: 'Build on Index for free with your entire company. Upgrade for unlimited dashboards, editors, connections and dedicated enterprise features.',
      features: [
        '1 editor',
        '1 connection',
        '2 dashboards',
        'Answer questions with IndexAI'
      ],
      cta: 'Get started for free',
      popular: false,
      bgColor: 'bg-white',
      textColor: 'text-gray-900',
      buttonColor: 'bg-gray-100 text-gray-900 hover:bg-gray-200'
    },
    {
      name: 'PRO',
      price: '$1970',
      period: '',
      description: 'Everything on Starter plus:',
      features: [
        '1 editor',
        'Unlimited connections',
        'Unlimited dashboards',
        '10-20x higher AI question limit'
      ],
      cta: 'Get started for free',
      popular: true,
      bgColor: 'bg-white',
      textColor: 'text-gray-900',
      buttonColor: 'bg-gray-900 text-white hover:bg-gray-800'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'Everything on PRO plus:',
      features: [
        'Embedded analytics',
        'Custom domains',
        'Whitelabeling',
        'Dedicated support'
      ],
      cta: 'Get started with Enterprise',
      popular: false,
      bgColor: 'bg-gray-900',
      textColor: 'text-white',
      buttonColor: 'bg-gray-900 text-white hover:bg-gray-800'
    }
  ];

  const comparisonFeatures = [
    // Access
    { category: 'Access', name: 'Editors', starter: '', pro: '1', enterprise: 'Unlimited' },
    { category: 'Access', name: 'Viewers', starter: '', pro: '', enterprise: 'Unlimited' },
    
    // Fundamentals
    { category: 'Fundamentals', name: 'Connections', starter: '', pro: 'Unlimited', enterprise: 'Unlimited' },
    { category: 'Fundamentals', name: 'Dashboards', starter: '', pro: 'Unlimited', enterprise: 'Unlimited' },
    { category: 'Fundamentals', name: 'Blocks', starter: '', pro: 'Unlimited', enterprise: 'Unlimited' },
    { category: 'Fundamentals', name: 'Data Questions', starter: true, pro: true, enterprise: true, badge: 'New' },
    { category: 'Fundamentals', name: 'SQL Editor', starter: true, pro: true, enterprise: true },
    { category: 'Fundamentals', name: 'Visual Editor', starter: true, pro: true, enterprise: true },
    { category: 'Fundamentals', name: 'Filters', starter: true, pro: true, enterprise: true },
    { category: 'Fundamentals', name: 'Datasets', starter: true, pro: true, enterprise: true },
    { category: 'Fundamentals', name: 'Multiplayer', starter: true, pro: true, enterprise: true },
    { category: 'Fundamentals', name: 'Data Exports', starter: true, pro: true, enterprise: true },
    { category: 'Fundamentals', name: 'Formulas', starter: true, pro: true, enterprise: true },
    { category: 'Fundamentals', name: 'Search', starter: true, pro: true, enterprise: true },
    { category: 'Fundamentals', name: 'Keyboard Shortcuts', starter: true, pro: true, enterprise: true },
    { category: 'Fundamentals', name: 'Dark Mode', starter: true, pro: true, enterprise: true },
    { category: 'Fundamentals', name: 'Sharing Links', starter: true, pro: true, enterprise: true },
    
    // Organization
    { category: 'Organization', name: 'Teams', starter: '', pro: '', enterprise: true, badge: 'Coming Soon' },
    { category: 'Organization', name: 'Verified Metrics', starter: '', pro: '', enterprise: true },
    { category: 'Organization', name: 'Data Catalog', starter: '', pro: '', enterprise: true },
    { category: 'Organization', name: 'Audit Log', starter: '', pro: '', enterprise: true },
    { category: 'Organization', name: 'SAML Single Sign-On', starter: '', pro: '', enterprise: true },
    { category: 'Organization', name: 'Invoicing', starter: '', pro: '', enterprise: true },
    { category: 'Organization', name: 'Custom Branding', starter: '', pro: '', enterprise: true },
    
    // Support
    { category: 'Support', name: 'Chat and Email Support', starter: '', pro: true, enterprise: true },
    { category: 'Support', name: 'Dedicated Account Manager', starter: '', pro: '', enterprise: true }
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

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
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
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                <Badge className="bg-blue-500 text-white px-3 py-1 text-sm">
                  Popular
                </Badge>
              </div>
            )}
            
            <Card className={`h-full ${plan.bgColor} ${plan.textColor} border border-gray-200 shadow-xl`}>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                
                <div className="mb-6">
                  <div className="text-3xl font-bold">
                    {plan.price}
                    {plan.period && <span className="text-lg font-normal text-gray-500">/{plan.period}</span>}
                  </div>
                </div>

                  <Button
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${plan.buttonColor}`}
                  >
                  {plan.cta}
                  </Button>

                <div className="mt-6">
                  <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Included:</h4>
                {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Comparison Table */}
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          {/* Table Header */}
          <div className="bg-gray-50 px-8 py-6">
            <div className="grid grid-cols-4 gap-4">
              <div className="text-left">
                <h4 className="text-lg font-semibold text-gray-900">Compare our plans</h4>
              </div>
              <div className="text-center">
                <Button className="bg-gray-100 text-gray-900 hover:bg-gray-200 px-4 py-2 text-sm">
                  Sign up
                </Button>
              </div>
              <div className="text-center">
                <Button className="bg-gray-100 text-gray-900 hover:bg-gray-200 px-4 py-2 text-sm">
                  Sign up
                </Button>
              </div>
              <div className="text-center">
                <Button className="bg-gray-900 text-white hover:bg-gray-800 px-4 py-2 text-sm">
                  Book demo
                </Button>
              </div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {comparisonFeatures.map((feature, index) => (
              <motion.div
                key={`${feature.category}-${feature.name}`}
                className="grid grid-cols-4 gap-4 px-8 py-4 hover:bg-gray-50 transition-colors duration-200"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
              >
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-900 font-medium">{feature.name}</span>
                    {feature.badge && (
                      <Badge className={`text-xs px-2 py-0.5 ${
                        feature.badge === 'New' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {feature.badge}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="text-center">
                  {typeof feature.starter === 'boolean' ? (
                    feature.starter ? (
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-red-400 mx-auto" />
                    )
                  ) : (
                    <span className="text-gray-900">{feature.starter}</span>
                  )}
                </div>
                
                <div className="text-center">
                  {typeof feature.pro === 'boolean' ? (
                    feature.pro ? (
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-red-400 mx-auto" />
                    )
                  ) : (
                    <span className="text-gray-900">{feature.pro}</span>
                  )}
                </div>
                
                <div className="text-center bg-gray-900">
                  {typeof feature.enterprise === 'boolean' ? (
                    feature.enterprise ? (
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-red-400 mx-auto" />
                    )
                  ) : (
                    <span className="text-white">{feature.enterprise}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </Section>
  );
};

export default Pricing;