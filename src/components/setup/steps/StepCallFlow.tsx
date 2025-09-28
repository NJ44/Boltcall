import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useSetupStore } from '../../../stores/setupStore';
import Button from '../../ui/Button';

const StepCallFlow: React.FC = () => {
  const { callFlow, updateCallFlow } = useSetupStore();

  const toneOptions = [
    { value: 'friendly_concise', label: 'Friendly & Concise', description: 'Warm but efficient' },
    { value: 'formal', label: 'Formal', description: 'Professional and structured' },
    { value: 'playful', label: 'Playful', description: 'Light and engaging' },
    { value: 'calm', label: 'Calm', description: 'Relaxed and soothing' },
  ];

  const handleAddQualifyingQuestion = () => {
    const newQuestion = '';
    updateCallFlow({
      qualifyingQuestions: [...callFlow.qualifyingQuestions, newQuestion],
    });
  };

  const handleUpdateQualifyingQuestion = (index: number, value: string) => {
    const updated = [...callFlow.qualifyingQuestions];
    updated[index] = value;
    updateCallFlow({ qualifyingQuestions: updated });
  };

  const handleRemoveQualifyingQuestion = (index: number) => {
    const updated = callFlow.qualifyingQuestions.filter((_, i) => i !== index);
    updateCallFlow({ qualifyingQuestions: updated });
  };

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Greeting Message</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Opening Greeting *
            </label>
            <textarea
              value={callFlow.greetingText}
              onChange={(e) => updateCallFlow({ greetingText: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
              rows={4}
              placeholder="Hello! Thank you for calling [Business Name]. I'm your AI assistant. How can I help you today?"
            />
            <p className="mt-1 text-sm text-gray-500">
              This is the first thing callers will hear. Keep it warm and professional.
            </p>
          </div>
        </div>
      </div>

      {/* Purpose Detection */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Purpose Detection</h3>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Select what types of calls your AI should be able to handle:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(callFlow.purposeDetection).map(([purpose, enabled]) => (
                <label key={purpose} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => updateCallFlow({
                      purposeDetection: {
                        ...callFlow.purposeDetection,
                        [purpose]: e.target.checked,
                      },
                    })}
                    className="text-brand-blue focus:ring-brand-blue"
                  />
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {purpose === 'booking' ? 'Appointment Booking' :
                       purpose === 'reschedule' ? 'Rescheduling' :
                       purpose === 'faq' ? 'FAQ & Information' :
                       purpose === 'complaint' ? 'Complaints' :
                       purpose === 'sales' ? 'Sales Inquiries' : purpose}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Qualifying Questions */}
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Qualifying Questions</h3>
            <Button
              onClick={handleAddQualifyingQuestion}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Add Question</span>
            </Button>
          </div>
          
          <div className="space-y-3">
            {callFlow.qualifyingQuestions.map((question, index) => (
              <div key={index} className="flex items-center space-x-3">
                <span className="text-sm text-gray-500 w-6">{index + 1}.</span>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => handleUpdateQualifyingQuestion(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                  placeholder="What brings you in today?"
                />
                <button
                  onClick={() => handleRemoveQualifyingQuestion(index)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  ×
                </button>
              </div>
            ))}

            {callFlow.qualifyingQuestions.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No qualifying questions added yet.</p>
                <p className="text-xs">Add questions to better understand caller needs.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transfer Rules */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Transfer Rules</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                When to Transfer to Human
              </label>
              <textarea
                value={callFlow.transferRules.whenToTransfer}
                onChange={(e) => updateCallFlow({
                  transferRules: { ...callFlow.transferRules, whenToTransfer: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                rows={3}
                placeholder="Transfer when: customer requests to speak to someone, complex technical issues, complaints..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                When to Book Appointments
              </label>
              <textarea
                value={callFlow.transferRules.whenToBook}
                onChange={(e) => updateCallFlow({
                  transferRules: { ...callFlow.transferRules, whenToBook: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                rows={3}
                placeholder="Book when: customer wants to schedule, routine appointments, standard services..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                When to Take Voicemail
              </label>
              <textarea
                value={callFlow.transferRules.whenToVoicemail}
                onChange={(e) => updateCallFlow({
                  transferRules: { ...callFlow.transferRules, whenToVoicemail: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                rows={3}
                placeholder="Voicemail when: after hours, no one available, customer prefers to leave message..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Fallback & Tone */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Fallback & Personality</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fallback Line
              </label>
              <textarea
                value={callFlow.fallbackLine}
                onChange={(e) => updateCallFlow({ fallbackLine: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                rows={2}
                placeholder="I'm sorry, I didn't quite understand that. Could you please rephrase your request?"
              />
              <p className="mt-1 text-sm text-gray-500">
                What to say when the AI doesn't understand the caller
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AI Tone & Style
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {toneOptions.map((tone) => (
                  <label key={tone.value} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="tone"
                      value={tone.value}
                      checked={callFlow.tone === tone.value}
                      onChange={(e) => updateCallFlow({ tone: e.target.value as 'friendly_concise' | 'formal' | 'playful' | 'calm' })}
                      className="text-brand-blue focus:ring-brand-blue mt-1"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{tone.label}</div>
                      <div className="text-xs text-gray-500">{tone.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pronunciation Guide
              </label>
              <textarea
                value={callFlow.pronunciationGuide}
                onChange={(e) => updateCallFlow({ pronunciationGuide: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                rows={3}
                placeholder="Business name: [phonetic spelling], Special terms: [pronunciation notes]..."
              />
              <p className="mt-1 text-sm text-gray-500">
                Special pronunciation instructions for your business name or technical terms
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Compliance & Disclosure</h3>
          
          <div className="space-y-4">
            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={callFlow.complianceDisclosure.enabled}
                onChange={(e) => updateCallFlow({
                  complianceDisclosure: {
                    ...callFlow.complianceDisclosure,
                    enabled: e.target.checked,
                  },
                })}
                className="text-brand-blue focus:ring-brand-blue mt-1"
              />
              <div>
                <div className="text-sm font-medium text-gray-900">Enable compliance disclosure</div>
                <div className="text-xs text-gray-500">
                  Required for certain industries or jurisdictions
                </div>
              </div>
            </label>

            {callFlow.complianceDisclosure.enabled && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Disclosure Text
                </label>
                <textarea
                  value={callFlow.complianceDisclosure.text}
                  onChange={(e) => updateCallFlow({
                    complianceDisclosure: {
                      ...callFlow.complianceDisclosure,
                      text: e.target.value,
                    },
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                  rows={3}
                  placeholder="This call may be recorded for quality assurance purposes..."
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-sm font-medium text-blue-900 mb-4">Call Flow Preview</h4>
        <div className="space-y-3 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <span className="text-blue-900">Caller dials your number</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <span className="text-blue-900">AI plays greeting</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <span className="text-blue-900">AI detects purpose</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <span className="text-blue-900">
              {callFlow.purposeDetection.booking ? 'Books appointment' :
               callFlow.purposeDetection.faq ? 'Answers questions' :
               callFlow.purposeDetection.reschedule ? 'Reschedules appointment' :
               'Transfers to human'}
            </span>
          </div>
        </div>
      </div>

      {/* Setup Status */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h4 className="text-sm font-medium text-gray-900 mb-4">Call Flow Status</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Greeting</span>
            <div className={`w-2 h-2 rounded-full ${
              callFlow.greetingText ? 'bg-green-500' : 'bg-gray-300'
            }`} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Purpose Detection</span>
            <div className={`w-2 h-2 rounded-full ${
              Object.values(callFlow.purposeDetection).some(Boolean) ? 'bg-green-500' : 'bg-gray-300'
            }`} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Transfer Rules</span>
            <div className={`w-2 h-2 rounded-full ${
              callFlow.transferRules.whenToTransfer || callFlow.transferRules.whenToBook ? 'bg-green-500' : 'bg-gray-300'
            }`} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Tone Selected</span>
            <div className={`w-2 h-2 rounded-full ${
              callFlow.tone ? 'bg-green-500' : 'bg-gray-300'
            }`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepCallFlow;

