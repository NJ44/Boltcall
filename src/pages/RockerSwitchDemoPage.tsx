import { useState } from "react";
import { Component } from "@/components/ui/switch";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/* ─── individual demo card ─── */
interface DemoCardProps {
  title: string;
  description: string;
  badge?: string;
  children: React.ReactNode;
}

const DemoCard = ({ title, description, badge, children }: DemoCardProps) => (
  <div
    style={{ fontFamily: "'IBM Plex Mono', 'JetBrains Mono', 'Fira Code', monospace" }}
    className="relative flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-sm
               hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300 group"
  >
    {badge && (
      <span className="absolute -top-3 left-5 rounded-full border border-amber-500/40 bg-amber-500/10
                       px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-amber-400">
        {badge}
      </span>
    )}
    <div>
      <h3 className="text-sm font-bold uppercase tracking-widest text-white/80 mb-1">{title}</h3>
      <p className="text-xs text-white/40 leading-relaxed">{description}</p>
    </div>
    <div className="flex items-center justify-center py-4">{children}</div>
  </div>
);

/* ─── live control row ─── */
interface ControlRowProps {
  label: string;
  status: boolean;
  onChange: (val: boolean) => void;
  statusOn?: string;
  statusOff?: string;
}

const ControlRow = ({
  label,
  status,
  onChange,
  statusOn = "ACTIVE",
  statusOff = "OFFLINE",
}: ControlRowProps) => (
  <div className="flex items-center justify-between gap-6 rounded-xl border border-white/8
                  bg-white/[0.02] px-5 py-4 hover:bg-white/[0.04] transition-colors">
    <div className="flex items-center gap-3 min-w-0">
      <div
        className="h-2 w-2 rounded-full flex-shrink-0 transition-all duration-500"
        style={{
          backgroundColor: status ? "#4ade80" : "#374151",
          boxShadow: status ? "0 0 6px #4ade80" : "none",
        }}
      />
      <span
        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        className="text-xs font-medium uppercase tracking-widest text-white/60 truncate"
      >
        {label}
      </span>
    </div>
    <div className="flex items-center gap-4 flex-shrink-0">
      <span
        className="text-[10px] font-bold uppercase tracking-widest transition-all duration-300"
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          color: status ? "#4ade80" : "#374151",
          textShadow: status ? "0 0 8px rgba(74,222,128,0.5)" : "none",
        }}
      >
        {status ? statusOn : statusOff}
      </span>
      <Component
        checked={status}
        onChange={onChange}
        labelYes="On"
        labelNo="Off"
        size="small"
        className="p-0"
      />
    </div>
  </div>
);

