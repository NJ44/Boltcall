import React, { useEffect, useMemo } from 'react';
import { updateMetaDescription } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingDown, Clock, Smartphone, Monitor, AlertCircle, Zap } from 'lucide-react';
import GiveawayBar from '../../components/GiveawayBar';
import Header from '../../components/Header';
import Button from '../../components/ui/Button';
import { useSpeedTestStore } from '../../stores/speedTestStore';

const SpeedTestReport: React.FC = () => {
  const navigate = useNavigate();
  const { url, results } = useSpeedTestStore();

  useEffect(() => {
    document.title = 'Website Speed Test Report - Performance Analysis';
    updateMetaDescription('View your website speed test report with detailed performance analysis, scores, and optimization recommendations. See report.');
  }, []);

  // Redirect if no results
  useEffect(() => {
    if (!results) {
      navigate('/speed-test');
    }
  }, [results, navigate]);

  // Calculate leads loss based on loading time
  // Research shows: 1s delay = ~7% conversion drop, 3s+ = significant bounce rate increase
  const leadsLossData = useMemo(() => {
    if (!results) return null;
    
    const { loadingTime, mobileScore, desktopScore } = results;
    const avgScore = (mobileScore + desktopScore) / 2;
    
    // Calculate lead loss percentage based on loading time
    // Formula: Base loss increases exponentially with loading time
    let leadLossPercent = 0;
    if (loadingTime <= 1.0) {
      leadLossPercent = loadingTime * 5; // 0-5% for 0-1s
    } else if (loadingTime <= 2.0) {
      leadLossPercent = 5 + ((loadingTime - 1.0) * 7); // 5-12% for 1-2s
    } else if (loadingTime <= 3.0) {
      leadLossPercent = 12 + ((loadingTime - 2.0) * 8); // 12-20% for 2-3s
    } else if (loadingTime <= 4.0) {
      leadLossPercent = 20 + ((loadingTime - 3.0) * 8); // 20-28% for 3-4s
    } else if (loadingTime <= 6.0) {
      leadLossPercent = 28 + ((loadingTime - 4.0) * 6); // 28-40% for 4-6s
    } else {
      leadLossPercent = Math.min(60, 40 + ((loadingTime - 6.0) * 5)); // 40-60% for 6s+
    }
    
    // Adjust based on performance score (lower score = more loss)
    const scoreAdjustment = (100 - avgScore) / 100 * 10; // Up to 10% additional loss
    leadLossPercent = Math.min(70, leadLossPercent + scoreAdjustment);
    
    return {
      percent: Math.round(leadLossPercent * 10) / 10,
      severity: leadLossPercent >= 30 ? 'critical' : leadLossPercent >= 15 ? 'high' : leadLossPercent >= 5 ? 'moderate' : 'low'
    };
  }, [results]);

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

  const getLeadsLossColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'moderate':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-green-600 bg-green-50 border-green-200';
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
            className="space-y-6"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                Speed Test Results
              </h1>
              <p className="text-sm text-gray-600 break-all">{url}</p>
            </div>

            {/* Status Badge */}
            <div className="text-center mb-8">
              <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-base font-semibold border-2 ${getStatusColor(results.status)}`}>
                <Zap className="w-5 h-5" />
                Your website is {results.status}
              </div>
            </div>

            {/* Leads Loss Warning - Prominent */}
            {leadsLossData && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className={`bg-white rounded-xl shadow-lg border-2 p-6 ${getLeadsLossColor(leadsLossData.severity)}`}
              >
                <div className="flex items-start gap-4">
                  <TrendingDown className="w-8 h-8 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">
                      You're Losing {leadsLossData.percent}% of Potential Leads
                    </h2>
                    <p className="text-base mb-4">
                      Due to your website's loading speed of <strong>{results.loadingTime}s</strong>, 
                      you're potentially losing <strong>{leadsLossData.percent}%</strong> of visitors before they even see your content. 
                      Research shows that for every second of delay, conversion rates drop significantly.
                    </p>
                    {leadsLossData.severity === 'critical' && (
                      <div className="flex items-center gap-2 text-red-700 font-semibold">
                        <AlertCircle className="w-5 h-5" />
                        <span>This is a critical issue that needs immediate attention.</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Performance Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-md border border-gray-200 p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Loading Time</h3>
                    <p className="text-3xl font-bold text-gray-900">{results.loadingTime}s</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  First Contentful Paint (FCP) - Time until first content appears
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl shadow-md border border-gray-200 p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Smartphone className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Mobile Score</h3>
                    <p className={`text-3xl font-bold ${getScoreColor(results.mobileScore)}`}>
                      {results.mobileScore}
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className={`h-2 rounded-full ${getScoreBgColor(results.mobileScore)}`}
                    style={{ width: `${results.mobileScore}%` }}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-xl shadow-md border border-gray-200 p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-indigo-100 rounded-lg">
                    <Monitor className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Desktop Score</h3>
                    <p className={`text-3xl font-bold ${getScoreColor(results.desktopScore)}`}>
                      {results.desktopScore}
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className={`h-2 rounded-full ${getScoreBgColor(results.desktopScore)}`}
                    style={{ width: `${results.desktopScore}%` }}
                  />
                </div>
              </motion.div>
            </div>

            {/* Key Performance Issues */}
            {results.keyIssues && results.keyIssues.length > 0 && results.keyIssues[0] !== 'No major issues detected' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-xl shadow-md border border-gray-200 p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  Performance Issues Found
                </h2>
                <ul className="space-y-3">
                  {results.keyIssues.map((issue, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-gray-700">
                      <span className="text-orange-500 font-bold mt-1">•</span>
                      <span className="flex-1">{issue}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-center pt-4"
            >
              <Button
                onClick={() => navigate('/speed-test/offer')}
                variant="primary"
                size="lg"
                className="px-8 py-4 text-lg"
              >
                Optimize My Website Speed
              </Button>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default SpeedTestReport;

