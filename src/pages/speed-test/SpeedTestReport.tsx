import React, { useEffect } from 'react';
import { updateMetaDescription } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Smartphone, Monitor, AlertCircle, Zap, CheckCircle, XCircle } from 'lucide-react';
import GiveawayBar from '../../components/GiveawayBar';
import Header from '../../components/Header';
import Button from '../../components/ui/Button';
import { useSpeedTestStore } from '../../stores/speedTestStore';

const SpeedTestReport: React.FC = () => {
  const navigate = useNavigate();
  const { url, results, webhookResults } = useSpeedTestStore();

  useEffect(() => {
    document.title = 'Website Health Check Report - Performance Analysis';
    updateMetaDescription('View your website health check report with detailed performance analysis, scores, and optimization recommendations. See report.');
  }, []);

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
        return 'text-green-600 bg-green-100 border-green-200';
      case 'average':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'slow':
        return 'text-red-600 bg-red-100 border-red-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    if (score >= 30) return 'text-orange-500';
    return 'text-red-500';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-600';
    if (score >= 70) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    if (score >= 30) return 'bg-orange-500';
    return 'bg-red-500';
  };


  // Helper to render webhook results
  const renderWebhookResults = () => {
    if (!webhookResults) return null;

    // Handle different possible webhook response structures
    const data = webhookResults.data || webhookResults;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
      >
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          Health Check Results
        </h3>
        <div className="space-y-2">
          {typeof data === 'object' && data !== null ? (
            Object.entries(data).map(([key, value]) => (
              <div key={key} className="flex items-start justify-between gap-2 text-xs">
                <span className="text-gray-600 capitalize">{key.replace(/_/g, ' ')}:</span>
                <span className="text-gray-900 font-medium text-right">
                  {typeof value === 'boolean' ? (
                    value ? (
                      <CheckCircle className="w-3.5 h-3.5 text-green-600 inline" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-red-600 inline" />
                    )
                  ) : typeof value === 'object' ? (
                    JSON.stringify(value)
                  ) : (
                    String(value)
                  )}
                </span>
              </div>
            ))
          ) : (
            <div className="text-xs text-gray-600">{JSON.stringify(data)}</div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="relative min-h-screen bg-white">
      <GiveawayBar />
      <div className="relative z-10 pt-32">
        <Header />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            {/* Compact Header */}
            <div className="text-center mb-4">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Website Health Check
              </h1>
              <p className="text-xs text-gray-500 break-all">{url}</p>
            </div>

            {/* Compact Status Badge */}
            <div className="text-center mb-4">
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(results.status)}`}>
                <Zap className="w-3.5 h-3.5" />
                {results.status}
              </div>
            </div>

            {/* Webhook Results */}
            {renderWebhookResults()}

            {/* Compact Performance Metrics Grid */}
            <div className="grid grid-cols-3 gap-3">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <h3 className="text-xs font-medium text-gray-600">Load Time</h3>
                </div>
                <p className="text-xl font-bold text-gray-900">{results.loadingTime}s</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Smartphone className="w-4 h-4 text-purple-600" />
                  <h3 className="text-xs font-medium text-gray-600">Mobile</h3>
                </div>
                <p className={`text-xl font-bold ${getScoreColor(results.mobileScore)}`}>
                  {results.mobileScore}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-1 mt-1.5">
                  <div
                    className={`h-1 rounded-full ${getScoreBgColor(results.mobileScore)}`}
                    style={{ width: `${results.mobileScore}%` }}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Monitor className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-xs font-medium text-gray-600">Desktop</h3>
                </div>
                <p className={`text-xl font-bold ${getScoreColor(results.desktopScore)}`}>
                  {results.desktopScore}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-1 mt-1.5">
                  <div
                    className={`h-1 rounded-full ${getScoreBgColor(results.desktopScore)}`}
                    style={{ width: `${results.desktopScore}%` }}
                  />
                </div>
              </motion.div>
            </div>

            {/* Compact Performance Issues */}
            {results.keyIssues && results.keyIssues.length > 0 && results.keyIssues[0] !== 'No major issues detected' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm"
              >
                <h2 className="text-xs font-semibold text-gray-900 mb-2 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-orange-500" />
                  Issues
                </h2>
                <ul className="space-y-1.5">
                  {results.keyIssues.slice(0, 3).map((issue, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs text-gray-700">
                      <span className="text-orange-500 font-bold mt-0.5">•</span>
                      <span className="flex-1">{issue}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Compact CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center pt-2"
            >
              <Button
                onClick={() => navigate('/speed-test/offer')}
                variant="primary"
                className="px-6 py-2.5 text-sm"
              >
                Optimize Website
              </Button>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default SpeedTestReport;

