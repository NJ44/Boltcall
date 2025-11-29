import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Image, Zap, Code } from 'lucide-react';
import HoverPreview from '@/components/ui/hover-image-preview';
import Header from '../components/Header';
import Footer from '../components/Footer';

const HoverImagePreviewDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Info Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-12">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Hover Image Preview
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Interactive text links that reveal beautiful preview cards on hover. Perfect for showcasing products, tools, or features with smooth animations and elegant design.
            </p>
            
            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Smooth Animations</h3>
                <p className="text-sm text-gray-600">
                  Elegant fade-in effects and smooth card positioning with viewport boundary detection
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Image className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Image Preloading</h3>
                <p className="text-sm text-gray-600">
                  Images are preloaded on mount for instant preview display without loading delays
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Rainbow Gradient</h3>
                <p className="text-sm text-gray-600">
                  Beautiful rainbow gradient underline effect on hover for visual appeal
                </p>
              </div>
            </div>

            {/* Usage Example */}
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Code className="w-5 h-5 text-gray-600" />
                <h2 className="text-2xl font-bold text-gray-900">Usage</h2>
              </div>
              <pre className="bg-gray-50 rounded-lg p-4 overflow-x-auto text-sm">
                <code className="text-gray-800">
{`import HoverPreview from '@/components/ui/hover-image-preview';

export default function MyPage() {
  return <HoverPreview />;
}`}
                </code>
              </pre>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">Customization</h3>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Edit the <code className="bg-blue-100 px-1 rounded">previewData</code> object to change content</li>
                  <li>Modify inline styles within the component for colors and spacing</li>
                  <li>Update Unsplash image URLs to use your own images</li>
                  <li>Adjust grid size, animations, and effects in the style tag</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Component Demo */}
      <div className="relative">
        <HoverPreview />
      </div>
      
      <Footer />
    </div>
  );
};

export default HoverImagePreviewDemo;

