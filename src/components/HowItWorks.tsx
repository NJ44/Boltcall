import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Zap, MessageCircle, Bot, Calendar, ArrowRight, Sparkles } from 'lucide-react';
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
      bgColor: 'from-blue-50 to-blue-100/50',
      iconColor: 'blue-600',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      icon: Bot,
      title: 'AI Responds',
      description: 'Our advanced AI immediately responds with personalized, contextual information – understanding context and intent in real-time.',
      step: '02',
      color: 'purple',
      bgColor: 'from-purple-50 to-purple-100/50',
      iconColor: 'purple-600',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      icon: Calendar,
      title: 'Intelligent Booking',
      description: 'Seamlessly books qualified appointments into your calendar while providing detailed insights and conversion analytics.',
      step: '03',
      color: 'green',
      bgColor: 'from-green-50 to-green-100/50',
      iconColor: 'green-600',
      gradient: 'from-green-500 to-green-600'
    }
  ];

  // Lightning bolt position based on scroll
  const lightningY = useTransform(scrollYProgress, [0, 1], ['10%', '85%']);

  return (
    <section 
      ref={containerRef}
      id="how-it-works" 
      className="relative py-24 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50"
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

      {/* Sparkling background elements */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-yellow-400 rounded-full opacity-60"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.5, 1, 0.5]
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 2
          }}
        />
      ))}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-100 to-amber-100 px-6 py-2 rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <span className="text-sm font-semibold text-amber-800">Powerful Automation</span>
          </div>
          
          <motion.h2
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true }}
        >
          How It Works
        </motion.h2>
          
        <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
            Three lightning-fast steps to transform your lead management with AI-powered precision and automation
        </motion.p>
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
              <Card className={`relative overflow-hidden bg-gradient-to-br ${step.bgColor} border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:-rotate-1 h-full`}>
                {/* Step number background */}
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${step.gradient} opacity-10 blur-xl`} />
                
                {/* Step number */}
                <div className={`absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br ${step.gradient} rounded-full flex items-center justify-center shadow-lg z-20`}>
                  <span className="text-sm font-bold text-white">{step.step}</span>
                    </div>

                    <div className="p-8 pt-12">
                  {/* Icon area */}
                      <motion.div
                    className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.6 }}
                  >
                    <step.icon className={`w-10 h-10 text-white drop-shadow-lg`} />
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
                    <div className={`w-12 h-12 bg-gradient-to-r ${step.gradient} rounded-full flex items-center justify-center shadow-lg`}>
                      <ArrowRight className="w-6 h-6 text-white" />
                  </div>
                </motion.div>
                )}

                {/* Glow effect on hover */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-xl`}
                />
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Card className="inline-block bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 text-white shadow-2xl p-8 hover:shadow-3xl transition-all duration-500 hover:scale-105">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Zap className="w-6 h-6 text-yellow-400 animate-pulse" />
                <span className="text-lg font-semibold">Ready to Electrify Your Lead Management?</span>
              </div>
              
              <p className="text-blue-100 mb-6 text-lg">
                Join thousands of businesses using Boltcall's lightning-fast AI automation.
              </p>
              
            <motion.button
                className="bg-white text-gray-900 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Get Started Today
            </motion.button>
          </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;