import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from './ui/Card';
import Section from './ui/Section';
import Button from './ui/Button';
import Badge from './ui/Badge';

const Pricing: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const navigate = useNavigate();

  const plans = [
    {
      name: 'STARTER',
      price: '$1297',
      description: 'Perfect for small dental practices getting started with AI receptionist.',
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
      buttonColor: 'bg-gray-900 text-white hover:bg-gray-800'
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
      name: 'ENTERPRISE',
      price: '$3997',
      description: 'Everything on PRO plus:',
      features: [
        'Embedded analytics',
        'Custom domains',
        'Whitelabeling',
        'Dedicated support'
      ],
      cta: 'Get started',
      popular: false,
      bgColor: 'bg-gray-900',
      textColor: 'text-white',
      buttonColor: 'bg-gray-100 text-gray-900 hover:bg-gray-200'
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
            
            <Card className={`h-full ${plan.bgColor} ${plan.textColor} border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out`}>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                
                <div className="mb-6">
                  <div className="text-3xl font-bold">
                    {plan.price}
                    {plan.period && <span className="text-lg font-normal text-gray-500">/{plan.period}</span>}
                  </div>
                </div>

                  <Button
                  onClick={() => navigate('/setup')}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 ease-in-out ${plan.buttonColor}`}
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

      {/* Guarantee Section */}
      <motion.div
        className="max-w-4xl mx-auto mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Check className="w-4 h-4" />
              30-Day Money-Back Guarantee
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Try Boltcall risk-free for 30 days
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              If you don't get 15 qualified leads in 30 days, we work free until you do. 
              No questions asked, no strings attached.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center gap-2 text-gray-700">
                <Check className="w-5 h-5 text-green-500" />
                <span>Full refund if not satisfied</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Check className="w-5 h-5 text-green-500" />
                <span>No setup fees</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Check className="w-5 h-5 text-green-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

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
          <div className="grid grid-cols-4 gap-0">
            <div className="text-left bg-gray-50 px-8 py-6">
              <h4 className="text-2xl font-bold text-gray-900">Compare our plans</h4>
            </div>
            <div className="text-center bg-gray-50 px-8 py-6">
              <div className="text-lg font-semibold text-gray-900">STARTER</div>
            </div>
            <div className="text-center bg-gray-50 px-8 py-6">
              <div className="text-lg font-semibold text-gray-900">PRO</div>
            </div>
            <div className="text-center bg-gray-900 px-8 py-6">
              <div className="text-lg font-semibold text-white">ENTERPRISE</div>
            </div>
          </div>

          {/* Table Body */}
          <div>
            {comparisonFeatures.map((feature, index) => (
              <motion.div
                key={`${feature.category}-${feature.name}`}
                className="group grid grid-cols-4 gap-0 transition-all duration-300 ease-in-out hover:bg-gray-50"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
              >
                <div className="text-left px-8 py-4 group-hover:bg-gray-50">
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
                
                <div className="text-center px-8 py-4 group-hover:bg-gray-50">
                  {typeof feature.starter === 'boolean' ? (
                    feature.starter ? (
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-red-400 mx-auto" />
                    )
                  ) : (
                    <span className="text-gray-900">{feature.starter || '-'}</span>
                  )}
                </div>
                
                <div className="text-center px-8 py-4 group-hover:bg-gray-50">
                  {typeof feature.pro === 'boolean' ? (
                    feature.pro ? (
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-red-400 mx-auto" />
                    )
                  ) : (
                    <span className="text-gray-900">{feature.pro || '-'}</span>
                  )}
                </div>
                
                <div className="text-center px-8 py-4 bg-gray-900 group-hover:bg-gray-800">
                  {typeof feature.enterprise === 'boolean' ? (
                    feature.enterprise ? (
                      <Check className="w-5 h-5 text-green-400 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-red-300 mx-auto" />
                    )
                  ) : (
                    <span className="text-white">{feature.enterprise || '-'}</span>
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