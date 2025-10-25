import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Smartphone, Zap, Shield } from 'lucide-react';

const WhatsappPage: React.FC = () => {
  const integrations = [
    {
      name: 'WhatsApp Business API',
      description: 'Official WhatsApp Business API for enterprise messaging',
      icon: <MessageCircle className="w-8 h-8 text-green-600" />,
      features: ['Official API', 'Rich media support', 'Template messages', 'Business verification'],
      status: 'Beta',
      beta: true
    },
    {
      name: 'Twilio WhatsApp',
      description: 'WhatsApp messaging through Twilio platform',
      icon: <Smartphone className="w-8 h-8 text-blue-600" />,
      features: ['Twilio integration', 'Global reach', 'Advanced routing', 'Analytics'],
      status: 'Beta',
      beta: true
    },
    {
      name: '360Dialog',
      description: 'WhatsApp Business API provider with global coverage',
      icon: <Zap className="w-8 h-8 text-orange-600" />,
      features: ['Global coverage', 'Fast setup', 'Compliance tools', '24/7 support'],
      status: 'Beta',
      beta: true
    },
    {
      name: 'MessageBird WhatsApp',
      description: 'WhatsApp integration with advanced features',
      icon: <Shield className="w-8 h-8 text-purple-600" />,
      features: ['Advanced features', 'Compliance ready', 'Real-time delivery', 'Global reach'],
      status: 'Beta',
      beta: true
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div>
        </div>
      </motion.div>

      {/* Integrations Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {integrations.map((integration) => (
          <div
            key={integration.name}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {integration.icon}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{integration.name}</h3>
                  <p className="text-gray-600 text-sm">{integration.description}</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-full">
                {integration.status}
              </span>
            </div>
            
            <div className="space-y-2 mb-6">
              <h4 className="font-medium text-gray-900">Key Features:</h4>
              <ul className="space-y-1">
                {integration.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium">
              Connect {integration.name}
            </button>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default WhatsappPage;
