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

// PAGE-SPECIFIC SKELETON COMPONENTS

// Knowledge Base Page - Search bar + Table structure
export const KnowledgeBaseSkeleton = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between">
          {/* Search Input Skeleton */}
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-xs">
              <div className="h-10 w-full rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse" />
            </div>
          </div>
          {/* Add Document Button Skeleton */}
          <div className="h-10 w-32 rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse" />
        </div>
      </div>
      
      {/* Table Content */}
      <div className="px-6 pb-6">
        <div className="space-y-3">
          {/* Table Header */}
          <div className="flex gap-6">
            <div className="h-4 w-1/3 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
            <div className="h-4 w-1/6 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
            <div className="h-4 w-1/6 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
            <div className="h-4 w-1/6 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
            <div className="h-4 w-1/6 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
          </div>
          
          {/* Table Rows */}
          {[...new Array(5)].map((_, i) => (
            <div key={`kb-row-${i}`} className="flex gap-6 items-center py-3">
              <div className="h-8 w-1/3 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
              <div className="h-6 w-1/6 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
              <div className="h-6 w-1/6 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
              <div className="h-6 w-1/6 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
              <div className="h-6 w-1/6 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Agents Page - Add button + Card table structure
export const AgentsSkeleton = () => (
  <div className="space-y-8">
    {/* Add Agent Button */}
    <div className="flex justify-end">
      <div className="h-10 w-28 rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse" />
    </div>
    
    {/* Agents Table */}
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-6">
        <div className="space-y-4">
          {/* Table Header */}
          <div className="flex gap-6">
            <div className="h-4 w-1/4 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
            <div className="h-4 w-1/6 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
            <div className="h-4 w-1/6 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
            <div className="h-4 w-1/6 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
            <div className="h-4 w-1/6 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
            <div className="h-4 w-1/6 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
          </div>
          
          {/* Agent Rows */}
          {[...new Array(4)].map((_, i) => (
            <div key={`agent-row-${i}`} className="flex gap-6 items-center py-4 border-b border-gray-100">
              <div className="flex items-center gap-3 w-1/4">
                <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-neutral-800 animate-pulse" />
                <div className="space-y-1">
                  <div className="h-4 w-24 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
                  <div className="h-3 w-16 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
                </div>
              </div>
              <div className="h-6 w-1/6 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
              <div className="h-6 w-1/6 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
              <div className="h-6 w-1/6 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
              <div className="h-6 w-1/6 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
              <div className="h-6 w-1/6 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Phone Numbers Page - Add dropdown + Table structure  
export const PhoneNumbersSkeleton = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          {/* Search Input */}
          <div className="h-10 w-64 rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse" />
          {/* Add Phone Number Button */}
          <div className="h-10 w-40 rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse" />
        </div>
        
        <div className="space-y-3">
          {/* Table Header */}
          <div className="flex gap-6">
            <div className="h-4 w-1/4 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
            <div className="h-4 w-1/6 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
            <div className="h-4 w-1/6 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
            <div className="h-4 w-1/6 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
            <div className="h-4 w-1/6 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
          </div>
          
          {/* Phone Number Rows */}
          {[...new Array(3)].map((_, i) => (
            <div key={`phone-row-${i}`} className="flex gap-6 items-center py-3">
              <div className="h-8 w-1/4 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
              <div className="h-6 w-1/6 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
              <div className="h-6 w-1/6 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
              <div className="h-6 w-1/6 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
              <div className="h-6 w-1/6 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Call History Page - Filters + Table structure
export const CallHistorySkeleton = () => (
  <div className="space-y-6">
    {/* Filters Section */}
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <div className="flex flex-wrap gap-4">
        <div className="h-10 w-48 rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse" />
        <div className="h-10 w-32 rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse" />
        <div className="h-10 w-32 rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse" />
        <div className="h-10 w-40 rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse" />
        <div className="h-10 w-40 rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse" />
      </div>
    </div>
    
    {/* Calls Table */}
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="p-6">
        <div className="space-y-4">
          {/* Table Header */}
          <div className="flex gap-6 pb-3 border-b border-gray-100">
            <div className="h-4 w-1/5 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
            <div className="h-4 w-1/6 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
            <div className="h-4 w-1/6 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
            <div className="h-4 w-1/6 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
            <div className="h-4 w-1/6 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
            <div className="h-4 w-1/6 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
          </div>
          
          {/* Call Rows */}
          {[...new Array(6)].map((_, i) => (
            <div key={`call-row-${i}`} className="flex gap-6 items-center py-4">
              <div className="flex items-center gap-3 w-1/5">
                <div className="h-8 w-8 rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse" />
                <div className="space-y-1">
                  <div className="h-4 w-20 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
                  <div className="h-3 w-16 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
                </div>
              </div>
              <div className="h-6 w-1/6 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
              <div className="h-6 w-1/6 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
              <div className="h-6 w-1/6 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
              <div className="h-6 w-1/6 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
              <div className="h-6 w-1/6 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Chat History Page - Similar to Call History but for chats
export const ChatHistorySkeleton = () => (
  <div className="space-y-6">
    {/* Filters Section */}
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <div className="flex flex-wrap gap-4">
        <div className="h-10 w-48 rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse" />
        <div className="h-10 w-32 rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse" />
        <div className="h-10 w-40 rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse" />
        <div className="h-10 w-40 rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse" />
      </div>
    </div>
    
    {/* Chats Table */}
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="p-6">
        <div className="space-y-4">
          {/* Table Header */}
          <div className="flex gap-6 pb-3 border-b border-gray-100">
            <div className="h-4 w-1/5 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
            <div className="h-4 w-1/6 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
            <div className="h-4 w-1/6 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
            <div className="h-4 w-1/6 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
            <div className="h-4 w-1/6 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
          </div>
          
          {/* Chat Rows */}
          {[...new Array(6)].map((_, i) => (
            <div key={`chat-row-${i}`} className="flex gap-6 items-center py-4">
              <div className="flex items-center gap-3 w-1/5">
                <div className="h-8 w-8 rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse" />
                <div className="space-y-1">
                  <div className="h-4 w-20 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
                  <div className="h-3 w-16 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
                </div>
              </div>
              <div className="h-6 w-1/6 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
              <div className="h-6 w-1/6 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
              <div className="h-6 w-1/6 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
              <div className="h-6 w-1/6 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Notification Preferences Page - Settings sections
export const NotificationPreferencesSkeleton = () => (
  <div className="space-y-6">
    {/* Header */}
    <div className="space-y-2">
      <div className="h-8 w-64 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
      <div className="h-4 w-96 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
    </div>
    
    {/* Notification Categories */}
    {[...new Array(4)].map((_, sectionIndex) => (
      <div key={`section-${sectionIndex}`} className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="space-y-4">
          {/* Section Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="h-6 w-6 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
            <div className="h-6 w-48 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
          </div>
          
          {/* Toggle Options */}
          {[...new Array(3)].map((_, optionIndex) => (
            <div key={`option-${optionIndex}`} className="flex items-center justify-between py-2">
              <div className="space-y-1">
                <div className="h-4 w-40 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
                <div className="h-3 w-64 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
              </div>
              <div className="h-6 w-12 rounded-full bg-gray-100 dark:bg-neutral-800 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

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
