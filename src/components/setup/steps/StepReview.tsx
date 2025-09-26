import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Edit, Phone, Calendar, Globe, MessageSquare, Settings, Play } from 'lucide-react';
import { useSetupStore, setupSteps } from '../../../stores/setupStore';
import Button from '../../ui/Button';
import PageLoader from '../../PageLoader';
import SetupCompletionPopup from '../../SetupCompletionPopup';

const StepReview: React.FC = () => {
  const navigate = useNavigate();
  const { 
    account, 
    businessProfile, 
    calendar, 
    phone, 
    knowledgeBase, 
    callFlow, 
    review,
    updateStep,
    updateReview,
    complete 
  } = useSetupStore();
  
  const [isLaunching, setIsLaunching] = useState(false);
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);

  const handleLaunch = async () => {
    setIsLaunching(true);
    try {
      // TODO: Implement launch API
      await fetch('/api/setup/launch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId: account.workspaceId,
          isEnabled: review.isEnabled,
        }),
      });
      
      // Wait for loading animation to show (1.5 seconds)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mark setup as completed
      complete();
      updateReview({ isLaunched: true });
      
      // Stop loading animation
      setIsLaunching(false);
      
      // Show completion popup after a brief moment
      setTimeout(() => {
        setShowCompletionPopup(true);
      }, 300);
      
    } catch (error) {
      console.error('Error launching setup:', error);
      setIsLaunching(false);
    }
  };

  const handleSetupComplete = () => {
    setShowCompletionPopup(false);
    // Navigate to dashboard
    navigate('/dashboard');
  };

  const getCompletionStatus = () => {
    const totalSteps = setupSteps.length - 1; // Exclude review step
    let completedSteps = 0;

    if (account.businessName) completedSteps++;
    if (businessProfile.mainCategory) completedSteps++;
    if (calendar.isConnected) completedSteps++;
    if (phone.useExistingNumber ? phone.existingNumber : phone.newNumber.number) completedSteps++;
    if (knowledgeBase.services.length > 0 || knowledgeBase.faqs.length > 0) completedSteps++;
    if (callFlow.greetingText) completedSteps++;

    return { completed: completedSteps, total: totalSteps };
  };

  const status = getCompletionStatus();
  const completionPercentage = (status.completed / status.total) * 100;

  const reviewSections = [
    {
      id: 1,
      title: 'Account',
      icon: Settings,
      data: account,
      fields: [
        { label: 'Business Name', value: account.businessName },
        { label: 'Email', value: account.workEmail },
        { label: 'Timezone', value: account.timezone },
      ],
    },
    {
      id: 2,
      title: 'Business Profile',
      icon: Globe,
      data: businessProfile,
      fields: [
        { label: 'Website', value: businessProfile.websiteUrl || 'Not set' },
        { label: 'Category', value: businessProfile.mainCategory || 'Not set' },
        { label: 'Service Areas', value: businessProfile.serviceAreas.join(', ') || 'Not set' },
        { label: 'Languages', value: businessProfile.languages.join(', ') || 'English' },
      ],
    },
    {
      id: 3,
      title: 'Calendar',
      icon: Calendar,
      data: calendar,
      fields: [
        { label: 'Status', value: calendar.isConnected ? 'Connected' : 'Not connected' },
        { label: 'Calendar', value: calendar.selectedCalendar || 'Not selected' },
        { label: 'Appointment Types', value: `${calendar.appointmentTypes.length} configured` },
      ],
    },
    {
      id: 4,
      title: 'Phone',
      icon: Phone,
      data: phone,
      fields: [
        { 
          label: 'Number', 
          value: phone.useExistingNumber 
            ? phone.existingNumber 
            : phone.newNumber.number || 'Not configured'
        },
        { label: 'Type', value: phone.useExistingNumber ? 'Existing' : 'New' },
        { label: 'Routing', value: phone.routing.afterHoursAction },
      ],
    },
    {
      id: 5,
      title: 'Knowledge Base',
      icon: MessageSquare,
      data: knowledgeBase,
      fields: [
        { label: 'Services', value: `${knowledgeBase.services.length} configured` },
        { label: 'FAQs', value: `${knowledgeBase.faqs.length} configured` },
        { label: 'Documents', value: `${knowledgeBase.uploadedFiles.length} uploaded` },
        { label: 'Policies', value: Object.values(knowledgeBase.policies).some(Boolean) ? 'Configured' : 'Not set' },
      ],
    },
    {
      id: 6,
      title: 'Call Flow',
      icon: Settings,
      data: callFlow,
      fields: [
        { label: 'Greeting', value: callFlow.greetingText ? 'Configured' : 'Not set' },
        { label: 'Tone', value: callFlow.tone || 'Not set' },
        { label: 'Purpose Detection', value: Object.values(callFlow.purposeDetection).filter(Boolean).length + ' enabled' },
        { label: 'Qualifying Questions', value: `${callFlow.qualifyingQuestions.length} configured` },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {/* Overview */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <CheckCircle className="w-8 h-8 text-white" />
        </motion.div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Setup Complete!
        </h2>
        <p className="text-gray-600 mb-6">
          Review your configuration and launch your AI receptionist
        </p>

        {/* Progress Bar */}
        <div className="max-w-md mx-auto mb-6">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Setup Progress</span>
            <span>{status.completed}/{status.total} steps</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Review Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reviewSections.map((section) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: section.id * 0.1 }}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-brand-blue/10 rounded-lg flex items-center justify-center">
                  <section.icon className="w-4 h-4 text-brand-blue" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
              </div>
              <Button
                onClick={() => updateStep(section.id)}
                variant="outline"
                size="sm"
                className="flex items-center space-x-1"
              >
                <Edit className="w-3 h-3" />
                <span>Edit</span>
              </Button>
            </div>

            <div className="space-y-2">
              {section.fields.map((field, index) => (
                <div key={index} className="flex justify-between items-center py-1">
                  <span className="text-sm text-gray-600">{field.label}</span>
                  <span className="text-sm font-medium text-gray-900 text-right max-w-xs truncate">
                    {field.value || 'Not set'}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Launch Section */}
      <div className="bg-gradient-to-r from-brand-blue to-brand-sky rounded-2xl p-8 text-white">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Play className="w-6 h-6" />
          </motion.div>
          
          <h3 className="text-xl font-bold mb-2">Ready to Launch!</h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Your AI receptionist is configured and ready to start handling calls. 
            Enable it now to begin capturing leads 24/7.
          </p>

          <div className="flex items-center justify-center space-x-4 mb-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={review.isEnabled}
                onChange={(e) => updateReview({ isEnabled: e.target.checked })}
                className="w-4 h-4 text-brand-blue bg-white border-gray-300 rounded focus:ring-brand-blue focus:ring-2"
              />
              <span className="text-sm font-medium">Enable AI Receptionist</span>
            </label>
          </div>

          <Button
            onClick={handleLaunch}
            disabled={isLaunching || !review.isEnabled}
            variant="primary"
            className="bg-white text-brand-blue hover:bg-gray-50 px-8 py-3 text-lg font-semibold"
          >
            {isLaunching ? 'Finishing Setup...' : 'Finish Setup'}
          </Button>

          {review.isLaunched && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center justify-center space-x-2 text-green-200"
            >
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Successfully launched!</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Usage Metrics Placeholder */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Usage Overview</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-brand-blue mb-1">0</div>
            <div className="text-sm text-gray-600">Calls Handled</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-brand-blue mb-1">0</div>
            <div className="text-sm text-gray-600">Appointments Booked</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-brand-blue mb-1">0</div>
            <div className="text-sm text-gray-600">Leads Captured</div>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h5 className="text-sm font-medium text-blue-900 mb-2">Current Plan</h5>
          <p className="text-sm text-blue-700">
            You're on the Starter plan with 100 calls/month. 
            <a href="#" className="underline hover:no-underline">Upgrade</a> for more capacity.
          </p>
        </div>
      </div>
      
      {/* Setup Completion Popup */}
      <SetupCompletionPopup 
        isOpen={showCompletionPopup}
        onClose={handleSetupComplete}
      />
      
      {/* Loading Animation */}
      <PageLoader isLoading={isLaunching} />
    </div>
  );
};

export default StepReview;

