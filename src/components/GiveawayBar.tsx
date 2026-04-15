import React from 'react';
import { Link } from 'react-router-dom';

const GiveawayBar: React.FC = () => {
  return (
    <Link to="/challenge" className="block">
      <div className="bg-blue-600 text-white w-full cursor-pointer shadow-none drop-shadow-none ring-0 border-none outline-none" style={{ contain: 'layout style', boxShadow: 'none' }}>
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
            <div className="flex items-center justify-center py-1 gap-2 sm:gap-3">
              <div className="flex items-center space-x-1 sm:space-x-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                  <span className="font-bold text-xs sm:text-sm text-white">Break Our AI</span>
                  <span className="text-[10px] sm:text-xs lg:text-sm text-white/80">
                    Crack the code in 60 seconds. Win a <strong className="text-white">free website</strong>.
                  </span>
                </div>
              </div>

              <span className="bg-black hover:bg-gray-900 transition-colors text-white text-[10px] sm:text-sm font-bold px-2 sm:px-4 py-1 sm:py-1.5 rounded-lg whitespace-nowrap">
                Try Now
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GiveawayBar;
