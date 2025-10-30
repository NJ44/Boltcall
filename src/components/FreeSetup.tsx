import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const FreeSetup: React.FC = () => {
  const navigate = useNavigate();

  // Removed unused timeline and visualization per design update

  return (
    <section className="py-20">
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
              className="font-bold text-white mb-6" 
              style={{ fontSize: '54px', lineHeight: '0.9' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div>One Setup.</div>
              <div>All <span className="text-blue-500">Channels.</span></div>
            </motion.h2>
            <motion.p 
              className="text-xl text-white mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              Get your AI assistant up and running in minutes with our completely free setup process. No hidden fees, no credit card required.
            </motion.p>
            <motion.button
              onClick={() => navigate('/setup')}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg text-lg font-medium hover:bg-gray-50 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
            >
              Start Setup
            </motion.button>
          </div>

          {/* Right side removed per request */}
        </div>
      </div>
    </section>
  );
};

export default FreeSetup;
