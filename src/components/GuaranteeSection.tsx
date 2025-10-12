import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Shield, Phone, LayoutDashboard, Clock, CheckCircle2, TrendingUp } from 'lucide-react';
import WhisperText from './ui/whisper-text';

const GuaranteeSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const features = [
    {
      icon: Shield,
      title: "Free Agent",
      description: "Custom-built AI agent tailored to your business needs"
    },
    {
      icon: Phone,
      title: "Free Phone Number",
      description: "Dedicated business line for your AI receptionist"
    },
    {
      icon: LayoutDashboard,
      title: "Dashboard Access",
      description: "Full control panel to customize and monitor your agent"
    },
    {
      icon: Clock,
      title: "100 Free Minutes",
      description: "Test your agent with real calls at no cost"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-white via-blue-50/30 to-white relative overflow-hidden"
    >
      {/* Subtle Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6">
            <Shield className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600">Risk-Free Guarantee</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <WhisperText
              text="No-Lead, No-Fee"
              className="text-4xl md:text-5xl font-bold text-gray-900 inline-block"
              delay={125}
              duration={0.625}
              x={-20}
              y={0}
              triggerStart="top 85%"
            />{' '}
            <WhisperText
              text="Guarantee"
              className="text-4xl md:text-5xl font-bold text-blue-600 inline-block"
              delay={125}
              duration={0.625}
              x={-20}
              y={0}
              triggerStart="top 85%"
            />
          </h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            We're so confident in our service that we'll set you up completely free. 
            No risk, no commitments, just results.
          </motion.p>
        </motion.div>

        {/* Free Setup Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-12"
        >
          <div className="bg-gradient-to-br from-white to-blue-50/50 rounded-2xl shadow-xl border border-gray-200/50 p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
              Complete Free Setup - Here's What You Get:
            </h3>
            
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.15 }}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                >
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-center text-white"
            >
              <p className="text-lg font-medium">
                Don't like what you see? <span className="font-bold">No problem.</span> Walk away with zero obligations.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Performance Guarantee Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl p-8 md:p-12 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
                Our Performance Promise
              </h3>
              
              <div className="max-w-3xl mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/20">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="text-xl font-semibold text-white mb-2">
                        10+ Appointment Guarantee
                      </h4>
                      <p className="text-gray-300">
                        If we don't generate at least 10 additional qualified appointments for your business, 
                        <span className="font-bold text-white"> we'll continue working for you completely free</span> until we deliver on our promise.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-lg text-gray-300 mb-4">
                    That's right - <span className="text-white font-bold">zero risk for you, all the pressure on us</span> to deliver results.
                  </p>
                  <p className="text-blue-400 font-semibold text-xl">
                    You only pay when you see real, measurable growth.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GuaranteeSection;

