import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import Confetti from 'react-confetti';
import { CheckCircle } from 'lucide-react';

interface FeatureOnboardingProps {
  featureKey: string;
  icon: LucideIcon;
  title: string;
  description: string;
  onActivate: () => void;
  children: React.ReactNode;
}

const FeatureOnboarding: React.FC<FeatureOnboardingProps> = ({
  featureKey,
  icon: Icon,
  title,
  description,
  onActivate,
  children
}) => {
  const [isActivated, setIsActivated] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Check if feature is already activated
    const activated = localStorage.getItem(`feature_${featureKey}_activated`) === 'true';
    setIsActivated(activated);

    // Set window size for confetti
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [featureKey]);

  const handleActivate = () => {
    // Mark as activated
    localStorage.setItem(`feature_${featureKey}_activated`, 'true');
    setIsActivated(true);
    
    // Show confetti
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    
    // Show success popup
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 3000);
    
    // Call the onActivate callback
    onActivate();
  };

  // If activated, show the regular content
  if (isActivated) {
    return <>{children}</>;
  }

  // Show onboarding screen
  return (
    <>
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
        />
      )}

      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 border-2 border-green-200">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Feature Activated!</h3>
                <p className="text-gray-600">
                  {title} is now active. You can start configuring it below.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl w-full text-center"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-8 flex justify-center"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
              <Icon className="w-16 h-16 text-white" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            {title}
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 mb-10 leading-relaxed max-w-xl mx-auto"
          >
            {description}
          </motion.p>

          {/* Activate Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={handleActivate}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Activate {title}
          </motion.button>
        </motion.div>
      </div>
    </>
  );
};

export default FeatureOnboarding;

