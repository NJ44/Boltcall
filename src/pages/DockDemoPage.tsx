import React from 'react';
import { AppleStyleDock } from '@/components/ui/dock-demo';

const DockDemoPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Apple-Style Dock
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Hover over the dock icons at the bottom to see them magnify and reveal labels
          </p>
          
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 mb-16">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Smooth Animations</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Powered by Framer Motion for fluid, responsive interactions
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Customizable</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Easy to customize icons, labels, and styling to match your brand
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Responsive</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Works seamlessly across all device sizes and screen resolutions
              </p>
            </div>
          </div>

          {/* Usage Example */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm border border-gray-200 dark:border-gray-700 text-left">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Usage</h2>
            <pre className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm">
              <code className="text-gray-800 dark:text-gray-200">
{`import { AppleStyleDock } from '@/components/ui/dock-demo';

// Or use components directly:
import { Dock, DockItem, DockIcon, DockLabel } from '@/components/ui/dock';
import { HomeIcon } from 'lucide-react';

<Dock>
  <DockItem>
    <DockLabel>Home</DockLabel>
    <DockIcon>
      <HomeIcon className="h-full w-full" />
    </DockIcon>
  </DockItem>
</Dock>`}
              </code>
            </pre>
          </div>
        </div>
      </div>

      {/* Dock Component - Fixed at top right */}
      <div className="fixed top-0 right-0 z-50">
        <AppleStyleDock />
      </div>
    </div>
  );
};

export default DockDemoPage;

