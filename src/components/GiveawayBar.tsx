import React from 'react';
import { Link } from 'react-router-dom';

const GiveawayBar: React.FC = () => {
  return (
    <Link to="/challenge" className="block">
      <div className="relative bg-blue-600 text-white fixed top-0 left-0 right-0 z-50 cursor-pointer shadow-none drop-shadow-none ring-0 border-none outline-none" style={{ minHeight: '43px', contain: 'layout style', boxShadow: 'none' }}>
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
            <div className="flex items-center justify-between py-0.5 sm:py-2 gap-0.5 sm:gap-0" style={{ minHeight: '43px' }}>
              {/* Left side */}
              <div className="flex items-center space-x-1 sm:space-x-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                  <span className="font-bold text-xs sm:text-lg text-yellow-400">Break My AI Challenge</span>
                  <span className="text-[10px] sm:text-sm lg:text-base text-gray-300">
                    Crack the code in 60 seconds. Win a <strong className="text-white">free website</strong>.
                  </span>
                </div>
              </div>

              {/* Right side - CTA */}
              <div className="flex items-center">
                <span className="bg-blue-600 hover:bg-blue-500 transition-colors text-white text-[10px] sm:text-sm font-bold px-2 sm:px-4 py-1 sm:py-1.5 rounded-lg whitespace-nowrap">
                  Try Now
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GiveawayBar;
