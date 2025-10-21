import React, { useState } from 'react';
import { UpgradeBanner } from '../components/ui/upgrade-banner';

const UpgradeBannerDemo: React.FC = () => {
  const [bannerVisible, setBannerVisible] = useState(true);

  const handleUpgrade = () => {
    alert('Upgrade functionality would be implemented here!');
  };

  const handleClose = () => {
    setBannerVisible(false);
  };

  const showBanner = () => {
    setBannerVisible(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Upgrade Banner Component Demo
          </h1>
          <p className="text-lg text-gray-600">
            Interactive demonstration of the UpgradeBanner component
          </p>
        </div>

        {/* Demo Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Default Banner</h2>
          
          {bannerVisible ? (
            <div className="flex flex-col items-center space-y-4">
              <UpgradeBanner
                buttonText="Upgrade to Pro"
                description="for 2x more CPUs and faster builds"
                onClose={handleClose}
                onClick={handleUpgrade}
              />
              <p className="text-sm text-gray-500">
                Hover over the upgrade button to see the animated settings icons!
              </p>
            </div>
          ) : (
            <div className="text-center">
              <button 
                onClick={showBanner}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Show Banner Again
              </button>
            </div>
          )}
        </div>

        {/* Custom Examples */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Custom Text</h3>
            <UpgradeBanner
              buttonText="Get Premium"
              description="unlock all features"
              onClick={() => console.log('Premium upgrade clicked')}
            />
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">No Close Button</h3>
            <UpgradeBanner
              buttonText="Try Enterprise"
              description="for unlimited usage"
              onClick={() => console.log('Enterprise upgrade clicked')}
            />
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Long Description</h3>
            <UpgradeBanner
              buttonText="Upgrade Now"
              description="for advanced analytics, priority support, and unlimited projects"
              onClose={() => console.log('Closed')}
              onClick={() => console.log('Long description upgrade clicked')}
            />
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Short & Sweet</h3>
            <UpgradeBanner
              buttonText="Go Pro"
              description="more power"
              onClose={() => console.log('Closed short banner')}
              onClick={() => console.log('Short banner upgrade clicked')}
            />
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Usage Instructions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Import the component:</h3>
              <pre className="bg-gray-100 p-3 rounded-lg text-sm overflow-x-auto">
                <code>{`import { UpgradeBanner } from "@/components/ui/upgrade-banner";`}</code>
              </pre>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Basic usage:</h3>
              <pre className="bg-gray-100 p-3 rounded-lg text-sm overflow-x-auto">
                <code>{`<UpgradeBanner
  buttonText="Upgrade to Pro"
  description="for 2x more CPUs and faster builds"
  onClose={() => setVisible(false)}
  onClick={() => handleUpgrade()}
/>`}</code>
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Props:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li><code className="bg-gray-100 px-1 rounded">buttonText</code> - Text for the upgrade button (default: "Upgrade to Pro")</li>
                <li><code className="bg-gray-100 px-1 rounded">description</code> - Description text (default: "for 2x more CPUs and faster builds")</li>
                <li><code className="bg-gray-100 px-1 rounded">onClose</code> - Optional callback when close button is clicked</li>
                <li><code className="bg-gray-100 px-1 rounded">onClick</code> - Callback when upgrade button is clicked</li>
                <li><code className="bg-gray-100 px-1 rounded">className</code> - Additional CSS classes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeBannerDemo;
