import React from "react";


const GlassDefs = () => (
  <svg style={{ display: "none", position: "absolute" }} aria-hidden="true">
    <defs>
      <filter id="gb-specular" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.06 0.08" numOctaves="2" seed="8" result="noise" />
        <feColorMatrix type="saturate" values="0" in="noise" result="gray" />
        <feSpecularLighting in="gray" surfaceScale="8" specularConstant="1.2" specularExponent="160" lightingColor="white" result="spec">
          <fePointLight x="-80" y="-120" z="350" />
        </feSpecularLighting>
        <feComposite in="spec" operator="arithmetic" k1="0" k2="0.28" k3="0" k4="0" />
      </filter>
      <filter id="gb-grain" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.82 0.92" numOctaves="4" stitchTiles="stitch" result="g" />
        <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.06 0" in="g" />
      </filter>
      <filter id="gb-spec-warm" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.45 0.55" numOctaves="4" seed="22" result="noise" />
        <feColorMatrix type="saturate" values="0" in="noise" result="gray" />
        <feSpecularLighting in="gray" surfaceScale="10" specularConstant="1.2" specularExponent="80" lightingColor="rgba(255,230,180,1)" result="spec">
          <fePointLight x="120" y="-80" z="300" />
        </feSpecularLighting>
        <feComposite in="spec" operator="arithmetic" k1="0" k2="0.28" k3="0" k4="0" />
      </filter>
      <clipPath id="gb-clip-sm"><rect width="100%" height="100%" rx="14" ry="14" /></clipPath>
      <clipPath id="gb-clip-md"><rect width="100%" height="100%" rx="20" ry="20" /></clipPath>
      <clipPath id="gb-clip-lg"><rect width="100%" height="100%" rx="24" ry="24" /></clipPath>
      <clipPath id="gb-clip-pill"><rect width="100%" height="100%" rx="999" ry="999" /></clipPath>
    </defs>
  </svg>
);

type GlassVariant = "clear"|"frost"|"blue"|"purple"|"rose"|"amber"|"emerald"|"dark"|"thick"|"rainbow"|"cobalt"|"obsidian";
interface VD { bg:string; tint?:string; border:string; topShine:string; sf:string; gOp:number; sOp:number; blur:string; rainbow?:boolean; }

const V: Record<GlassVariant, VD> = {
  clear:    {bg:"rgba(255,255,255,0.12)",border:"rgba(255,255,255,0.62)",topShine:"rgba(255,255,255,0.55)",sf:"url(#gb-specular)",gOp:0.7,sOp:1,   blur:"blur(18px) saturate(180%)"},
  frost:    {bg:"rgba(255,255,255,0.48)",border:"rgba(255,255,255,0.82)",topShine:"rgba(255,255,255,0.72)",sf:"url(#gb-specular)",gOp:0.5,sOp:0.8, blur:"blur(36px) saturate(200%) brightness(1.05)"},
  blue:     {bg:"rgba(59,130,246,0.18)", tint:"rgba(147,197,253,0.12)", border:"rgba(147,197,253,0.60)",topShine:"rgba(219,234,254,0.55)",sf:"url(#gb-specular)",gOp:0.7,sOp:1,blur:"blur(20px) saturate(200%)"},
  cobalt:   {bg:"rgba(29,78,216,0.28)",  tint:"rgba(96,165,250,0.10)",  border:"rgba(96,165,250,0.55)", topShine:"rgba(186,230,253,0.50)",sf:"url(#gb-specular)",gOp:0.6,sOp:1,blur:"blur(22px) saturate(220%)"},
  purple:   {bg:"rgba(139,92,246,0.20)", tint:"rgba(196,181,253,0.10)", border:"rgba(196,181,253,0.55)",topShine:"rgba(237,233,254,0.50)",sf:"url(#gb-specular)",gOp:0.7,sOp:1,blur:"blur(20px) saturate(190%)"},
  rose:     {bg:"rgba(244,63,94,0.16)",  tint:"rgba(253,164,175,0.10)", border:"rgba(253,164,175,0.55)",topShine:"rgba(255,228,230,0.50)",sf:"url(#gb-specular)",gOp:0.7,sOp:0.9,blur:"blur(20px) saturate(200%)"},
  amber:    {bg:"rgba(251,146,60,0.18)", tint:"rgba(253,186,116,0.10)", border:"rgba(253,186,116,0.55)",topShine:"rgba(254,243,199,0.55)",sf:"url(#gb-spec-warm)",gOp:0.7,sOp:1,blur:"blur(20px) saturate(200%)"},
  emerald:  {bg:"rgba(52,211,153,0.16)", tint:"rgba(110,231,183,0.10)", border:"rgba(110,231,183,0.52)",topShine:"rgba(209,250,229,0.50)",sf:"url(#gb-specular)",gOp:0.7,sOp:1,blur:"blur(20px) saturate(180%)"},
  dark:     {bg:"rgba(10,14,30,0.62)",   tint:"rgba(30,41,59,0.20)",    border:"rgba(255,255,255,0.12)",topShine:"rgba(255,255,255,0.22)",sf:"url(#gb-specular)",gOp:0.4,sOp:0.7,blur:"blur(24px) saturate(160%) brightness(0.9)"},
  obsidian: {bg:"rgba(2,6,23,0.75)",                                    border:"rgba(99,102,241,0.35)", topShine:"rgba(165,180,252,0.25)",sf:"url(#gb-specular)",gOp:0.35,sOp:0.65,blur:"blur(30px) saturate(150%) brightness(0.85)"},
  thick:    {bg:"rgba(255,255,255,0.65)",                                border:"rgba(255,255,255,0.90)",topShine:"rgba(255,255,255,0.80)",sf:"url(#gb-specular)",gOp:0.45,sOp:0.7,blur:"blur(48px) saturate(220%) brightness(1.08)"},
  rainbow:  {bg:"rgba(255,255,255,0.10)",                                border:"rgba(255,255,255,0.55)",topShine:"rgba(255,255,255,0.45)",sf:"url(#gb-specular)",gOp:0.7,sOp:1,blur:"blur(20px) saturate(240%)",rainbow:true},
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
        <rect width="100%" height="100%" filter="url(#gb-grain)" clipPath={"url(#" + ci + ")"} opacity={v.gOp} />
      </svg>
      <div className={"absolute inset-0 z-20 pointer-events-none " + rounded} style={{ boxShadow:"inset 2px 2px 1px rgba(255,255,255,0.65),inset -1px -1px 1px rgba(255,255,255,0.35)" }} />
      <div className="absolute inset-x-0 top-0 z-20 pointer-events-none" style={{ height:"44%", background:"linear-gradient(180deg," + v.topShine + " 0%,rgba(255,255,255,0.08) 38%,transparent 100%)", borderRadius:"inherit" }} />
      <div className="relative z-30">{children}</div>
    </div>
  );
};

export { GlassDefs, GlassBox };
export type { GlassVariant };
