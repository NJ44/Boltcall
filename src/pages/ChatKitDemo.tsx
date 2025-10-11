import React, { useState } from 'react';
import { ChatKit, useChatKit } from '@openai/chatkit-react';
import { getChatKitSessionToken, getOrCreateDeviceId } from '../utils/chatkit';

const ChatKitDemo: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { control } = useChatKit({
    api: {
      async getClientSecret(existing) {
        if (existing) {
          console.log('Refreshing existing session');
        }

        setIsLoading(true);
        setError(null);

        try {
          // Get device ID for the user
          const deviceId = getOrCreateDeviceId();
          
          // Get client secret from OpenAI API
          const clientSecret = await getChatKitSessionToken(deviceId);
          
          console.log('✅ ChatKit session created successfully');
          setIsLoading(false);
          return clientSecret;
        } catch (error: any) {
          const errorMessage = error?.message || 'Unknown error occurred';
          console.error('❌ Error getting ChatKit client secret:', errorMessage);
          setError(errorMessage);
          setIsLoading(false);
          throw error;
        }
      },
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            AI Agent Builder Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience our AI-powered agent built with OpenAI ChatKit. 
            Ask questions, get assistance, and see the power of conversational AI.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-red-800 font-semibold mb-1">Configuration Error</h3>
                <p className="text-red-700 text-sm mb-2">{error}</p>
                <div className="bg-red-100 rounded p-3 mt-3">
                  <p className="text-xs text-red-800 font-mono">
                    <strong>Setup Instructions:</strong><br/>
                    1. Create a <code className="bg-red-200 px-1 rounded">.env</code> file in project root<br/>
                    2. Add: <code className="bg-red-200 px-1 rounded">VITE_OPENAI_API_SECRET_KEY=sk-...</code><br/>
                    3. Restart dev server: <code className="bg-red-200 px-1 rounded">npm run dev</code><br/>
                    4. Check console (F12) for detailed errors
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="max-w-2xl mx-auto mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
            <p className="text-blue-800">Initializing ChatKit session...</p>
          </div>
        )}

        {/* ChatKit Widget Container */}
        <div className="flex justify-center items-center">
          <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Chat with Boltcall AI
              </h2>
              <p className="text-gray-600 text-sm">
                Our AI assistant is here to help you 24/7
              </p>
            </div>
            
            {/* ChatKit Component */}
            <div className="chatkit-container">
              <ChatKit 
                control={control} 
                className="h-[600px] w-full md:w-[400px]" 
              />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Natural Conversations</h3>
            <p className="text-gray-600">Engage in human-like conversations with our AI agent</p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Responses</h3>
            <p className="text-gray-600">Get immediate answers to your questions 24/7</p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart & Helpful</h3>
            <p className="text-gray-600">Powered by OpenAI's advanced language models</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatKitDemo;

