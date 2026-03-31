import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { updateMetaDescription } from '../lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Zap,
  Bot,
  Mic,
  Phone,
  BookOpen,
  Loader2,
  Sparkles,
  Plus,
  X,
  HelpCircle,
  Shield,
  Wrench,
  PhoneIncoming,
  PhoneOutgoing,
  FileText,
} from 'lucide-react';
import { useSetupStore } from '../stores/setupStore';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { createUserWorkspaceAndProfile } from '../lib/database';
import { createAgentAndKnowledgeBase } from '../lib/webhooks';
import { LocationService } from '../lib/locations';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/button-shadcn';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card-shadcn';
import { Input } from '../components/ui/input-shadcn';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select-shadcn';
import { VoicePicker } from '../components/ui/voice-picker';
import { useRetellVoices } from '../hooks/useRetellVoices';

import { FUNCTIONS_BASE } from '../lib/api';

const steps = [
  { id: 'overview', title: 'Overview' },
  { id: 'agent', title: 'Agent Setup' },
  { id: 'knowledge', title: 'Knowledge Base' },
  { id: 'launch', title: 'Review & Launch' },
];

const AGENT_TYPES = [
  {
    value: 'inbound',
    label: 'Inbound Receptionist',
    description: 'Answers incoming calls — booking, FAQs, transfers',
    icon: PhoneIncoming,
  },
  {
    value: 'outbound_speed_to_lead',
    label: 'Speed to Lead',
    description: 'Calls new leads within minutes of form submission',
    icon: PhoneOutgoing,
  },
  {
    value: 'outbound_reactivation',
    label: 'Reactivation',
    description: 'Re-engages past leads or dormant customers',
    icon: PhoneOutgoing,
  },
  {
    value: 'outbound_reminder',
    label: 'Appointment Reminder',
    description: 'Confirms upcoming appointments',
    icon: PhoneOutgoing,
  },
  {
    value: 'outbound_review',
    label: 'Review Request',
    description: 'Asks satisfied customers for a Google review',
    icon: PhoneOutgoing,
  },
] as const;

const INDUSTRY_OPTIONS = [
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

const COUNTRY_OPTIONS = [
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

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const contentVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -50, transition: { duration: 0.2 } },
};

