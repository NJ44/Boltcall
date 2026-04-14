import { useState } from 'react';

const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

// ─── SMS Agent Illustration ──────────────────────────────────────────────────

const SMSIllustration = () => (
  <div className="flex items-center justify-center h-full">
    <div className="relative">
      {/* Phone shell */}
      <div className="w-[188px] bg-slate-900 rounded-[32px] p-[6px] shadow-2xl ring-1 ring-white/10">
        {/* Notch */}
        <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-16 h-4 bg-slate-900 rounded-full z-10" />
        {/* Screen */}
        <div className="rounded-[27px] overflow-hidden bg-white">
          {/* Status bar */}
          <div className="bg-white px-4 pt-5 pb-1 flex justify-between">
            <span className="text-[9px] font-semibold text-slate-800">9:41</span>
            <span className="text-[9px] text-slate-500">●●●</span>
          </div>
          {/* Chat header */}
          <div className="bg-slate-900 px-3 py-2 flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">BC</div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-[10px] font-semibold leading-tight">Boltcall Agent</p>
              <p className="text-green-400 text-[8px]">● Online now</p>
            </div>
          </div>
          {/* Message thread */}
          <div className="bg-[#f0f0f5] px-2 py-2 space-y-2 min-h-[200px]">
            {/* Lead inbound */}
            <div className="flex justify-end">
              <div className="bg-white rounded-2xl rounded-br-sm px-2.5 py-1.5 max-w-[130px] shadow-sm">
                <p className="text-[9px] text-slate-800 leading-relaxed">Hi, need AC repair today — it's urgent!</p>
                <p className="text-[8px] text-slate-400 text-right mt-0.5">2:14 PM</p>
              </div>
            </div>
            {/* Speed badge */}
            <div className="flex justify-center">
              <span className="bg-emerald-100 text-emerald-700 text-[8px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                Responded in 3 sec
              </span>
            </div>
            {/* AI reply */}
            <div className="flex justify-start">
              <div className="bg-blue-600 rounded-2xl rounded-tl-sm px-2.5 py-1.5 max-w-[140px]">
                <p className="text-[9px] text-white leading-relaxed">Hi! I'm your AI from Cool Air. I'm calling you right now to get you booked 👋</p>
                <p className="text-[8px] text-blue-200 text-right mt-0.5">2:14 PM ✓✓</p>
              </div>
            </div>
            {/* Lead confirm */}
            <div className="flex justify-end">
              <div className="bg-white rounded-2xl rounded-br-sm px-2.5 py-1.5 shadow-sm">
                <p className="text-[9px] text-slate-800">Sounds good!</p>
                <p className="text-[8px] text-slate-400 text-right mt-0.5">2:15 PM</p>
              </div>
            </div>
            {/* Booking confirm */}
            <div className="flex justify-start">
              <div className="bg-blue-600 rounded-2xl rounded-tl-sm px-2.5 py-1.5 max-w-[140px]">
                <p className="text-[9px] text-white leading-relaxed">Booked! John arrives at 4pm today ✅</p>
                <p className="text-[8px] text-blue-200 text-right mt-0.5">2:15 PM ✓✓</p>
              </div>
            </div>
          </div>
          {/* Input bar */}
          <div className="bg-white px-2 py-1.5 flex items-center gap-1.5">
            <div className="flex-1 bg-slate-100 rounded-full px-2.5 py-1">
              <span className="text-[8px] text-slate-400">Message...</span>
            </div>
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>
            </div>
          </div>
        </div>
      </div>
      {/* Floating tags */}
      <div className="absolute -top-2 -right-16 bg-white border border-slate-100 rounded-xl px-2.5 py-1.5 shadow-lg text-[9px] font-semibold text-slate-700 whitespace-nowrap">
        📲 Lead captured
      </div>
      <div className="absolute -bottom-2 -left-16 bg-white border border-slate-100 rounded-xl px-2.5 py-1.5 shadow-lg text-[9px] font-semibold text-slate-700 whitespace-nowrap">
        🕐 24/7 auto-reply
      </div>
    </div>
  </div>
);

