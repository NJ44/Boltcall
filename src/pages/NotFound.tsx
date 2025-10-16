import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Home } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-4"
        >
          <div className="w-80 h-80 mx-auto">
            <DotLottieReact
              src="/404_Animation.lottie"
              loop
              autoplay
              style={{
                width: '100%',
                height: '100%'
              }}
            />
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-4"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Page Not Found
          </h1>
          <p className="text-base text-gray-600 mb-4">
            Oops! It looks like our AI assistant couldn't find the page you're looking for. 
            Don't worry, we'll help you get back on track.
          </p>
        </motion.div>

        {/* Return to Home Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-base mx-auto"
          >
            <Home className="w-6 h-6" />
            Return to Homepage
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
