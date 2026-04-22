import React from "react";
import { GlassDefs, GlassBox } from "./ui/glass-box";
import type { GlassVariant } from "./ui/glass-box";

const dtc  = (d:boolean) => d ? "text-white"     : "text-gray-900";
const dtcs = (d:boolean) => d ? "text-white/55"  : "text-gray-500";
const dtcx = (d:boolean) => d ? "text-white/42"  : "text-black/38";
const dbd  = (d:boolean) => d ? "border-white/18 text-white/48" : "border-black/14 text-black/40";

const StatCard = ({variant,label,value,sub,dark=false}:{variant:GlassVariant;label:string;value:string;sub:string;dark?:boolean}) => (
  <GlassBox variant={variant} className="p-5 flex-1 min-w-[140px]" clip="md">
    <p className={"text-[10px] uppercase tracking-widest font-semibold mb-2 " + dtcx(dark)}>{label}</p>
    <p className={"text-3xl font-bold " + dtc(dark)}>{value}</p>
    <p className={"text-xs mt-1 " + dtcs(dark)}>{sub}</p>
  </GlassBox>
);
const InfoCard = ({variant,title,desc,badge,dark=false}:{variant:GlassVariant;title:string;desc:string;badge?:string;dark?:boolean}) => (
  <GlassBox variant={variant} className="p-5" clip="md">
    {badge && <span className={"text-[9px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full mb-3 inline-block border " + dbd(dark)}>{badge}</span>}
    <h3 className={"font-semibold text-base leading-snug mb-1.5 " + dtc(dark)}>{title}</h3>
    <p className={"text-sm leading-relaxed " + dtcs(dark)}>{desc}</p>
  </GlassBox>
);
const Pill = ({variant,label,dark=false}:{variant:GlassVariant;label:string;dark?:boolean}) => (
  <GlassBox variant={variant} rounded="rounded-full" clip="pill" className="cursor-pointer hover:scale-105 transition-transform duration-300">
    <div className={"px-5 py-2.5 text-sm font-semibold " + dtc(dark)}>{label}</div>
  </GlassBox>
);
const WidePanel = ({variant,dark=false}:{variant:GlassVariant;dark?:boolean}) => (
  <GlassBox variant={variant} className="p-6" clip="lg">
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1">
        <p className={"text-[10px] uppercase tracking-widest font-semibold mb-1 " + dtcx(dark)}>Boltcall Platform</p>
        <h3 className={"text-xl font-bold " + dtc(dark)}>Speed-to-Lead, Automated</h3>
        <p className={"text-sm mt-1.5 max-w-xs " + dtcs(dark)}>Every inbound lead answered instantly. Every appointment booked automatically.</p>
      </div>
      <div className="flex flex-col gap-2 items-end shrink-0">
        <Pill variant={dark ? "clear" : "dark"} label="Get Started" dark={dark} />
        <Pill variant={variant} label={"variant: " + variant} dark={dark} />
      </div>
    </div>
  </GlassBox>
);

const GlassStats: React.FC = () => (
  <section
    className="relative px-4 sm:px-8 lg:px-16 py-16"
    style={{ background:"radial-gradient(ellipse 70% 60% at 15% 20%,#1e3a8a 0%,#0f172a 55%,#020617 100%)" }}
  >
    <GlassDefs />
    <div className="max-w-4xl mx-auto w-full space-y-5">
      <div className="flex gap-4 flex-wrap">
        <StatCard variant="cobalt" label="Response" value="22s"  sub="avg reply time"      dark />
        <StatCard variant="blue"   label="Leads"    value="248"  sub="captured this month" dark />
        <StatCard variant="clear"  label="Booked"   value="91%"  sub="booking conversion"  dark />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard variant="clear"  title="AI Receptionist"  desc="Answers every inbound call 24/7, qualifies leads, and books appointments automatically." badge="Feature" dark />
        <InfoCard variant="cobalt" title="Instant SMS Reply" desc="Every missed call gets a text back in seconds, before leads go cold." badge="Popular" dark />
      </div>
    </div>
  </section>
);

export default GlassStats;
