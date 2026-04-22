import React from "react";

const GlassDefs = () => (
  <svg style={{ display: "none", position: "absolute" }} aria-hidden="true">
    <defs>
      <filter id="gd-specular" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.45 0.55" numOctaves="4" seed="8" result="noise" />
        <feColorMatrix type="saturate" values="0" in="noise" result="gray" />
        <feSpecularLighting in="gray" surfaceScale="10" specularConstant="1.4" specularExponent="90" lightingColor="white" result="spec">
          <fePointLight x="-80" y="-120" z="350" />
        </feSpecularLighting>
        <feComposite in="spec" operator="arithmetic" k1="0" k2="0.32" k3="0" k4="0" />
      </filter>
      <filter id="gd-grain" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.82 0.92" numOctaves="4" stitchTiles="stitch" result="g" />
        <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.06 0" in="g" />
      </filter>
      <filter id="gd-spec-warm" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.45 0.55" numOctaves="4" seed="22" result="noise" />
        <feColorMatrix type="saturate" values="0" in="noise" result="gray" />
        <feSpecularLighting in="gray" surfaceScale="10" specularConstant="1.2" specularExponent="80" lightingColor="rgba(255,230,180,1)" result="spec">
          <fePointLight x="120" y="-80" z="300" />
        </feSpecularLighting>
        <feComposite in="spec" operator="arithmetic" k1="0" k2="0.28" k3="0" k4="0" />
      </filter>
      <clipPath id="gd-clip-sm"><rect width="100%" height="100%" rx="14" ry="14" /></clipPath>
      <clipPath id="gd-clip-md"><rect width="100%" height="100%" rx="20" ry="20" /></clipPath>
      <clipPath id="gd-clip-lg"><rect width="100%" height="100%" rx="24" ry="24" /></clipPath>
      <clipPath id="gd-clip-pill"><rect width="100%" height="100%" rx="999" ry="999" /></clipPath>
    </defs>
  </svg>
);

type GlassVariant = "clear"|"frost"|"blue"|"purple"|"rose"|"amber"|"emerald"|"dark"|"thick"|"rainbow"|"cobalt"|"obsidian";
interface VD { bg:string; tint?:string; border:string; topShine:string; sf:string; gOp:number; sOp:number; blur:string; rainbow?:boolean; }

const V: Record<GlassVariant, VD> = {
  clear:    {bg:"rgba(255,255,255,0.12)",border:"rgba(255,255,255,0.62)",topShine:"rgba(255,255,255,0.55)",sf:"url(#gd-specular)",gOp:0.7,sOp:1,   blur:"blur(18px) saturate(180%)"},
  frost:    {bg:"rgba(255,255,255,0.48)",border:"rgba(255,255,255,0.82)",topShine:"rgba(255,255,255,0.72)",sf:"url(#gd-specular)",gOp:0.5,sOp:0.8, blur:"blur(36px) saturate(200%) brightness(1.05)"},
  blue:     {bg:"rgba(59,130,246,0.18)", tint:"rgba(147,197,253,0.12)", border:"rgba(147,197,253,0.60)",topShine:"rgba(219,234,254,0.55)",sf:"url(#gd-specular)",gOp:0.7,sOp:1,blur:"blur(20px) saturate(200%)"},
  cobalt:   {bg:"rgba(29,78,216,0.28)",  tint:"rgba(96,165,250,0.10)",  border:"rgba(96,165,250,0.55)", topShine:"rgba(186,230,253,0.50)",sf:"url(#gd-specular)",gOp:0.6,sOp:1,blur:"blur(22px) saturate(220%)"},
  purple:   {bg:"rgba(139,92,246,0.20)", tint:"rgba(196,181,253,0.10)", border:"rgba(196,181,253,0.55)",topShine:"rgba(237,233,254,0.50)",sf:"url(#gd-specular)",gOp:0.7,sOp:1,blur:"blur(20px) saturate(190%)"},
  rose:     {bg:"rgba(244,63,94,0.16)",  tint:"rgba(253,164,175,0.10)", border:"rgba(253,164,175,0.55)",topShine:"rgba(255,228,230,0.50)",sf:"url(#gd-specular)",gOp:0.7,sOp:0.9,blur:"blur(20px) saturate(200%)"},
  amber:    {bg:"rgba(251,146,60,0.18)", tint:"rgba(253,186,116,0.10)", border:"rgba(253,186,116,0.55)",topShine:"rgba(254,243,199,0.55)",sf:"url(#gd-spec-warm)",gOp:0.7,sOp:1,blur:"blur(20px) saturate(200%)"},
  emerald:  {bg:"rgba(52,211,153,0.16)", tint:"rgba(110,231,183,0.10)", border:"rgba(110,231,183,0.52)",topShine:"rgba(209,250,229,0.50)",sf:"url(#gd-specular)",gOp:0.7,sOp:1,blur:"blur(20px) saturate(180%)"},
  dark:     {bg:"rgba(10,14,30,0.62)",   tint:"rgba(30,41,59,0.20)",    border:"rgba(255,255,255,0.12)",topShine:"rgba(255,255,255,0.22)",sf:"url(#gd-specular)",gOp:0.4,sOp:0.7,blur:"blur(24px) saturate(160%) brightness(0.9)"},
  obsidian: {bg:"rgba(2,6,23,0.75)",                                    border:"rgba(99,102,241,0.35)", topShine:"rgba(165,180,252,0.25)",sf:"url(#gd-specular)",gOp:0.35,sOp:0.65,blur:"blur(30px) saturate(150%) brightness(0.85)"},
  thick:    {bg:"rgba(255,255,255,0.65)",                                border:"rgba(255,255,255,0.90)",topShine:"rgba(255,255,255,0.80)",sf:"url(#gd-specular)",gOp:0.45,sOp:0.7,blur:"blur(48px) saturate(220%) brightness(1.08)"},
  rainbow:  {bg:"rgba(255,255,255,0.10)",                                border:"rgba(255,255,255,0.55)",topShine:"rgba(255,255,255,0.45)",sf:"url(#gd-specular)",gOp:0.7,sOp:1,blur:"blur(20px) saturate(240%)",rainbow:true},
};
const RB = "linear-gradient(135deg,rgba(255,100,100,0.16) 0%,rgba(255,180,50,0.13) 18%,rgba(100,255,120,0.13) 36%,rgba(50,180,255,0.15) 55%,rgba(160,80,255,0.15) 75%,rgba(255,100,180,0.14) 100%)";

