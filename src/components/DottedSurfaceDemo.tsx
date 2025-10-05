import { DottedSurface } from "./ui/dotted-surface";
import { cn } from '../lib/utils';
import { useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function DottedSurfaceDemo() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-white'
    }`}>
      <DottedSurface isDarkMode={isDarkMode} className="size-full">
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute -top-10 left-1/2 size-full -translate-x-1/2 rounded-full',
              isDarkMode 
                ? 'bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1),transparent_50%)]'
                : 'bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.1),transparent_50%)]',
              'blur-[30px]',
            )}
          />
          <div className="text-center">
            <h1 className={`font-mono text-4xl font-semibold mb-8 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Dotted Surface
            </h1>
            <p className={`text-lg mb-8 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Animated Three.js background with floating dots
            </p>
            <button
              onClick={toggleDarkMode}
              className={`px-6 py-3 rounded-lg transition-colors flex items-center gap-2 mx-auto ${
                isDarkMode 
                  ? 'bg-gray-700 text-white hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      </DottedSurface>
    </div>
  );
}

