"use client";

import DatabaseWithRestApi from "../components/ui/database-with-rest-api";

export const Page = () => {
  return (
    <div className="p-4 rounded-xl bg-accent/20 w-full">
      <DatabaseWithRestApi />
    </div>
  );
};

const DatabaseWithRestApiDemo = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 text-gray-900">
          Database with REST API Component
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Interactive database visualization with animated API connections
        </p>

        <div className="space-y-16">
          {/* Default Component */}
          <div>
            <h2 className="text-2xl font-bold mb-8 text-gray-900 text-center">
              Default Configuration
            </h2>
            <div className="flex min-h-[500px] w-full items-center justify-center py-32 px-16">
              <div className="w-full max-w-6xl">
                <DatabaseWithRestApi />
              </div>
            </div>
          </div>

        </div>

        <div className="mt-16 max-w-3xl mx-auto bg-gray-100 rounded-xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold mb-4 text-gray-900">
            Component Features
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>Animated Paths:</strong> SVG paths with animated stroke-dasharray effects</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>Moving Lights:</strong> Animated circles that follow the API paths</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>REST API Buttons:</strong> GET, POST, PUT, DELETE method indicators</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>Pulsing Circles:</strong> Animated concentric circles with different timing</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>Customizable:</strong> Colors, text, badges, and button labels</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>Responsive:</strong> Adapts to different screen sizes</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DatabaseWithRestApiDemo;
