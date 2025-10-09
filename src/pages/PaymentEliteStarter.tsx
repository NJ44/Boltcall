import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PaymentEliteStarter: React.FC = () => {
  useEffect(() => {
    // Load PayPal SDK
    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=BAA5fIcZyGHSGBeakJKNPZ9R0r4qGyhW0q0YVABwmULTwWSgSncoz1XsEkhygcw-nn_A9CS5CbBWG8LJJw&components=hosted-buttons&disable-funding=venmo&currency=USD';
    script.crossOrigin = 'anonymous';
    script.async = true;
    document.head.appendChild(script);

    // Initialize PayPal button when script loads
    script.onload = () => {
      if (window.paypal) {
        window.paypal.HostedButtons({
          hostedButtonId: "6QXWAZWNEVEV2"
        }).render("#paypal-container-6QXWAZWNEVEV2");
      }
    };

    return () => {
      // Cleanup script on unmount
      document.head.removeChild(script);
    };
  }, []);

  const features = [
    "AI-Powered Lead Management",
    "Automated Text & Call System",
    "Basic Calendar Integration",
    "Analytics Dashboard",
    "AI Receptionist",
    "Standard Call Flows",
    "Lead Qualification",
    "Appointment Scheduling",
    "Email Support"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Logo - Absolute Top Left */}
      <div className="absolute top-4 left-4 z-50">
        <Link to="/">
          <img 
            src="/boltcall_full_logo.png" 
            alt="Boltcall" 
            className="h-16 w-auto"
          />
        </Link>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 py-8 pt-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <Link 
            to="/pricing" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Pricing
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Elite Starter Plan</h1>
          <p className="text-xl text-gray-600">Perfect for new dental practices</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Plan Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Check className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Elite Starter</h2>
              <div className="text-4xl font-bold text-blue-600 mb-2">$197<span className="text-lg text-gray-500">/month</span></div>
              <p className="text-gray-600">Everything you need to get started</p>
            </div>

            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="flex items-center"
                >
                  <Check className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </motion.div>
              ))}
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">What's Included:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Up to 200 leads per month</li>
                <li>• Standard AI conversation flows</li>
                <li>• Basic integrations</li>
                <li>• Essential analytics</li>
                <li>• Email support</li>
              </ul>
            </div>
          </motion.div>

          {/* Payment Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Purchase</h3>
              <p className="text-gray-600">Secure payment powered by PayPal</p>
            </div>

            {/* PayPal Button Container */}
            <div className="mb-6">
              <div id="paypal-container-6QXWAZWNEVEV2" style={{ minHeight: '150px', display: 'block', width: '100%' }}></div>
            </div>

            <div className="text-center text-sm text-gray-500 mb-6">
              <p>🔒 Your payment information is secure and encrypted</p>
              <p>💳 We accept all major credit cards through PayPal</p>
            </div>

            <div className="border-t pt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Payment Summary:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Elite Starter (Monthly)</span>
                  <span>$197.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Setup Fee</span>
                  <span>$0.00</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>$197.00/month</span>
                </div>
              </div>
            </div>

            <div className="mt-6 text-xs text-gray-500 text-center">
              <p>By completing this purchase, you agree to our Terms of Service and Privacy Policy.</p>
              <p>You can cancel your subscription at any time from your dashboard.</p>
            </div>
          </motion.div>
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500">
            <div className="flex items-center">
              <Check className="w-5 h-5 text-blue-500 mr-2" />
              <span>30-Day Money Back Guarantee</span>
            </div>
            <div className="flex items-center">
              <Check className="w-5 h-5 text-blue-500 mr-2" />
              <span>Cancel Anytime</span>
            </div>
            <div className="flex items-center">
              <Check className="w-5 h-5 text-blue-500 mr-2" />
              <span>Email Support</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentEliteStarter;
