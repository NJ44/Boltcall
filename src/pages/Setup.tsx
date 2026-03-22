import React, { useEffect, useState } from 'react';
import { updateMetaDescription } from '../lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, CheckIcon, ArrowRightIcon, Loader2, Zap, Phone, Calendar, MessageSquare } from 'lucide-react';
import { useSetupStore } from '../stores/setupStore';
import { useAuth } from '../contexts/AuthContext';
import { createUserWorkspaceAndProfile } from '../lib/database';
import { createAgentAndKnowledgeBase } from '../lib/webhooks';
import { LocationService } from '../lib/locations';
import { cn } from '../lib/utils';
import { FancyDropdown } from '../components/ui/fancy-dropdown';
import type { FancyDropdownOption } from '../components/ui/fancy-dropdown';

const CATEGORY_OPTIONS: FancyDropdownOption[] = [
  { value: 'dentist', label: 'Dentist' },
  { value: 'medspa', label: 'Med Spa' },
  { value: 'plumber', label: 'Plumber' },
  { value: 'hvac', label: 'HVAC' },
  { value: 'legal', label: 'Legal' },
  { value: 'salon', label: 'Salon' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'retail', label: 'Retail' },
  { value: 'real-estate', label: 'Real Estate' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'construction', label: 'Construction' },
  { value: 'roofing', label: 'Roofing' },
  { value: 'education', label: 'Education' },
  { value: 'technology', label: 'Technology' },
  { value: 'other', label: 'Other' },
];

const COUNTRY_OPTIONS: FancyDropdownOption[] = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'es', label: 'Spain' },
  { value: 'it', label: 'Italy' },
  { value: 'nl', label: 'Netherlands' },
  { value: 'ie', label: 'Ireland' },
  { value: 'nz', label: 'New Zealand' },
  { value: 'il', label: 'Israel' },
  { value: 'ae', label: 'United Arab Emirates' },
  { value: 'in', label: 'India' },
  { value: 'sg', label: 'Singapore' },
  { value: 'br', label: 'Brazil' },
  { value: 'mx', label: 'Mexico' },
  { value: 'za', label: 'South Africa' },
  { value: 'other', label: 'Other' },
];

type StepDef = {
  id: number;
  label: string;
};

const steps: StepDef[] = [
  { id: 1, label: 'Your Business' },
  { id: 2, label: 'Location' },
  { id: 3, label: 'Launch' },
];