// ─── AI Receptionist Illustration ───────────────────────────────────────────

const ReceptionistIllustration = () => (
  <div className="flex items-center justify-center h-full">
    <div className="space-y-3 w-[256px]">
      {/* Live call card */}
      <div className="bg-slate-900 rounded-2xl p-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">JD</div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold">John Davis</p>
            <p className="text-slate-400 text-[11px]">+1 (555) 847-2091</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/30">
            <svg width="14" height="14" fill="white" viewBox="0 0 24 24"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
          </div>
        </div>
        {/* Voice waveform */}
        <div className="mt-3 flex items-end gap-[3px] h-7 justify-center">
          {[4, 9, 14, 8, 18, 11, 7, 16, 10, 5, 13, 8, 17, 9, 6, 12, 15, 8, 4, 11].map((h, i) => (
            <div
              key={i}
              className="w-[3px] rounded-full bg-blue-400"
              style={{ height: `${h}px`, opacity: 0.55 + (i % 4) * 0.12 }}
            />
          ))}
        </div>
        <div className="mt-2 flex items-center justify-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-400" />
          <span className="text-green-400 text-[10px] font-semibold">AI Answering · 0:23</span>
        </div>
        {/* Transcript snippet */}
        <div className="mt-3 bg-slate-800 rounded-xl p-2.5">
          <p className="text-slate-300 text-[9px] leading-relaxed italic">
            "…I have Thursday at 2pm or Friday at 10am available. Which works better for you?"
          </p>
        </div>
      </div>
      {/* Booking confirmation */}
      <div className="bg-white rounded-xl p-3 shadow-lg border border-slate-100">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <p className="text-[11px] font-semibold text-slate-800">Appointment Confirmed</p>
          <div className="ml-auto w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
            <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2"><polyline points="2 6 5 9 10 3"/></svg>
          </div>
        </div>
        <div className="bg-blue-50 rounded-lg px-3 py-2">
          <p className="text-[10px] font-semibold text-blue-800">Thursday, Apr 17 · 2:00 PM</p>
          <p className="text-[9px] text-blue-600 mt-0.5">AC Repair — John Davis · Confirmed via AI call</p>
        </div>
      </div>
    </div>
  </div>
);

// ─── Instant Ads Response Illustration ──────────────────────────────────────

