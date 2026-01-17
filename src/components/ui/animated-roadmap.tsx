"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils"; // Assuming you have a `cn` utility from shadcn

// Define the type for a single milestone
interface Milestone {
    id: number;
    name: string;
    status: "complete" | "in-progress" | "pending";
    position: {
        top?: string;
        left?: string;
        right?: string;
        bottom?: string;
    };
}

// Define the props for the AnimatedRoadmap component
interface AnimatedRoadmapProps extends React.HTMLAttributes<HTMLDivElement> {
    milestones: Milestone[];
    mapImageSrc: string; // Add a prop for the map background image
}

// Sub-component for a single milestone marker
const MilestoneMarker = ({ milestone }: { milestone: Milestone }) => {
    const statusClasses = {
        complete: "bg-green-500 border-green-700",
        "in-progress": "bg-blue-500 border-blue-700 animate-pulse",
        pending: "bg-muted border-border",
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: milestone.id * 0.3, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.8 }}
            className="absolute flex items-center gap-4"
            style={milestone.position}
        >
            <div className="relative flex h-8 w-8 items-center justify-center">
                <div
                    className={cn(
                        "absolute h-3 w-3 rounded-full border-2",
                        statusClasses[milestone.status]
                    )}
                />
                <div className="absolute h-full w-full rounded-full bg-primary/10" />
            </div>
            <div className="rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-3 py-1.5 text-xs font-bold text-black shadow-sm">
                {milestone.name}
            </div>
        </motion.div>
    );
};

// Main AnimatedRoadmap component
const AnimatedRoadmap = React.forwardRef<HTMLDivElement, AnimatedRoadmapProps>(
    ({ className, milestones, mapImageSrc, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn("relative w-full max-w-4xl mx-auto py-24", className)}
                {...props}
            >
                {/* Background map image */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true, amount: 0.2 }}
                    className="absolute inset-0 top-10"
                >
                    <img
                        src={mapImageSrc}
                        alt="Product roadmap map"
                        className="h-full w-full object-contain"
                    />
                </motion.div>

                {/* Render each milestone */}
                <div className="relative h-[400px]">
                    {milestones.map((milestone) => (
                        <MilestoneMarker key={milestone.id} milestone={milestone} />
                    ))}
                </div>
            </div>
        );
    }
);

AnimatedRoadmap.displayName = "AnimatedRoadmap";

export { AnimatedRoadmap };
