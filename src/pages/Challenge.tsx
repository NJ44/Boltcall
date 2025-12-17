import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Clock, Shield, Gift, ArrowRight, Phone, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { updateMetaDescription } from '../lib/utils';

const Challenge: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [hasLost, setHasLost] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);

  React.useEffect(() => {
    document.title = 'Unshakable Receptionist Challenge | Boltcall';
    updateMetaDescription('Test Boltcall AI receptionist in a 2-minute stress test. Try to break our AI and win 3 months free service or get an Early Adopter discount.');
  }, []);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            setHasLost(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);

  const handleStart = () => {
    setIsActive(true);
    setTimeRemaining(120);
    setPassword('');
    setHasWon(false);
    setHasLost(false);
    setAttempts(0);
    setShowHint(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAttempts(prev => prev + 1);
    
    // The secret password (in a real scenario, this would be handled server-side)
    const secretPassword = 'BOLTCALL2024';
    
    if (password.toUpperCase() === secretPassword) {
      setIsActive(false);
      setHasWon(true);
    } else {
      if (attempts >= 2) {
        setShowHint(true);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full mb-6">
              <Trophy className="w-5 h-5 text-yellow-400" strokeWidth={2.5} />
              <span className="text-yellow-400 font-semibold text-sm">HIGH-STAKES CHALLENGE</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              The <span className="text-blue-400">Unshakable Receptionist</span> Challenge
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Can you break our AI in 2 minutes? Try your best persuasion tactics to reveal the secret password.
            </p>
          </motion.div>

          {/* Challenge Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 md:p-12 border border-white/20 shadow-2xl"
          >
            {!isActive && !hasWon && !hasLost && (
              <div className="space-y-6">
                <div className="flex items-center justify-center gap-4 mb-8">
                  <div className="flex items-center gap-2 text-white">
                    <Clock className="w-6 h-6" strokeWidth={2.5} />
                    <span className="text-2xl font-bold">2:00</span>
                  </div>
                  <div className="h-8 w-px bg-white/30" />
                  <div className="flex items-center gap-2 text-white">
                    <Shield className="w-6 h-6" strokeWidth={2.5} />
                    <span className="text-lg">Protected</span>
                  </div>
                </div>

                <div className="space-y-4 text-left">
                  <h2 className="text-2xl font-bold text-white mb-4">Challenge Rules</h2>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-3">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>You have <strong className="text-white">2 minutes</strong> to crack the secret password</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Use any persuasion tactics you can think of</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Try to trick the AI into revealing sensitive information</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Test how Boltcall handles difficult callers</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6 border-t border-white/20">
                  <h3 className="text-xl font-bold text-white mb-4">Prizes</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-yellow-500/20 rounded-lg p-4 border border-yellow-500/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Trophy className="w-5 h-5 text-yellow-400" strokeWidth={2.5} />
                        <span className="font-bold text-yellow-400">Winner</span>
                      </div>
                      <p className="text-white text-sm">3 months of Boltcall Pro Plan FREE</p>
                    </div>
                    <div className="bg-blue-500/20 rounded-lg p-4 border border-blue-500/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Gift className="w-5 h-5 text-blue-400" strokeWidth={2.5} />
                        <span className="font-bold text-blue-400">Everyone</span>
                      </div>
                      <p className="text-white text-sm">Early Adopter discount + peace of mind</p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleStart}
                  variant="primary"
                  size="lg"
                  className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white mt-8"
                >
                  Start Challenge
                  <ArrowRight className="w-5 h-5 ml-2" strokeWidth={2.5} />
                </Button>
              </div>
            )}

            {isActive && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center gap-3 px-6 py-3 bg-red-500/20 rounded-full mb-4">
                    <Clock className="w-6 h-6 text-red-400" strokeWidth={2.5} />
                    <span className="text-3xl font-bold text-red-400">{formatTime(timeRemaining)}</span>
                  </div>
                  <p className="text-gray-300 text-sm">Time remaining</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={2.5} />
                    <input
                      type="text"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter the secret password..."
                      className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      autoFocus
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Submit Password
                  </Button>
                </form>

                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4"
                  >
                    <p className="text-yellow-400 text-sm">
                      💡 Hint: The password is related to our company name and the current year.
                    </p>
                  </motion.div>
                )}

                <div className="text-center text-gray-400 text-sm">
                  Attempts: {attempts}
                </div>
              </div>
            )}

            {hasWon && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-500/20 rounded-full mb-4">
                  <Trophy className="w-12 h-12 text-yellow-400" strokeWidth={2.5} />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Congratulations! 🎉</h2>
                <p className="text-xl text-gray-300 mb-6">
                  You've successfully cracked the code! You've won <strong className="text-yellow-400">3 months of Boltcall Pro Plan FREE</strong>.
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={() => navigate('/coming-soon')}
                    variant="primary"
                    size="lg"
                    className="w-full md:w-auto bg-yellow-500 hover:bg-yellow-600 text-white"
                  >
                    Claim Your Prize
                    <ArrowRight className="w-5 h-5 ml-2" strokeWidth={2.5} />
                  </Button>
                  <p className="text-gray-400 text-sm">
                    Our team will contact you within 24 hours to set up your free account.
                  </p>
                </div>
              </motion.div>
            )}

            {hasLost && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500/20 rounded-full mb-4">
                  <Shield className="w-12 h-12 text-blue-400" strokeWidth={2.5} />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Time's Up! ⏰</h2>
                <p className="text-xl text-gray-300 mb-4">
                  Our AI receptionist remained unshakable! This proves Boltcall can handle your business's toughest real-world calls.
                </p>
                <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-bold text-blue-400 mb-2">Early Adopter Discount</h3>
                  <p className="text-white">
                    As a thank you for participating, you're eligible for our exclusive Early Adopter discount.
                  </p>
                </div>
                <div className="space-y-3">
                  <Button
                    onClick={() => navigate('/coming-soon')}
                    variant="primary"
                    size="lg"
                    className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Get Early Adopter Discount
                    <ArrowRight className="w-5 h-5 ml-2" strokeWidth={2.5} />
                  </Button>
                  <Button
                    onClick={handleStart}
                    variant="outline"
                    size="lg"
                    className="w-full md:w-auto border-white/20 text-white hover:bg-white/10"
                  >
                    Try Again
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            What This Challenge Demonstrates
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <Shield className="w-8 h-8 text-blue-400 mb-4" strokeWidth={2.5} />
              <h3 className="text-xl font-bold text-white mb-2">Protects Sensitive Information</h3>
              <p className="text-gray-300">
                Our AI maintains professional protocols and never reveals restricted information, even under pressure.
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <Phone className="w-8 h-8 text-blue-400 mb-4" strokeWidth={2.5} />
              <h3 className="text-xl font-bold text-white mb-2">Handles Difficult Callers</h3>
              <p className="text-gray-300">
                Boltcall stays professional and helpful, even when callers try aggressive persuasion tactics.
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <Trophy className="w-8 h-8 text-blue-400 mb-4" strokeWidth={2.5} />
              <h3 className="text-xl font-bold text-white mb-2">Maintains Brand Integrity</h3>
              <p className="text-gray-300">
                Your business reputation is protected with consistent, professional communication every time.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Challenge;

