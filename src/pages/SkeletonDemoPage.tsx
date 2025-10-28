import React, { useState } from 'react';
import { DashboardSkeleton, TableSkeleton, CardsSkeleton, LoadingSkeleton } from '../components/ui/loading-skeleton';

const SkeletonDemoPage: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<'dashboard' | 'table' | 'cards' | 'custom'>('dashboard');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Loading Skeleton Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            These are the animated skeleton loading states used throughout the dashboard.
          </p>
        </div>

        {/* Demo Controls */}
        <div className="mb-8">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setActiveDemo('dashboard')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeDemo === 'dashboard'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Dashboard Layout
            </button>
            <button
              onClick={() => setActiveDemo('table')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeDemo === 'table'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Table Layout
            </button>
            <button
              onClick={() => setActiveDemo('cards')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeDemo === 'cards'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Cards Layout
            </button>
            <button
              onClick={() => setActiveDemo('custom')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeDemo === 'custom'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Custom Layout
            </button>
          </div>
        </div>

        {/* Demo Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          {activeDemo === 'dashboard' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Dashboard Skeleton (Used in: Agents, Knowledge Base, Phone Numbers)
              </h2>
              <DashboardSkeleton />
            </div>
          )}

          {activeDemo === 'table' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Table Skeleton (Used in: Call History, Chat History)
              </h2>
              <TableSkeleton rows={6} columns={5} />
            </div>
          )}

          {activeDemo === 'cards' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Cards Skeleton (Used in: Grid layouts)
              </h2>
              <CardsSkeleton count={9} />
            </div>
          )}

          {activeDemo === 'custom' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Custom Skeleton (Configurable)
              </h2>
              <LoadingSkeleton variant="custom" rows={4} className="max-w-md" />
            </div>
          )}
        </div>

        {/* Usage Examples */}
        <div className="mt-8 bg-gray-900 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Usage Examples</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">Dashboard Loading:</h4>
              <pre className="text-green-400 text-sm bg-gray-800 p-3 rounded overflow-x-auto">
{`if (isLoading) {
  return (
    <div className="p-6">
      <DashboardSkeleton />
    </div>
  );
}`}
              </pre>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">Table Loading:</h4>
              <pre className="text-green-400 text-sm bg-gray-800 p-3 rounded overflow-x-auto">
{`{loading ? (
  <div className="p-6">
    <TableSkeleton rows={5} columns={4} />
  </div>
) : (
  // Your table content
)}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonDemoPage;
