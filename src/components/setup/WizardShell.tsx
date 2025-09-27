import React, { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, ChevronDown } from 'lucide-react';
import { useSetupStore, setupSteps } from '../../stores/setupStore';
import Card from '../ui/Card';
import Button from '../ui/Button';

// Step Components - Dynamic imports to avoid circular dependencies
const StepAccount = React.lazy(() => import('./steps/StepAccount'));
const StepBusinessProfile = React.lazy(() => import('./steps/StepBusinessProfile'));
const StepCalendar = React.lazy(() => import('./steps/StepCalendar'));
const StepPhone = React.lazy(() => import('./steps/StepPhone'));
const StepKnowledge = React.lazy(() => import('./steps/StepKnowledge'));
const StepReview = React.lazy(() => import('./steps/StepReview'));

const stepComponents = {
  1: StepAccount,
  2: StepBusinessProfile,
  3: StepCalendar,
  4: StepPhone,
  5: StepKnowledge,
  6: StepReview,
};

const WizardShell: React.FC = () => {
  const { currentStep, updateStep, account, businessProfile, phone, knowledgeBase } = useSetupStore();
  const [expandedStep, setExpandedStep] = useState(1);

  const StepComponent = stepComponents[currentStep as keyof typeof stepComponents];

  // Check if step is completed
  const isStepCompleted = (stepId: number) => {
    switch (stepId) {
      case 1:
        return !!account.businessName && !!account.workEmail;
      case 2:
        return !!businessProfile.mainCategory && businessProfile.serviceAreas.length > 0;
      case 3:
        return true; // Calendar step is always complete since it's optional
      case 4:
        return phone.useExistingNumber ? !!phone.existingNumber : !!phone.newNumber.number;
      case 5:
        return knowledgeBase.services.length > 0 || knowledgeBase.faqs.length > 0;
      case 6:
        return true; // Review step is always accessible if previous steps are done
      default:
        return false;
    }
  };

  // Check if step is accessible (can be clicked)
  const isStepAccessible = (stepId: number) => {
    if (stepId === 1) return true;
    return isStepCompleted(stepId - 1);
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

  const handleContinue = () => {
    if (isStepCompleted(currentStep) && currentStep < setupSteps.length) {
      const nextStep = currentStep + 1;
      updateStep(nextStep);
      setExpandedStep(nextStep);
    }
  };


  const progressPercentage = (currentStep / setupSteps.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        {/* Back Button - Fixed to left edge */}
        <button
          onClick={() => window.history.back()}
          className="absolute left-0 top-0 h-16 px-4 flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors z-50"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4 ml-20">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Voice Receptionist Setup
                </h1>
                <p className="text-sm text-gray-500">
                  Configure your AI receptionist in simple steps
                </p>
              </div>
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
        {/* Vertical Steps */}
        <div className="space-y-0">
          {setupSteps.map((step, index) => (
            <div key={step.id} className="relative">
              {/* Step Header */}
              <motion.button
                onClick={() => handleStepClick(step.id)}
                disabled={!isStepAccessible(step.id)}
                className={`w-full text-left p-8 mb-0 transition-all duration-200 ${
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
                 <div className="mx-0">
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
                                disabled={!isStepCompleted(currentStep)}
                                className={`px-8 py-3 ${
                                  isStepCompleted(currentStep)
                                    ? 'bg-brand-blue text-white hover:bg-brand-blue/90'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                } transition-colors duration-200`}
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
