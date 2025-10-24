import React, { useState } from 'react';
import { FileText, BookOpen } from 'lucide-react';
import { useSetupStore } from '../../../stores/setupStore';
import StyledInput from '../../ui/StyledInput';
import { createAgentAndKnowledgeBase } from '../../../lib/webhooks';
import Button from '../../ui/Button';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../contexts/ToastContext';

const StepKnowledge: React.FC = () => {
  const { businessProfile, updateBusinessProfile } = useSetupStore();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isCreatingAgent, setIsCreatingAgent] = useState(false);
  const [agentCreated, setAgentCreated] = useState(false);

  const handleCreateAgent = async () => {
    if (agentCreated) return;
    
    setIsCreatingAgent(true);
    try {
      await createAgentAndKnowledgeBase({
        businessName: businessProfile.businessName || '',
        websiteUrl: businessProfile.websiteUrl || '',
        mainCategory: businessProfile.mainCategory || '',
        country: businessProfile.country || '',
        serviceAreas: businessProfile.serviceAreas || [],
        openingHours: businessProfile.openingHours || {},
        languages: businessProfile.languages || [],
        clientId: user?.id || undefined,
      });
      
      setAgentCreated(true);
      console.log('Agent and knowledge base created successfully');
      
      // Trigger next step after successful creation
      window.dispatchEvent(new CustomEvent('knowledge-step-completed'));
    } catch (error) {
      console.error('Error creating agent:', error);
      showToast({
        title: 'Error',
        message: 'Failed to create AI agent. Please try again.',
        variant: 'error',
        duration: 5000
      });
    } finally {
      setIsCreatingAgent(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Knowledge Base */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Knowledge Base Setup</h3>
          <p className="text-gray-600 mb-6">
            Set up your knowledge base so the AI can answer questions about your business and services.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Business Information (Optional)
                </div>
              </label>
              <StyledInput
                type="url"
                value={businessProfile.websiteUrl}
                onChange={(e) => updateBusinessProfile({ websiteUrl: e.target.value })}
                placeholder="https://yourbusiness.com"
                name="websiteUrl"
              />
              <p className="mt-2 text-sm text-gray-500">
                Our AI will analyze your website to understand your services and business information.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Agent Button */}
      <div className="text-center">
        <Button
          onClick={handleCreateAgent}
          disabled={isCreatingAgent || agentCreated}
          variant="primary"
          size="lg"
          className="mx-auto"
        >
          {isCreatingAgent ? 'Creating AI Agent...' : agentCreated ? 'AI Agent Created ✓' : 'Create AI Agent & Knowledge Base'}
        </Button>
        {agentCreated && (
          <p className="text-green-600 text-sm mt-2">
            Your AI agent has been created successfully!
          </p>
        )}
      </div>

      {/* Document Upload Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Upload Documents Later</h4>
            <p className="text-sm text-blue-700">
              You can upload service brochures, policies, FAQs, and other documents in the dashboard after completing setup. This helps your AI provide more detailed and accurate information to your customers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepKnowledge;
