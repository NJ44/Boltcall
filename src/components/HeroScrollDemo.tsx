import { ContainerScroll } from "./ui/container-scroll-animation";
import { QuantumTimeline } from "./ui/premium-process-timeline";

export function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden pb-0 -mt-[284px] pointer-events-none">
      <ContainerScroll
        titleComponent={null}
      >
        <div className="flex flex-col h-full text-center pointer-events-auto">
          <div className="flex-1 flex items-center justify-center px-4">
            <QuantumTimeline />
          </div>
        </div>
      </ContainerScroll>
    </div>
  );
}
