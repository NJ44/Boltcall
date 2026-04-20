import React from 'react';
import { useSetupStore } from '../../../stores/setupStore';

const REFERRAL_SOURCES = [
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'google', label: 'Google Search' },
  { value: 'ai', label: 'AI / ChatGPT' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'friend', label: 'Friend or Colleague' },
  { value: 'podcast', label: 'Podcast' },
  { value: 'other', label: 'Other' },
];

const PAIN_POINTS = [
  { value: 'missed_calls', label: 'Missing calls from potential customers' },
  { value: 'ad_followup', label: 'Hard to follow up on ad leads fast enough' },
  { value: 'after_hours', label: 'No coverage after hours or on weekends' },
  { value: 'slow_response', label: 'Losing jobs to competitors who respond faster' },
  { value: 'manual_booking', label: 'Too much time on manual booking and scheduling' },
  { value: 'no_system', label: 'No system to track and manage leads' },
];

const StepSurvey: React.FC = () => {
  const { survey, updateSurvey } = useSetupStore();

  const toggleReferral = (value: string) => {
    updateSurvey({ referralSource: survey.referralSource === value ? '' : value });
  };

  const togglePainPoint = (value: string) => {
    const updated = survey.painPoints.includes(value)
      ? survey.painPoints.filter((p) => p !== value)
      : [...survey.painPoints, value];
    updateSurvey({ painPoints: updated });
  };

  return (
    <div className="space-y-10">
      {/* Question 1 */}
      <div>
        <h3 className="text-lg font-semibold text-black mb-1">
          Where did you hear about us?
        </h3>
        <p className="text-sm text-black/50 mb-4">Pick one</p>
        <div className="flex flex-wrap gap-3">
          {REFERRAL_SOURCES.map((source) => {
            const selected = survey.referralSource === source.value;
            return (
              <button
                key={source.value}
                type="button"
                onClick={() => toggleReferral(source.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  selected
                    ? 'bg-brand-blue text-white border-brand-blue'
                    : 'bg-white text-black border-gray-200 hover:border-brand-blue hover:text-brand-blue'
                }`}
              >
                {source.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Question 2 */}
      <div>
        <h3 className="text-lg font-semibold text-black mb-1">
          What's driving you to try Boltcall?
        </h3>
        <p className="text-sm text-black/50 mb-4">Select all that apply</p>
        <div className="flex flex-col gap-3">
          {PAIN_POINTS.map((point) => {
            const selected = survey.painPoints.includes(point.value);
            return (
              <button
                key={point.value}
                type="button"
                onClick={() => togglePainPoint(point.value)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium text-left transition-colors ${
                  selected
                    ? 'bg-brand-blue/5 border-brand-blue text-brand-blue'
                    : 'bg-white border-gray-200 text-black hover:border-brand-blue/50'
                }`}
              >
                <span
                  className={`w-5 h-5 flex-shrink-0 rounded border-2 flex items-center justify-center transition-colors ${
                    selected ? 'bg-brand-blue border-brand-blue' : 'border-gray-300'
                  }`}
                >
                  {selected && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                {point.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StepSurvey;
