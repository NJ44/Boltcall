import React from 'react';

const FreeSetup: React.FC = () => {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left">
          {/* Content */}
          <div className="bg-transparent max-w-2xl">
            <div className="mb-4">
              <span className="text-sm uppercase tracking-wider font-medium text-white">SETUP</span>
            </div>
            <h2 className="text-8xl md:text-9xl lg:text-[10rem] font-bold text-white mb-6" style={{ fontSize: '4em' }}>
              <div>One Setup.</div>
              <div>All Channels.</div>
            </h2>
            <p className="text-xl text-white mb-8">
              Get your AI assistant up and running in minutes with our completely free setup process. No hidden fees, no credit card required.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors duration-300">
              Start Setup
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FreeSetup;