const AdsIllustration = () => (
  <div className="flex items-center justify-center h-full gap-4">
    {/* Facebook lead form card */}
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 w-[130px] overflow-hidden flex-shrink-0">
      <div className="bg-[#1877F2] px-2.5 py-2 flex items-center gap-1.5">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        <span className="text-white text-[9px] font-bold">Lead Ad</span>
      </div>
      <div className="p-2 space-y-1.5">
        <div>
          <p className="text-[7px] text-slate-400 uppercase font-semibold mb-0.5">Name</p>
          <div className="bg-slate-50 border border-slate-200 rounded px-1.5 py-1">
            <p className="text-[9px] text-slate-800 font-medium">Sarah Johnson</p>
          </div>
        </div>
        <div>
          <p className="text-[7px] text-slate-400 uppercase font-semibold mb-0.5">Service</p>
          <div className="bg-slate-50 border border-slate-200 rounded px-1.5 py-1">
            <p className="text-[9px] text-slate-800 font-medium">Teeth Whitening</p>
          </div>
        </div>
        <div>
          <p className="text-[7px] text-slate-400 uppercase font-semibold mb-0.5">Phone</p>
          <div className="bg-slate-50 border border-slate-200 rounded px-1.5 py-1">
            <p className="text-[9px] text-slate-800 font-medium">555-821-4490</p>
          </div>
        </div>
        <div className="bg-[#1877F2] rounded-lg py-1.5 text-center mt-1">
          <span className="text-white text-[9px] font-bold">Submitted ✓</span>
        </div>
      </div>
    </div>

    {/* Pipeline arrow */}
    <div className="flex flex-col items-center gap-1 flex-shrink-0">
      <svg width="32" height="16" viewBox="0 0 32 16" fill="none">
        <path d="M0 8 L26 8" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 2"/>
        <path d="M24 4 L30 8 L24 12" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
      <span className="text-[8px] text-slate-500 font-semibold whitespace-nowrap">⚡ 4 sec</span>
    </div>

    {/* SMS notification card */}
    <div className="bg-slate-900 rounded-xl p-3 w-[126px] shadow-2xl flex-shrink-0">
      <div className="flex items-center gap-1.5 mb-2">
        <div className="w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="white"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
        </div>
        <p className="text-white text-[10px] font-semibold">SMS Sent</p>
        <span className="ml-auto bg-emerald-500 text-white text-[7px] font-bold px-1.5 py-0.5 rounded-md">NOW</span>
      </div>
      <div className="bg-slate-800 rounded-lg p-2">
        <p className="text-slate-300 text-[8px] leading-relaxed">Hi Sarah! Saw your interest in teeth whitening. Are you free for a quick call? 😊</p>
      </div>
      <div className="mt-1.5 flex items-center gap-1">
        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
        <span className="text-emerald-400 text-[8px] font-medium">Delivered · just now</span>
      </div>
    </div>
  </div>
);

// ─── Website Response Illustration ──────────────────────────────────────────

