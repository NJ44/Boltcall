import { QuantumTimeline } from "./ui/premium-process-timeline";

export function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden pb-0 -mt-[284px] pointer-events-none">
      <div className="flex items-center justify-center relative p-2 md:p-20">
        <div className="w-full relative">
          {/* Static laptop/screen frame — same styling as ContainerScroll Card but no rotation */}
          <div
            className="max-w-5xl mx-auto h-[25.2rem] md:h-[33.6rem] w-full border-4 border-[#6C6C6C] p-2 md:p-6 bg-[#222222] rounded-[30px] shadow-2xl pointer-events-auto"
            style={{
              boxShadow: "0 60px 120px -40px rgba(59, 130, 246, 0.6)",
            }}
          >
            <div className="h-full w-full overflow-hidden rounded-2xl bg-transparent md:rounded-2xl md:p-4">
              <div className="flex flex-col h-full text-center">
                <div className="flex-1 flex items-center justify-center px-4">
                  <QuantumTimeline />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