interface GB { variant?:GlassVariant; children:React.ReactNode; className?:string; clip?:"sm"|"md"|"lg"|"pill"; rounded?:string; }
const GlassBox: React.FC<GB> = ({ variant="clear", children, className="", clip="md", rounded="rounded-2xl" }) => {
  const v = V[variant];
  const ci = "gd-clip-" + clip;
  return (
    <div className={"relative overflow-hidden " + rounded + " " + className}
      style={{ boxShadow:"0 8px 32px rgba(0,0,0,0.14),0 2px 8px rgba(0,0,0,0.08),inset 0 1.5px 0 rgba(255,255,255,0.85)", border:"1.5px solid " + v.border }}>
      <div className={"absolute inset-0 z-0 " + rounded} style={{ backdropFilter:v.blur, WebkitBackdropFilter:v.blur }} />
      <div className={"absolute inset-0 z-10 " + rounded} style={{ background:v.bg }} />
      {v.tint && <div className={"absolute inset-0 z-10 " + rounded} style={{ background:v.tint }} />}
      {v.rainbow && <div className={"absolute inset-0 z-10 " + rounded} style={{ background:RB }} />}
      <svg className="absolute inset-0 w-full h-full z-20 pointer-events-none" style={{ borderRadius:"inherit" }}>
        <rect width="100%" height="100%" filter={v.sf} clipPath={"url(#" + ci + ")"} opacity={v.sOp} />
        <rect width="100%" height="100%" filter="url(#gd-grain)" clipPath={"url(#" + ci + ")"} opacity={v.gOp} />
      </svg>
      <div className={"absolute inset-0 z-20 pointer-events-none " + rounded} style={{ boxShadow:"inset 2px 2px 1px rgba(255,255,255,0.65),inset -1px -1px 1px rgba(255,255,255,0.35)" }} />
      <div className="absolute inset-x-0 top-0 z-20 pointer-events-none" style={{ height:"44%", background:"linear-gradient(180deg," + v.topShine + " 0%,rgba(255,255,255,0.08) 38%,transparent 100%)", borderRadius:"inherit" }} />
      <div className="relative z-30">{children}</div>
    </div>
  );
};

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

