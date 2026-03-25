"use client";
import React from "react";
import { cn } from "@/lib/utils";

// Lightweight CSS-only grid background — replaces 1,500 animated Framer Motion divs
export const BoxesCore = ({ className, ...rest }: { className?: string }) => {
    return (
        <div
            className={cn(
                "absolute inset-0 overflow-hidden z-0",
                className
            )}
            {...rest}
        >
            <div
                className="absolute inset-0 opacity-[0.15]"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
                    `,
                    backgroundSize: '64px 32px',
                    transform: 'translate(-20%,-60%) skewX(-48deg) skewY(14deg) scale(0.675)',
                }}
            />
        </div>
    );
};

export const Boxes = React.memo(BoxesCore);
