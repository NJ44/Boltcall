import React from 'react';
import { Magnetic } from '../components/ui/magnetic';
import { Save, Plus, ArrowRight } from 'lucide-react';

const MagneticDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Magnetic Button Demo
          </h1>
          <p className="text-lg text-gray-600">
            Hover over the buttons below and move your cursor around to see the magnetic effect
          </p>
        </div>

        {/* Demo Section 1: Basic Buttons */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Basic Buttons (Default Settings)
          </h2>
          <div className="flex flex-wrap gap-4 items-center justify-center">
            <Magnetic>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Save Changes
              </button>
            </Magnetic>

            <Magnetic>
              <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            </Magnetic>

            <Magnetic>
              <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center gap-2">
                Next Step
                <ArrowRight className="w-4 h-4" />
              </button>
            </Magnetic>
          </div>
        </div>

        {/* Demo Section 2: Dashboard Style Buttons */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Dashboard Style Buttons
          </h2>
          <div className="flex flex-wrap gap-4 items-center justify-center">
            <Magnetic>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </Magnetic>

            <Magnetic>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="font-bold">Add Phone Number</span>
              </button>
            </Magnetic>

            <Magnetic>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="font-bold">Add Missed Call</span>
              </button>
            </Magnetic>
          </div>
        </div>

        {/* Demo Section 3: Different Intensities */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Different Intensity Levels
          </h2>
          <div className="flex flex-wrap gap-4 items-center justify-center">
            <Magnetic intensity={0.3}>
              <button className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium">
                Low Intensity (0.3)
              </button>
            </Magnetic>

            <Magnetic intensity={0.6}>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Default (0.6)
              </button>
            </Magnetic>

            <Magnetic intensity={1.0}>
              <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                High Intensity (1.0)
              </button>
            </Magnetic>
          </div>
        </div>

        {/* Demo Section 4: Different Ranges */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Different Range Settings
          </h2>
          <div className="flex flex-wrap gap-4 items-center justify-center">
            <Magnetic range={50}>
              <button className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium">
                Small Range (50px)
              </button>
            </Magnetic>

            <Magnetic range={100}>
              <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                Default Range (100px)
              </button>
            </Magnetic>

            <Magnetic range={200}>
              <button className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium">
                Large Range (200px)
              </button>
            </Magnetic>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            How to Test:
          </h3>
          <ul className="list-disc list-inside space-y-2 text-blue-800">
            <li>Hover your mouse over any button above</li>
            <li>Move your cursor around while hovering — the button should follow your cursor</li>
            <li>Notice how different intensity and range settings affect the movement</li>
            <li>Move your cursor away from the button — it should smoothly return to its original position</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MagneticDemo;

