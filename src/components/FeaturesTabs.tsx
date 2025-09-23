import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Clock, MessageCircle, User } from 'lucide-react';
import Card from './ui/Card';
import Section from './ui/Section';
import Icon from './ui/Icon';

const FeaturesTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const features = [
    {
      icon: Zap,
      title: 'Speed-to-Lead',
      description: 'Lightning-fast response times that capture leads before they go cold',
      details: [
        '30-second average response time',
        'Multi-channel support (SMS, WhatsApp, Web)',
        'Intelligent lead scoring and prioritization',
        'Automated follow-up sequences'
      ]
    },
    {
      icon: Clock,
      title: '24/7 Booking',
      description: 'Never miss an opportunity with round-the-clock availability',
      details: [
        '24/7 calendar integration',
        'Smart scheduling based on availability',
        'Automatic timezone handling',
        'Rescheduling and cancellation management'
      ]
    },
    {
      icon: MessageCircle,
      title: 'DM Bot',
      description: 'Engage prospects across all social media platforms',
      details: [
        'Instagram, Facebook, LinkedIn integration',
        'Natural conversation flow',
        'Lead qualification in real-time',
        'Seamless handoff to human agents'
      ]
    },
    {
      icon: User,
      title: 'AI Receptionist',
      description: 'Professional virtual receptionist for all your communication needs',
      details: [
        'Phone call handling and routing',
        'Email management and responses',
        'Appointment scheduling and confirmation',
        'Customer service automation'
      ]
    }
  ];

  return (
    <Section id="features" background="brand">
      <div className="text-center mb-16">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-text-main mb-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Powerful Features
        </motion.h2>
        <motion.p
          className="text-lg text-text-muted max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Everything you need to capture, qualify, and convert leads automatically
        </motion.p>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {features.map((feature, index) => (
            <button
              key={feature.title}
              onClick={() => setActiveTab(index)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === index
                  ? 'bg-brand-blue text-white shadow-lg'
                  : 'bg-white text-text-muted hover:text-brand-blue hover:bg-white/80'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon
                  icon={feature.icon}
                  size="sm"
                  color={activeTab === index ? 'white' : 'muted'}
                />
                <span>{feature.title}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Content */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-brand-blue/10 rounded-xl flex items-center justify-center">
                      <Icon
                        icon={features[activeTab].icon}
                        size="lg"
                        color="brand"
                      />
                    </div>
                    <h3 className="text-2xl font-bold text-text-main">
                      {features[activeTab].title}
                    </h3>
                  </div>
                  
                  <p className="text-lg text-text-muted mb-6 leading-relaxed">
                    {features[activeTab].description}
                  </p>

                  <ul className="space-y-3">
                    {features[activeTab].details.map((detail, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-brand-blue rounded-full mt-2 flex-shrink-0" />
                        <span className="text-text-muted">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Visual */}
                <div className="bg-gradient-to-br from-brand-blue/10 to-brand-sky/20 rounded-xl p-8">
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-blue/10 rounded-full flex items-center justify-center">
                          <Icon
                            icon={features[activeTab].icon}
                            size="sm"
                            color="brand"
                          />
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </Section>
  );
};

export default FeaturesTabs;