const WebsiteIllustration = () => (
  <div className="flex items-center justify-center h-full">
    <div className="relative w-[272px]">
      {/* Browser frame */}
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Browser chrome */}
        <div className="bg-slate-100 px-2.5 py-1.5 flex items-center gap-2 border-b border-slate-200">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 bg-white rounded-md px-2 py-0.5 flex items-center gap-1">
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            <span className="text-[8px] text-slate-400">yoursite.com/contact</span>
          </div>
        </div>

        {/* Page content */}
        <div className="px-4 py-3 bg-slate-50 relative">
          {/* Hero area stub */}
          <div className="mb-3">
            <div className="h-2.5 w-28 bg-blue-600 rounded-sm mb-1.5" />
            <div className="h-1.5 w-36 bg-slate-200 rounded-sm mb-1" />
            <div className="h-1.5 w-28 bg-slate-200 rounded-sm" />
          </div>

          {/* Contact form */}
          <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-100">
            <p className="text-[9px] font-semibold text-slate-700 mb-2">Contact Us</p>
            <div className="space-y-1.5">
              <div className="bg-slate-50 border border-slate-200 rounded-md h-5 flex items-center px-2">
                <span className="text-[8px] text-slate-600">Mike Thompson</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-md h-5 flex items-center px-2">
                <span className="text-[8px] text-slate-600">Need emergency plumber</span>
              </div>
              <div className="bg-blue-600 rounded-md py-1.5 text-center">
                <span className="text-white text-[8px] font-bold">Submit ✓</span>
              </div>
            </div>
          </div>

          {/* Chat widget */}
          <div className="absolute bottom-3 right-3">
            <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-[148px]">
              {/* Widget header */}
              <div className="bg-blue-600 rounded-t-xl px-2.5 py-1.5 flex items-center gap-1.5">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-white text-[9px] font-semibold">Boltcall</span>
              </div>
              {/* Messages */}
              <div className="p-2 space-y-1.5">
                <div className="bg-blue-600 rounded-xl rounded-tl-sm px-2 py-1.5">
                  <p className="text-white text-[8px] leading-relaxed">Hi Mike! Saw your request — calling you now to help fast 🔧</p>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  <span className="text-[7px] text-emerald-600 font-semibold">Sent in 5 seconds</span>
                </div>
              </div>
              {/* Input */}
              <div className="px-2 pb-2">
                <div className="bg-slate-100 rounded-full px-2 py-1 flex items-center justify-between">
                  <span className="text-[7px] text-slate-400">Reply...</span>
                  <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                    <svg width="7" height="7" viewBox="0 0 24 24" fill="white"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>
                  </div>
                </div>
              </div>
            </div>
            {/* Notification dot */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center ring-2 ring-white">
              <span className="text-white text-[8px] font-bold">1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ─── Tab data ────────────────────────────────────────────────────────────────

interface TabData {
  id: string;
  label: string;
  title: string;
  description: string;
  features: string[];
  illustration: React.ReactNode;
}

const TABS: TabData[] = [
  {
    id: 'sms',
    label: 'SMS Agent',
    title: 'SMS Lead Agent',
    description:
      'Every text message lead gets an instant, personalized reply — day or night. Your AI agent handles the whole conversation and books the appointment before a competitor even reads the notification.',
    features: [
      'Responds in under 5 seconds',
      'Qualifies & books via SMS',
      'Handles objections & follow-ups',
      'Works for any local service business',
    ],
    illustration: <SMSIllustration />,
  },
  {
    id: 'receptionist',
    label: 'AI Receptionist',
    title: 'AI Receptionist',
    description:
      'Never miss a call again. Your AI receptionist answers every call with a natural human voice, handles FAQs, and drops bookings straight into your calendar — around the clock, even on weekends.',
    features: [
      'Answers every call instantly',
      'Natural conversational voice',
      'Books into your calendar live',
      'Transfers urgent calls to you',
    ],
    illustration: <ReceptionistIllustration />,
  },
  {
    id: 'ads',
    label: 'Instant Ads Response',
    title: 'Instant Ads Response',
    description:
      'When someone fills out your Facebook or Google lead form, Boltcall fires a personalized SMS in under 5 seconds. Be the first to reply — and win the job before your competition wakes up.',
    features: [
      'Works with Facebook & Google Ads',
      'Personalised to every lead',
      'Auto-qualifies & schedules',
      'Zero manual work required',
    ],
    illustration: <AdsIllustration />,
  },
  {
    id: 'website',
    label: 'Website Response',
    title: 'Website Response',
    description:
      'The moment a lead submits your contact form or chat widget, your AI agent responds — reaching out before they close the tab. Turn casual browsers into booked appointments on autopilot.',
    features: [
      'Instant form submission response',
      'Works with any website',
      'Live chat widget included',
      'Syncs with your CRM',
    ],
    illustration: <WebsiteIllustration />,
  },
];

// ─── Main Component ──────────────────────────────────────────────────────────

export const QuantumTimeline = () => {
  const [activeTab, setActiveTab] = useState('sms');
  const active = TABS.find((t) => t.id === activeTab)!;

  return (
    <div
      className="w-full mx-auto px-6 pt-5 pb-4 font-sans bg-white rounded-2xl shadow-2xl"
      style={{
        width: 'calc(100% + 80px)',
        maxWidth: 'calc(70rem + 200px)',
        marginLeft: '-40px',
        marginRight: '-40px',
        marginTop: '-105px',
        marginBottom: '-100px',
      }}
    >
      {/* Tab navigation */}
      <div className="flex justify-center mb-5">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-full">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-150',
                activeTab === tab.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content area */}
      <div className="grid md:grid-cols-2 gap-8 items-center min-h-[260px]">
        {/* Left: text */}
        <div className="text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">{active.title}</h2>
          <p className="mt-3 text-slate-600 text-sm leading-relaxed">{active.description}</p>
          <ul className="mt-5 space-y-2.5">
            {active.features.map((f) => (
              <li key={f} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="#2563eb" strokeWidth="2.2">
                    <polyline points="2 6 5 9 10 3" />
                  </svg>
                </div>
                <span className="text-sm text-slate-700">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: illustration */}
        <div className="h-[280px]">{active.illustration}</div>
      </div>
    </div>
  );
};
