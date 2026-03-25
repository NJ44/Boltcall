import React, { useState, useEffect } from 'react';
import { CalendarDays, Filter, X, ArrowLeftRight } from 'lucide-react';

export type DatePreset = 'today' | '7d' | '30d' | '90d' | 'custom';

export interface DateRangeValue {
  start: string;
  end: string;
}

export interface AnalyticsFilterValues {
  dateRange: DateRangeValue;
  preset: DatePreset;
  agentId: string;
  source: string;
  leadStatus: string;
  phone: string;
  comparisonEnabled: boolean;
  comparisonRange: DateRangeValue;
}

interface AnalyticsDateFilterProps {
  value: AnalyticsFilterValues;
  onChange: (v: AnalyticsFilterValues) => void;
  sources?: string[];
  agents?: { id: string; name: string }[];
  statuses?: string[];
}

const PRESETS: { key: DatePreset; label: string; days: number }[] = [
  { key: 'today', label: 'Today', days: 0 },
  { key: '7d', label: '7 Days', days: 7 },
  { key: '30d', label: '30 Days', days: 30 },
  { key: '90d', label: '90 Days', days: 90 },
];

function getPresetRange(_preset: DatePreset, days: number): DateRangeValue {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - (days || 0));
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  };
}

const STORAGE_KEY = 'boltcall_analytics_filters';

function loadPersistedFilters(): Partial<AnalyticsFilterValues> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persistFilters(v: AnalyticsFilterValues) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      preset: v.preset,
      agentId: v.agentId,
      source: v.source,
      leadStatus: v.leadStatus,
    }));
  } catch { /* noop */ }
}

export function getDefaultFilters(): AnalyticsFilterValues {
  const persisted = loadPersistedFilters();
  const preset = (persisted?.preset as DatePreset) || '30d';
  const presetDef = PRESETS.find(p => p.key === preset) || PRESETS[2];
  const dateRange = getPresetRange(preset, presetDef.days);

  return {
    dateRange,
    preset,
    agentId: persisted?.agentId || '',
    source: persisted?.source || '',
    leadStatus: persisted?.leadStatus || '',
    phone: '',
    comparisonEnabled: false,
    comparisonRange: getPresetRange('30d', 30),
  };
}

