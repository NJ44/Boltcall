import React, { useState } from 'react';
import { FileText, BookOpen } from 'lucide-react';
import { useSetupStore } from '../../../stores/setupStore';
import StyledInput from '../../ui/StyledInput';
import { createAgentAndKnowledgeBase } from '../../../lib/webhooks';
import { createRetellAgentAndKnowledgeBase } from '../../../lib/retell';
import Button from '../../ui/Button';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../contexts/ToastContext';

const StepKnowledge: React.FC = () => {
  const { businessProfile, updateBusinessProfile } = useSetupStore();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isCreatingAgent, setIsCreatingAgent] = useState(false);
  const [agentCreated, setAgentCreated] = useState(false);
  const [retellAgentId, setRetellAgentId] = useState<string | null>(null);
  const [retellKnowledgeBaseId, setRetellKnowledgeBaseId] = useState<string | null>(null);

  const handleCreateAgent = async () => {
    if (agentCreated) return;

    // Immediately allow user to continue; run workflow in background
    setIsCreatingAgent(true);
    showToast({
      title: 'Starting setup',
      message: 'Creating AI agent and knowledge base in the background...',
      variant: 'info',
      duration: 4000
    });
    // Let the wizard proceed to next step right away
    window.dispatchEvent(new CustomEvent('knowledge-step-completed'));

    try {
      // Create Retell knowledge base and agent
      const retellResponse = await createRetellAgentAndKnowledgeBase({
        businessName: businessProfile.businessName || '',
        websiteUrl: businessProfile.websiteUrl || '',
        mainCategory: businessProfile.mainCategory || '',
        country: businessProfile.country || '',
        serviceAreas: businessProfile.serviceAreas || [],
        openingHours: businessProfile.openingHours || {},
        languages: businessProfile.languages || [],
        // Add knowledge base data if available
        services: [], // Could be populated from knowledgeBase.services
        faqs: [], // Could be populated from knowledgeBase.faqs
        policies: undefined // Could be populated from knowledgeBase.policies
      });

      setRetellAgentId(retellResponse.agent_id);
      setRetellKnowledgeBaseId(retellResponse.knowledge_base_id);

      // Also create the original agent for backward compatibility
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
      console.log('Retell agent and knowledge base created successfully');
      console.log('Agent ID:', retellResponse.agent_id);
      console.log('Knowledge Base ID:', retellResponse.knowledge_base_id);

      showToast({
        title: 'Agent ready',
        message: 'AI agent and knowledge base were created successfully.',
        variant: 'success',
        duration: 5000
      });
    } catch (error) {
      console.error('Error creating agent:', error);
      showToast({
        title: 'Agent setup failed',
        message: error instanceof Error ? error.message : 'Unknown error during agent creation.',
        variant: 'error',
        duration: 6000
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
                  Business website
                </div>
              </label>
              <StyledInput
                type="url"
                value={businessProfile.websiteUrl}
                onChange={(e) => updateBusinessProfile({ websiteUrl: e.target.value })}
                placeholder="https://yourbusiness.com"
                name="websiteUrl"
              />
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
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm font-medium mb-2">
              ✓ AI agent and knowledge base created successfully!
            </p>
            {retellAgentId && (
              <p className="text-green-700 text-xs">
                Retell Agent ID: {retellAgentId}
              </p>
            )}
            {retellKnowledgeBaseId && (
              <p className="text-green-700 text-xs">
                Knowledge Base ID: {retellKnowledgeBaseId}
              </p>
            )}
          </div>
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
