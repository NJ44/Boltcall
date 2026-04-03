import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlarmClock, RefreshCcw, Megaphone, MessageSquare, Globe, Phone } from 'lucide-react';

const FreeSetup: React.FC = () => {
  const navigate = useNavigate();
  const features = [
    {
      title: 'Reminders',
      description: 'Reduce no-shows automatically.',
      icon: AlarmClock,
      href: '/features/automated-reminders',
    },
    {
      title: 'Follow Ups',
      description: 'Keep conversations warm.',
      icon: RefreshCcw,
      href: '/features/ai-follow-up-system',
    },
    {
      title: 'Ads',
      description: 'Turn clicks into calls.',
      icon: Megaphone,
      href: '/features/instant-form-reply',
    },
    {
      title: 'SMS',
      description: 'Two-way texting that books.',
      icon: MessageSquare,
      href: '/features/sms-booking-assistant',
    },
    {
      title: 'Website',
      description: 'Book meetings on your site.',
      icon: Globe,
      href: '/features/website-widget',
    },
    {
      title: 'AI Receptionist',
      description: 'Answer and route every call.',
      icon: Phone,
      href: '/features/ai-receptionist',
    },
  ];

  // Removed unused timeline and visualization per design update

  return (
    <section className="pt-16 md:pt-64 pb-12 md:pb-20 mt-8 md:mt-[150px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="text-left">
            <motion.div 
              className="mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <span className="text-sm uppercase tracking-wider font-medium text-white/70">SETUP</span>
            </motion.div>
            <motion.h2
              className="font-bold text-white mb-6 text-3xl md:text-[44px] leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div>One Setup.</div>
              <div>All <span className="text-blue-500">Channels.</span></div>
            </motion.h2>
            <motion.p 
              className="text-base md:text-xl text-white mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              Get your helper ready in just a few minutes. It is free to set up. You don't need a credit card.
            </motion.p>
            <motion.button
              onClick={() => navigate('/signup')}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg text-lg font-medium hover:bg-gray-50 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
            >
              Start Setup
            </motion.button>
          </div>

          {/* Right side - Feature list */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {features.map((feature) => (
                <button
                  key={feature.title}
                  onClick={() => navigate(feature.href)}
                  className="flex items-center gap-3 px-5 py-4 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all duration-200 cursor-pointer text-left"
                >
                  <feature.icon className="h-5 w-5 text-blue-600 shrink-0" />
                  <div>
                    <h3 className="text-sm font-bold leading-none">{feature.title}</h3>
                    <p className="text-[11px] text-gray-500 mt-1 font-normal">{feature.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FreeSetup;