const AnalyticsDateFilter: React.FC<AnalyticsDateFilterProps> = ({
  value,
  onChange,
  sources = [],
  agents = [],
  statuses = ['pending', 'scheduled', 'completed', 'missed', 'booked'],
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showCustom, setShowCustom] = useState(value.preset === 'custom');

  useEffect(() => {
    persistFilters(value);
  }, [value]);

  const handlePreset = (preset: DatePreset) => {
    const def = PRESETS.find(p => p.key === preset);
    if (!def) return;
    const dateRange = getPresetRange(preset, def.days);
    setShowCustom(false);
    onChange({ ...value, preset, dateRange });
  };

  const handleCustomApply = () => {
    if (value.dateRange.start && value.dateRange.end) {
      onChange({ ...value, preset: 'custom' });
    }
  };

  return (
    <div className="space-y-3">
      {/* Date presets row */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {PRESETS.map(p => (
            <button
              key={p.key}
              onClick={() => handlePreset(p.key)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                value.preset === p.key && !showCustom
                  ? 'bg-white text-text-main shadow-sm'
                  : 'text-text-muted hover:text-text-main'
              }`}
            >
              {p.label}
            </button>
          ))}
          <button
            onClick={() => setShowCustom(!showCustom)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors inline-flex items-center gap-1 ${
              value.preset === 'custom'
                ? 'bg-white text-text-main shadow-sm'
                : 'text-text-muted hover:text-text-main'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            Custom
          </button>
        </div>

        {/* Advanced filters toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
            showAdvanced || value.agentId || value.source || value.leadStatus
              ? 'border-brand-blue text-brand-blue bg-blue-50'
              : 'border-border text-text-muted hover:text-text-main hover:bg-gray-50'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          Filters
          {(value.agentId || value.source || value.leadStatus) && (
            <span className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
          )}
        </button>

        {/* Comparison toggle */}
        <button
          onClick={() => onChange({ ...value, comparisonEnabled: !value.comparisonEnabled })}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
            value.comparisonEnabled
              ? 'border-purple-400 text-purple-700 bg-purple-50'
              : 'border-border text-text-muted hover:text-text-main hover:bg-gray-50'
          }`}
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          Compare
        </button>
      </div>

      {/* Custom date picker */}
      {showCustom && (
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={value.dateRange.start}
            onChange={(e) => onChange({ ...value, dateRange: { ...value.dateRange, start: e.target.value } })}
            className="px-2.5 py-1.5 text-sm rounded-lg border border-border"
          />
          <span className="text-text-muted text-sm">to</span>
          <input
            type="date"
            value={value.dateRange.end}
            onChange={(e) => onChange({ ...value, dateRange: { ...value.dateRange, end: e.target.value } })}
            className="px-2.5 py-1.5 text-sm rounded-lg border border-border"
          />
          <button
            onClick={handleCustomApply}
            disabled={!value.dateRange.start || !value.dateRange.end}
            className="px-3 py-1.5 text-sm font-medium rounded-lg bg-brand-blue text-white hover:bg-brand-blueDark transition-colors disabled:opacity-50"
          >
            Apply
          </button>
        </div>
      )}

      {/* Comparison date range */}
      {value.comparisonEnabled && (
        <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg border border-purple-100">
          <span className="text-xs font-medium text-purple-700">Compare with:</span>
          <input
            type="date"
            value={value.comparisonRange.start}
            onChange={(e) => onChange({ ...value, comparisonRange: { ...value.comparisonRange, start: e.target.value } })}
            className="px-2.5 py-1.5 text-sm rounded-lg border border-purple-200 bg-white"
          />
          <span className="text-purple-500 text-sm">to</span>
          <input
            type="date"
            value={value.comparisonRange.end}
            onChange={(e) => onChange({ ...value, comparisonRange: { ...value.comparisonRange, end: e.target.value } })}
            className="px-2.5 py-1.5 text-sm rounded-lg border border-purple-200 bg-white"
          />
        </div>
      )}

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="flex flex-wrap items-center gap-3 p-3 bg-gray-50 rounded-lg border border-border">
          {agents.length > 0 && (
            <select
              value={value.agentId}
              onChange={(e) => onChange({ ...value, agentId: e.target.value })}
              className="px-2.5 py-1.5 text-sm rounded-lg border border-border bg-white"
            >
              <option value="">All Agents</option>
              {agents.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          )}

          <select
            value={value.source}
            onChange={(e) => onChange({ ...value, source: e.target.value })}
            className="px-2.5 py-1.5 text-sm rounded-lg border border-border bg-white"
          >
            <option value="">All Sources</option>
            {sources.length > 0
              ? sources.map(s => <option key={s} value={s}>{s}</option>)
              : ['website', 'phone', 'sms', 'whatsapp', 'form', 'ads', 'organic', 'referral'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))
            }
          </select>

          <select
            value={value.leadStatus}
            onChange={(e) => onChange({ ...value, leadStatus: e.target.value })}
            className="px-2.5 py-1.5 text-sm rounded-lg border border-border bg-white"
          >
            <option value="">All Statuses</option>
            {statuses.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Filter by phone..."
            value={value.phone}
            onChange={(e) => onChange({ ...value, phone: e.target.value })}
            className="px-2.5 py-1.5 text-sm rounded-lg border border-border bg-white w-40"
          />

          {(value.agentId || value.source || value.leadStatus || value.phone) && (
            <button
              onClick={() => onChange({ ...value, agentId: '', source: '', leadStatus: '', phone: '' })}
              className="inline-flex items-center gap-1 px-2 py-1.5 text-xs text-red-600 hover:text-red-800"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalyticsDateFilter;
