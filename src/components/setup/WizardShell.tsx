import React, { useState, Suspense, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSetupStore, setupSteps } from '../../stores/setupStore';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { createUserWorkspaceAndProfile } from '../../lib/database';
import { useAuth } from '../../contexts/AuthContext';

// Step Components - Dynamic imports to avoid circular dependencies
const StepAccount = React.lazy(() => import('./steps/StepAccount'));
const StepBusinessProfile = React.lazy(() => import('./steps/StepBusinessProfile'));
const StepPhone = React.lazy(() => import('./steps/StepPhone'));
const StepKnowledge = React.lazy(() => import('./steps/StepKnowledge'));
const StepReview = React.lazy(() => import('./steps/StepReview'));

const stepComponents = {
  1: StepAccount,
  2: StepBusinessProfile,
  3: StepPhone,
  4: StepKnowledge,
  5: StepReview,
};

const WizardShell: React.FC = () => {
  const { currentStep, updateStep, markStepCompleted, completedSteps, businessProfile: storeBusinessProfile, account } = useSetupStore();
  const [expandedStep, setExpandedStep] = useState(0);
  const [unlockedSteps, setUnlockedSteps] = useState([1]); // Start with step 1 unlocked
  const { user } = useAuth();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const StepComponent = stepComponents[currentStep as keyof typeof stepComponents];

  // Check if step is completed (based on explicit completion, not form data)
  const isStepCompleted = (stepId: number) => {
    return completedSteps.includes(stepId);
  };

  // Check if step is accessible (can be clicked)
  const isStepAccessible = (stepId: number) => {
    if (stepId === 1) return true;
    if (stepId === 3) return unlockedSteps.includes(3); // Calendar step unlocked when reached
    if (stepId === 4) return currentStep >= 4; // Phone step only accessible when reached
    return completedSteps.includes(stepId - 1); // Previous step must be explicitly completed
  };

  const handleStepClick = (stepId: number) => {
    if (isStepAccessible(stepId)) {
      // If clicking the same step, toggle it
      if (expandedStep === stepId) {
        setExpandedStep(0); // Close it
      } else {
        // Open the clicked step
        updateStep(stepId);
        setExpandedStep(stepId);
      }
    }
  };

  // Validation function for Business Profile step
  const isBusinessProfileValid = () => {
    const { businessProfile } = useSetupStore.getState();
    return !!(
      businessProfile.businessName &&
      businessProfile.mainCategory &&
      businessProfile.country &&
      businessProfile.languages.length > 0
    );
  };

  // Check if current step is valid
  const isCurrentStepValid = () => {
    if (currentStep === 2) {
      return isBusinessProfileValid();
    }
    return true; // Other steps don't have validation yet
  };

  const handleContinue = async () => {
    try {
      // If completing business profile step (step 2), create workspace and business profile in database
      if (currentStep === 2 && user?.id) {
        console.log('Creating workspace and business profile for user:', user.id);
        
        const { workspace, businessProfile } = await createUserWorkspaceAndProfile(
          user.id,
          {
            business_name: storeBusinessProfile.businessName,
            website_url: storeBusinessProfile.websiteUrl,
            main_category: storeBusinessProfile.mainCategory,
            country: storeBusinessProfile.country,
            service_areas: storeBusinessProfile.serviceAreas,
            opening_hours: storeBusinessProfile.openingHours,
            languages: storeBusinessProfile.languages,
          }
        );
        
        console.log('Successfully created workspace and business profile:', { workspace, businessProfile });
        
        // Update the account with workspace ID
        if (account) {
          // You might want to update the account store with the workspace ID
          console.log('Workspace created with ID:', workspace.id);
        }
      }
      
      // Mark current step as completed
      markStepCompleted(currentStep);
      
      if (currentStep < setupSteps.length) {
        const nextStep = currentStep + 1;
        updateStep(nextStep);
        setExpandedStep(nextStep);
        
        // Unlock the calendar step when user reaches it
        if (nextStep === 3 && !unlockedSteps.includes(3)) {
          setUnlockedSteps(prev => [...prev, 3]);
        }
      }
    } catch (error) {
      console.error('Error in handleContinue:', error);
      // You might want to show an error message to the user here
      alert('Failed to save your business profile. Please try again.');
    }
  };


  // Calculate progress based on explicitly completed steps
  const progressPercentage = (completedSteps.length / setupSteps.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Far Left */}
            <div className="flex items-center -ml-4">
              <Link to="/">
                <img 
                  src="/boltcall_full_logo.png" 
                  alt="Boltcall" 
                  className="h-16 w-auto"
                />
              </Link>
            </div>
            
            {/* Title - Center */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-4xl font-bold text-gray-900">
                Account Setup
              </h1>
            </div>
            
            {/* Spacer for balance */}
            <div className="w-32"></div>
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
        {/* Vertical Steps */}
        <div className="space-y-0">
          {setupSteps.map((step, index) => (
            <div key={step.id} className="relative">
              {/* Step Header */}
              <motion.button
                onClick={() => handleStepClick(step.id)}
                disabled={!isStepAccessible(step.id)}
                className={`w-full text-left p-10 mb-0 transition-all duration-200 ${
                  isStepAccessible(step.id)
                    ? 'cursor-pointer'
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    {/* Step Number */}
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl ${
                      isStepCompleted(step.id)
                        ? 'bg-green-500 text-white shadow-lg'
                        : step.id === currentStep
                        ? 'bg-brand-blue text-white shadow-lg'
                        : isStepAccessible(step.id)
                        ? 'bg-gray-200 text-gray-700'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {isStepCompleted(step.id) ? (
                        <CheckCircle className="w-7 h-7" />
                      ) : (
                        step.id
                      )}
                    </div>

                    {/* Step Info */}
                    <div>
                      <h3 className={`text-4xl font-bold text-gray-900 ${
                        !isStepAccessible(step.id) ? 'opacity-50' : ''
                      }`}>
                        {step.title}
                      </h3>
                      <p className={`text-gray-600 text-lg mt-2 ${!isStepAccessible(step.id) ? 'opacity-50' : ''}`}>
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Chevron */}
                  <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform duration-200 ${
                    expandedStep === step.id ? 'rotate-180' : ''
                  } ${!isStepAccessible(step.id) ? 'opacity-50' : ''}`} />
                </div>
              </motion.button>

               {/* Separator Line */}
               {index < setupSteps.length - 1 && (
                 <div className="w-full">
                   <div className="h-px bg-gray-300"></div>
                 </div>
               )}

              {/* Step Content */}
              <AnimatePresence>
                {expandedStep === step.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6">
                      <Card className="p-8">
                        {StepComponent && (
                          <Suspense fallback={
                            <div className="flex items-center justify-center py-8">
                              <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue mx-auto mb-4"></div>
                                <p className="text-gray-600">Loading step...</p>
                              </div>
                            </div>
                          }>
                            <StepComponent />
                          </Suspense>
                        )}
                        
                        {/* Continue Button */}
                        {expandedStep === currentStep && (
                          <div className="mt-6 pt-6 border-t border-gray-200">
                            <div className="flex justify-end">
                              <Button
                                onClick={handleContinue}
                                disabled={!isCurrentStepValid()}
                                className="px-8 py-3 bg-brand-blue text-white hover:bg-brand-blue/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Continue
                              </Button>
                            </div>
                          </div>
                        )}
                      </Card>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default WizardShell;
