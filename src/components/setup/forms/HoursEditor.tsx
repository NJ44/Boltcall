import React from 'react';
import { Clock } from 'lucide-react';

interface HoursEditorProps {
  hours: Record<string, { open: string; close: string; closed: boolean }>;
  onChange: (day: string, hours: { open: string; close: string; closed: boolean }) => void;
  className?: string;
}

const days = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
];

const HoursEditor: React.FC<HoursEditorProps> = ({
  hours,
  onChange,
  className = '',
}) => {
  const handleClosedToggle = (day: string) => {
    const currentHours = hours[day];
    onChange(day, {
      ...currentHours,
      closed: !currentHours.closed,
    });
  };

  const handleTimeChange = (day: string, field: 'open' | 'close', value: string) => {
    const currentHours = hours[day];
    onChange(day, {
      ...currentHours,
      [field]: value,
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center space-x-2 mb-4">
        <Clock className="w-5 h-5 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900">Business Hours</h3>
      </div>

      <div className="space-y-3">
        {days.map(day => (
          <div key={day.key} className="flex items-center space-x-4">
            <div className="w-24">
              <label className="text-sm font-medium text-gray-700">
                {day.label}
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={hours[day.key]?.closed || false}
                  onChange={() => handleClosedToggle(day.key)}
                  className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
                />
                <span className="ml-2 text-sm text-gray-600">Closed</span>
              </label>

              {!hours[day.key]?.closed && (
                <div className="flex items-center space-x-2">
                  <input
                    type="time"
                    value={hours[day.key]?.open || '09:00'}
                    onChange={(e) => handleTimeChange(day.key, 'open', e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                  />
                  <span className="text-gray-400">to</span>
                  <input
                    type="time"
                    value={hours[day.key]?.close || '17:00'}
                    onChange={(e) => handleTimeChange(day.key, 'close', e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => {
              days.forEach(day => {
                onChange(day.key, { open: '09:00', close: '17:00', closed: false });
              });
            }}
            className="px-3 py-1 text-sm text-brand-blue hover:text-brand-blue/80 font-medium"
          >
            Set All 9-5
          </button>
          <button
            type="button"
            onClick={() => {
              days.forEach(day => {
                onChange(day.key, { open: '08:00', close: '18:00', closed: false });
              });
            }}
            className="px-3 py-1 text-sm text-brand-blue hover:text-brand-blue/80 font-medium"
          >
            Set All 8-6
          </button>
          <button
            type="button"
            onClick={() => {
              ['saturday', 'sunday'].forEach(day => {
                onChange(day, { open: '09:00', close: '17:00', closed: true });
              });
            }}
            className="px-3 py-1 text-sm text-brand-blue hover:text-brand-blue/80 font-medium"
          >
            Close Weekends
          </button>
        </div>
      </div>
    </div>
  );
};

export default HoursEditor;

