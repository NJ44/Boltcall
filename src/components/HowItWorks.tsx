import React from 'react';
import { motion } from 'framer-motion';
import Card from './ui/Card';
import WhisperText from './ui/whisper-text';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      title: 'Lead Arrives',
      description: 'When a potential customer reaches out – any channel, any time. Our powerful AI instantly recognizes and captures the lead.',
      step: '01',
      stepBg: 'bg-blue-600'
    },
    {
      title: 'AI Responds',
      description: 'Our advanced AI immediately responds with personalized, contextual information – understanding context and intent in real-time.',
      step: '02',
      stepBg: 'bg-purple-600'
    },
    {
      title: 'Intelligent Booking',
      description: 'Seamlessly books qualified appointments into your calendar while providing detailed insights and conversion analytics.',
      step: '03',
      stepBg: 'bg-green-600'
    }
  ];

  return (
    <section 
      id="how-it-works" 
      className="relative py-16 overflow-hidden bg-transparent -mt-32"
    >


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            <WhisperText
              text="Closing leads in lightning speed"
              className="text-4xl md:text-6xl font-bold text-white"
              delay={125}
              duration={0.625}
              x={-20}
              y={0}
              triggerStart="top 85%"
            />
          </h2>
          
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
              <Card className={`relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 border-none shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_50px_rgba(59,130,246,0.5)] transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2 h-full`}>
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 pointer-events-none" />
                
                <div className="p-8 pt-4 relative z-10">
                  {/* Step number - smaller at top left */}
                  <div className="mb-8 -ml-2 -mt-2">
                    <span className="text-3xl font-bold text-white/20">STEP {step.step}</span>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Gradient glow effect on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none"
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