const Setup: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isCompleted, updateBusinessProfile, updateAccount, complete, updateReview, markStepCompleted, knowledgeBase: storeKnowledgeBase } = useSetupStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [country, setCountry] = useState('');

  useEffect(() => {
    document.title = 'Setup Your Boltcall Account';
    updateMetaDescription('Setup your Boltcall account in under 60 seconds. Free setup, no credit card required.');
  }, []);

  useEffect(() => {
    if (isCompleted) {
      navigate('/dashboard', { replace: true });
    }
  }, [isCompleted, navigate]);

  const isStepValid = () => {
    if (currentStep === 0) return businessName.trim().length >= 2 && industry.length > 0;
    if (currentStep === 1) return country.length > 0;
    return true;
  };

  const handleNext = async () => {
    if (!isStepValid()) return;
    setError('');

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      return;
    }

    // Final step — create everything and redirect
    if (!user?.id) {
      setError('Please log in first.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Update store
      updateBusinessProfile({
        businessName,
        websiteUrl,
        mainCategory: industry.toLowerCase(),
        country,
        languages: 'en',
        serviceAreas: [],
        openingHours: {},
      });

      // Create workspace + business profile
      const { workspace, businessProfile } = await createUserWorkspaceAndProfile(user.id, {
        business_name: businessName,
        website_url: websiteUrl,
        main_category: industry.toLowerCase(),
        country,
        service_areas: [],
        opening_hours: {},
        languages: ['en'],
      });

      // Create primary location
      let locationId: string | undefined;
      try {
        const location = await LocationService.create({
          business_profile_id: businessProfile.id,
          user_id: user.id,
          name: businessName,
          slug: null,
          phone: null,
          email: null,
          address_line1: null,
          address_line2: null,
          city: null,
          state: null,
          postal_code: null,
          country: country || null,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          is_primary: true,
          is_active: true,
        } as any);
        locationId = location.id;
      } catch (e) {
        console.warn('Could not create primary location:', e);
      }

      updateAccount({
        workspaceId: workspace.id,
        businessProfileId: businessProfile.id,
        locationId,
      });

      // Mark setup complete and navigate to loading
      markStepCompleted(1);
      markStepCompleted(2);
      complete();
      updateReview({ isLaunched: true });
      navigate('/setup/loading');

      // Fire agent creation in background — create both inbound + outbound
      const agentBaseData = {
        businessName,
        websiteUrl,
        mainCategory: industry.toLowerCase(),
        country,
        serviceAreas: [],
        openingHours: {},
        languages: ['en'],
        clientId: user.id,
        businessProfileId: businessProfile.id,
        locationId,
        services: storeKnowledgeBase.services,
        faqs: storeKnowledgeBase.faqs,
        policies: storeKnowledgeBase.policies,
      };

      // 1. Inbound agent — answers incoming calls
      createAgentAndKnowledgeBase({
        ...agentBaseData,
        agentType: 'inbound',
        agentName: `${businessName} AI Receptionist`,
      }).catch(e => console.error('Inbound agent creation failed:', e));

      // 2. Outbound agent — speed-to-lead follow-up calls
      createAgentAndKnowledgeBase({
        ...agentBaseData,
        agentType: 'speed_to_lead',
        agentName: `${businessName} Follow-Up Agent`,
      }).catch(e => console.error('Outbound agent creation failed:', e));

      const FUNCTIONS_BASE = import.meta.env.DEV ? 'http://localhost:8888/.netlify/functions' : '/.netlify/functions';
      fetch(`${FUNCTIONS_BASE}/setup-launch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspaceId: workspace.id, isEnabled: true, userId: user.id }),
      }).catch(e => console.error('Setup launch failed:', e));
    } catch (err) {
      console.error('Setup error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen flex items-start md:items-center justify-center bg-white">
      {/* Logo */}
      <header className="fixed top-0 left-0 right-0 z-10 py-4 md:py-6">
        <div className="max-w-4xl mx-auto px-4 flex justify-center">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <Link to="/">
              <img src="/boltcall_full_logo.png" alt="Boltcall" className="h-12 md:h-16 w-auto" />
            </Link>
          </motion.div>
        </div>
      </header>

      <motion.div
        className="w-full max-w-4xl mx-auto px-4 pt-24 md:pt-8 pb-8"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.15 }}
      >
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl overflow-hidden shadow-[0_35px_60px_-12px_rgba(0,0,0,0.15)] md:shadow-[0_35px_60px_-12px_rgba(0,0,0,0.6)]">
          {/* Left: dark panel */}
          <div className="bg-gray-900 text-white p-8 md:p-12 flex flex-col justify-between">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-gray-400">
                Free Setup
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight mt-3">
                Get your <span className="text-blue-500">AI receptionist</span> ready in{' '}
                <span className="text-blue-500">60 seconds</span>
              </h1>

              <p className="mt-6 text-white/80 text-sm md:text-base leading-relaxed max-w-md">
                Just tell us your business name and industry. We'll set up everything for you automatically.
              </p>

              <ul className="mt-6 space-y-3 text-white/90 text-sm">
                <li className="flex items-start gap-3">
                  <Phone className="w-3.5 h-3.5 mt-0.5 text-blue-500 flex-shrink-0" strokeWidth={2.5} />
                  <span>AI answers calls 24/7</span>
                </li>
                <li className="flex items-start gap-3">
                  <Calendar className="w-3.5 h-3.5 mt-0.5 text-blue-500 flex-shrink-0" strokeWidth={2.5} />
                  <span>Books appointments automatically</span>
                </li>
                <li className="flex items-start gap-3">
                  <MessageSquare className="w-3.5 h-3.5 mt-0.5 text-blue-500 flex-shrink-0" strokeWidth={2.5} />
                  <span>Responds to leads instantly</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="w-3.5 h-3.5 mt-0.5 text-blue-500 flex-shrink-0" strokeWidth={2.5} />
                  <span>No credit card required</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 flex items-center gap-2 text-xs text-gray-500">
              <Check className="w-3 h-3" strokeWidth={2.5} />
              <span>50 free credits on signup</span>
            </div>
          </div>

          {/* Right: blue form panel */}
          <div className="bg-gradient-to-b from-blue-600 to-blue-700 text-white p-8 md:p-12">
            {/* Step indicators */}
            <div className="mb-6 flex items-center justify-center gap-2">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-2">
                  <button
                    onClick={() => index < currentStep && setCurrentStep(index)}
                    disabled={index > currentStep}
                    className={cn(
                      'relative flex h-8 w-8 items-center justify-center rounded-full transition-all duration-500',
                      'disabled:cursor-not-allowed',
                      index < currentStep && 'bg-white/20 text-white/80',
                      index === currentStep && 'bg-white text-blue-600 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]',
                      index > currentStep && 'bg-white/10 text-white/40',
                    )}
                  >
                    {index < currentStep ? (
                      <CheckIcon className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
                    ) : (
                      <span className="text-xs font-medium">{step.id}</span>
                    )}
                    {index === currentStep && (
                      <div className="absolute inset-0 rounded-full bg-white/30 blur-md animate-pulse" />
                    )}
                  </button>
                  {index < steps.length - 1 && (
                    <div className="relative h-[1.5px] w-8">
                      <div className="absolute inset-0 bg-white/20" />
                      <div
                        className="absolute inset-0 bg-white/60 transition-all duration-700 origin-left"
                        style={{ transform: `scaleX(${index < currentStep ? 1 : 0})` }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="mb-6 overflow-hidden rounded-full bg-white/20 h-[2px]">
              <div
                className="h-full bg-white transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Step content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <div className="flex items-baseline justify-between">
                  <span className="text-base font-medium text-white">{steps[currentStep].label}</span>
                  <span className="text-xs font-medium text-white/60">{currentStep + 1}/{steps.length}</span>
                </div>

                {currentStep === 0 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/90">Business Name</label>
                      <input
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="e.g. Smith Dental"
                        autoFocus
                        className="w-full h-10 px-3 text-sm rounded-md border border-white/30 bg-white/10 backdrop-blur !text-white placeholder-white/50 focus:border-white/50 focus:outline-none focus:ring-1 focus:ring-white/30" style={{ color: 'white' }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/90">Industry</label>
                      <FancyDropdown
                        options={CATEGORY_OPTIONS}
                        value={industry}
                        onChange={setIndustry}
                        placeholder="Select your industry"
                      />
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/90">Country</label>
                      <FancyDropdown
                        options={COUNTRY_OPTIONS}
                        value={country}
                        onChange={setCountry}
                        placeholder="Select your country"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/90">
                        Website URL <span className="text-white/50">(optional)</span>
                      </label>
                      <input
                        type="url"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        placeholder="https://yourbusiness.com"
                        className="w-full h-10 px-3 text-sm rounded-md border border-white/30 bg-white/10 backdrop-blur !text-white placeholder-white/50 focus:border-white/50 focus:outline-none focus:ring-1 focus:ring-white/30" style={{ color: 'white' }}
                      />
                      <p className="text-xs text-white/60">AI will auto-learn from your website</p>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-lg p-4 border border-white/20 space-y-3">
                      <h3 className="font-semibold text-sm">Ready to launch:</h3>
                      <div className="space-y-2 text-sm text-white/90">
                        <div className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-green-300 flex-shrink-0" strokeWidth={2.5} />
                          <span><strong>{businessName}</strong> — {CATEGORY_OPTIONS.find(c => c.value === industry)?.label || industry}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-green-300 flex-shrink-0" strokeWidth={2.5} />
                          <span>{COUNTRY_OPTIONS.find(c => c.value === country)?.label || country}</span>
                        </div>
                        {websiteUrl && (
                          <div className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-green-300 flex-shrink-0" strokeWidth={2.5} />
                            <span className="truncate">{websiteUrl}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed">
                      We'll create your AI receptionist and dashboard. You can add services, FAQs, and more later.
                    </p>
                  </div>
                )}

                {error && (
                  <div className="bg-red-500/20 border border-red-400/30 rounded-lg px-3 py-2">
                    <p className="text-sm text-white">{error}</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="flex gap-3 mt-6">
              {currentStep > 0 && (
                <button
                  onClick={() => { setCurrentStep(currentStep - 1); setError(''); }}
                  className="flex-1 px-4 py-2.5 h-10 text-sm bg-white/10 text-white font-semibold rounded-md border border-white/30 hover:bg-white/20 transition-colors"
                >
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={!isStepValid() || isSubmitting}
                className={cn(
                  'flex-1 h-10 text-sm font-semibold rounded-md transition-all duration-300',
                  'bg-white text-blue-600 hover:bg-gray-50 hover:shadow-lg hover:shadow-white/10',
                  (!isStepValid() || isSubmitting) && 'opacity-60 cursor-not-allowed',
                  currentStep === 0 && 'w-full',
                )}
              >
                <span className="flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Setting up...
                    </>
                  ) : currentStep === steps.length - 1 ? (
                    <>
                      <Zap className="w-4 h-4" />
                      Launch My AI Receptionist
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRightIcon className="h-4 w-4" strokeWidth={2} />
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Setup;