export default function RockerSwitchDemoPage() {
  const [notify, setNotify] = useState(true);
  const [voiceAI, setVoiceAI] = useState(false);
  const [instantReply, setInstantReply] = useState(true);
  const [smsFollowUp, setSmsFollowUp] = useState(false);
  const [googleAds, setGoogleAds] = useState(true);
  const [webWidget, setWebWidget] = useState(true);

  const activeCount = [notify, voiceAI, instantReply, smsFollowUp, googleAds, webWidget].filter(Boolean).length;

  return (
    <div
      className="min-h-screen"
      style={{
        background: "radial-gradient(ellipse at 20% 20%, #0a1628 0%, #050810 50%, #000000 100%)",
        fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace",
      }}
    >
      <Header />

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        {/* Subtle grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Glow orb */}
        <div
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-20"
          style={{
            background: "radial-gradient(ellipse, #22c55e 0%, transparent 70%)",
          }}
        />

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/5 px-4 py-1.5 mb-8">
            <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-green-400">
              Component Demo — Rocker Switch
            </span>
          </div>

          <h1
            className="text-5xl md:text-7xl font-black uppercase tracking-tight text-white mb-6"
            style={{ letterSpacing: "-0.02em" }}
          >
            Control{" "}
            <span
              style={{
                WebkitTextStroke: "2px #4ade80",
                color: "transparent",
                textShadow: "0 0 40px rgba(74,222,128,0.3)",
              }}
            >
              Panel
            </span>
          </h1>

          <p className="text-white/40 text-sm tracking-widest uppercase max-w-xl mx-auto">
            Rocker switch UI — binary states, zero ambiguity
          </p>
        </div>
      </section>

      {/* ── Main content ── */}
      <main className="max-w-5xl mx-auto px-6 pb-32 space-y-16">

        {/* ── Section 1: Basic Variants ── */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">01 — Variants</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <DemoCard
              title="Default"
              description="Green YES / dimmed NO — the standard rocker state. Mirrors real electrical panel switches."
              badge="Base"
            >
              <Component labelYes="Yes" labelNo="No" size="small" />
            </DemoCard>

            <DemoCard
              title="Pre-checked"
              description="Renders with the switch defaulted to YES position on mount."
            >
              <Component defaultChecked={true} labelYes="Yes" labelNo="No" size="small" />
            </DemoCard>

            <DemoCard
              title="Custom labels"
              description="Any two-character labels work. Great for On/Off, Go/Stop, or domain-specific controls."
            >
              <Component labelYes="On" labelNo="Off" size="small" />
            </DemoCard>

            <DemoCard
              title="Disabled state"
              description="Prevents interaction. Useful for features locked behind a plan or pending a dependency."
              badge="State"
            >
              <Component labelYes="Yes" labelNo="No" size="small" disabled />
            </DemoCard>

            <DemoCard
              title="Disabled + checked"
              description="Shows a frozen active state — read-only display of a system-controlled setting."
            >
              <Component defaultChecked={true} labelYes="Yes" labelNo="No" size="small" disabled />
            </DemoCard>

            <DemoCard
              title="Normal size"
              description="The default (non-small) rocker is 33% larger — better for touchscreens and primary controls."
            >
              <Component labelYes="Yes" labelNo="No" size="normal" />
            </DemoCard>
          </div>
        </section>

        {/* ── Section 2: Live Control Panel ── */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">02 — Live Controls</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
            {/* Panel header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/50" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/50" />
                  <div className="h-3 w-3 rounded-full bg-green-500/50" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-white/40">
                  Boltcall — Feature Controls
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="text-[11px] font-bold uppercase tracking-widest"
                  style={{
                    color: "#4ade80",
                    textShadow: "0 0 8px rgba(74,222,128,0.5)",
                  }}
                >
                  {activeCount} / 6 active
                </span>
              </div>
            </div>

            {/* Controls list */}
            <div className="p-6 space-y-2">
              <ControlRow
                label="Lead Notifications"
                status={notify}
                onChange={setNotify}
                statusOn="LIVE"
                statusOff="MUTED"
              />
              <ControlRow
                label="AI Voice Receptionist"
                status={voiceAI}
                onChange={setVoiceAI}
                statusOn="ANSWERING"
                statusOff="PAUSED"
              />
              <ControlRow
                label="Instant Lead Reply"
                status={instantReply}
                onChange={setInstantReply}
                statusOn="FIRING"
                statusOff="STOPPED"
              />
              <ControlRow
                label="SMS Follow-up Sequences"
                status={smsFollowUp}
                onChange={setSmsFollowUp}
                statusOn="RUNNING"
                statusOff="IDLE"
              />
              <ControlRow
                label="Google Ads Integration"
                status={googleAds}
                onChange={setGoogleAds}
                statusOn="SYNCING"
                statusOff="DISCONNECTED"
              />
              <ControlRow
                label="Website Chat Widget"
                status={webWidget}
                onChange={setWebWidget}
                statusOn="EMBEDDED"
                statusOff="HIDDEN"
              />
            </div>

            {/* Status bar */}
            <div className="px-6 py-3 border-t border-white/8 bg-white/[0.01] flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    backgroundColor: activeCount > 0 ? "#4ade80" : "#374151",
                    boxShadow: activeCount > 0 ? "0 0 6px #4ade80" : "none",
                    transition: "all 0.3s",
                  }}
                />
                <span className="text-[10px] uppercase tracking-widest text-white/30">
                  System status:{" "}
                  <span
                    style={{
                      color: activeCount >= 4 ? "#4ade80" : activeCount >= 2 ? "#fbbf24" : "#f87171",
                    }}
                  >
                    {activeCount >= 4 ? "OPTIMAL" : activeCount >= 2 ? "PARTIAL" : "DEGRADED"}
                  </span>
                </span>
              </div>
              <div className="ml-auto flex gap-1">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-1 rounded-full transition-all duration-500"
                    style={{
                      width: 20,
                      backgroundColor: i < activeCount ? "#4ade80" : "#1f2937",
                      boxShadow: i < activeCount ? "0 0 4px #4ade80" : "none",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 3: Controlled component demo ── */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">03 — Controlled State</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <ControlledDemo />
        </section>

        {/* ── Section 4: Usage Guide ── */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">04 — Usage</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-4">Uncontrolled</p>
              <pre className="text-[11px] text-green-400/80 leading-relaxed overflow-x-auto">
{`<Component
  labelYes="Yes"
  labelNo="No"
  size="small"
/>`}
              </pre>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-4">Controlled</p>
              <pre className="text-[11px] text-green-400/80 leading-relaxed overflow-x-auto">
{`const [on, setOn] = useState(false);

<Component
  checked={on}
  onChange={setOn}
  labelYes="On"
  labelNo="Off"
/>`}
              </pre>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-4">Props</p>
              <div className="space-y-2">
                {[
                  ["labelYes", "string", '"Yes"'],
                  ["labelNo", "string", '"No"'],
                  ["size", '"small" | "normal" | "large"', '"small"'],
                  ["checked", "boolean", "undefined"],
                  ["defaultChecked", "boolean", "false"],
                  ["onChange", "(v: boolean) => void", "—"],
                  ["disabled", "boolean", "false"],
                ].map(([prop, type, def]) => (
                  <div key={prop} className="flex items-start gap-3 text-[11px]">
                    <span className="text-amber-400 font-bold min-w-[110px]">{prop}</span>
                    <span className="text-white/30">{type}</span>
                    <span className="ml-auto text-white/20">{def}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-4">Best Fit</p>
              <ul className="space-y-2">
                {[
                  "Dashboard feature toggles",
                  "Settings panel on/off controls",
                  "Notification preferences",
                  "Integration enable/disable",
                  "A/B test variant selectors",
                  "Plan upgrade prompts (disabled state)",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-[11px] text-white/50">
                    <span className="text-green-400">›</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

/* ── Controlled demo sub-component ── */
function ControlledDemo() {
  const [value, setValue] = useState(false);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 flex flex-col md:flex-row items-center gap-10">
      <div className="flex flex-col items-center gap-6">
        <Component
          checked={value}
          onChange={setValue}
          labelYes="Yes"
          labelNo="No"
          size="normal"
        />
        <button
          onClick={() => setValue((v) => !v)}
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-bold uppercase
                     tracking-widest text-white/50 hover:bg-white/10 hover:text-white/80 transition-all"
        >
          Toggle externally
        </button>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3">Current state</p>
        <div
          className="rounded-xl border px-6 py-4 transition-all duration-500"
          style={{
            borderColor: value ? "rgba(74,222,128,0.3)" : "rgba(248,113,113,0.2)",
            backgroundColor: value ? "rgba(74,222,128,0.05)" : "rgba(248,113,113,0.03)",
          }}
        >
          <span
            className="text-3xl font-black uppercase tracking-widest transition-all duration-500"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              color: value ? "#4ade80" : "#f87171",
              textShadow: value
                ? "0 0 20px rgba(74,222,128,0.4)"
                : "0 0 20px rgba(248,113,113,0.4)",
            }}
          >
            {value ? "YES — ACTIVE" : "NO — INACTIVE"}
          </span>
          <p className="text-[11px] text-white/30 mt-2">
            {value
              ? "Switch is in YES position. onChange fired with true."
              : "Switch is in NO position. onChange fired with false."}
          </p>
        </div>
        <p className="text-[10px] text-white/20 mt-3 leading-relaxed">
          Both the rocker and the external button share the same React state.
          This demonstrates fully controlled mode — the component holds no internal state.
        </p>
      </div>
    </div>
  );
}
