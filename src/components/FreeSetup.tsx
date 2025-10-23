import React from 'react';
import { useNavigate } from 'react-router-dom';

const FreeSetup: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left">
          {/* Content */}
          <div className="bg-transparent max-w-xl">
            <div className="mb-4">
              <span className="text-sm uppercase tracking-wider font-medium text-white/70">SETUP</span>
            </div>
            <h2 className="font-bold text-white mb-6" style={{ fontSize: '54px', lineHeight: '0.9' }}>
              <div>One Setup.</div>
              <div>All <span className="text-blue-500">Channels.</span></div>
            </h2>
            <p className="text-xl text-white mb-8">
              Get your AI assistant up and running in minutes with our completely free setup process. No hidden fees, no credit card required.
            </p>
            <button
              onClick={() => navigate('/setup')}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg text-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Start Setup
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FreeSetup;
