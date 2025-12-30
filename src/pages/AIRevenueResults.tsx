import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Clock, CheckCircle, Zap, Sparkles, ArrowRight, Phone, MessageSquare, Calendar } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GiveawayBar from '../components/GiveawayBar';
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
    monthlyHoursSaved: number;
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

  const { results, inputs } = resultsData;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-white">
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
                    <span className="text-blue-100 text-sm font-medium">Time saved</span>
                  </div>
                  <p className="text-4xl font-bold">
                    {results.totals.monthlyHoursSaved} <span className="text-2xl">hours/month</span>
                  </p>
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

            {/* Suggestions Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg border border-blue-200 mb-8"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-blue-600" />
                Recommended Next Steps
              </h3>
              
              <div className="space-y-4">
                {/* Suggestion 1: AI Receptionist */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 }}
                  className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 rounded-lg p-3">
                      <Phone className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Enable AI Receptionist</h4>
                      <p className="text-gray-600 mb-3">
                        Answer calls 24/7 and never miss a lead. Based on your audit, you're missing {Math.round(results.recovery.missedLeads)} leads per month that could be captured by AI.
                      </p>
                      <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                        <span>Potential: {formatCurrency(results.recovery.recoveredRevenue)}/month</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Suggestion 2: Automated Follow-ups */}
                {(inputs.automatedFollowUpSystem === 'No' || inputs.automatedFollowUpSystem === 'We try to do it manually') && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.1 }}
                    className="bg-white rounded-xl p-6 border border-gray-200 hover:border-green-300 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-green-100 rounded-lg p-3">
                        <MessageSquare className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Setup Automated Follow-ups</h4>
                        <p className="text-gray-600 mb-3">
                          Automate follow-ups for all new leads. 70% of sales happen between the 5th and 12th contact - don't leave money on the table.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                          <span>Potential: {formatCurrency(results.followUp.addedRevenue)}/month</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Suggestion 3: Scheduling Automation */}
                {(inputs.adminPingPongHours === '5-10' || inputs.adminPingPongHours === '10-20' || inputs.adminPingPongHours === '20+') && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 }}
                    className="bg-white rounded-xl p-6 border border-gray-200 hover:border-purple-300 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-purple-100 rounded-lg p-3">
                        <Calendar className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Automate Scheduling & Reminders</h4>
                        <p className="text-gray-600 mb-3">
                          Stop wasting {inputs.adminPingPongHours} hours per week on admin ping-pong. Let AI handle scheduling, rescheduling, and reminders automatically.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-purple-600 font-medium">
                          <span>Time saved: {results.totals.monthlyHoursSaved} hours/month</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Suggestion 4: Quick Response */}
                {(inputs.responseTimeToInquiry === '30 mins' || inputs.responseTimeToInquiry === '2 hours' || inputs.responseTimeToInquiry === 'Next day' || inputs.responseTimeToInquiry === 'We often miss them') && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.3 }}
                    className="bg-white rounded-xl p-6 border border-gray-200 hover:border-orange-300 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-orange-100 rounded-lg p-3">
                        <Zap className="w-6 h-6 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Improve Response Time</h4>
                        <p className="text-gray-600 mb-3">
                          Your current response time is {inputs.responseTimeToInquiry}. Leads go cold after 5 minutes - AI can respond instantly to every inquiry.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-orange-600 font-medium">
                          <span>Impact: Higher conversion rates</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
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

