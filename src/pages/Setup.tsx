import React, { useEffect, useState } from 'react';
import { updateMetaDescription } from '../lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,

  Zap,
  User,
  Building2,
} from 'lucide-react';
import { useSetupStore } from '../stores/setupStore';
import { useAuth } from '../contexts/AuthContext';
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

import { FUNCTIONS_BASE } from '../lib/api';

const steps = [
  { id: 'personal', title: 'Personal Profile' },
  { id: 'business', title: 'Business Profile' },
  { id: 'launch', title: 'Review & Launch' },
];

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
  const {
    isCompleted,
    updateBusinessProfile,
    updateAccount,
    knowledgeBase,
    complete,
    updateReview,
    markStepCompleted,
    reset,
  } = useSetupStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state — Step 1: Personal Profile
  const [fullName, setFullName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [country, setCountry] = useState('');

  // Form state — Step 2: Business Profile
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('');

  // If the user lands on /setup, clear any stale "completed" flag from a
  // previous session so we don't immediately redirect back to /dashboard.
  useEffect(() => {
    if (isCompleted && !isSubmitting) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.title = 'Set Up Your AI Receptionist — Boltcall';
    updateMetaDescription(
      'Configure your AI receptionist in under 2 minutes. Choose voice, set up knowledge base, and launch.'
    );
  }, []);


  const isStepValid = () => {
    switch (currentStep) {
      case 0: // Personal Profile
        return fullName.trim().length >= 2 && workEmail.trim().length > 3 && country.length > 0;
      case 1: // Business Profile
        return businessName.trim().length >= 2 && industry.length > 0;
      case 2: // Review & Launch
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

    updateAccount({
      fullName,
      workEmail,
    });

    updateBusinessProfile({
      businessName,
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
          owner_name: fullName || undefined,
          website_url: undefined,
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
        websiteUrl: '',
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
        agentType: 'inbound',
        agentName: `${businessName} AI Receptionist`,
        voiceId: undefined,
        transferNumber: '',
      }).catch((e) => { console.error('Agent creation failed:', e); return null; });

      // Create secondary follow-up agent — reuse the same KB folder
      createAgentAndKnowledgeBase({
        ...agentBaseData,
        agentType: 'speed_to_lead',
        agentName: `${businessName} Follow-Up Agent`,
        kbFolderId: primaryResult?.kb_folder_id || undefined,
      }).catch((e) => console.error('Follow-up agent creation failed:', e));

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
                  {/* ─── STEP 0: PERSONAL PROFILE ─── */}
                  {currentStep === 0 && (
                    <>
                      <CardHeader>
                        <CardTitle>Personal Profile</CardTitle>
                        <CardDescription>
                          Tell us about yourself
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <motion.div variants={fadeInUp} className="space-y-1.5">
                          <Label htmlFor="fullName">Full Name *</Label>
                          <Input
                            id="fullName"
                            placeholder="e.g. John Smith"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            autoFocus
                          />
                        </motion.div>

                        <motion.div variants={fadeInUp} className="space-y-1.5">
                          <Label htmlFor="workEmail">Work Email *</Label>
                          <Input
                            id="workEmail"
                            type="email"
                            placeholder="john@yourbusiness.com"
                            value={workEmail}
                            onChange={(e) => setWorkEmail(e.target.value)}
                          />
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
                      </CardContent>
                    </>
                  )}

                  {/* ─── STEP 1: BUSINESS PROFILE ─── */}
                  {currentStep === 1 && (
                    <>
                      <CardHeader>
                        <CardTitle>Business Profile</CardTitle>
                        <CardDescription>
                          Tell us about your business
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <motion.div variants={fadeInUp} className="space-y-1.5">
                          <Label htmlFor="businessName">Business Name *</Label>
                          <Input
                            id="businessName"
                            placeholder="e.g. Smith Dental"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            autoFocus
                          />
                        </motion.div>

                        <motion.div variants={fadeInUp} className="space-y-1.5">
                          <Label htmlFor="industry">Industry *</Label>
                          <Select value={industry} onValueChange={setIndustry}>
                            <SelectTrigger id="industry"><SelectValue placeholder="Select your industry" /></SelectTrigger>
                            <SelectContent>
                              {INDUSTRY_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </motion.div>
                      </CardContent>
                    </>
                  )}

                  {/* ─── STEP 2: REVIEW & LAUNCH ─── */}
                  {currentStep === 2 && (
                    <>
                      <CardHeader>
                        <CardTitle>Ready to launch</CardTitle>
                        <CardDescription>
                          Review your info and go live
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Personal Profile summary */}
                        <motion.div
                          variants={fadeInUp}
                          className="rounded-xl border p-4 space-y-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                              <User className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{fullName}</p>
                              <p className="text-xs text-muted-foreground">
                                {workEmail} &middot; {COUNTRY_OPTIONS.find((o) => o.value === country)?.label}
                              </p>
                            </div>
                          </div>
                        </motion.div>

                        {/* Business Profile summary */}
                        <motion.div
                          variants={fadeInUp}
                          className="rounded-xl border p-4 space-y-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                              <Building2 className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{businessName}</p>
                              <p className="text-xs text-muted-foreground">
                                {INDUSTRY_OPTIONS.find((o) => o.value === industry)?.label}
                              </p>
                            </div>
                          </div>
                        </motion.div>

                        <motion.p variants={fadeInUp} className="text-xs text-muted-foreground leading-relaxed">
                          Your AI receptionist will go live immediately. You can configure voice, knowledge base, and call flow anytime from the dashboard.
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
