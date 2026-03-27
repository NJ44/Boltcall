import React, { useState } from 'react';
import { Save, Plus, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { updateEmailSettings, type EmailAccount } from '../../lib/emailService';

interface Props {
  account: EmailAccount;
  onSaved: () => void;
}

const toneOptions = [
  { value: 'professional', label: 'Professional', description: 'Formal, business-appropriate tone' },
  { value: 'friendly', label: 'Friendly', description: 'Warm and approachable, but still professional' },
  { value: 'casual', label: 'Casual', description: 'Relaxed and conversational' },
] as const;

const EmailSettingsPanel: React.FC<Props> = ({ account, onSaved }) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState(account.settings);
  const [saving, setSaving] = useState(false);
  const [newExcluded, setNewExcluded] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
    try {
      await updateEmailSettings(user.id, account.id, settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      onSaved();
    } catch (err) {
      console.error('Save settings error:', err);
    } finally {
      setSaving(false);
    }
  };

  const addExcluded = () => {
    if (!newExcluded.trim()) return;
    setSettings({
      ...settings,
      excluded_senders: [...settings.excluded_senders, newExcluded.trim().toLowerCase()],
    });
    setNewExcluded('');
  };

  const removeExcluded = (email: string) => {
    setSettings({
      ...settings,
      excluded_senders: settings.excluded_senders.filter(e => e !== email),
    });
  };

  return (
    <div className="space-y-6">
      {/* Auto-Send Toggle */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Auto-Send Responses</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              When enabled, AI-generated responses are sent immediately without approval.
              When disabled, drafts appear in your approval queue.
            </p>
          </div>
          <button
            onClick={() => setSettings({ ...settings, auto_send: !settings.auto_send })}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              settings.auto_send ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                settings.auto_send ? 'translate-x-5' : ''
              }`}
            />
          </button>
        </div>
        {settings.auto_send && (
          <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
            <p className="text-xs text-amber-700">
              AI will automatically respond to all inbound lead emails. Review sent responses in the Threads tab.
            </p>
          </div>
        )}
      </div>

      {/* Response Tone */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Response Tone</h3>
        <div className="space-y-2">
          {toneOptions.map((option) => (
            <label
              key={option.value}
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                settings.response_tone === option.value
                  ? 'border-blue-300 bg-blue-50/50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="tone"
                value={option.value}
                checked={settings.response_tone === option.value}
                onChange={() => setSettings({ ...settings, response_tone: option.value })}
                className="mt-0.5 text-blue-600"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">{option.label}</p>
                <p className="text-xs text-gray-500">{option.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Daily Cap */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Daily Email Cap</h3>
        <p className="text-xs text-gray-500 mb-3">Maximum number of emails to process per day for this account.</p>
        <input
          type="number"
          min={1}
          max={500}
          value={settings.daily_cap}
          onChange={(e) => setSettings({ ...settings, daily_cap: parseInt(e.target.value) || 50 })}
          className="w-24 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Excluded Senders */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Excluded Senders</h3>
        <p className="text-xs text-gray-500 mb-3">
          Emails from these addresses or domains will be ignored. Newsletters and noreply addresses are automatically skipped.
        </p>

        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newExcluded}
            onChange={(e) => setNewExcluded(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addExcluded()}
            placeholder="email@example.com or @domain.com"
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={addExcluded}
            className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            Add
          </button>
        </div>

        {settings.excluded_senders.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {settings.excluded_senders.map((sender) => (
              <span
                key={sender}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {sender}
                <button onClick={() => removeExcluded(sender)} className="hover:text-red-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className={`w-full py-2.5 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors ${
          saved
            ? 'bg-green-600 text-white'
            : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'
        }`}
      >
        <Save className="w-4 h-4" />
        {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
      </button>
    </div>
  );
};

export default EmailSettingsPanel;
