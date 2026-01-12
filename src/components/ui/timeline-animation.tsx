"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import React from "react";

interface TimelineContentProps<T extends React.ElementType> {
    as?: T;
    animationNum: number;
    timelineRef: React.RefObject<HTMLElement>;
    customVariants: any;
    children: React.ReactNode;
    className?: string;
}

export const TimelineContent = <T extends React.ElementType = "div">({
    as,
    animationNum,
    timelineRef,
    customVariants,
    children,
    className,
    ...props
}: TimelineContentProps<T> & Omit<React.ComponentPropsWithoutRef<T>, keyof TimelineContentProps<T>>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Component = (motion as any)[as || 'div'];

    return (
        <Component
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            variants={customVariants}
            custom={animationNum}
            className={className}
            {...props}
        >
            {children}
        </Component>
    );
};
