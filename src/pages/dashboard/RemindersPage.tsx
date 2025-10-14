import React, { useState } from 'react';
import { Clock, Save, ToggleLeft, ToggleRight, MessageSquare, Bot } from 'lucide-react';
import Button from '../../components/ui/Button';

const RemindersPage: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState('24');
  const [reminderText, setReminderText] = useState('');
  const [agentFollowup, setAgentFollowup] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    // Show success message
    alert('Reminders settings saved successfully!');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Clock className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Reminders</h1>
        </div>
        <p className="text-gray-600 text-lg">
          Configure automated reminders and follow-up settings for your appointments.
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        {/* Enable/Disable Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Enable Reminders</h2>
              <p className="text-gray-600">Turn on automated reminder notifications</p>
            </div>
            <button
              onClick={() => setIsEnabled(!isEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isEnabled ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Reminder Time */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Reminder Time (hours before appointment)
          </label>
          <div className="relative">
            <select
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
            >
              <option value="1">1 hour before</option>
              <option value="2">2 hours before</option>
              <option value="4">4 hours before</option>
              <option value="8">8 hours before</option>
              <option value="24">24 hours before</option>
              <option value="48">48 hours before</option>
              <option value="72">72 hours before</option>
            </select>
          </div>
        </div>

        {/* Reminder Text */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Reminder Message
          </label>
          <textarea
            value={reminderText}
            onChange={(e) => setReminderText(e.target.value)}
            placeholder="Enter your custom reminder message here..."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
            rows={4}
          />
          <p className="text-sm text-gray-500 mt-2">
            This message will be sent to your clients as a reminder
          </p>
        </div>

        {/* Agent Follow-up */}
        <div className="mb-8">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Bot className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Agent Follow-up</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Enable AI agent to automatically follow up if a client cancels or wants to reschedule
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setAgentFollowup(!agentFollowup)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    agentFollowup ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      agentFollowup ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-sm text-gray-600">
                  {agentFollowup ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            variant="primary"
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <MessageSquare className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">How it works</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Reminders are sent automatically based on your selected time</li>
              <li>• Clients can respond to reschedule or cancel appointments</li>
              <li>• AI agent will follow up if cancellation is detected</li>
              <li>• All interactions are logged in your analytics dashboard</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemindersPage;
