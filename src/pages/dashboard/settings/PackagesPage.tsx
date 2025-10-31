import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Target, User, Check, Star } from 'lucide-react';
import Button from '../../../components/ui/Button';

const PackagesPage: React.FC = () => {
  const packages = [
    {
      id: 'website-ultimate',
      name: 'Website Ultimate Package',
      icon: <Globe className="w-6 h-6" />,
      description: 'Complete website automation and AI integration package',
      price: '$299',
      period: '/month',
      features: [
        'AI-powered website chatbot',
        'Lead capture and qualification',
        '24/7 customer support automation',
        'Website analytics and insights',
        'Custom branding and styling',
        'Integration with 50+ platforms',
        'Advanced conversation flows',
        'Multi-language support',
        'A/B testing capabilities',
        'Priority support'
      ],
      popular: false
    },
    {
      id: 'ads-package',
      name: 'Ads Package',
      icon: <Target className="w-6 h-6" />,
      description: 'Maximize your advertising ROI with AI-powered ad management',
      price: '$199',
      period: '/month',
      features: [
        'AI ad optimization',
        'Automated bid management',
        'Cross-platform ad management',
        'Performance analytics',
        'Audience targeting optimization',
        'Ad creative testing',
        'Budget management',
        'ROI tracking and reporting',
        'Competitor analysis',
        'Ad scheduling automation'
      ],
      popular: true
    },
    {
      id: 'personal-assistant',
      name: 'Personal Assistant Package',
      icon: <User className="w-6 h-6" />,
      description: 'Your personal AI assistant for business automation',
      price: '$149',
      period: '/month',
      features: [
        'Personal AI assistant',
        'Email management and responses',
        'Calendar scheduling',
        'Task automation',
        'Document processing',
        'Meeting coordination',
        'Travel planning',
        'Expense tracking',
        'Report generation',
        'Voice commands support'
      ],
      popular: false
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Packages</h1>
        <p className="text-gray-600">Choose the package that best fits your business needs</p>
      </div>

      {/* Packages Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {packages.map((pkg, index) => (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative bg-gray-900 text-white border border-gray-700 rounded-2xl shadow-2xl shadow-gray-900/50 hover:shadow-3xl hover:shadow-gray-900/60 transition-all duration-300 overflow-hidden flex flex-col h-full ${
              pkg.popular ? 'ring-2 ring-gray-600 scale-[1.02]' : ''
            }`}
          >
            {/* Popular Badge */}
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                <span className="inline-flex items-center bg-white text-gray-900 px-4 py-1 text-sm font-medium rounded-full shadow-lg">
                  <Star className="w-3 h-3 mr-1 fill-current text-gray-900" />
                  Most Popular
                </span>
              </div>
            )}

            {/* Package Header */}
            <div className="p-6 pb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-300 border border-gray-700">
                  {pkg.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">{pkg.name}</h3>
                  <p className="text-gray-400 text-sm">{pkg.description}</p>
                </div>
              </div>
              
              <div className="flex items-baseline gap-1 mt-4">
                <span className="text-4xl font-bold text-white">{pkg.price}</span>
                <span className="text-gray-400 text-lg">{pkg.period}</span>
              </div>
            </div>

            {/* Package Features */}
            <div className="px-6 pb-6 flex-1">
              <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">What's Included:</h4>
              <ul className="space-y-3">
                {pkg.features.map((feature, featureIndex) => (
                  <motion.li
                    key={featureIndex}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (index * 0.1) + (featureIndex * 0.03) }}
                    className="flex items-start gap-3"
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-gray-300 leading-relaxed">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Package Footer */}
            <div className="p-6 pt-0 mt-auto">
              <Button
                variant={pkg.popular ? "primary" : "outline"}
                size="lg"
                className={`w-full ${
                  pkg.popular 
                    ? 'bg-white text-gray-900 hover:bg-gray-100 border-0' 
                    : 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700'
                }`}
              >
                {pkg.popular ? 'Get Started' : 'Choose Plan'}
              </Button>
              
              <p className="text-center text-xs text-gray-500 mt-3">
                48-hour setup included
              </p>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
};

export default PackagesPage;
