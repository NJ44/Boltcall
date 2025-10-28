import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'dashboard' | 'table' | 'cards' | 'custom';
  rows?: number;
  columns?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className,
  variant = 'dashboard',
  rows = 2,
  columns = 4,
}) => {
  if (variant === 'dashboard') {
    return (
      <div className={cn("flex flex-col gap-2 w-full h-full", className)}>
        {/* Top row of cards */}
        <div className="flex gap-2">
          {[...new Array(columns)].map((_, i) => (
            <div
              key={`top-card-${i}`}
              className="h-20 w-full rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse"
            />
          ))}
        </div>
        
        {/* Bottom larger cards */}
        <div className="flex gap-2 flex-1">
          {[...new Array(rows)].map((_, i) => (
            <div
              key={`bottom-card-${i}`}
              className="h-full w-full rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className={cn("flex flex-col gap-3 w-full", className)}>
        {/* Table header */}
        <div className="flex gap-4">
          {[...new Array(columns)].map((_, i) => (
            <div
              key={`header-${i}`}
              className="h-4 flex-1 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse"
            />
          ))}
        </div>
        
        {/* Table rows */}
        {[...new Array(rows)].map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex gap-4">
            {[...new Array(columns)].map((_, colIndex) => (
              <div
                key={`cell-${rowIndex}-${colIndex}`}
                className="h-8 flex-1 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse"
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'cards') {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full", className)}>
        {[...new Array(rows * columns)].map((_, i) => (
          <div
            key={`card-${i}`}
            className="h-32 w-full rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse"
          />
        ))}
      </div>
    );
  }

  // Custom variant - just basic skeleton boxes
  return (
    <div className={cn("flex flex-col gap-2 w-full", className)}>
      {[...new Array(rows)].map((_, i) => (
        <div
          key={`skeleton-${i}`}
          className="h-16 w-full rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse"
        />
      ))}
    </div>
  );
};

// Quick skeleton components for common use cases
export const DashboardSkeleton = () => (
  <LoadingSkeleton variant="dashboard" columns={4} rows={2} />
);

export const TableSkeleton = ({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) => (
  <LoadingSkeleton variant="table" rows={rows} columns={columns} />
);

export const CardsSkeleton = ({ count = 6 }: { count?: number }) => (
  <LoadingSkeleton variant="cards" rows={Math.ceil(count / 3)} columns={3} />
);

export default LoadingSkeleton;