interface BS { id:string; label:string; style:React.CSSProperties; dark:boolean; variants:GlassVariant[]; }
const SECTIONS: BS[] = [
  {id:"white",    label:"White / Light",   dark:false, variants:["clear","frost","blue","purple","rose","thick"],
   style:{background:"radial-gradient(ellipse 80% 60% at 30% 40%,#dbeafe 0%,#f0f4ff 45%,#ffffff 100%)"}},
  {id:"midnight", label:"Midnight Blue",   dark:true,  variants:["clear","cobalt","blue","purple","dark","obsidian"],
   style:{background:"radial-gradient(ellipse 70% 60% at 15% 20%,#1e3a8a 0%,#0f172a 55%,#020617 100%)"}},
  {id:"aurora",   label:"Aurora Borealis", dark:true,  variants:["clear","emerald","blue","purple","cobalt","rainbow"],
   style:{background:"#050510",backgroundImage:"radial-gradient(ellipse 60% 50% at 10% 30%,rgba(0,200,180,0.5) 0%,transparent 70%),radial-gradient(ellipse 55% 50% at 80% 70%,rgba(120,40,220,0.55) 0%,transparent 65%),radial-gradient(ellipse 40% 35% at 55% 10%,rgba(40,100,255,0.4) 0%,transparent 60%)"}},
  {id:"sunset",   label:"Sunset",          dark:false, variants:["clear","frost","amber","rose","purple","thick"],
   style:{background:"linear-gradient(155deg,#ff6b35 0%,#f7c59f 35%,#e8c1f4 65%,#c084fc 100%)"}},
  {id:"ocean",    label:"Deep Ocean",      dark:true,  variants:["clear","blue","cobalt","emerald","dark","rainbow"],
   style:{background:"#001020",backgroundImage:"radial-gradient(ellipse 80% 60% at 50% 0%,rgba(2,60,120,0.9) 0%,transparent 70%),radial-gradient(ellipse 50% 40% at 80% 80%,rgba(0,100,150,0.55) 0%,transparent 60%)"}},
  {id:"forest",   label:"Forest",          dark:true,  variants:["clear","emerald","frost","dark","obsidian","rainbow"],
   style:{background:"#030d05",backgroundImage:"radial-gradient(ellipse 60% 50% at 20% 30%,rgba(10,80,20,0.85) 0%,transparent 65%),radial-gradient(ellipse 50% 45% at 75% 60%,rgba(20,100,30,0.55) 0%,transparent 60%)"}},
  {id:"mesh",     label:"Color Mesh",      dark:true,  variants:["clear","rainbow","frost","purple","rose","cobalt"],
   style:{background:"#0a001a",backgroundImage:"radial-gradient(ellipse 50% 50% at 0% 0%,rgba(255,60,120,0.75) 0%,transparent 60%),radial-gradient(ellipse 50% 50% at 100% 0%,rgba(255,160,20,0.65) 0%,transparent 60%),radial-gradient(ellipse 50% 50% at 50% 50%,rgba(100,20,255,0.5) 0%,transparent 55%),radial-gradient(ellipse 50% 50% at 0% 100%,rgba(20,200,255,0.65) 0%,transparent 60%),radial-gradient(ellipse 50% 50% at 100% 100%,rgba(20,255,140,0.60) 0%,transparent 60%)"}},
];

const Section: React.FC<BS> = ({ label, style, dark, variants }) => {
  const [v0,v1,v2,v3,,v5] = variants;
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-8 py-24 overflow-hidden" style={style}>
      <p className={"text-xs font-semibold uppercase tracking-widest mb-8 " + (dark?"text-white/48":"text-black/38")}>{label}</p>
      <div className="max-w-4xl mx-auto w-full space-y-5">
        <WidePanel variant={v0} dark={dark} />
        <div className="flex gap-4 flex-wrap">
          <StatCard variant={v1} label="Response" value="22s" sub="avg reply time" dark={dark} />
          <StatCard variant={v2} label="Leads"    value="248" sub="this month"     dark={dark} />
          <StatCard variant={v3} label="Booked"   value="91%" sub="conversion"     dark={dark} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InfoCard variant={v0} title="AI Receptionist"  desc="Answers every inbound call 24/7, qualifies leads, and books appointments." badge="Feature" dark={dark} />
          <InfoCard variant={v5} title="Instant SMS Reply" desc="Every missed call gets a text back in seconds, before leads go cold."     badge="Popular" dark={dark} />
        </div>
        <div className="flex flex-wrap gap-3">
          {variants.map((v) => <Pill key={v} variant={v} label={v} dark={dark} />)}
        </div>
      </div>
    </section>
  );
};

const GlassDemo: React.FC = () => (
  <div className="w-full font-sans antialiased">
    <GlassDefs />
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-3 gap-4"
      style={{ backdropFilter:"blur(20px) saturate(200%)", WebkitBackdropFilter:"blur(20px) saturate(200%)", borderBottom:"1px solid rgba(255,255,255,0.12)", background:"rgba(5,5,20,0.60)" }}>
      <span className="text-white font-semibold text-sm shrink-0">Glass Variants</span>
      <div className="flex gap-5 overflow-x-auto">
        {SECTIONS.map((s) => (
          <a key={s.id} href={"#" + s.id} className="text-[11px] text-white/45 hover:text-white transition-colors font-medium whitespace-nowrap">{s.label}</a>
        ))}
      </div>
    </nav>
    {SECTIONS.map((s) => <div key={s.id} id={s.id}><Section {...s} /></div>)}
  </div>
);

export default GlassDemo;
