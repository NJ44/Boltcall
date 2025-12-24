import React, { useState } from 'react';
import { updateMetaDescription } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import GiveawayBar from '../../components/GiveawayBar';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Button from '../../components/ui/Button';
import { useSpeedTestStore } from '../../stores/speedTestStore';
import { runSpeedTest } from '../../lib/speedTest';

const SpeedTestLanding: React.FC = () => {
  const navigate = useNavigate();
  const { setUrl, setResults, setWebhookResults } = useSpeedTestStore();
  const [websiteUrl, setWebsiteUrl] = useState('');

  React.useEffect(() => {
    document.title = 'Free Website Health Check - Analyze Site Performance';
    updateMetaDescription('Free website health check analyzes your site performance. Get detailed report on loading times, health metrics, and optimization tips. Check now.');
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('Testing your website speed...');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteUrl.trim()) return;

    // Add https:// if not present
    let url = websiteUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }

    setIsLoading(true);
    setProgress(0);
    setProgressMessage('Running website health check...');
    setUrl(url);

    try {
      // Call webhook first
      setProgress(5);
      setProgressMessage('Running health check...');
      const webhookResponse = await fetch('https://n8n.srv974118.hstgr.cloud/webhook/fade2648-d939-4d3b-93aa-726ced02c1a3', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      let webhookData = null;
      if (webhookResponse.ok) {
        webhookData = await webhookResponse.json();
        setWebhookResults(webhookData);
      }

      // Run speed test with progress callback
      const results = await runSpeedTest(url, (progressValue, message) => {
        setProgress(progressValue);
        setProgressMessage(message);
      });
      setResults(results);
      // Small delay to show 100% before navigation
      await new Promise(resolve => setTimeout(resolve, 500));
      navigate('/speed-test/report');
    } catch (error) {
      console.error('Speed test error:', error);
      // Show error message to user
      const errorMessage = error instanceof Error ? error.message : 'Failed to run health check. Please try again.';
      alert(errorMessage);
    } finally {
      // Always reset loading state, even if navigation fails
      setIsLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="relative min-h-screen bg-white">
      <GiveawayBar />
      <div className="relative z-10 pt-32">
        <Header />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Website Health Check
            </h1>
            
            <p className="text-xl text-gray-600 mb-12">
              Get instant insights into your website's performance and health
            </p>

            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <input
                  type="text"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="Enter your website URL (e.g., example.com)"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  required
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isLoading}
                  className="px-8 py-3 text-lg flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    'Run Health Check'
                  )}
                </Button>
              </div>
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center gap-3 mt-4"
                >
                  <div className="flex items-center gap-2 text-blue-600">
                    <span className="text-sm font-medium">{progressMessage}</span>
                  </div>
                  <div className="w-64 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{progress}%</span>
                </motion.div>
              )}
            </form>
          </motion.div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default SpeedTestLanding;

