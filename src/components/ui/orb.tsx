import * as React from "react"
import { cn } from "@/lib/utils"

interface OrbProps extends React.HTMLAttributes<HTMLDivElement> {
  agentState?: "thinking" | "talking"
  size?: "sm" | "md" | "lg"
}

const sizeMap = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-12 h-12",
}

export function Orb({ agentState, size = "md", className, ...props }: OrbProps) {
  return (
    <div
      className={cn(
        "relative rounded-full bg-blue-500 flex items-center justify-center",
        sizeMap[size],
        agentState === "thinking" && "animate-pulse",
        agentState === "talking" && "animate-bounce",
        className
      )}
      {...props}
    >
      {/* Inner glow */}
      <div
        className={cn(
          "absolute inset-0 rounded-full bg-blue-400 opacity-40",
          agentState === "thinking" && "animate-ping",
          agentState === "talking" && "animate-ping [animation-duration:0.5s]"
        )}
      />
      {/* Core dot */}
      <div
        className={cn(
          "relative rounded-full bg-white",
          size === "sm" && "w-2 h-2",
          size === "md" && "w-3 h-3",
          size === "lg" && "w-4 h-4"
        )}
      />
    </div>
  )
}
