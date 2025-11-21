import React from 'react';
import { WavePath } from '../components/ui/wave-path';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Code, MousePointer, Sparkles, Palette } from 'lucide-react';

const WavePathDemoPage: React.FC = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-32 pb-16">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Interactive Wave Path
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              A beautiful, interactive SVG wave path that responds to mouse movement. 
              Hover over the wave to see it bend and animate.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 max-w-6xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <MousePointer className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Interactive</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Responds to mouse movement in real-time for engaging user interactions
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Sparkles className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Smooth Animations</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Elegant fade-out animation when mouse leaves the interaction area
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Palette className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Customizable</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Easy to style with Tailwind classes and stroke-current for theming
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Code className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">TypeScript</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Fully typed with TypeScript for better developer experience
              </p>
            </div>
          </div>

          {/* Demo Section */}
          <div className="max-w-6xl mx-auto mb-16">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Interactive Wave Path</h2>
              <div className="relative w-full flex min-h-[400px] flex-col items-center justify-center rounded-lg">
                <div className="flex w-[70vw] flex-col items-end">
                  <WavePath className="mb-10 text-blue-600 dark:text-blue-400" />
                  <div className="flex w-full flex-col items-end">
                    <div className="flex justify-end">
                      <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Hover to interact</p>
                      <p className="text-gray-800 dark:text-gray-200 ml-8 w-3/4 text-xl md:text-3xl">
                        Move your mouse over the wave to see it bend and respond to your movements.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Usage Section */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Code className="w-6 h-6" />
                Usage
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Basic Usage</h3>
                  <pre className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <code className="text-sm text-gray-800 dark:text-gray-200">
{`import { WavePath } from '@/components/ui/wave-path';

<WavePath className="text-blue-600" />`}
                    </code>
                  </pre>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">With Custom Styling</h3>
                  <pre className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <code className="text-sm text-gray-800 dark:text-gray-200">
{`<WavePath 
  className="text-purple-600 dark:text-purple-400 mb-10" 
/>`}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default WavePathDemoPage;

