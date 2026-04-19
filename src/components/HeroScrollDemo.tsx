import BentoCard from "./ui/bento-card";

export function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden pb-0 -mt-[284px] pointer-events-none">
      <div className="flex items-center justify-center relative p-2 md:p-20">
        <div className="w-full relative">
          <div
            className="max-w-5xl mx-auto w-full pointer-events-auto"
            style={{
              filter: "drop-shadow(0 60px 80px rgba(59, 130, 246, 0.35))",
            }}
          >
            <BentoCard />
          </div>
        </div>
      </div>
    </div>
  );
}
