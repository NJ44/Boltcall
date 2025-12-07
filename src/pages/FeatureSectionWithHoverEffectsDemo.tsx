import React, { useEffect } from 'react';
import { updateMetaDescription } from '../lib/utils';
import { FeaturesSectionWithHoverEffects } from '../components/ui/feature-section-with-hover-effects';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GiveawayBar from '../components/GiveawayBar';

const FeatureSectionWithHoverEffectsDemo: React.FC = () => {
  useEffect(() => {
    document.title = 'Feature Section with Hover Effects Demo | Boltcall';
    updateMetaDescription('Demo page showcasing feature section component with hover effects. Interactive grid layout with smooth animations.');
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      <GiveawayBar />
      <Header />
      
      {/* Demo Header Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-blue-50/30 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-full mb-6 dark:bg-blue-900/20 dark:text-blue-400">
            <span className="font-semibold">Component Demo</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight dark:text-white">
            Feature Section with <span className="text-blue-600 dark:text-blue-400">Hover Effects</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto dark:text-gray-300">
            Interactive feature grid with smooth hover animations and gradient effects.
            Perfect for showcasing product features, services, or key benefits.
          </p>
        </div>
      </section>

      {/* Component Demo Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <FeaturesSectionWithHoverEffects />
      </section>

      <Footer />
    </div>
  );
};

export default FeatureSectionWithHoverEffectsDemo;

