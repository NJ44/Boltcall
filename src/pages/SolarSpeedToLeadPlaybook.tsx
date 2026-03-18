import React, { useState, useEffect } from 'react';
import { updateMetaDescription } from '../lib/utils';
import { motion } from 'framer-motion';
import {
  Clock, DollarSign, AlertCircle, Loader, Mail,
  FileText, TrendingDown, CheckCircle2, Loader2,
  Building2, Users,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GiveawayBar from '../components/GiveawayBar';
import { useNavigate } from 'react-router-dom';

// ── Loading step messages ──
const loadingSteps = [
  { icon: Building2, text: 'Personalizing for your company...' },
  { icon: DollarSign, text: 'Calculating your lead waste...' },
  { icon: Clock, text: 'Benchmarking your response time...' },
  { icon: TrendingDown, text: 'Mapping your revenue gap...' },
  { icon: FileText, text: 'Building your custom playbook...' },
  { icon: FileText, text: 'Generating your PDF...' },
];

const WEBHOOK_URL = 'https://n8n.srv974118.hstgr.cloud/webhook/solar-speed-playbook';

const SolarSpeedToLeadPlaybook: React.FC = () => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState('');
  const [monthlyLeads, setMonthlyLeads] = useState('');
  const [costPerLead, setCostPerLead] = useState('');
  const [responseTime, setResponseTime] = useState('');
  const [email, setEmail] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [error, setError] = useState('');

  // Live calculations
  const leads = parseInt(monthlyLeads) || 0;
  const cpl = parseInt(costPerLead) || 0;
  const monthlySpend = leads * cpl;
  const wastedLeads = Math.round(leads * 0.94);
  const wastedMoney = wastedLeads * cpl;
  const recoverableRevenue = Math.round(wastedLeads * 0.15) * 25000; // 15% recoverable at $25K avg deal

  useEffect(() => {
    document.title = 'Free Solar Speed-to-Lead Playbook | Boltcall';
    updateMetaDescription(
      'Get a personalized playbook showing exactly how much revenue your solar company loses from slow lead response — and the 10-second fix to recover it.'
    );
  }, []);

  // Animate loading steps
  useEffect(() => {
    if (!isAnalyzing) return;
    const interval = setInterval(() => {
      setLoadingStepIndex((prev) => {
        if (prev >= loadingSteps.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 3500);
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const validateEmail = (emailString: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailString);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!companyName.trim()) {
      setError('Please enter your company name');
      return;
    }
    if (!monthlyLeads.trim() || leads <= 0) {
      setError('Please enter your monthly lead volume');
      return;
    }
    if (!costPerLead.trim() || cpl <= 0) {
      setError('Please enter your average cost per lead');
      return;
    }
    if (!responseTime.trim()) {
      setError('Please select your average response time');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (!validateEmail(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    setIsAnalyzing(true);
    setLoadingStepIndex(0);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: companyName.trim(),
          monthly_leads: leads,
          cost_per_lead: cpl,
          response_time: responseTime,
          email: email.trim(),
          // Pre-calculated personalization data
          monthly_spend: monthlySpend,
          wasted_leads: wastedLeads,
          wasted_money: wastedMoney,
          recoverable_revenue: recoverableRevenue,
        }),
      });

      if (!response.ok) throw new Error('Submission failed');

      await new Promise((r) => setTimeout(r, 2500));
      navigate('/solar-speed-playbook/thank-you');
    } catch {
      setError('Something went wrong. Please try again.');
      setIsAnalyzing(false);
    }
  };

  // ── Loading screen ──
  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-white">
        <GiveawayBar />
        <Header />
        <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-center mb-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Loader2 className="w-16 h-16 text-blue-600" />
                </motion.div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Building Your Personalized Playbook...
              </h2>
              <p className="text-gray-500 mb-10">
                Crunching {companyName}'s numbers and building your custom report.
              </p>

              <div className="space-y-3 text-left">
                {loadingSteps.map((step, idx) => {
                  const Icon = step.icon;
                  const isDone = idx < loadingStepIndex;
                  const isActive = idx === loadingStepIndex;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{
                        opacity: idx <= loadingStepIndex ? 1 : 0.3,
                        x: 0,
                      }}
                      transition={{ delay: idx * 0.1, duration: 0.3 }}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        isActive
                          ? 'bg-blue-50 border border-blue-200'
                          : isDone
                          ? 'bg-green-50'
                          : 'bg-gray-50'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      ) : isActive ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                        >
                          <Loader2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        </motion.div>
                      ) : (
                        <Icon className="w-5 h-5 text-gray-300 flex-shrink-0" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          isActive
                            ? 'text-blue-700'
                            : isDone
                            ? 'text-green-700'
                            : 'text-gray-400'
                        }`}
                      >
                        {step.text}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  // ── Main page ──
  return (
    <div className="min-h-screen bg-white">
      <GiveawayBar />
      <Header />

      {/* Hero + Form */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-blue-50 via-white to-blue-50/30">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
              Solar <span className="text-blue-600">Speed-to-Lead</span> Playbook
            </h1>
            <p className="text-lg text-gray-600">
              Enter your numbers. Get a personalized playbook with your exact revenue gap and the fix.
            </p>
          </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-1 text-center">
              Get Your Personalized Playbook
            </h2>
            <p className="text-sm text-gray-500 mb-6 text-center">
              4 quick inputs — we'll calculate your exact revenue gap
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Company Name */}
              <div>
                <label htmlFor="company-name" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Company Name
                </label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="company-name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. SunPower Installs"
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                    disabled={isAnalyzing}
                  />
                </div>
              </div>

              {/* Monthly Leads */}
              <div>
                <label htmlFor="monthly-leads" className="block text-sm font-medium text-gray-700 mb-1.5">
                  How many leads do you get per month?
                </label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    id="monthly-leads"
                    value={monthlyLeads}
                    onChange={(e) => setMonthlyLeads(e.target.value)}
                    placeholder="e.g. 100"
                    min="1"
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                    disabled={isAnalyzing}
                  />
                </div>
              </div>

              {/* Cost Per Lead */}
              <div>
                <label htmlFor="cost-per-lead" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Average cost per lead ($)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    id="cost-per-lead"
                    value={costPerLead}
                    onChange={(e) => setCostPerLead(e.target.value)}
                    placeholder="e.g. 200"
                    min="1"
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                    disabled={isAnalyzing}
                  />
                </div>
              </div>

              {/* Response Time - Dropdown */}
              <div>
                <label htmlFor="response-time" className="block text-sm font-medium text-gray-700 mb-1.5">
                  How fast do you typically respond to a new lead?
                </label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    id="response-time"
                    value={responseTime}
                    onChange={(e) => setResponseTime(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base appearance-none bg-white"
                    disabled={isAnalyzing}
                  >
                    <option value="">Select response time...</option>
                    <option value="under_1_min">Under 1 minute</option>
                    <option value="1_to_5_min">1-5 minutes</option>
                    <option value="5_to_30_min">5-30 minutes</option>
                    <option value="30_to_60_min">30-60 minutes</option>
                    <option value="1_to_4_hours">1-4 hours</option>
                    <option value="next_day">Next business day</option>
                    <option value="no_system">No system — whenever we get to it</option>
                  </select>
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="playbook-email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="playbook-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@solarcompany.com"
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                    disabled={isAnalyzing}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1.5">
                  Your personalized playbook PDF will be sent here
                </p>
              </div>

              {/* Live Preview - shows when user has entered numbers */}
              {leads > 0 && cpl > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="bg-blue-50 border border-blue-200 rounded-xl p-5"
                >
                  <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                    <TrendingDown className="w-5 h-5" />
                    Your Numbers
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-xs text-gray-500 mb-1">Monthly lead spend</div>
                      <div className="text-lg font-bold text-gray-900">
                        ${monthlySpend.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-xs text-gray-500 mb-1">Leads that never close</div>
                      <div className="text-lg font-bold text-blue-600">
                        {wastedLeads} leads
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-xs text-gray-500 mb-1">Wasted spend / month</div>
                      <div className="text-lg font-bold text-blue-600">
                        ${wastedMoney.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-xs text-gray-500 mb-1">Recoverable revenue</div>
                      <div className="text-lg font-bold text-green-600">
                        ${recoverableRevenue.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-blue-700 mt-3 text-center">
                    Your playbook will show how to recover this
                  </p>
                </motion.div>
              )}

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <p className="text-red-800 text-sm">{error}</p>
                </motion.div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isAnalyzing || !companyName.trim() || !monthlyLeads.trim() || !costPerLead.trim() || !responseTime || !email.trim()}
                className="w-full py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-semibold text-base"
              >
                {isAnalyzing ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Building Your Playbook...
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    Get My Free Personalized Playbook
                  </>
                )}
              </button>

              <p className="text-xs text-center text-gray-400">
                Free · No credit card · Personalized PDF in ~5 minutes
              </p>
            </form>
          </div>
        </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SolarSpeedToLeadPlaybook;
