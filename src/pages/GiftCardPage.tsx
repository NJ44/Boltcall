import React from 'react';
import { motion } from 'framer-motion';
import GiftCard from '../components/ui/gift-card';

const GiftCardPage: React.FC = () => {
  return (
    <div className="min-h-screen py-12 px-4">
      {/* Background with brand colors */}
      <div className="fixed inset-0 bg-gradient-to-br from-brand-sky via-brand-blue to-brand-blueDark dark:from-blue-900 dark:via-blue-800 dark:to-blue-700 -z-10" />
      
      {/* Animated background orbs */}
      <motion.div
        className="fixed top-20 left-20 w-96 h-96 bg-brand-sky/20 dark:bg-brand-blue/10 rounded-full blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="fixed bottom-20 right-20 w-96 h-96 bg-brand-blue/20 dark:bg-brand-blueDark/10 rounded-full blur-3xl"
        animate={{
          x: [0, -50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Gift Cards
          </h1>
          <p className="text-gray-200 text-lg">
            Choose your perfect gift card
          </p>
        </motion.div>

        {/* Gift Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center justify-center">
          {/* First Gift Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="w-full max-w-md">
              <GiftCard balance="$250.00" variant="gradient" />
            </div>
          </motion.div>

          {/* Second Gift Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center"
          >
            <div className="w-full max-w-md">
              <GiftCard balance="$500.00" variant="gold" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default GiftCardPage;