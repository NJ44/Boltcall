import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Clock, Bell, Check, Send } from 'lucide-react';

const SmsPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const plannedCapabilities = [
    'Automated appointment reminders and confirmations',
    'Two-way SMS conversations with AI-powered replies',
    'Bulk SMS campaigns for promotions and updates',
    'Missed call text-back automation',
    'Review request sequences via SMS',
    'Custom templates and scheduling',
  ];

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center justify-center min-h-[60vh]"
      >
        <div className="max-w-lg w-full text-center space-y-6">
          {/* Icon */}
          <div className="mx-auto w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center">
            <MessageSquare className="w-10 h-10 text-blue-600" />
          </div>

          {/* Title and description */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">SMS Messaging</h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
              <Clock className="w-3.5 h-3.5" />
              Coming Soon
            </span>
            <p className="text-gray-500 mt-3">
              Reach your customers instantly with AI-powered SMS. Automate reminders, follow-ups, and conversations — all from your Boltcall dashboard.
            </p>
          </div>

          {/* Planned capabilities */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-left">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Planned Capabilities</h3>
            <ul className="space-y-3">
              {plannedCapabilities.map((capability, index) => (
                <li key={index} className="flex items-start gap-3 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                  {capability}
                </li>
              ))}
            </ul>
          </div>

          {/* Notify form */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 space-y-3">
            {submitted ? (
              <div className="flex items-center justify-center gap-2 text-green-700 py-2">
                <Bell className="w-5 h-5" />
                <span className="font-medium">We'll notify you when SMS is available!</span>
              </div>
            ) : (
              <>
                <p className="text-sm font-medium text-gray-700">Get notified when this feature launches</p>
                <form onSubmit={handleNotify} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <Send className="w-4 h-4" />
                    Notify Me
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Timeline */}
          <p className="text-xs text-gray-400">Expected: Q2 2026</p>
        </div>
      </motion.div>
    </div>
  );
};

export default SmsPage;
