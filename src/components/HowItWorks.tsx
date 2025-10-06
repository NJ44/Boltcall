import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Zap, MessageCircle, Bot, Calendar, ArrowRight } from 'lucide-react';
import Card from './ui/Card';

const HowItWorks: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  const steps = [
    {
      icon: MessageCircle,
      title: 'Lead Arrives',
      description: 'When a potential customer reaches out – any channel, any time. Our powerful AI instantly recognizes and captures the lead.',
      step: '01',
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
      stepBg: 'bg-blue-600'
    },
    {
      icon: Bot,
      title: 'AI Responds',
      description: 'Our advanced AI immediately responds with personalized, contextual information – understanding context and intent in real-time.',
      step: '02',
      color: 'purple',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-100',
      stepBg: 'bg-purple-600'
    },
    {
      icon: Calendar,
      title: 'Intelligent Booking',
      description: 'Seamlessly books qualified appointments into your calendar while providing detailed insights and conversion analytics.',
      step: '03',
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100',
      stepBg: 'bg-green-600'
    }
  ];

  // Lightning bolt position based on scroll
  const lightningY = useTransform(scrollYProgress, [0, 1], ['10%', '85%']);

  return (
    <section 
      ref={containerRef}
      id="how-it-works" 
      className="relative py-16 overflow-hidden bg-transparent -mt-16"
    >
      {/* Lightning bolt that follows scroll */}
      <motion.div
        className="absolute left-1/2 transform -translate-x-1/2 z-10"
        style={{ 
          y: lightningY,
          left: '50%'
        }}
      >
        <motion.div
          animate={{ 
            opacity: [0.4, 0.8, 0.4],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="relative"
        >
          <Zap 
            size={32} 
            className="text-amber-500 drop-shadow-lg" 
            style={{ filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.5))' }}
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.5
            }}
            className="absolute inset-0 bg-yellow-400 blur-md opacity-60 rounded-full"
          />
        </motion.div>
      </motion.div>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          
          <motion.h2
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true }}
        >
          Closing leads in lightning speed
        </motion.h2>
          
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              className="group relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              {/* Card */}
              <Card className={`relative overflow-hidden ${step.bgColor} border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2 h-full`}>
                {/* Step number background */}
                <div className={`absolute top-0 right-0 w-20 h-20 ${step.stepBg} opacity-5 blur-xl`} />
                
                {/* Step number */}
                <div className={`absolute -top-4 -right-4 w-16 h-16 ${step.stepBg} rounded-full flex items-center justify-center shadow-xl z-20`}>
                  <span className="text-sm font-bold text-white">{step.step}</span>
                    </div>

                    <div className="p-8 pt-12">
                  {/* Icon area */}
                      <motion.div
                    className={`w-20 h-20 mx-auto rounded-2xl ${step.iconBg} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-all duration-300`}
                    whileHover={{ rotate: 180, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <step.icon className={`w-10 h-10 ${step.iconColor} drop-shadow-sm`} />
                      </motion.div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                        {step.title}
                      </h3>
                  
                  <p className="text-gray-600 text-center leading-relaxed mb-6">
                        {step.description}
                      </p>
                    </div>

                {/* Connector Arrow */}
                {index < steps.length - 1 && (
                <motion.div
                    className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-30"
                    animate={{ x: [0, 5, 0] }}
                        transition={{ 
                          duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                  >
                    <div className={`w-12 h-12 ${step.stepBg} rounded-full flex items-center justify-center shadow-xl`}>
                      <ArrowRight className="w-6 h-6 text-white" />
                  </div>
                </motion.div>
                )}

                {/* Subtle hover effect */}
                <motion.div
                  className={`absolute inset-0 ${step.stepBg} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-xl`}
                />
              </Card>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;