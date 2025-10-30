import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Edit, Globe, Settings } from 'lucide-react';
import { useSetupStore } from '../../../stores/setupStore';
import PageLoader from '../../PageLoader';

const StepReview: React.FC = () => {
  const navigate = useNavigate();
  const { 
    account, 
    businessProfile, 
    review,
    updateStep,
    updateReview,
    complete 
  } = useSetupStore();
  
  const [isLaunching, setIsLaunching] = useState(false);

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
      
      // Navigate to dashboard with setup completion flag
      navigate('/dashboard?setupCompleted=true');
      
    } catch (error) {
      console.error('Error launching setup:', error);
      setIsLaunching(false);
    }
  };


  const getCompletionStatus = () => {
    const totalSteps = 5; // All 5 setup steps
    let completedSteps = 0;

    // Count completed steps (assuming all are completed if we're in review)
    if (account.businessName) completedSteps++;
    if (businessProfile.mainCategory) completedSteps++;
    // Add the other 3 steps as completed since we're in review
    completedSteps += 3;

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
        { label: 'Language', value: businessProfile.languages || 'English' },
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
              <button
                onClick={() => updateStep(section.id)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
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

      {/* Finish Setup Section */}
      <div className="bg-gradient-to-r from-brand-blue to-brand-sky rounded-2xl p-8 text-white">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle className="w-6 h-6" />
          </motion.div>
          
          <h3 className="text-xl font-bold mb-2">Ready to Launch!</h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Your AI receptionist is ready to go live. Complete the setup to start using your dashboard.
          </p>

          <button
            onClick={handleLaunch}
            disabled={isLaunching}
            className="px-6 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLaunching ? 'Completing Setup...' : 'Complete Setup'}
          </button>

          {review.isLaunched && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center justify-center space-x-2 text-green-200"
            >
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Setup completed successfully!</span>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Loading Animation */}
      <PageLoader isLoading={isLaunching} />
    </div>
  );
};

export default StepReview;

