/**
 * Locale-aware formatting utilities powered by the Intl API.
 *
 * All functions accept an optional `locale` override; when omitted they read
 * from the current i18n language (via a plain import so they can be used
 * outside of React components too).
 */
import i18n from '../i18n';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Resolve locale: explicit override > i18n language > browser default */
function resolveLocale(locale?: string): string {
  return locale ?? i18n.language ?? navigator.language ?? 'en';
}

// ---------------------------------------------------------------------------
// Date / Time
// ---------------------------------------------------------------------------

export interface FormatDateOptions {
  locale?: string;
  /** Intl.DateTimeFormat options — pick a preset or pass custom options */
  preset?: 'short' | 'medium' | 'long' | 'full';
  options?: Intl.DateTimeFormatOptions;
}

const DATE_PRESETS: Record<string, Intl.DateTimeFormatOptions> = {
  short: { month: 'numeric', day: 'numeric', year: '2-digit' },
  medium: { month: 'short', day: 'numeric', year: 'numeric' },
  long: { month: 'long', day: 'numeric', year: 'numeric' },
  full: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
};

/** Format a Date (or ISO string / timestamp) for display. */
export function formatDate(
  date: Date | string | number,
  opts: FormatDateOptions = {},
): string {
  const d = date instanceof Date ? date : new Date(date);
  const locale = resolveLocale(opts.locale);
  const fmtOptions = opts.options ?? DATE_PRESETS[opts.preset ?? 'medium'];
  return new Intl.DateTimeFormat(locale, fmtOptions).format(d);
}

export interface FormatTimeOptions {
  locale?: string;
  hour12?: boolean;
}

/** Format just the time portion of a Date. */
export function formatTime(
  date: Date | string | number,
  opts: FormatTimeOptions = {},
): string {
  const d = date instanceof Date ? date : new Date(date);
  const locale = resolveLocale(opts.locale);
  return new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: opts.hour12,
  }).format(d);
}

/** Format a Date as both date + time. */
export function formatDateTime(
  date: Date | string | number,
  opts: FormatDateOptions & { hour12?: boolean } = {},
): string {
  const d = date instanceof Date ? date : new Date(date);
  const locale = resolveLocale(opts.locale);
  const dateOptions = opts.options ?? DATE_PRESETS[opts.preset ?? 'medium'];
  return new Intl.DateTimeFormat(locale, {
    ...dateOptions,
    hour: 'numeric',
    minute: '2-digit',
    hour12: opts.hour12,
  }).format(d);
}

// ---------------------------------------------------------------------------
// Relative Time
// ---------------------------------------------------------------------------

const RELATIVE_UNITS: { unit: Intl.RelativeTimeFormatUnit; ms: number }[] = [
  { unit: 'year', ms: 365.25 * 24 * 60 * 60 * 1000 },
  { unit: 'month', ms: 30.44 * 24 * 60 * 60 * 1000 },
  { unit: 'week', ms: 7 * 24 * 60 * 60 * 1000 },
  { unit: 'day', ms: 24 * 60 * 60 * 1000 },
  { unit: 'hour', ms: 60 * 60 * 1000 },
  { unit: 'minute', ms: 60 * 1000 },
  { unit: 'second', ms: 1000 },
];

/**
 * Returns a human-readable relative time string such as "3 hours ago" or
 * "in 2 days", localised to the active (or specified) locale.
 */
export function formatRelativeTime(
  date: Date | string | number,
  locale?: string,
): string {
  const d = date instanceof Date ? date : new Date(date);
  const diff = d.getTime() - Date.now();
  const absDiff = Math.abs(diff);

  // "just now" for anything < 10 seconds
  if (absDiff < 10_000) {
    // Use i18n key if loaded, otherwise fallback
    try {
      return i18n.t('time.justNow', { ns: 'common' });
    } catch {
      return 'Just now';
    }
  }

  const resolved = resolveLocale(locale);
  const rtf = new Intl.RelativeTimeFormat(resolved, { numeric: 'auto' });

  for (const { unit, ms } of RELATIVE_UNITS) {
    if (absDiff >= ms || unit === 'second') {
      const value = Math.round(diff / ms);
      return rtf.format(value, unit);
    }
  }

  return rtf.format(0, 'second');
}

// ---------------------------------------------------------------------------
// Numbers
// ---------------------------------------------------------------------------

export interface FormatNumberOptions {
  locale?: string;
  options?: Intl.NumberFormatOptions;
}

/** Format a number with locale-appropriate grouping separators. */
export function formatNumber(
  value: number,
  opts: FormatNumberOptions = {},
): string {
  const locale = resolveLocale(opts.locale);
  return new Intl.NumberFormat(locale, opts.options).format(value);
}

/** Compact notation: 1.2K, 3.4M, etc. */
export function formatCompactNumber(
  value: number,
  locale?: string,
): string {
  const resolved = resolveLocale(locale);
  return new Intl.NumberFormat(resolved, {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

/** Format a number as a percentage (0.75 → "75%"). */
export function formatPercent(
  value: number,
  opts: { locale?: string; decimals?: number } = {},
): string {
  const locale = resolveLocale(opts.locale);
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: opts.decimals ?? 0,
    maximumFractionDigits: opts.decimals ?? 0,
  }).format(value);
}

// ---------------------------------------------------------------------------
// Currency
// ---------------------------------------------------------------------------

export interface FormatCurrencyOptions {
  locale?: string;
  currency?: string;
  /** Show cents? Default true */
  showCents?: boolean;
}

/** Format a number as currency. Defaults to USD. */
export function formatCurrency(
  value: number,
  opts: FormatCurrencyOptions = {},
): string {
  const locale = resolveLocale(opts.locale);
  const currency = opts.currency ?? 'USD';
  const fractionDigits = opts.showCents === false ? 0 : 2;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}
