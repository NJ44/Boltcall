import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Target, User, Check, Star } from 'lucide-react';
import Button from '../../../components/ui/Button';

const PackagesPage: React.FC = () => {
  const packages = [
    {
      id: 'website-ultimate',
      name: 'Website Ultimate Package',
      icon: <Globe className="w-8 h-8" />,
      description: 'Complete website automation and AI integration package',
      price: '$299',
      period: '/month',
      color: 'from-blue-500 to-blue-700',
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
      icon: <Target className="w-8 h-8" />,
      description: 'Maximize your advertising ROI with AI-powered ad management',
      price: '$199',
      period: '/month',
      color: 'from-purple-500 to-purple-700',
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
      icon: <User className="w-8 h-8" />,
      description: 'Your personal AI assistant for business automation',
      price: '$149',
      period: '/month',
      color: 'from-green-500 to-green-700',
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

      {/* Packages Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {packages.map((pkg, index) => (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative bg-white rounded-2xl shadow-lg border-2 overflow-hidden ${
              pkg.popular ? 'border-purple-500 shadow-purple-200' : 'border-gray-200'
            }`}
          >
            {/* Popular Badge */}
            {pkg.popular && (
              <div className="absolute top-4 right-4 z-10">
                <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  Most Popular
                </div>
              </div>
            )}

            {/* Package Header */}
            <div className={`bg-gradient-to-r ${pkg.color} p-6 text-white relative overflow-hidden`}>
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 left-4 w-8 h-8 border-2 border-white rounded-full"></div>
                <div className="absolute bottom-4 right-4 w-6 h-6 border-2 border-white rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 border-2 border-white rounded-full"></div>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    {pkg.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{pkg.name}</h3>
                    <p className="text-white/80 text-sm">{pkg.description}</p>
                  </div>
                </div>
                
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{pkg.price}</span>
                  <span className="text-white/70">{pkg.period}</span>
                </div>
              </div>
            </div>

            {/* Package Features */}
            <div className="p-6">
              <h4 className="font-semibold text-gray-900 mb-4">What's Included:</h4>
              <ul className="space-y-3">
                {pkg.features.map((feature, featureIndex) => (
                  <motion.li
                    key={featureIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (index * 0.1) + (featureIndex * 0.05) }}
                    className="flex items-center gap-3"
                  >
                    <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${pkg.color} flex items-center justify-center flex-shrink-0`}>
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Package Footer */}
            <div className="p-6 pt-0">
              <Button
                variant={pkg.popular ? "primary" : "outline"}
                size="lg"
                className={`w-full ${
                  pkg.popular 
                    ? 'bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white border-0' 
                    : ''
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
