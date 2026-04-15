import React, { useState } from 'react';
import { MessageSquare, CheckCircle } from 'lucide-react';

const FeedbackPage: React.FC = () => {
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!feedback.trim()) return;
    const subject = encodeURIComponent('Boltcall Feedback');
    const body = encodeURIComponent(feedback.trim());
    window.open(`mailto:noam@boltcall.org?subject=${subject}&body=${body}`, '_blank');
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto mt-16 flex flex-col items-center gap-4 text-center">
        <CheckCircle className="w-12 h-12 text-green-500" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Thanks for your feedback!</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Your email client should have opened. If not, email us directly at{' '}
          <a href="mailto:noam@boltcall.org" className="text-blue-600 hover:underline">
            noam@boltcall.org
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Give Feedback</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Help us improve Boltcall. Tell us what's working and what isn't.
        </p>
      </div>

      <div className="bg-white dark:bg-[#111114] rounded-lg border border-gray-200 dark:border-[#1e1e24] p-6 space-y-4">
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <MessageSquare className="w-5 h-5" />
          <span className="font-medium text-sm">Your feedback</span>
        </div>

        <textarea
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
          placeholder="What's working well? What could be better? Any bugs or feature requests?"
          rows={6}
          className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-[#0e0e11] border border-gray-200 dark:border-[#1e1e24] rounded-lg text-gray-900 dark:text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleSubmit}
          disabled={!feedback.trim()}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
        >
          Send Feedback
        </button>
      </div>
    </div>
  );
};

export default FeedbackPage;
