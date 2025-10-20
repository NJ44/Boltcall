import React from 'react';
import { Link } from 'react-router-dom';
import { Gift, Star } from 'lucide-react';

const GiveawayBar: React.FC = () => {
  return (
    <Link to="/giveaway" className="block">
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white fixed top-0 left-0 right-0 z-50 cursor-pointer hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 transition-colors duration-300">

          <div className="relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between py-2">
                {/* Left side - Announcement content */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Gift className="w-6 h-6 text-yellow-300" />
                      <Star className="absolute -top-1 -right-1 w-3 h-3 text-yellow-300 fill-current" />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                      <span className="font-bold text-lg">🎉 MEGA GIVEAWAY! 🎉</span>
                      <span className="text-sm sm:text-base opacity-90">
                        Win a <strong>$1,000 Amazon Gift Card</strong> + <strong>1 Year Free Pro Plan</strong>
                      </span>
                    </div>
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
