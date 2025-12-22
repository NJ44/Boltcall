import React, { useEffect } from 'react';
import { updateMetaDescription } from '../lib/utils';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GiveawayBar from '../components/GiveawayBar';

const AIVisibilityCheck: React.FC = () => {
  useEffect(() => {
    document.title = 'Free AI Visibility Check - Analyze Your AI Presence';
    updateMetaDescription('Free AI visibility check analyzes your website AI presence. Get detailed report on AI visibility and optimization opportunities. Start now.');
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <GiveawayBar />
      <Header />
      
      {/* Coming Soon Section */}
      <section className="relative pt-32 pb-64 bg-gradient-to-br from-blue-50 via-white to-blue-50/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-full mb-4">
              <Eye className="w-4 h-4" />
              <span className="font-semibold">AI Visibility Analysis</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Check Your <span className="text-blue-600">AI Visibility</span>
            </h1>
            <p className="text-2xl md:text-3xl font-semibold text-gray-600">
              Coming Soon
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AIVisibilityCheck;

