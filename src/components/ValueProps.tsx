import React from 'react';
import { motion } from 'framer-motion';
import Card from './ui/Card';
import Section from './ui/Section';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const ValueProps: React.FC = () => {
  const valueProps = [
    {
      title: 'Dashboard Analytics',
      description: 'Comprehensive insights and performance metrics to track your lead conversion, response times, and booking success rates in real-time.',
      animation: '/statistics_on_tab.lottie'
    },
    {
      title: 'Speed to Lead System',
      description: 'Lightning-fast response system that captures leads within 30 seconds across all channels, ensuring no opportunity is missed.',
      animation: '/Data_protection.lottie'
    },
    {
      title: 'AI Receptionist',
      description: 'Intelligent virtual assistant that handles calls, qualifies leads, books appointments, and provides 24/7 customer service.',
      animation: '/AI_assistant.lottie'
    }
  ];

  return (
    <Section id="value-props" background="white">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {valueProps.map((prop, index) => (
          <motion.div
            key={prop.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="text-center h-full bg-gradient-to-br from-white via-gray-50/30 to-white shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200/50 rounded-3xl overflow-hidden group hover:scale-[1.02]">
              <div className="p-10">
                {/* Header */}
                <h3 className="text-3xl font-bold text-gray-900 mb-6 group-hover:text-brand-blue transition-colors duration-300">
                  {prop.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 leading-relaxed text-lg mb-8">
                  {prop.description}
                </p>
                
                {/* Animation */}
                <div className="w-40 h-40 mx-auto relative">
                  <DotLottieReact
                    src={prop.animation}
                    loop
                    autoplay
                    style={{
                      width: '100%',
                      height: '100%'
                    }}
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

export default ValueProps;
