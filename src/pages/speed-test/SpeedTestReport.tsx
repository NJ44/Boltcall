import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import GiveawayBar from '../../components/GiveawayBar';
import Header from '../../components/Header';
import Button from '../../components/ui/Button';
import { useSpeedTestStore } from '../../stores/speedTestStore';

const SpeedTestReport: React.FC = () => {
  const navigate = useNavigate();
  const { url, results } = useSpeedTestStore();

  // Redirect if no results
  useEffect(() => {
    if (!results) {
      navigate('/speed-test');
    }
  }, [results, navigate]);

  if (!results) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'fast':
        return 'text-green-600 bg-green-100';
      case 'average':
        return 'text-yellow-600 bg-yellow-100';
      case 'slow':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <GiveawayBar />
      <div className="relative z-10 pt-32">
        <Header />
        
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                Speed Test Results
              </h1>
              <p className="text-sm text-gray-600">{url}</p>
            </div>

            {/* Status Badge */}
            <div className="mb-6">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(results.status)}`}>
                Your website is {results.status}
              </div>
            </div>

            {/* KPIs Grid - Compact */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
              >
                <h3 className="text-xs font-medium text-gray-600 mb-1">Loading Time</h3>
                <p className="text-2xl font-bold text-gray-900">{results.loadingTime}s</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
              >
                <h3 className="text-xs font-medium text-gray-600 mb-1">Mobile Score</h3>
                <p className="text-2xl font-bold text-gray-900">{results.mobileScore}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
              >
                <h3 className="text-xs font-medium text-gray-600 mb-1">Desktop Score</h3>
                <p className="text-2xl font-bold text-gray-900">{results.desktopScore}</p>
              </motion.div>
            </div>

            {/* Key Issues */}
            {results.keyIssues.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6"
              >
                <h2 className="text-base font-semibold text-gray-900 mb-3">
                  What's slowing your site down
                </h2>
                <ul className="space-y-2">
                  {results.keyIssues.map((issue, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-gray-400">•</span>
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* CTA */}
            <div className="text-center">
              <Button
                onClick={() => navigate('/speed-test/offer')}
                variant="primary"
                size="lg"
                className="px-8 py-3 text-lg"
              >
                Optimize My Website
              </Button>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default SpeedTestReport;

