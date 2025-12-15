import React, { useState, useEffect } from 'react';
import { updateMetaDescription } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail } from 'lucide-react';
import GiveawayBar from '../../components/GiveawayBar';
import Header from '../../components/Header';
import Button from '../../components/ui/Button';
import { useSpeedTestStore } from '../../stores/speedTestStore';
import { runSpeedTest } from '../../lib/speedTest';

const SpeedTestLogin: React.FC = () => {
  const navigate = useNavigate();
  const { url, setCredentials, setResults } = useSpeedTestStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    document.title = 'Login for Website Speed Test - Access Your Report';
    updateMetaDescription('Login to access your website speed test results. View detailed performance analysis and recommendations. Sign in now.');
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if no URL
  useEffect(() => {
    if (!url) {
      navigate('/speed-test');
    }
  }, [url, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setCredentials(email, password);

    try {
      // Run speed test
      const results = await runSpeedTest(url);
      setResults(results);
      
      // Redirect to report page
      navigate('/speed-test/report');
    } catch (err) {
      setError('Failed to run speed test. Please try again.');
      console.error('Speed test error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <GiveawayBar />
      <div className="relative z-10 pt-32">
        <Header />
        
        <main className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
              Login to View Your Speed Results
            </h1>
            <p className="text-gray-600 mb-8 text-center">
              We'll analyze <span className="font-semibold">{url}</span>
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                disabled={isLoading}
                className="w-full py-3"
              >
                {isLoading ? 'Running Speed Test...' : 'See My Report'}
              </Button>
            </form>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default SpeedTestLogin;

