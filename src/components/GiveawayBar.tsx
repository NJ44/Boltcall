import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedNumberCountdownCompact from '@/components/ui/countdown-number-compact';

const GiveawayBar: React.FC = () => {
  // Calculate end date (14 days from now, matching giveaway page)
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 14);

  return (
    <Link to="/giveaway" className="block">
      <div className="relative bg-blue-600 text-white fixed top-0 left-0 right-0 z-50 cursor-pointer shadow-none" style={{ minHeight: '43px', contain: 'layout style' }}>
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between py-0.5 sm:py-2 gap-0.5 sm:gap-0" style={{ minHeight: '43px' }}>
              {/* Left side - Announcement content */}
              <div className="flex items-center space-x-1 sm:space-x-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                  <span className="font-bold text-xs sm:text-lg">🛍️ Black Friday Giveaway 🛍️</span>
                  <span className="text-[10px] sm:text-sm lg:text-base opacity-90">
                    Win a <strong>6 months Pro subscription</strong>
                  </span>
                </div>
              </div>

              {/* Right side - Giveaway Countdown */}
              <div className="flex items-center space-x-1 sm:space-x-3 text-[10px] sm:text-sm">
                <span className="font-medium hidden sm:inline">Until giveaway:</span>
                <div className="bg-white/20 px-1.5 sm:px-3 py-0.5 sm:py-1.5 rounded-lg min-w-[120px] sm:min-w-[140px]">
                  <AnimatedNumberCountdownCompact
                    endDate={endDate}
                    className="text-white [&_span]:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GiveawayBar;
