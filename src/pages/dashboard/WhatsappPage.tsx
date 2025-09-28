import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Smartphone, Zap, Shield, Clock, AlertCircle } from 'lucide-react';

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
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-green-50 rounded-lg">
            <MessageCircle className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-gray-900">WhatsApp Integrations</h1>
              <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                BETA
              </span>
            </div>
            <p className="text-gray-600 mt-2">Connect WhatsApp Business for patient communication</p>
          </div>
        </div>
        
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-orange-900">Beta Notice</h3>
              <p className="text-orange-800 text-sm mt-1">
                WhatsApp integrations are currently in beta. Some features may be limited or require additional setup.
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <Clock className="w-5 h-5 text-gray-600" />
            <div>
              <div className="font-medium text-gray-900">Real-time</div>
              <div className="text-sm text-gray-600">Instant messaging</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <Shield className="w-5 h-5 text-gray-600" />
            <div>
              <div className="font-medium text-gray-900">Secure</div>
              <div className="text-sm text-gray-600">End-to-end encryption</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <Zap className="w-5 h-5 text-gray-600" />
            <div>
              <div className="font-medium text-gray-900">Rich Media</div>
              <div className="text-sm text-gray-600">Images, videos, documents</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Integrations Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {integrations.map((integration, index) => (
          <motion.div
            key={integration.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
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
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default WhatsappPage;
