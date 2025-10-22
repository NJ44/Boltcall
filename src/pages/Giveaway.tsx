import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Gift, Star, Clock, Users, Trophy } from 'lucide-react';

const GiveawayPage: React.FC = () => {
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


  const prizes = [
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "1st Prize",
      prize: "$1,000 Amazon Gift Card",
      color: "from-yellow-400 to-yellow-600",
      description: "Shop anything you want on Amazon!"
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "2nd Prize", 
      prize: "1 Year Free Pro Plan",
      color: "from-blue-500 to-blue-700",
      description: "Full access to all premium features"
    },
    {
      icon: <Gift className="w-8 h-8" />,
      title: "3rd Prize",
      prize: "6 Months Free Pro Plan",
      color: "from-green-500 to-green-700", 
      description: "Half a year of premium features"
    }
  ];


  return (
    <div className="min-h-screen bg-white">
      {/* Header with Logo */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="pt-6 pb-4">
            <Link to="/">
              <img 
                src="/boltcall_full_logo.png" 
                alt="Boltcall" 
                className="h-12 w-auto"
              />
            </Link>
          </div>
          
          <div className="py-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                <Gift className="w-8 h-8 text-blue-600" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                Giveaway Contest
              </h1>
              
              <p className="text-lg md:text-xl mb-8 text-gray-600 max-w-2xl mx-auto">
                Enter for a chance to win amazing prizes worth over <strong className="text-blue-600">$1,500</strong>
              </p>

              {/* Giveaway Countdown Timer */}
              <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl p-6 mb-8 max-w-2xl mx-auto">
                <div className="flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 mr-2" />
                  <span className="text-xl font-bold">🎁 Giveaway Countdown</span>
                </div>
                <div className="flex items-center justify-center space-x-4">
                  <div className="text-center">
                    <div className="bg-white/20 rounded-lg px-4 py-2">
                      <div className="text-2xl font-bold">{timeLeft.days}</div>
                      <div className="text-sm">Days</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-white/20 rounded-lg px-4 py-2">
                      <div className="text-2xl font-bold">{timeLeft.hours}</div>
                      <div className="text-sm">Hours</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-white/20 rounded-lg px-4 py-2">
                      <div className="text-2xl font-bold">{timeLeft.minutes}</div>
                      <div className="text-sm">Minutes</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-white/20 rounded-lg px-4 py-2">
                      <div className="text-2xl font-bold">{timeLeft.seconds}</div>
                      <div className="text-sm">Seconds</div>
                    </div>
                  </div>
                </div>
                <p className="text-orange-100 text-sm mt-3">
                  Contest ends on Halloween (October 31st, 2025)
                </p>
              </div>

              <div className="flex items-center justify-center space-x-8 text-gray-500">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">1,000+ entries</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Prizes Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Prize Details</h2>
          <p className="text-lg text-gray-600">Three winners will be selected</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {prizes.map((prize, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="relative"
            >
              <div className="bg-white rounded-xl p-6 text-center border border-gray-200 hover:shadow-lg transition-all duration-300">
                <div className={`inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4`}>
                  <div className="text-blue-600">{prize.icon}</div>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">{prize.title}</h3>
                <h4 className="text-xl font-bold text-blue-600 mb-3">{prize.prize}</h4>
                <p className="text-gray-600 text-sm">{prize.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Qualification Quiz */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl p-8 mb-8"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">🎯 Qualification Quiz</h2>
            <p className="text-lg mb-6 opacity-90">
              Complete this quick quiz to qualify for the giveaway and increase your chances of winning!
            </p>
            <a
              href="https://form.typeform.com/to/tmB4QfSf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-white text-purple-600 font-bold py-4 px-8 rounded-xl hover:bg-gray-100 transition-colors duration-200 text-lg"
            >
              <Star className="w-5 h-5 mr-2" />
              Take Qualification Quiz
            </a>
            <p className="text-sm mt-4 opacity-75">
              Opens in a new tab • Takes 2-3 minutes to complete
            </p>
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default GiveawayPage;
