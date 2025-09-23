import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, Phone, BarChart3 } from 'lucide-react';
import Card from './ui/Card';
import Section from './ui/Section';
import Icon from './ui/Icon';

const ValueProps: React.FC = () => {
  const valueProps = [
    {
      icon: Clock,
      title: 'Speed to Lead',
      description: 'Auto-reply in under 30 seconds via SMS/WhatsApp/Web',
      color: 'text-green-600'
    },
    {
      icon: Calendar,
      title: '24/7 Booking',
      description: 'Answers FAQs and books into your calendar',
      color: 'text-blue-600'
    },
    {
      icon: Phone,
      title: 'Missed-Call Rescue',
      description: 'Texts back missed callers and saves the lead',
      color: 'text-purple-600'
    },
    {
      icon: BarChart3,
      title: 'Proof & Reports',
      description: 'Weekly summary with leads, bookings, no-shows',
      color: 'text-orange-600'
    }
  ];

  return (
    <Section id="value-props" background="gray">
      <div className="text-center mb-16">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-text-main mb-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Why Choose Boltcall?
        </motion.h2>
        <motion.p
          className="text-lg text-text-muted max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Transform your lead management with AI-powered automation that never sleeps
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {valueProps.map((prop, index) => (
          <motion.div
            key={prop.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card hover className="text-center h-full">
              <div className="mb-6">
                <div className={`w-16 h-16 mx-auto rounded-xl bg-gray-50 flex items-center justify-center mb-4`}>
                  <Icon
                    icon={prop.icon}
                    size="xl"
                    color="brand"
                  />
                </div>
                <h3 className="text-xl font-semibold text-text-main mb-3">
                  {prop.title}
                </h3>
                <p className="text-text-muted leading-relaxed">
                  {prop.description}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

export default ValueProps;
