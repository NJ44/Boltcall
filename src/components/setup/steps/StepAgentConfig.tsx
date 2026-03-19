import React from 'react';
import { Bot, Phone, Mic, Loader2 } from 'lucide-react';
import { useSetupStore } from '../../../stores/setupStore';
import StyledInput from '../../ui/StyledInput';
import { VoicePicker } from '../../ui/voice-picker';
import { useRetellVoices } from '../../../hooks/useRetellVoices';

const agentTypes = [
  { value: 'inbound', label: 'Inbound Receptionist', description: 'Answers incoming calls — booking, FAQs, transfers' },
  { value: 'outbound_speed_to_lead', label: 'Speed to Lead', description: 'Calls new leads within minutes of form submission' },
  { value: 'outbound_reactivation', label: 'Reactivation', description: 'Re-engages past leads or dormant customers' },
  { value: 'outbound_reminder', label: 'Appointment Reminder', description: 'Confirms upcoming appointments' },
  { value: 'outbound_review', label: 'Review Request', description: 'Asks satisfied customers for a Google review' },
] as const;

const StepAgentConfig: React.FC = () => {
  const { agentConfig, updateAgentConfig, businessProfile } = useSetupStore();
  const { voices, isLoading: voicesLoading } = useRetellVoices();

  return (
    <div className="space-y-8">
      {/* Agent Name */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Agent Name</h3>
        <StyledInput
          type="text"
          value={agentConfig.agentName}
          onChange={(e) => updateAgentConfig({ agentName: e.target.value })}
          placeholder={`${businessProfile.businessName || 'Your Business'} AI Assistant`}
          name="agentName"
        />
        <p className="mt-1 text-sm text-gray-500">
          Leave blank to use the default: "{businessProfile.businessName || 'Your Business'} AI Assistant"
        </p>
      </div>

      {/* Agent Type */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            Agent Type
          </div>
        </h3>
        <div className="space-y-3">
          {agentTypes.map((type) => (
            <label
              key={type.value}
              className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-all ${
                agentConfig.agentType === type.value
                  ? 'border-brand-blue bg-blue-50/50 ring-1 ring-brand-blue'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="agentType"
                value={type.value}
                checked={agentConfig.agentType === type.value}
                onChange={() => updateAgentConfig({ agentType: type.value })}
                className="mt-1 text-brand-blue focus:ring-brand-blue"
              />
              <div>
                <div className="text-sm font-medium text-gray-900">{type.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{type.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Voice Selection */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          <div className="flex items-center gap-2">
            <Mic className="w-5 h-5" />
            Voice
          </div>
        </h3>
        {voicesLoading ? (
          <div className="flex items-center gap-2 text-sm text-gray-500 py-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading voices...
          </div>
        ) : (
          <VoicePicker
            voices={voices}
            value={agentConfig.voiceId}
            onValueChange={(voiceId) => updateAgentConfig({ voiceId })}
            placeholder="Choose a voice for your agent..."
          />
        )}
      </div>

      {/* Transfer Number */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Human Transfer Number
          </div>
        </h3>
        <StyledInput
          type="tel"
          value={agentConfig.transferNumber}
          onChange={(e) => updateAgentConfig({ transferNumber: e.target.value })}
          placeholder="+1 (555) 987-6543"
          name="transferNumber"
        />
        <p className="mt-1 text-sm text-gray-500">
          When the AI can't help, calls transfer here. Leave blank to take a message instead.
        </p>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h4 className="text-sm font-medium text-gray-900 mb-4">Agent Config Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Type</span>
            <span className="font-medium text-gray-900">
              {agentTypes.find(t => t.value === agentConfig.agentType)?.label || 'Inbound'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Voice</span>
            <span className="font-medium text-gray-900">
              {agentConfig.voiceId || '11labs-Adrian'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Transfer</span>
            <span className="font-medium text-gray-900">
              {agentConfig.transferNumber || 'Take message'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepAgentConfig;
