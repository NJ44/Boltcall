import React, { useState, useEffect } from 'react';
import { updateMetaDescription } from '../lib/utils';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, Brain, Globe, Phone, Settings, DollarSign } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GiveawayBar from '../components/GiveawayBar';
import FAQ from '../components/FAQ';
import Breadcrumbs from '../components/Breadcrumbs';
import Button from '../components/ui/Button';
import DropdownComponent from '../components/ui/dropdown-01';
import { useNavigate } from 'react-router-dom';

// ── Option lists ──
const industryOptions = [
  { value: 'Plumber', label: 'Plumber' },
  { value: 'HVAC', label: 'HVAC' },
  { value: 'Dentist', label: 'Dentist' },
  { value: 'Lawyer', label: 'Lawyer' },
  { value: 'Contractor', label: 'General Contractor' },
  { value: 'Real Estate', label: 'Real Estate' },
  { value: 'Restaurant', label: 'Restaurant' },
  { value: 'Auto Repair', label: 'Auto Repair' },
  { value: 'Salon/Spa', label: 'Salon / Spa' },
  { value: 'Roofing', label: 'Roofing' },
  { value: 'Electrician', label: 'Electrician' },
  { value: 'Medical Practice', label: 'Medical Practice' },
  { value: 'Insurance', label: 'Insurance' },
  { value: 'Accounting', label: 'Accounting' },
  { value: 'Other', label: 'Other' },
];

const monthlyLeadsOptions = [
  { value: '0-10', label: '0 – 10' },
  { value: '10-50', label: '10 – 50' },
  { value: '50-100', label: '50 – 100' },
  { value: '100+', label: '100+' },
];

const ltvOptions = [
  { value: 'Under $500', label: 'Under $500' },
  { value: '$500-$2K', label: '$500 – $2,000' },
  { value: '$2K-$5K', label: '$2,000 – $5,000' },
  { value: '$5K-$10K', label: '$5,000 – $10,000' },
  { value: '$10K+', label: '$10,000+' },
];

const adminHoursOptions = [
  { value: '0-5', label: '0 – 5 hours' },
  { value: '5-10', label: '5 – 10 hours' },
  { value: '10-20', label: '10 – 20 hours' },
  { value: '20+', label: '20+ hours' },
];

const channelOptions = [
  'Phone',
  'Email',
  'Website form',
  'Walk-in',
  'Social media',
];

const painPointOptions = [
  'Missed calls',
  'Slow response time',
  'No online booking',
  'Manual follow-ups',
  'Low website traffic',
  'Not enough reviews',
  'Losing to competitors',
];

// ── Webhook URL (replace with your n8n webhook after creating it) ──
const WEBHOOK_URL = 'https://n8n.srv974118.hstgr.cloud/webhook/ai-audit'; // n8n orchestration webhook

// ── Loading step messages ──
const loadingSteps = [
  { icon: Globe, text: 'Analyzing your website...' },
  { icon: Phone, text: 'Auditing customer communication...' },
  { icon: Settings, text: 'Evaluating operations & automation...' },
  { icon: Brain, text: 'Assessing AI readiness...' },
  { icon: DollarSign, text: 'Calculating revenue impact...' },
];

const AIAuditPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0); // 0 = hero, 1-4 = form steps
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [error, setError] = useState('');

  // Form state
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  const [customerChannels, setCustomerChannels] = useState<string[]>([]);
  const [monthlyLeads, setMonthlyLeads] = useState('');
  const [hasAfterHours, setHasAfterHours] = useState<boolean | null>(null);
  const [customerLtv, setCustomerLtv] = useState('');

  const [painPoints, setPainPoints] = useState<string[]>([]);
  const [adminHours, setAdminHours] = useState('');

  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    document.title = 'Free AI Business Audit | Boltcall';
    updateMetaDescription(
      'Get a free AI audit of your business. Discover how much revenue you\'re losing and how AI can help. Personalized PDF report delivered to your inbox.'
    );
  }, []);

  // Animate loading steps
  useEffect(() => {
    if (!isSubmitting) return;
    const interval = setInterval(() => {
      setLoadingStepIndex((prev) => {
        if (prev >= loadingSteps.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [isSubmitting]);

  const toggleArrayItem = (arr: string[], item: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item]);
  };

  const validateStep = (step: number): boolean => {
    setError('');
    if (step === 1) {
      if (!businessName.trim() || !industry) {
        setError('Please fill in your business name and industry.');
        return false;
      }
    } else if (step === 2) {
      if (customerChannels.length === 0 || !monthlyLeads || hasAfterHours === null || !customerLtv) {
        setError('Please answer all questions before continuing.');
        return false;
      }
    } else if (step === 3) {
      if (painPoints.length === 0 || !adminHours) {
        setError('Please select at least one challenge and your admin hours.');
        return false;
      }
    } else if (step === 4) {
      if (!contactName.trim() || !email.trim() || !consent) {
        setError('Please fill in your name, email, and accept the consent.');
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Please enter a valid email address.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 0) {
      setCurrentStep(1);
      return;
    }
    if (!validateStep(currentStep)) return;
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError('');
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    setIsSubmitting(true);
    setLoadingStepIndex(0);

    const payload = {
      business_name: businessName.trim(),
      industry,
      website_url: websiteUrl.trim(),
      city: city.trim(),
      state: state.trim(),
      contact_name: contactName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      customer_channels: customerChannels,
      monthly_leads: monthlyLeads,
      has_after_hours: hasAfterHours,
      customer_ltv: customerLtv,
      pain_points: painPoints,
      admin_hours_weekly: adminHours,
    };

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Submission failed');

      // Wait a moment for the loading animation to feel complete
      await new Promise((r) => setTimeout(r, 2000));
      navigate('/ai-audit/thank-you');
    } catch {
      setError('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  // ── Hero ──
  if (currentStep === 0) {
    return (
      <div className="min-h-screen bg-white">
        <GiveawayBar />
        <Header />
        <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Breadcrumbs />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-block bg-blue-50 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
                Free — No credit card required
              </div>
              <h1 className="text-[33px] md:text-[40px] lg:text-[53px] font-bold text-gray-900 mb-6 leading-tight">
                Is Your Business <span className="text-blue-600">AI-Ready?</span>
              </h1>
              <p className="text-[18px] md:text-[22px] text-gray-600 mb-4 max-w-2xl mx-auto">
                Get a personalized AI audit of your business — find out exactly where you're losing money and how AI can fix it.
              </p>
              <p className="text-gray-500 mb-10 max-w-xl mx-auto">
                Answer a few quick questions and we'll send you a branded PDF report with your scores, revenue impact analysis, and a priority action plan.
              </p>

              <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-lg font-semibold text-lg">
                Start My Free Audit
              </Button>

              <p className="text-sm text-gray-400 mt-4">Takes ~2 minutes · Report delivered in ~3 minutes</p>

              {/* Trust signals */}
              <div className="grid grid-cols-3 gap-6 mt-16 max-w-lg mx-auto">
                {[
                  { value: '100', label: 'Point Score' },
                  { value: '5', label: 'Categories Audited' },
                  { value: 'Free', label: 'PDF Report' },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{item.value}</div>
                    <div className="text-sm text-gray-500">{item.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  // ── Loading screen ──
  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-white">
        <GiveawayBar />
        <Header />
        <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto text-center">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
              <div className="flex justify-center mb-8">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                  <Loader2 className="w-16 h-16 text-blue-600" />
                </motion.div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Generating Your AI Audit...</h2>
              <p className="text-gray-500 mb-10">Our AI is analyzing your business right now.</p>

              <div className="space-y-3 text-left">
                {loadingSteps.map((step, idx) => {
                  const Icon = step.icon;
                  const isDone = idx < loadingStepIndex;
                  const isActive = idx === loadingStepIndex;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: idx <= loadingStepIndex ? 1 : 0.3, x: 0 }}
                      transition={{ delay: idx * 0.1, duration: 0.3 }}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        isActive ? 'bg-blue-50 border border-blue-200' : isDone ? 'bg-green-50' : 'bg-gray-50'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      ) : isActive ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                          <Loader2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        </motion.div>
                      ) : (
                        <Icon className="w-5 h-5 text-gray-300 flex-shrink-0" />
                      )}
                      <span className={`text-sm font-medium ${isActive ? 'text-blue-700' : isDone ? 'text-green-700' : 'text-gray-400'}`}>
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

  // ── Multi-step form ──
  const totalSteps = 4;
  const stepLabels = ['Business Info', 'Operations', 'Challenges', 'Get Report'];

  return (
    <div className="min-h-screen bg-white">
      <GiveawayBar />
      <Header />

      <section className="pt-32 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="mb-4">
            <div className="grid grid-cols-4 gap-2 mb-4">
              {stepLabels.map((label, idx) => (
                <div key={label} className={`text-center ${currentStep >= idx + 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className="text-sm font-semibold mb-1">{idx + 1}</div>
                  <div className="text-xs font-medium">{label}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-sm font-medium text-gray-700">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1">
              <motion.div
                className="bg-blue-600 h-1 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>
          )}

          {/* Step 1 — Business Basics */}
          {currentStep === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Tell us about your business</h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Business Name *</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Smith Plumbing"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Industry *</label>
                  <DropdownComponent options={industryOptions} value={industry} onChange={setIndustry} placeholder="Select your industry" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Website URL</label>
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://www.example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">Optional — we'll analyze it if provided</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Austin"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">State</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="e.g. TX"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2 — Current Operations */}
          {currentStep === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">How does your business operate?</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">How do customers reach you? *</label>
                  <div className="flex flex-wrap gap-2">
                    {channelOptions.map((ch) => (
                      <button
                        key={ch}
                        type="button"
                        onClick={() => toggleArrayItem(customerChannels, ch, setCustomerChannels)}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                          customerChannels.includes(ch)
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                        }`}
                      >
                        {ch}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Estimated monthly leads/inquiries *</label>
                  <DropdownComponent options={monthlyLeadsOptions} value={monthlyLeads} onChange={setMonthlyLeads} placeholder="Select range" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Do you have an after-hours answering system? *</label>
                  <div className="flex gap-3">
                    {[
                      { label: 'Yes', value: true },
                      { label: 'No', value: false },
                    ].map((opt) => (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => setHasAfterHours(opt.value)}
                        className={`px-6 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                          hasAfterHours === opt.value
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Average customer lifetime value *</label>
                  <DropdownComponent options={ltvOptions} value={customerLtv} onChange={setCustomerLtv} placeholder="Select range" required />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3 — Pain Points */}
          {currentStep === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">What are your biggest challenges?</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Select all that apply *</label>
                  <div className="flex flex-wrap gap-2">
                    {painPointOptions.map((pp) => (
                      <button
                        key={pp}
                        type="button"
                        onClick={() => toggleArrayItem(painPoints, pp, setPainPoints)}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                          painPoints.includes(pp)
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                        }`}
                      >
                        {pp}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">How many hours/week does your team spend on admin tasks? *</label>
                  <DropdownComponent options={adminHoursOptions} value={adminHours} onChange={setAdminHours} placeholder="Select range" required />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4 — Contact Info */}
          {currentStep === 4 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Where should we send your report?</h3>
              <p className="text-gray-500 text-sm mb-6">We'll email your personalized AI Audit PDF within a few minutes.</p>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="John Smith"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">Optional</p>
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">
                    I agree to receive my AI Audit report and occasional business tips from Boltcall. You can unsubscribe at any time.
                  </span>
                </label>
              </div>
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button onClick={handleBack} disabled={currentStep <= 1} variant="outline" className="px-6 py-3">
              Back
            </Button>
            <Button onClick={handleNext} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white" style={{ transition: 'none' }}>
              {currentStep === 4 ? 'Get My Free Audit' : 'Next'}
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AIAuditPage;
