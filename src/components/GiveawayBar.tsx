import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';

const GiveawayBar: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Halloween 2025 is October 31st
    const halloween2025 = new Date('2025-10-31T23:59:59').getTime();
    
    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = halloween2025 - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Link to="/giveaway" className="block">
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white fixed top-0 left-0 right-0 z-50 cursor-pointer hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 transition-colors duration-300">
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-2">
              {/* Left side - Announcement content */}
              <div className="flex items-center space-x-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                  <span className="font-bold text-lg">🎉 MEGA GIVEAWAY! 🎉</span>
                  <span className="text-sm sm:text-base opacity-90">
                    Win a <strong>$1,000 Amazon Gift Card</strong> + <strong>1 Year Free Pro Plan</strong>
                  </span>
                </div>
              </div>

              {/* Right side - Giveaway Countdown */}
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="w-4 h-4 text-yellow-300" />
                <span className="font-medium">🎁 Until giveaway:</span>
                <div className="flex items-center space-x-1">
                  <span className="bg-white/20 px-2 py-1 rounded text-xs font-bold">
                    {timeLeft.days}d
                  </span>
                  <span className="bg-white/20 px-2 py-1 rounded text-xs font-bold">
                    {timeLeft.hours}h
                  </span>
                  <span className="bg-white/20 px-2 py-1 rounded text-xs font-bold">
                    {timeLeft.minutes}m
                  </span>
                  <span className="bg-white/20 px-2 py-1 rounded text-xs font-bold">
                    {timeLeft.seconds}s
                  </span>
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
