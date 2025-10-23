import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
      <div className="relative bg-blue-600 text-white fixed top-0 left-0 right-0 z-50 cursor-pointer shadow-none">
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
              <div className="flex items-center space-x-3 text-sm">
                <span className="font-medium">Until giveaway:</span>
                <div className="bg-white/20 px-3 py-1.5 rounded-lg">
                  <div className="flex items-center space-x-2 text-sm font-bold">
                    <span className="min-w-[2rem] text-center">
                      {timeLeft.days}d
                    </span>
                    <span className="text-white/60">:</span>
                    <span className="min-w-[2rem] text-center">
                      {timeLeft.hours}h
                    </span>
                    <span className="text-white/60">:</span>
                    <span className="min-w-[2rem] text-center">
                      {timeLeft.minutes}m
                    </span>
                    <span className="text-white/60">:</span>
                    <span className="min-w-[2rem] text-center">
                      {timeLeft.seconds}s
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
