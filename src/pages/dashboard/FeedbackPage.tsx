import React, { useState } from 'react';
import { MessageSquare, CheckCircle, ChevronDown } from 'lucide-react';

type Category = 'general' | 'bug' | 'feature';

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'general', label: 'General feedback' },
  { value: 'bug', label: 'Bug report' },
  { value: 'feature', label: 'Feature request' },
];

const NPS_LABELS: Record<number, string> = {
  1: 'Very unlikely',
  5: 'Neutral',
  10: 'Very likely',
};

const FeedbackPage: React.FC = () => {
  const [feedback, setFeedback] = useState('');
  const [category, setCategory] = useState<Category>('general');
  const [nps, setNps] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!feedback.trim()) return;

    const categoryLabel = CATEGORIES.find(c => c.value === category)?.label ?? category;
    const npsLine = nps !== null ? `\n\nLikelihood to recommend (1–10): ${nps}` : '';
    const bodyText = `Category: ${categoryLabel}\n\n${feedback.trim()}${npsLine}`;

    const subject = encodeURIComponent(`Boltcall Feedback — ${categoryLabel}`);
    const body = encodeURIComponent(bodyText);
    window.open(`mailto:noam@boltcall.org?subject=${subject}&body=${body}`, '_blank');
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto mt-16 flex flex-col items-center gap-4 text-center px-4">
        <div className="w-14 h-14 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Thanks for your feedback!
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
          We read every submission. If you need a response, reach us directly at{' '}
          <a href="mailto:noam@boltcall.org" className="text-blue-600 hover:underline">
            noam@boltcall.org
          </a>
        </p>
        <button
          onClick={() => { setSubmitted(false); setFeedback(''); setNps(null); setCategory('general'); }}
          className="mt-2 text-sm text-blue-600 hover:underline"
        >
          Submit another response
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6 px-4 py-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Share Your Feedback</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Help us improve Boltcall. Your feedback shapes the product.
        </p>
      </div>

      {/* Form card */}
      <div className="bg-white dark:bg-[#111114] rounded-lg border border-gray-200 dark:border-[#1e1e24] p-6 space-y-5">

        {/* Category */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Category
          </label>
          <div className="relative">
            <select
              value={category}
              onChange={e => setCategory(e.target.value as Category)}
              className="w-full appearance-none px-3 py-2.5 pr-9 text-sm bg-gray-50 dark:bg-[#0e0e11] border border-gray-200 dark:border-[#1e1e24] rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Textarea */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            <MessageSquare className="w-3.5 h-3.5" />
            Your feedback
          </label>
          <textarea
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            placeholder="What's working? What could be better?"
            rows={6}
            className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-[#0e0e11] border border-gray-200 dark:border-[#1e1e24] rounded-lg text-gray-900 dark:text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* NPS */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            How likely are you to recommend Boltcall? (optional)
          </label>
          <div className="flex gap-1.5 flex-wrap">
            {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                type="button"
                onClick={() => setNps(nps === n ? null : n)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors border ${
                  nps === n
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-gray-50 dark:bg-[#0e0e11] border-gray-200 dark:border-[#1e1e24] text-gray-700 dark:text-gray-300 hover:border-blue-400 hover:text-blue-600'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          {nps !== null && (
            <p className="text-xs text-gray-400">
              {NPS_LABELS[nps] ?? (nps <= 3 ? 'Unlikely' : nps <= 7 ? 'Somewhat likely' : 'Likely')}
            </p>
          )}
        </div>

        {/* Submit */}
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
