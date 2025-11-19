import React, { useState } from 'react';
import { Clock, Save } from 'lucide-react';
import { motion } from 'framer-motion';

const RemindersPage: React.FC = () => {
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [defaultReminderText, setDefaultReminderText] = useState('Hi {{client_name}}, this is a reminder about your {{service}} appointment on {{appointment_date}} at {{appointment_time}}. Please arrive 10 minutes early.');
  const [defaultReminderTime, setDefaultReminderTime] = useState('24');

  return (
    <div className="space-y-6">
      {/* Reminders Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Reminders Configuration</h2>
            <p className="text-sm text-gray-600">Configure your reminder settings and templates</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Enable/Disable Reminders Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="text-sm font-medium text-gray-900">Enable Reminders</label>
              <p className="text-xs text-gray-500 mt-1">Turn reminders on or off for all clients</p>
            </div>
            <button
              onClick={() => setRemindersEnabled(!remindersEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                remindersEnabled ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  remindersEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Default Reminder Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Default Settings</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Default Reminder Time</label>
                  <select 
                    value={defaultReminderTime}
                    onChange={(e) => setDefaultReminderTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="24">24 hours before</option>
                    <option value="48">48 hours before</option>
                    <option value="72">72 hours before</option>
                    <option value="168">1 week before</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Default Reminder Message</label>
                  <textarea
                    value={defaultReminderText}
                    onChange={(e) => setDefaultReminderText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={6}
                    placeholder="Enter your default reminder message template..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use variables: {'{{client_name}}'}, {'{{service}}'}, {'{{appointment_date}}'}, {'{{appointment_time}}'}
                  </p>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Notification Settings</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email Reminders</label>
                    <p className="text-xs text-gray-500">Send reminders via email</p>
                  </div>
                  <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">SMS Reminders</label>
                    <p className="text-xs text-gray-500">Send reminders via SMS</p>
                  </div>
                  <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
          <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Reset to Defaults
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Configuration
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default RemindersPage;