const Setup: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const {
    isCompleted,
    updateBusinessProfile,
    updateAccount,
    updateAgentConfig,
    updateKnowledgeBase,
    agentConfig,
    knowledgeBase,
    complete,
    updateReview,
    markStepCompleted,
  } = useSetupStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scanning, setScanning] = useState(false);

  // Form state
  const [businessName, setBusinessName] = useState('');
  const [ownerName, _setOwnerName] = useState('');
  const [industry, setIndustry] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [country, setCountry] = useState('');

  // Voice
  const { voices, isLoading: voicesLoading } = useRetellVoices();

  useEffect(() => {
    document.title = 'Set Up Your AI Receptionist — Boltcall';
    updateMetaDescription(
      'Configure your AI receptionist in under 2 minutes. Choose voice, set up knowledge base, and launch.'
    );
  }, []);

  useEffect(() => {
    if (isCompleted && !isSubmitting) {
      navigate('/dashboard', { replace: true });
    }
  }, [isCompleted, isSubmitting, navigate]);

  // Website scanner
  const handleScanWebsite = useCallback(async () => {
    const url = websiteUrl.trim();
    if (!url) return;

    setScanning(true);
    try {
      showToast({ title: 'Scanning website...', message: 'AI is reading your website to auto-fill services & FAQs', variant: 'default', duration: 15000 });

      const res = await fetch(`${FUNCTIONS_BASE}/scrape-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const scraped = await res.json();
      const content = scraped.markdown || scraped.content || '';

      if (!content || content.length < 50) {
        showToast({ title: 'Low content', message: 'Could not extract much. Try adding info manually.', variant: 'error', duration: 4000 });
        setScanning(false);
        return;
      }

      const extractRes = await fetch(`${FUNCTIONS_BASE}/ai-extract-kb`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, businessName, category: industry }),
      });

      if (extractRes.ok) {
        const extracted = await extractRes.json();
        if (extracted.services?.length && knowledgeBase.services.length === 0) {
          updateKnowledgeBase({ services: extracted.services });
        }
        if (extracted.faqs?.length && knowledgeBase.faqs.length === 0) {
          updateKnowledgeBase({ faqs: extracted.faqs });
        }
        if (extracted.policies) {
          const p = knowledgeBase.policies;
          const np = { ...p };
          if (!p.cancellation && extracted.policies.cancellation) np.cancellation = extracted.policies.cancellation;
          if (!p.reschedule && extracted.policies.reschedule) np.reschedule = extracted.policies.reschedule;
          if (!p.deposit && extracted.policies.deposit) np.deposit = extracted.policies.deposit;
          updateKnowledgeBase({ policies: np });
        }

        const parts = [];
        if (extracted.services?.length) parts.push(`${extracted.services.length} services`);
        if (extracted.faqs?.length) parts.push(`${extracted.faqs.length} FAQs`);
        showToast({
          title: 'Website scanned!',
          message: parts.length > 0 ? `Found ${parts.join(', ')}. Review below.` : 'No structured data found.',
          variant: parts.length > 0 ? 'success' : 'default',
          duration: 5000,
        });
      }
    } catch {
      showToast({ title: 'Scan failed', message: 'Could not scan website. Add info manually below.', variant: 'error', duration: 4000 });
    } finally {
      setScanning(false);
    }
  }, [websiteUrl, businessName, industry, knowledgeBase, updateKnowledgeBase, showToast]);

  // KB helpers
  const handleAddService = () => {
    updateKnowledgeBase({ services: [...knowledgeBase.services, { name: '', duration: 30, price: 0 }] });
  };
  const handleUpdateService = (index: number, field: string, value: string | number) => {
    const updated = [...knowledgeBase.services];
    updated[index] = { ...updated[index], [field]: value };
    updateKnowledgeBase({ services: updated });
  };
  const handleRemoveService = (index: number) => {
    updateKnowledgeBase({ services: knowledgeBase.services.filter((_, i) => i !== index) });
  };
  const handleAddFaq = () => {
    updateKnowledgeBase({ faqs: [...knowledgeBase.faqs, { question: '', answer: '' }] });
  };
  const handleUpdateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = [...knowledgeBase.faqs];
    updated[index] = { ...updated[index], [field]: value };
    updateKnowledgeBase({ faqs: updated });
  };
  const handleRemoveFaq = (index: number) => {
    updateKnowledgeBase({ faqs: knowledgeBase.faqs.filter((_, i) => i !== index) });
  };

  // Selected agent type info
  const selectedAgentType = useMemo(
    () => AGENT_TYPES.find((t) => t.value === agentConfig.agentType) || AGENT_TYPES[0],
    [agentConfig.agentType]
  );

  const isStepValid = () => {
    switch (currentStep) {
      case 0: // Overview — always valid
        return true;
      case 1: // Agent Setup — need business name + industry + country + agent type
        return businessName.trim().length >= 2 && industry.length > 0 && country.length > 0;
      case 2: // Knowledge Base — always valid (optional)
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setError('');
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setError('');
    }
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      setError('Please log in first.');
      return;
    }

    setError('');
    setIsSubmitting(true);
    navigate('/setup/loading');

    updateBusinessProfile({
      businessName,
      websiteUrl,
      mainCategory: industry.toLowerCase(),
      country,
      languages: 'en',
      serviceAreas: [],
      openingHours: {},
    });

    markStepCompleted(1);
    markStepCompleted(2);
    complete();
    updateReview({ isLaunched: true });

    try {
      const { workspace, businessProfile } =
        await createUserWorkspaceAndProfile(user.id, {
          business_name: businessName,
          owner_name: ownerName || null,
          website_url: websiteUrl,
          main_category: industry.toLowerCase(),
          country,
          service_areas: [],
          opening_hours: {},
          languages: ['en'],
        });

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
        services: knowledgeBase.services,
        faqs: knowledgeBase.faqs,
        policies: knowledgeBase.policies,
      };

      // Create the primary agent — this also creates the "Business Profile" KB folder
      // and links the agent to it
      const primaryResult = await createAgentAndKnowledgeBase({
        ...agentBaseData,
        agentType: agentConfig.agentType,
        agentName: agentConfig.agentName || `${businessName} AI Receptionist`,
        voiceId: agentConfig.voiceId,
        transferNumber: agentConfig.transferNumber,
      }).catch((e) => { console.error('Agent creation failed:', e); return null; });

      // Create secondary follow-up agent if primary is inbound
      // Reuse the same KB folder so both agents share "Business Profile"
      if (agentConfig.agentType === 'inbound') {
        createAgentAndKnowledgeBase({
          ...agentBaseData,
          agentType: 'speed_to_lead',
          agentName: `${businessName} Follow-Up Agent`,
          kbFolderId: primaryResult?.kb_folder_id || undefined,
        }).catch((e) => console.error('Follow-up agent creation failed:', e));
      }

      fetch(`${FUNCTIONS_BASE}/setup-launch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId: workspace.id,
          isEnabled: true,
          userId: user.id,
        }),
      }).catch((e) => console.error('Setup launch failed:', e));
    } catch (err) {
      console.error('Setup error (background):', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-white">
      {/* Logo */}
      <header className="w-full py-6">
        <div className="max-w-2xl mx-auto px-4 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <Link to="/">
              <img
                src="/boltcall_full_logo.png"
                alt="Boltcall"
                className="h-12 md:h-14 w-auto"
              />
            </Link>
          </motion.div>
        </div>
      </header>

      <div className="w-full max-w-2xl mx-auto px-4 py-4">
        {/* Progress indicator */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between mb-2">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center"
                whileHover={{ scale: 1.1 }}
              >
                <motion.div
                  className={cn(
                    'w-4 h-4 rounded-full cursor-pointer transition-colors duration-300',
                    index < currentStep
                      ? 'bg-primary'
                      : index === currentStep
                        ? 'bg-primary ring-4 ring-primary/20'
                        : 'bg-muted'
                  )}
                  onClick={() => {
                    if (index <= currentStep) setCurrentStep(index);
                  }}
                  whileTap={{ scale: 0.95 }}
                />
                <motion.span
                  className={cn(
                    'text-xs mt-1.5 hidden sm:block',
                    index === currentStep
                      ? 'text-primary font-medium'
                      : 'text-muted-foreground'
                  )}
                >
                  {step.title}
                </motion.span>
              </motion.div>
            ))}
          </div>
          <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden mt-2">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{
                width: `${(currentStep / (steps.length - 1)) * 100}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border shadow-md rounded-3xl overflow-hidden">
            <div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={contentVariants}
                >
                  {/* ─── STEP 0: OVERVIEW ─── */}
                  {currentStep === 0 && (
                    <>
                      <CardHeader className="text-center pb-2">
                        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                          <Bot className="h-7 w-7 text-primary" />
                        </div>
                        <CardTitle className="text-2xl">Set Up Your AI Receptionist</CardTitle>
                        <CardDescription className="text-base mt-1">
                          3 quick steps and your AI is live. Takes under 2 minutes.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3 pt-4">
                        {[
                          { icon: Bot, title: 'Agent Type & Role', desc: 'Choose inbound or outbound, pick a voice, set a name' },
                          { icon: BookOpen, title: 'Knowledge Base', desc: 'Auto-scan your website or add services & FAQs manually' },
                          { icon: Zap, title: 'Launch', desc: 'Review and go live — your AI starts handling calls instantly' },
                        ].map((item, i) => (
                          <motion.div
                            key={i}
                            variants={fadeInUp}
                            className="flex items-start gap-4 rounded-xl border p-4 transition-colors hover:bg-muted/50"
                          >
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                              <item.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold">{item.title}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                            </div>
                          </motion.div>
                        ))}
                      </CardContent>
                    </>
                  )}

                  {/* ─── STEP 1: AGENT SETUP ─── */}
                  {currentStep === 1 && (
                    <>
                      <CardHeader>
                        <CardTitle>Configure Your Agent</CardTitle>
                        <CardDescription>
                          Set the role, voice, and identity of your AI receptionist
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Quick business context (minimal) */}
                        <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <Label htmlFor="businessName">Business Name *</Label>
                            <Input
                              id="businessName"
                              placeholder="e.g. Smith Dental"
                              value={businessName}
                              onChange={(e) => setBusinessName(e.target.value)}
                              autoFocus
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="industry">Industry *</Label>
                            <Select value={industry} onValueChange={setIndustry}>
                              <SelectTrigger id="industry"><SelectValue placeholder="Select" /></SelectTrigger>
                              <SelectContent>
                                {INDUSTRY_OPTIONS.map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="space-y-1.5">
                          <Label htmlFor="country">Country *</Label>
                          <Select value={country} onValueChange={setCountry}>
                            <SelectTrigger id="country"><SelectValue placeholder="Select your country" /></SelectTrigger>
                            <SelectContent>
                              {COUNTRY_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </motion.div>

                        {/* Divider */}
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-muted-foreground">AI Receptionist Settings</span></div>
                        </div>

                        {/* Agent Type */}
                        <motion.div variants={fadeInUp} className="space-y-3">
                          <Label className="flex items-center gap-2"><Bot className="h-4 w-4" /> Agent Type</Label>
                          <div className="grid grid-cols-1 gap-2">
                            {AGENT_TYPES.map((type) => {
                              const Icon = type.icon;
                              return (
                                <label
                                  key={type.value}
                                  className={cn(
                                    'flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition-all',
                                    agentConfig.agentType === type.value
                                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                      : 'border-border hover:bg-muted/50'
                                  )}
                                >
                                  <input
                                    type="radio"
                                    name="agentType"
                                    value={type.value}
                                    checked={agentConfig.agentType === type.value}
                                    onChange={() => updateAgentConfig({ agentType: type.value })}
                                    className="mt-0.5 text-primary focus:ring-primary"
                                  />
                                  <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                    <div>
                                      <span className="text-sm font-medium">{type.label}</span>
                                      <p className="text-xs text-muted-foreground">{type.description}</p>
                                    </div>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        </motion.div>

                        {/* Agent Name */}
                        <motion.div variants={fadeInUp} className="space-y-1.5">
                          <Label htmlFor="agentName">Agent Name</Label>
                          <Input
                            id="agentName"
                            placeholder={`${businessName || 'Your Business'} AI Receptionist`}
                            value={agentConfig.agentName}
                            onChange={(e) => updateAgentConfig({ agentName: e.target.value })}
                          />
                          <p className="text-xs text-muted-foreground">Leave blank for the default</p>
                        </motion.div>

                        {/* Voice */}
                        <motion.div variants={fadeInUp} className="space-y-1.5">
                          <Label className="flex items-center gap-2"><Mic className="h-4 w-4" /> Voice</Label>
                          {voicesLoading ? (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Loading voices...
                            </div>
                          ) : (
                            <VoicePicker
                              voices={voices}
                              value={agentConfig.voiceId}
                              onValueChange={(voiceId) => updateAgentConfig({ voiceId })}
                              placeholder="Choose a voice..."
                            />
                          )}
                        </motion.div>

                        {/* Transfer Number */}
                        <motion.div variants={fadeInUp} className="space-y-1.5">
                          <Label className="flex items-center gap-2"><Phone className="h-4 w-4" /> Human Transfer Number</Label>
                          <Input
                            type="tel"
                            placeholder="+1 (555) 987-6543"
                            value={agentConfig.transferNumber}
                            onChange={(e) => updateAgentConfig({ transferNumber: e.target.value })}
                          />
                          <p className="text-xs text-muted-foreground">When the AI can't help, calls transfer here. Leave blank to take a message.</p>
                        </motion.div>
                      </CardContent>
                    </>
                  )}

                  {/* ─── STEP 2: KNOWLEDGE BASE ─── */}
                  {currentStep === 2 && (
                    <>
                      <CardHeader>
                        <CardTitle>Knowledge Base</CardTitle>
                        <CardDescription>
                          Teach your AI what your business does. Scan your website or add manually.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Website scan */}
                        <motion.div variants={fadeInUp} className="space-y-1.5">
                          <Label className="flex items-center gap-2"><BookOpen className="h-4 w-4" /> Website URL</Label>
                          <div className="flex gap-2">
                            <Input
                              type="url"
                              placeholder="https://yourbusiness.com"
                              value={websiteUrl}
                              onChange={(e) => setWebsiteUrl(e.target.value)}
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleScanWebsite}
                              disabled={scanning || !websiteUrl.trim()}
                              className="flex items-center gap-1.5 whitespace-nowrap"
                            >
                              {scanning ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> Scanning...</>
                              ) : (
                                <><Sparkles className="w-4 h-4" /> Scan</>
                              )}
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">AI reads your website and auto-fills services, FAQs, and policies</p>
                        </motion.div>

                        {/* Services */}
                        <motion.div variants={fadeInUp} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="flex items-center gap-2"><Wrench className="h-4 w-4" /> Services & Pricing</Label>
                            <Button type="button" variant="outline" size="sm" onClick={handleAddService} className="flex items-center gap-1 h-7 text-xs">
                              <Plus className="w-3 h-3" /> Add
                            </Button>
                          </div>
                          {knowledgeBase.services.length === 0 ? (
                            <div className="text-center py-4 text-muted-foreground border border-dashed rounded-lg">
                              <Wrench className="w-6 h-6 mx-auto mb-1 opacity-40" />
                              <p className="text-xs">No services yet. Add them so the AI can quote prices.</p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {knowledgeBase.services.map((service, index) => (
                                <div key={index} className="flex items-center gap-2 rounded-lg border p-2">
                                  <Input
                                    value={service.name}
                                    onChange={(e) => handleUpdateService(index, 'name', e.target.value)}
                                    placeholder="Service name"
                                    className="flex-1 h-8 text-sm"
                                  />
                                  <Input
                                    type="number"
                                    value={String(service.duration)}
                                    onChange={(e) => handleUpdateService(index, 'duration', parseInt(e.target.value) || 0)}
                                    placeholder="Min"
                                    className="w-16 h-8 text-sm"
                                  />
                                  <div className="relative w-20">
                                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                                    <Input
                                      type="number"
                                      value={String(service.price)}
                                      onChange={(e) => handleUpdateService(index, 'price', parseInt(e.target.value) || 0)}
                                      placeholder="Price"
                                      className="pl-5 h-8 text-sm"
                                    />
                                  </div>
                                  <button onClick={() => handleRemoveService(index)} className="p-1 text-muted-foreground hover:text-destructive">
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </motion.div>

                        {/* FAQs */}
                        <motion.div variants={fadeInUp} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="flex items-center gap-2"><HelpCircle className="h-4 w-4" /> FAQs</Label>
                            <Button type="button" variant="outline" size="sm" onClick={handleAddFaq} className="flex items-center gap-1 h-7 text-xs">
                              <Plus className="w-3 h-3" /> Add
                            </Button>
                          </div>
                          {knowledgeBase.faqs.length === 0 ? (
                            <div className="text-center py-4 text-muted-foreground border border-dashed rounded-lg">
                              <HelpCircle className="w-6 h-6 mx-auto mb-1 opacity-40" />
                              <p className="text-xs">No FAQs yet. Add common questions for instant answers.</p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {knowledgeBase.faqs.map((faq, index) => (
                                <div key={index} className="rounded-lg border p-3 space-y-1.5 relative">
                                  <button onClick={() => handleRemoveFaq(index)} className="absolute top-2 right-2 p-0.5 text-muted-foreground hover:text-destructive">
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                  <Input
                                    value={faq.question}
                                    onChange={(e) => handleUpdateFaq(index, 'question', e.target.value)}
                                    placeholder="Question"
                                    className="h-8 text-sm"
                                  />
                                  <textarea
                                    value={faq.answer}
                                    onChange={(e) => handleUpdateFaq(index, 'answer', e.target.value)}
                                    placeholder="Answer"
                                    rows={2}
                                    className="w-full px-3 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </motion.div>

                        {/* Policies */}
                        <motion.div variants={fadeInUp} className="space-y-3">
                          <Label className="flex items-center gap-2"><Shield className="h-4 w-4" /> Policies</Label>
                          <div className="space-y-2">
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">Cancellation</Label>
                              <textarea
                                value={knowledgeBase.policies.cancellation}
                                onChange={(e) => updateKnowledgeBase({ policies: { ...knowledgeBase.policies, cancellation: e.target.value } })}
                                placeholder="24-hour notice required..."
                                rows={2}
                                className="w-full px-3 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">Reschedule</Label>
                              <textarea
                                value={knowledgeBase.policies.reschedule}
                                onChange={(e) => updateKnowledgeBase({ policies: { ...knowledgeBase.policies, reschedule: e.target.value } })}
                                placeholder="Can reschedule up to 12 hours before..."
                                rows={2}
                                className="w-full px-3 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">Deposit / Payment</Label>
                              <textarea
                                value={knowledgeBase.policies.deposit}
                                onChange={(e) => updateKnowledgeBase({ policies: { ...knowledgeBase.policies, deposit: e.target.value } })}
                                placeholder="$50 deposit required..."
                                rows={2}
                                className="w-full px-3 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                              />
                            </div>
                          </div>
                        </motion.div>

                        {/* Tip */}
                        <motion.div variants={fadeInUp} className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                          <div className="flex items-start gap-3">
                            <FileText className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-muted-foreground">
                              Everything here is optional. Your AI learns from your website automatically. You can always add more from the dashboard later.
                            </p>
                          </div>
                        </motion.div>
                      </CardContent>
                    </>
                  )}

                  {/* ─── STEP 3: REVIEW & LAUNCH ─── */}
                  {currentStep === 3 && (
                    <>
                      <CardHeader>
                        <CardTitle>Ready to launch</CardTitle>
                        <CardDescription>
                          Review your AI receptionist configuration
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <motion.div
                          variants={fadeInUp}
                          className="rounded-xl border p-4 space-y-3"
                        >
                          {/* Business */}
                          <div className="flex items-center gap-3">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                              <Check className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{businessName}</p>
                              <p className="text-xs text-muted-foreground">
                                {INDUSTRY_OPTIONS.find((o) => o.value === industry)?.label} &middot; {COUNTRY_OPTIONS.find((o) => o.value === country)?.label}
                              </p>
                            </div>
                          </div>

                          {/* Agent type */}
                          <div className="flex items-center gap-3">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                              <Check className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{selectedAgentType.label}</p>
                              <p className="text-xs text-muted-foreground">{selectedAgentType.description}</p>
                            </div>
                          </div>

                          {/* Voice */}
                          <div className="flex items-center gap-3">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                              <Check className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                Voice: {voices.find((v) => v.voice_id === agentConfig.voiceId)?.voice_name || agentConfig.voiceId || '11labs-Adrian'}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {agentConfig.transferNumber ? `Transfers to ${agentConfig.transferNumber}` : 'Takes messages when stuck'}
                              </p>
                            </div>
                          </div>

                          {/* KB summary */}
                          <div className="flex items-center gap-3">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                              <Check className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                Knowledge Base: {knowledgeBase.services.length} services, {knowledgeBase.faqs.length} FAQs
                              </p>
                              {websiteUrl && (
                                <p className="text-xs text-muted-foreground truncate max-w-[320px]">
                                  AI will learn from {websiteUrl}
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>

                        <motion.p variants={fadeInUp} className="text-xs text-muted-foreground leading-relaxed">
                          Your AI receptionist will go live immediately. You can fine-tune voice, knowledge base, and call flow anytime from the dashboard.
                        </motion.p>

                        {error && (
                          <motion.div
                            variants={fadeInUp}
                            className="rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2"
                          >
                            <p className="text-sm text-destructive">{error}</p>
                          </motion.div>
                        )}
                      </CardContent>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>

              <CardFooter className="flex justify-between pt-6 pb-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="flex items-center gap-1 rounded-2xl"
                  >
                    <ChevronLeft className="h-4 w-4" /> Back
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type="button"
                    onClick={currentStep === steps.length - 1 ? handleSubmit : nextStep}
                    disabled={!isStepValid()}
                    className="flex items-center gap-1 rounded-2xl"
                  >
                    {currentStep === steps.length - 1 ? (
                      <><Zap className="h-4 w-4" /> Launch</>
                    ) : (
                      <>Next <ChevronRight className="h-4 w-4" /></>
                    )}
                  </Button>
                </motion.div>
              </CardFooter>
            </div>
          </Card>
        </motion.div>

        <motion.div
          className="mt-4 text-center text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
        </motion.div>
      </div>
    </div>
  );
};

export default Setup;
