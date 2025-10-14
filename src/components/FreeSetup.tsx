import React from 'react';
import { CheckCircle, ArrowRight, Clock, Users, Shield } from 'lucide-react';
import Button from './ui/Button';

const FreeSetup: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Free Setup & Onboarding
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get your AI assistant up and running in minutes with our completely free setup process. 
            No hidden fees, no credit card required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Setup Process */}
          <div className="bg-gray-50 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Setup</h3>
            <p className="text-gray-600">
              Complete setup in under 5 minutes with our guided onboarding process.
            </p>
          </div>

          {/* Expert Support */}
          <div className="bg-gray-50 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Expert Support</h3>
            <p className="text-gray-600">
              Our team will help you configure everything perfectly for your business.
            </p>
          </div>

          {/* No Risk */}
          <div className="bg-gray-50 rounded-2xl p-8 text-center md:col-span-2 lg:col-span-1">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">No Risk</h3>
            <p className="text-gray-600">
              Try everything free for 14 days. Cancel anytime with no questions asked.
            </p>
          </div>
        </div>

        {/* What's Included */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              What's Included in Free Setup
            </h3>
            <p className="text-lg text-gray-600">
              Everything you need to get started, completely free
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">AI Assistant Configuration</h4>
                  <p className="text-gray-600">Customize your AI to match your business needs</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Phone Number Setup</h4>
                  <p className="text-gray-600">Get a dedicated business phone number</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Calendar Integration</h4>
                  <p className="text-gray-600">Connect your existing calendar system</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Knowledge Base Setup</h4>
                  <p className="text-gray-600">Upload your business information and FAQs</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Testing & Optimization</h4>
                  <p className="text-gray-600">Test calls and optimize performance</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Training & Support</h4>
                  <p className="text-gray-600">Learn how to use all features effectively</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button
              onClick={() => window.location.href = '/setup'}
              variant="primary"
              size="lg"
              className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 transition-all duration-300 font-bold px-8 py-4 rounded-2xl border-2 border-blue-500/20 hover:border-blue-400/40 transform hover:scale-105"
            >
              Start Free Setup
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-sm text-gray-500 mt-4">
              No credit card required • 14-day free trial
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FreeSetup;
