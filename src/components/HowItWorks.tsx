import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MessageSquare, Bot, Calendar } from 'lucide-react';
import Card from './ui/Card';
import Section from './ui/Section';
import Icon from './ui/Icon';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: MessageSquare,
      title: 'Lead Capture',
      description: 'Potential customers reach out via phone, website, or social media',
      step: '1'
    },
    {
      icon: Bot,
      title: 'AI Answers',
      description: 'Our AI responds instantly with personalized, helpful information',
      step: '2'
    },
    {
      icon: Calendar,
      title: 'Booking & Reporting',
      description: 'Leads are qualified and booked, with detailed reports provided',
      step: '3'
    }
  ];

  return (
    <Section id="how-it-works">
      <div className="text-center mb-16">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-text-main mb-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          How It Works
        </motion.h2>
        <motion.p
          className="text-lg text-text-muted max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Three simple steps to transform your lead management
        </motion.p>
      </div>

      <div className="relative">
        {/* Connection Lines */}
        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-blue/20 via-brand-blue/40 to-brand-blue/20 transform -translate-y-1/2 z-0" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              className="relative z-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="text-center">
                {/* Step Number */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="w-8 h-8 bg-brand-blue text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {step.step}
                  </div>
                </div>

                {/* Icon */}
                <div className="mb-6 mt-4">
                  <div className="w-16 h-16 mx-auto rounded-xl bg-brand-blue/10 flex items-center justify-center mb-4">
                    <Icon
                      icon={step.icon}
                      size="xl"
                      color="brand"
                    />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-text-main mb-3">
                  {step.title}
                </h3>
                <p className="text-text-muted leading-relaxed">
                  {step.description}
                </p>
              </Card>

              {/* Arrow (hidden on mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-20">
                  <ArrowRight className="w-6 h-6 text-brand-blue" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default HowItWorks;
