"use client";

import { Boxes } from "@/components/ui/background-boxes";
import { cn } from "@/lib/utils";

export function BackgroundBoxesDemo({ onCtaClick }: { onCtaClick?: () => void }) {
    return (
        <div className="h-[40rem] relative w-full overflow-hidden bg-black flex flex-col items-center justify-center rounded-lg mt-0">
            <div className="absolute inset-0 w-full h-full bg-black z-20 [mask-image:radial-gradient(transparent,white_80%)] pointer-events-none" />

            <Boxes />
            <h1 className={cn("md:text-7xl text-4xl text-white relative z-20 font-bold -mt-32")}>
                Upgrade your website
            </h1>
            <p className="text-center mt-4 text-neutral-300 relative z-20 text-xl md:text-2xl">
                Modern, fast, and designed to convert.
            </p>
            <button
                onClick={onCtaClick}
                className="mt-8 relative z-20 px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-neutral-200 transition-colors"
            >
                Get Your Free Website
            </button>
        </div>
    );
}
