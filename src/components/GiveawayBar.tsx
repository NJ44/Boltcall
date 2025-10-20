import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Gift, X, Star } from 'lucide-react';

const GiveawayBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white fixed top-0 left-0 right-0 z-50"
        >
          {/* Animated background pattern */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-white/10 rounded-full animate-ping"></div>
            <div className="absolute -top-2 -right-6 w-6 h-6 bg-white/10 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute -bottom-3 left-1/4 w-4 h-4 bg-white/10 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
            <div className="absolute -bottom-2 right-1/3 w-5 h-5 bg-white/10 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
          </div>

          <div className="relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between py-2">
                {/* Left side - Announcement content */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Gift className="w-6 h-6 text-yellow-300 animate-bounce" />
                      <Star className="absolute -top-1 -right-1 w-3 h-3 text-yellow-300 fill-current animate-pulse" />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                      <span className="font-bold text-lg">🎉 MEGA GIVEAWAY! 🎉</span>
                      <span className="text-sm sm:text-base opacity-90">
                        Win a <strong>$1,000 Amazon Gift Card</strong> + <strong>1 Year Free Pro Plan</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Center - CTA Button */}
                <div className="hidden md:flex items-center">
                  <Link
                    to="/giveaway"
                    className="inline-flex items-center px-6 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full font-semibold text-sm transition-all duration-300 transform hover:scale-105 border border-white/30"
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    Enter Now - Free!
                  </Link>
                </div>

                {/* Right side - Dismiss button */}
                <button
                  onClick={handleDismiss}
                  className="flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors duration-200"
                  aria-label="Dismiss announcement"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile CTA */}
              <div className="md:hidden pb-2">
                <Link
                  to="/giveaway"
                  className="inline-flex items-center justify-center w-full px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg font-semibold text-sm transition-all duration-300 border border-white/30"
                >
                  <Gift className="w-4 h-4 mr-2" />
                  Enter Giveaway - Win $1,000 + Free Pro Plan!
                </Link>
              </div>
            </div>
          </div>

          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 animate-shimmer"></div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GiveawayBar;
