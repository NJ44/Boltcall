import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Clock, CheckCircle, Phone, Zap, ArrowLeft, Sparkles } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GiveawayBar from '../components/GiveawayBar';
import Button from '../components/ui/Button';
import { updateMetaDescription } from '../lib/utils';

interface AuditInputs {
  responseTimeToInquiry: string;
  afterHoursCallHandling: string;
  adminPingPongHours: string;
  automatedFollowUpSystem: string;
  avgCustomerLifetimeValue: number;
  avgMonthlyLeads: number;
  avgLeadToBookingRate: number;
}

interface AuditResults {
  baseline: {
    bookingsPerMonth: number;
    monthlyRevenue: number;
  };
  recovery: {
    missedLeads: number;
    recoveredLeads: number;
    recoveredBookings: number;
    recoveredRevenue: number;
  };
  followUp: {
    addedBookings: number;
    addedRevenue: number;
  };
  savings: {
    staffingSavings: number;
  };
  totals: {
    monthlyUplift: number;
    annualUplift: number;
    monthlyNetGain: number;
    paybackMonths: number;
  };
  assumptions: {
    aiCaptureRate: number;
    followUpUpliftPct: number;
    staffingReductionPct: number;
  };
}

const AIRevenueResults: React.FC = () => {
  const navigate = useNavigate();
  const [resultsData, setResultsData] = useState<{ inputs: AuditInputs; results: AuditResults } | null>(null);

  useEffect(() => {
    document.title = 'AI Revenue Audit Results - Your Potential Earnings | Boltcall';
    updateMetaDescription('View your AI revenue audit results. See your potential revenue increase and cost savings with Boltcall\'s AI services.');
    
    // Get results from localStorage
    const stored = localStorage.getItem('aiRevenueAuditResults');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setResultsData(data);
      } catch (error) {
        console.error('Error parsing results:', error);
        navigate('/ai-revenue-calculator');
      }
    } else {
      navigate('/ai-revenue-calculator');
    }
  }, [navigate]);

  if (!resultsData) {
    return null;
  }

  const { inputs, results } = resultsData;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <GiveawayBar />
      <Header />
      
      {/* Hero Results Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Back Button */}
            <Button
              onClick={() => navigate('/ai-revenue-calculator')}
              variant="outline"
              className="mb-8 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Calculator
            </Button>

            {/* Main Results Card */}
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-3xl p-8 md:p-12 text-white mb-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-8 h-8" />
                <h1 className="text-3xl md:text-4xl font-bold">Your AI Revenue Audit Results</h1>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <TrendingUp className="w-6 h-6" />
                    <span className="text-blue-100 text-sm font-medium">Monthly Revenue Increase</span>
                  </div>
                  <p className="text-4xl font-bold">{formatCurrency(results.totals.monthlyUplift)}</p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <DollarSign className="w-6 h-6" />
                    <span className="text-blue-100 text-sm font-medium">Annual Revenue Uplift</span>
                  </div>
                  <p className="text-4xl font-bold">{formatCurrency(results.totals.annualUplift)}</p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Clock className="w-6 h-6" />
                    <span className="text-blue-100 text-sm font-medium">Payback Period</span>
                  </div>
                  <p className="text-4xl font-bold">{results.totals.paybackMonths} months</p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Zap className="w-6 h-6" />
                    <span className="text-blue-100 text-sm font-medium">Additional Bookings/Month</span>
                  </div>
                  <p className="text-4xl font-bold">
                    {results.recovery.recoveredBookings + results.followUp.addedBookings}
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Baseline Metrics */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">Current Baseline</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-gray-600">Bookings/Month</span>
                    <span className="text-2xl font-bold text-gray-900">{results.baseline.bookingsPerMonth}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Monthly Revenue</span>
                    <span className="text-2xl font-bold text-gray-900">{formatCurrency(results.baseline.monthlyRevenue)}</span>
                  </div>
                </div>
              </motion.div>

              {/* Recovered Revenue */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-lg border border-green-200"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Recovered Revenue
                </h3>
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    <p className="mb-2">
                      {results.recovery.missedLeads} missed leads × {Math.round(results.assumptions.aiCaptureRate * 100)}% capture = {results.recovery.recoveredLeads} recovered
                    </p>
                    <p className="mb-2">
                      {results.recovery.recoveredBookings} additional bookings
                    </p>
                  </div>
                  <div className="pt-3 border-t border-green-200">
                    <p className="text-3xl font-bold text-green-600">
                      +{formatCurrency(results.recovery.recoveredRevenue)}/month
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Additional Revenue Sources */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">Follow-up Automation</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Automated follow-ups increase conversion by {Math.round(results.assumptions.followUpUpliftPct * 100)}%
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  +{formatCurrency(results.followUp.addedRevenue)}/month
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">Cost Savings</h3>
                <p className="text-sm text-gray-600 mb-4">
                  AI reduces staffing hours by {Math.round(results.assumptions.staffingReductionPct * 100)}%
                </p>
                <p className="text-3xl font-bold text-purple-600">
                  +{formatCurrency(results.savings.staffingSavings)}/month
                </p>
              </motion.div>
            </div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-white rounded-2xl p-8 shadow-lg border-2 border-blue-200 text-center"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Unlock This Revenue?</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Start capturing missed leads and automating follow-ups today. Get your AI receptionist set up in minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => window.location.href = '/pricing'}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  Get Started
                </Button>
                <Button
                  onClick={() => navigate('/ai-revenue-calculator')}
                  variant="outline"
                  className="px-8 py-3"
                >
                  Recalculate
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AIRevenueResults;

