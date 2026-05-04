import React, { useState, Suspense, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSetupStore, setupSteps } from '../../stores/setupStore';
import Card from '../ui/Card';
import Button from '../ui/Button';
import PageLoader from '../PageLoader';
import { createUserWorkspaceAndProfile } from '../../lib/database';
import { createAgentAndKnowledgeBase } from '../../lib/webhooks';
import { LocationService } from '../../lib/locations';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { calculateKBCompleteness } from './kbCompleteness';
import { FUNCTIONS_BASE } from '../../lib/api';
import { supabase } from '../../lib/supabase';

// Step Components - Dynamic imports to avoid circular dependencies
const StepBusinessProfile = React.lazy(() => import('./steps/StepBusinessProfile'));
const StepKnowledge = React.lazy(() => import('./steps/StepKnowledge'));
const StepSurvey = React.lazy(() => import('./steps/StepSurvey'));

const stepComponents = {
  1: StepBusinessProfile,
  2: StepKnowledge,
  3: StepSurvey,
};

const WizardShell: React.FC = () => {
  const { currentStep, updateStep, markStepCompleted, businessProfile: storeBusinessProfile, account, updateAccount, knowledgeBase: storeKnowledgeBase, callFlow: storeCallFlow, agentConfig: storeAgentConfig, complete, updateReview } = useSetupStore();
  const [isLaunching] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation('setup');

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Listen for step completion events
  useEffect(() => {
    const handleKnowledgeStepCompleted = () => {
      markStepCompleted(currentStep);
      if (currentStep < setupSteps.length) {
        updateStep(currentStep + 1);
      }
    };

    window.addEventListener('knowledge-step-completed', handleKnowledgeStepCompleted);
    return () => {
      window.removeEventListener('knowledge-step-completed', handleKnowledgeStepCompleted);
    };
  }, [currentStep, markStepCompleted, updateStep]);

  const StepComponent = stepComponents[currentStep as keyof typeof stepComponents];

  // Validation function for Business Profile step
  const isBusinessProfileValid = () => {
    const { businessProfile } = useSetupStore.getState();
    return !!(
      businessProfile.businessName &&
      businessProfile.mainCategory &&
      businessProfile.country &&
      businessProfile.languages
    );
  };

  // Check if current step is valid
  const isCurrentStepValid = () => {
    if (currentStep === 1) {
      return isBusinessProfileValid();
    }
    return true; // Other steps don't have validation yet
  };

  const handleContinue = async () => {
    try {
      // If completing business profile step (step 1), create workspace and business profile in database
      if (currentStep === 1 && user?.id) {
        const { workspace, businessProfile } = await createUserWorkspaceAndProfile(
          user.id,
          {
            business_name: storeBusinessProfile.businessName,
            website_url: storeBusinessProfile.websiteUrl,
            main_category: storeBusinessProfile.mainCategory,
            country: storeBusinessProfile.country,
            service_areas: storeBusinessProfile.serviceAreas,
            opening_hours: storeBusinessProfile.openingHours,
            languages: storeBusinessProfile.languages ? [storeBusinessProfile.languages] : [],
          }
        );
        
        // Auto-create primary location using address fields
        let locationId: string | undefined;
        try {
          const nameFromAddress = storeBusinessProfile.addressLine1?.trim() || storeBusinessProfile.businessName || 'Primary Location';
          const location = await LocationService.create({
            business_profile_id: businessProfile.id,
            user_id: user.id,
            name: nameFromAddress,
            slug: null,
            phone: storeBusinessProfile.businessPhone || null,
            email: null,
            address_line1: storeBusinessProfile.addressLine1 || null,
            address_line2: null,
            city: storeBusinessProfile.city || null,
            state: storeBusinessProfile.state || null,
            postal_code: storeBusinessProfile.postalCode || null,
            country: storeBusinessProfile.country || null,
            timezone: account.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
            is_primary: true,
            is_active: true,
          } as any);
          locationId = location.id;
        } catch (locErr) {
          console.warn('Could not create primary location:', locErr);
        }
        
        // Update the account with workspace ID, business profile ID, and location ID
        updateAccount({
          workspaceId: workspace.id,
          businessProfileId: businessProfile.id,
          locationId: locationId,
        });
      }
      
      // Survey step (step 3 / final step): create agent, launch, and redirect to dashboard
      if (currentStep === 3) {
        // Navigate to branded loading screen IMMEDIATELY (no pencil loader)
        markStepCompleted(currentStep);
        complete();
        updateReview({ isLaunched: true });
        navigate('/setup/loading');

        // Fire async work in background — loading screen runs its own timer
        const asyncWork = async () => {
          const kbScore = calculateKBCompleteness(storeBusinessProfile, storeKnowledgeBase).score;
          if (kbScore < 40) {
            console.warn('KB completeness below 40% — agent may not answer well');
          }

          try {
            await createAgentAndKnowledgeBase({
              businessName: storeBusinessProfile.businessName || '',
              websiteUrl: storeBusinessProfile.websiteUrl || '',
              mainCategory: storeBusinessProfile.mainCategory || '',
              country: storeBusinessProfile.country || '',
              serviceAreas: storeBusinessProfile.serviceAreas || [],
              openingHours: storeBusinessProfile.openingHours || {},
              languages: storeBusinessProfile.languages ? [storeBusinessProfile.languages] : [],
              clientId: user?.id || undefined,
              businessProfileId: account.businessProfileId || undefined,
              locationId: account.locationId || undefined,
              businessPhone: storeBusinessProfile.businessPhone,
              city: storeBusinessProfile.city,
              state: storeBusinessProfile.state,
              services: storeKnowledgeBase.services,
              faqs: storeKnowledgeBase.faqs,
              policies: storeKnowledgeBase.policies,
              // Call flow + agent config: power the industry template selection and prompt generation
              callFlow: storeCallFlow,
              agentType: storeAgentConfig?.agentType,
              agentName: storeAgentConfig?.agentName,
              voiceId: storeAgentConfig?.voiceId,
              transferNumber: storeAgentConfig?.transferNumber,
            });
          } catch (e) {
            console.error('Agent creation failed', e);
          }

          try {
            const { data: { session } } = await supabase.auth.getSession();
            await fetch(`${FUNCTIONS_BASE}/setup-launch`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
              },
              body: JSON.stringify({
                workspaceId: account.workspaceId,
                isEnabled: true,
              }),
            });
          } catch (e) {
            console.error('Setup launch failed', e);
          }
        };
        asyncWork();
        return;
      }

      // Mark current step as completed
      markStepCompleted(currentStep);

      if (currentStep < setupSteps.length) {
        updateStep(currentStep + 1);
      }
    } catch (error) {
      console.error('Error in handleContinue:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        currentStep,
        user: user?.id,
        businessProfile: storeBusinessProfile
      });
      
      // Get user-friendly error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      let userFriendlyMessage = 'An unexpected error occurred while setting up your account.';
      
      // Provide specific error messages based on error type
      if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        userFriendlyMessage = 'Unable to connect to our servers. Please check your internet connection and try again.';
      } else if (errorMessage.includes('auth') || errorMessage.includes('permission')) {
        userFriendlyMessage = 'Your session may have expired. Please sign in again to continue.';
      } else if (errorMessage.includes('validation') || errorMessage.includes('invalid')) {
        userFriendlyMessage = 'Some of the information you entered is invalid. Please review your entries and try again.';
      } else if (errorMessage.includes('database') || errorMessage.includes('duplicate')) {
        userFriendlyMessage = 'There was an issue saving your information. Please try again in a moment.';
      }
      
      // Show user-friendly error toast
      showToast({
        title: 'Setup Error',
        message: userFriendlyMessage,
        variant: 'error',
        duration: 6000
      });
      
      // After a short delay, show redirect toast
      setTimeout(() => {
        showToast({
          title: 'Redirecting to Dashboard',
          message: 'We\'re redirecting you to your dashboard where you can try again or contact support if the issue persists.',
          variant: 'default',
          duration: 4000
        });
        
        // Redirect after toast is shown
        setTimeout(() => {
          navigate('/dashboard');
        }, 4500);
      }, 2000);
    }
  };


  // Calculate progress based on current step
  const progressPercentage = (currentStep / setupSteps.length) * 100;

  const handleBack = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      updateStep(prevStep);
    }
  };

  const currentStepInfo = setupSteps.find(s => s.id === currentStep);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center -ml-4">
              <Link to="/">
                <img
                  src="/boltcall_full_logo.png"
                  alt="Boltcall"
                  className="h-16 w-auto"
                  width={160}
                  height={64}
                  loading="lazy"
                  decoding="async"
                />
              </Link>
            </div>

            <div className="absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-4xl font-bold text-black">
                {t('wizard.title')}
              </h1>
            </div>

            <div className="text-sm text-black font-medium">
              {t('wizard.stepOf', { current: currentStep, total: setupSteps.length })}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-gray-200">
          <motion.div
            className="h-full bg-gradient-to-r from-brand-blue to-brand-sky"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step Title */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-black">{currentStepInfo?.title}</h2>
          <p className="text-black/70 text-lg mt-1">{currentStepInfo?.description}</p>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
          >
            <Card className="p-8 bg-white text-black">
              {StepComponent && (
                <Suspense fallback={
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue mx-auto mb-4"></div>
                      <p className="text-black/60">{t('wizard.loading')}</p>
                    </div>
                  </div>
                }>
                  <StepComponent />
                </Suspense>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Previous / Next Buttons */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              currentStep === 1
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-black hover:bg-gray-100'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          <Button
            onClick={handleContinue}
            disabled={!isCurrentStepValid() || isLaunching}
            className="flex items-center gap-2 px-8 py-3 bg-brand-blue text-white hover:bg-brand-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === setupSteps.length ? 'Complete Setup' : 'Next'}
            {currentStep < setupSteps.length && <ChevronRight className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Loading overlay during setup launch */}
      <PageLoader isLoading={isLaunching} />
    </div>
  );
};

export default WizardShell;
