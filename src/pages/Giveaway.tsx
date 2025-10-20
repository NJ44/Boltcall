import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Gift, Star, Clock, Users, Trophy, CheckCircle, ArrowLeft, Mail } from 'lucide-react';
import Button from '../components/ui/Button';

const GiveawayPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
    }, 1500);
  };

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

  const requirements = [
    "Follow us on social media",
    "Share this giveaway with friends",
    "Sign up for our newsletter",
    "Leave a review on our platform"
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-green-600" />
          </motion.div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">🎉 You're In! 🎉</h1>
          <p className="text-gray-600 mb-6">
            Congratulations! You've successfully entered our mega giveaway. 
            We'll notify you if you win!
          </p>
          
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Check your email for confirmation</li>
              <li>• Follow us on social media (bonus entries!)</li>
              <li>• Share with friends for more chances</li>
              <li>• Winner announced on December 31st</li>
            </ul>
          </div>

          <Link to="/">
            <Button variant="primary" size="lg" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Homepage
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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

            <div className="flex items-center justify-center space-x-8 text-gray-500">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Ends Dec 31st</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span className="text-sm">1,000+ entries</span>
              </div>
            </div>
          </motion.div>
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

      {/* Entry Form */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm"
        >
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Enter Contest</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isLoading || !email}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 text-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Entering...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Gift className="w-5 h-5 mr-2" />
                  Submit Entry
                </div>
              )}
            </Button>
          </form>

          {/* Requirements */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Entry Requirements:</h3>
            <ul className="space-y-2">
              {requirements.map((req, index) => (
                <li key={index} className="flex items-center text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                  {req}
                </li>
              ))}
            </ul>
          </div>

          {/* Terms */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              By entering, you agree to our terms and conditions. 
              Winners will be contacted via email and announced on our social media.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link to="/">
            <Button variant="outline" className="text-gray-600 border-gray-300 hover:bg-gray-100">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GiveawayPage;
