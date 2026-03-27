import React, { useEffect, useState } from 'react';
import { updateMetaDescription } from '../lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, Zap } from 'lucide-react';
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

const steps = [
  { id: 'business', title: 'Your Business' },
  { id: 'location', title: 'Location' },
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
    complete,
    updateReview,
    markStepCompleted,
    knowledgeBase: storeKnowledgeBase,
  } = useSetupStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [industry, setIndustry] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [country, setCountry] = useState('');

  useEffect(() => {
    document.title = 'Setup Your Boltcall Account';
    updateMetaDescription(
      'Setup your Boltcall account in under 60 seconds. Free setup, no credit card required.'
    );
  }, []);

  // Redirect already-completed users to dashboard (but not during submit flow)
  useEffect(() => {
    if (isCompleted && !isSubmitting) {
      navigate('/dashboard', { replace: true });
    }
  }, [isCompleted, isSubmitting, navigate]);

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return businessName.trim().length >= 2 && industry.length > 0;
      case 1:
        return country.length > 0;
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

    // Navigate to loading page immediately — no button loading state
    navigate('/setup/loading');

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

    markStepCompleted(1);
    markStepCompleted(2);
    complete();
    updateReview({ isLaunched: true });

    // Fire all async work in background — loading page handles the UX
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
        services: storeKnowledgeBase.services,
        faqs: storeKnowledgeBase.faqs,
        policies: storeKnowledgeBase.policies,
      };

      createAgentAndKnowledgeBase({
        ...agentBaseData,
        agentType: 'inbound',
        agentName: `${businessName} AI Receptionist`,
      }).catch((e) => console.error('Inbound agent creation failed:', e));

      createAgentAndKnowledgeBase({
        ...agentBaseData,
        agentType: 'speed_to_lead',
        agentName: `${businessName} Follow-Up Agent`,
      }).catch((e) => console.error('Outbound agent creation failed:', e));

      const FUNCTIONS_BASE = import.meta.env.DEV
        ? 'http://localhost:8888/.netlify/functions'
        : '/.netlify/functions';
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
        <div className="max-w-lg mx-auto px-4 flex justify-center">
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

      <div className="w-full max-w-lg mx-auto px-4 py-4">
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
                    if (index <= currentStep) {
                      setCurrentStep(index);
                    }
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
                  {/* Step 1: Your Business */}
                  {currentStep === 0 && (
                    <>
                      <CardHeader>
                        <CardTitle>Tell us about your business</CardTitle>
                        <CardDescription>
                          We'll use this to set up your AI receptionist
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <motion.div variants={fadeInUp} className="space-y-2">
                          <Label htmlFor="businessName">Business Name</Label>
                          <Input
                            id="businessName"
                            placeholder="e.g. Smith Dental"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            autoFocus
                            className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          />
                        </motion.div>
                        <motion.div variants={fadeInUp} className="space-y-2">
                          <Label htmlFor="ownerName">Your Name</Label>
                          <Input
                            id="ownerName"
                            placeholder="e.g. John Smith"
                            value={ownerName}
                            onChange={(e) => setOwnerName(e.target.value)}
                            className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          />
                        </motion.div>
                        <motion.div variants={fadeInUp} className="space-y-2">
                          <Label htmlFor="industry">Industry</Label>
                          <Select
                            value={industry}
                            onValueChange={(value) => setIndustry(value)}
                          >
                            <SelectTrigger
                              id="industry"
                              className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            >
                              <SelectValue placeholder="Select your industry" />
                            </SelectTrigger>
                            <SelectContent>
                              {INDUSTRY_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </motion.div>
                      </CardContent>
                    </>
                  )}

                  {/* Step 2: Location */}
                  {currentStep === 1 && (
                    <>
                      <CardHeader>
                        <CardTitle>Where are you located?</CardTitle>
                        <CardDescription>
                          Your AI receptionist will match your region's language
                          and accent
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <motion.div variants={fadeInUp} className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <Select
                            value={country}
                            onValueChange={(value) => setCountry(value)}
                          >
                            <SelectTrigger
                              id="country"
                              className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            >
                              <SelectValue placeholder="Select your country" />
                            </SelectTrigger>
                            <SelectContent>
                              {COUNTRY_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </motion.div>
                        <motion.div variants={fadeInUp} className="space-y-2">
                          <Label htmlFor="websiteUrl">
                            Website URL{' '}
                            <span className="text-muted-foreground font-normal">
                              (optional)
                            </span>
                          </Label>
                          <Input
                            id="websiteUrl"
                            type="url"
                            placeholder="https://yourbusiness.com"
                            value={websiteUrl}
                            onChange={(e) => setWebsiteUrl(e.target.value)}
                            className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          />
                          <p className="text-xs text-muted-foreground">
                            AI will auto-learn from your website
                          </p>
                        </motion.div>
                      </CardContent>
                    </>
                  )}

                  {/* Step 3: Review & Launch */}
                  {currentStep === 2 && (
                    <>
                      <CardHeader>
                        <CardTitle>Ready to launch</CardTitle>
                        <CardDescription>
                          Review your details and launch your AI receptionist
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <motion.div
                          variants={fadeInUp}
                          className="rounded-lg border p-4 space-y-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                              <Check className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {businessName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {INDUSTRY_OPTIONS.find(
                                  (o) => o.value === industry
                                )?.label || industry}
                              </p>
                            </div>
                          </div>
                          {ownerName && (
                            <div className="flex items-center gap-3">
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                                <Check className="h-3.5 w-3.5 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">
                                  {ownerName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Business owner
                                </p>
                              </div>
                            </div>
                          )}
                          <div className="flex items-center gap-3">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                              <Check className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {COUNTRY_OPTIONS.find(
                                  (o) => o.value === country
                                )?.label || country}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Voice matched to your region
                              </p>
                            </div>
                          </div>
                          {websiteUrl && (
                            <div className="flex items-center gap-3">
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                                <Check className="h-3.5 w-3.5 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm font-medium truncate max-w-[280px]">
                                  {websiteUrl}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  AI will learn from your site
                                </p>
                              </div>
                            </div>
                          )}
                        </motion.div>
                        <motion.div variants={fadeInUp}>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            We'll create your AI receptionist and follow-up
                            agent. You can add services, FAQs, and more from the
                            dashboard.
                          </p>
                        </motion.div>

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
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="flex items-center gap-1 transition-all duration-300 rounded-2xl"
                  >
                    <ChevronLeft className="h-4 w-4" /> Back
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type="button"
                    onClick={
                      currentStep === steps.length - 1
                        ? handleSubmit
                        : nextStep
                    }
                    disabled={!isStepValid()}
                    className={cn(
                      'flex items-center gap-1 transition-all duration-300 rounded-2xl'
                    )}
                  >
                    {currentStep === steps.length - 1 ? (
                      <>
                        <Zap className="h-4 w-4" /> Launch
                      </>
                    ) : (
                      <>
                        Next <ChevronRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </CardFooter>
            </div>
          </Card>
        </motion.div>

        {/* Step indicator */}
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
