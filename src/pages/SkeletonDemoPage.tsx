import React, { useState } from 'react';
import { 
  DashboardSkeleton, 
  TableSkeleton, 
  CardsSkeleton, 
  LoadingSkeleton,
  KnowledgeBaseSkeleton,
  AgentsSkeleton,
  PhoneNumbersSkeleton,
  CallHistorySkeleton,
  ChatHistorySkeleton,
  NotificationPreferencesSkeleton
} from '../components/ui/loading-skeleton';

const SkeletonDemoPage: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<'knowledge-base' | 'agents' | 'phone-numbers' | 'call-history' | 'chat-history' | 'notifications' | 'dashboard' | 'table' | 'cards' | 'custom'>('knowledge-base');

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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            <button
              onClick={() => setActiveDemo('knowledge-base')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeDemo === 'knowledge-base'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Knowledge Base
            </button>
            <button
              onClick={() => setActiveDemo('agents')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeDemo === 'agents'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Agents
            </button>
            <button
              onClick={() => setActiveDemo('phone-numbers')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeDemo === 'phone-numbers'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Phone Numbers
            </button>
            <button
              onClick={() => setActiveDemo('call-history')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeDemo === 'call-history'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Call History
            </button>
            <button
              onClick={() => setActiveDemo('chat-history')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeDemo === 'chat-history'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Chat History
            </button>
            <button
              onClick={() => setActiveDemo('notifications')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeDemo === 'notifications'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Notifications
            </button>
            <button
              onClick={() => setActiveDemo('dashboard')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeDemo === 'dashboard'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveDemo('table')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeDemo === 'table'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setActiveDemo('cards')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeDemo === 'cards'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setActiveDemo('custom')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeDemo === 'custom'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Custom
            </button>
          </div>
        </div>

        {/* Demo Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          {activeDemo === 'knowledge-base' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Knowledge Base Page Skeleton
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Search bar + Document table with exact layout matching
              </p>
              <KnowledgeBaseSkeleton />
            </div>
          )}

          {activeDemo === 'agents' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Agents Page Skeleton
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Add button + Agent cards with avatar, name, and stats
              </p>
              <AgentsSkeleton />
            </div>
          )}

          {activeDemo === 'phone-numbers' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Phone Numbers Page Skeleton
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Search + Add dropdown + Phone numbers table
              </p>
              <PhoneNumbersSkeleton />
            </div>
          )}

          {activeDemo === 'call-history' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Call History Page Skeleton
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Filters section + Call details table with icons
              </p>
              <CallHistorySkeleton />
            </div>
          )}

          {activeDemo === 'chat-history' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Chat History Page Skeleton
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Filters section + Chat details table
              </p>
              <ChatHistorySkeleton />
            </div>
          )}

          {activeDemo === 'notifications' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Notification Preferences Skeleton
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Settings sections with toggle switches
              </p>
              <NotificationPreferencesSkeleton />
            </div>
          )}

          {activeDemo === 'dashboard' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Generic Dashboard Skeleton
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                4 top cards + 2 bottom larger cards (fallback layout)
              </p>
              <DashboardSkeleton />
            </div>
          )}

          {activeDemo === 'table' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Generic Table Skeleton
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Basic table header + rows (fallback layout)
              </p>
              <TableSkeleton rows={6} columns={5} />
            </div>
          )}

          {activeDemo === 'cards' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Cards Grid Skeleton
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Responsive grid layout for card-based content
              </p>
              <CardsSkeleton count={9} />
            </div>
          )}

          {activeDemo === 'custom' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Custom Skeleton
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Configurable skeleton for any custom layout
              </p>
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
