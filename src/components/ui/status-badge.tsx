import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeStatus = "active" | "inactive";

export interface StatusBadgeProps {
  status: BadgeStatus;
  className?: string;
  activeLabel?: string;
  inactiveLabel?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className,
  activeLabel = "Active",
  inactiveLabel = "Inactive",
}) => {
  if (status === "active") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400",
          className
        )}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        {activeLabel}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
      {inactiveLabel}
    </span>
  );
};

export { StatusBadge };
