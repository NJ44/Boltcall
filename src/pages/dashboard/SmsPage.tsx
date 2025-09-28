import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Smartphone, Zap, Shield, Clock } from 'lucide-react';

const SmsPage: React.FC = () => {
  const integrations = [
    {
      name: 'Twilio',
      description: 'Send and receive SMS messages with high deliverability rates',
      icon: <MessageSquare className="w-8 h-8 text-blue-600" />,
      features: ['Global SMS delivery', 'Two-way messaging', 'Delivery receipts', 'Phone number verification'],
      status: 'Available'
    },
    {
      name: 'Vonage (Nexmo)',
      description: 'Enterprise-grade SMS API with advanced features',
      icon: <Smartphone className="w-8 h-8 text-green-600" />,
      features: ['SMS API', 'Number verification', 'Advanced analytics', 'Global coverage'],
      status: 'Available'
    },
    {
      name: 'AWS SNS',
      description: 'Scalable SMS service with AWS infrastructure',
      icon: <Zap className="w-8 h-8 text-orange-600" />,
      features: ['High scalability', 'AWS integration', 'Cost-effective', 'Reliable delivery'],
      status: 'Available'
    },
    {
      name: 'MessageBird',
      description: 'Global messaging platform with advanced features',
      icon: <Shield className="w-8 h-8 text-purple-600" />,
      features: ['Global reach', 'Advanced routing', 'Compliance tools', 'Real-time analytics'],
      status: 'Available'
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
          <div className="p-3 bg-blue-50 rounded-lg">
            <MessageSquare className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">SMS Integrations</h1>
            <p className="text-gray-600 mt-2">Connect your SMS service to automate patient communication</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <Clock className="w-5 h-5 text-gray-600" />
            <div>
              <div className="font-medium text-gray-900">Real-time</div>
              <div className="text-sm text-gray-600">Instant delivery</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <Shield className="w-5 h-5 text-gray-600" />
            <div>
              <div className="font-medium text-gray-900">Secure</div>
              <div className="text-sm text-gray-600">HIPAA compliant</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <Zap className="w-5 h-5 text-gray-600" />
            <div>
              <div className="font-medium text-gray-900">Automated</div>
              <div className="text-sm text-gray-600">Smart responses</div>
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
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                {integration.status}
              </span>
            </div>
            
            <div className="space-y-2 mb-6">
              <h4 className="font-medium text-gray-900">Key Features:</h4>
              <ul className="space-y-1">
                {integration.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
              Connect {integration.name}
            </button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default SmsPage;
