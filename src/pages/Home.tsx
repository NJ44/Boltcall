import React, { useEffect, lazy, Suspense } from 'react';
import { updateMetaDescription } from '../lib/utils';
import GiveawayBar from '../components/GiveawayBar';
import Header from '../components/Header';
import Hero from '../components/Hero';

// Lazy load below-the-fold components to reduce initial bundle
const HowItWorks = lazy(() => import('../components/HowItWorks'));
const FreeSetup = lazy(() => import('../components/FreeSetup'));
const Pricing = lazy(() => import('../components/Pricing'));
const FAQ = lazy(() => import('../components/FAQ'));
const FinalCTA = lazy(() => import('../components/FinalCTA'));
const Footer = lazy(() => import('../components/Footer'));
const HeroScrollDemo = lazy(() => import('../components/HeroScrollDemo').then(module => ({ default: module.HeroScrollDemo })));
const StickyScrollSection = lazy(() => import('../components/StickyScrollSection').then(module => ({ default: module.StickyScrollSection })));

const Home: React.FC = () => {
  // Add smooth-scroll class to body for homepage
  useEffect(() => {
    document.body.classList.add('smooth-scroll');
    return () => {
      document.body.classList.remove('smooth-scroll');
    };
  }, []);

  useEffect(() => {
    document.title = 'AI Receptionist: 24/7 Booking & Lead Capture | Boltcall';
    updateMetaDescription('Never miss a call or lead. AI receptionist answers 24/7, books appointments instantly, captures leads automatically. Start free today.');

    const speakableSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": document.title,
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": [".speakable-intro"]
      }
    };
    const speakableScript = document.createElement('script');
    speakableScript.type = 'application/ld+json';
    speakableScript.textContent = JSON.stringify(speakableSchema);
    document.head.appendChild(speakableScript);

    return () => { speakableScript.remove(); };
  }, []);

  return (
    <div className="relative bg-brand-blue">
      {/* Giveaway Bar (hidden on mobile) */}
      <div className="hidden md:block">
        <GiveawayBar />
      </div>
      
      {/* Content */}
      <div className="relative z-10 pt-32">
        <Header />
        <main className="pb-0">
          <Hero />

          <div className="relative -top-[120px] z-[100] pointer-events-none hidden md:block" style={{ minHeight: '600px', contain: 'layout' }}>
            <Suspense fallback={<div className="h-[600px] w-full" style={{ contain: 'layout' }} />}>
              <HeroScrollDemo />
            </Suspense>
          </div>

          <Suspense fallback={<div className="min-h-screen" />}>
            <div className="relative mt-0 md:mt-0 md:-top-[300px]">
              <HowItWorks />
            </div>

            <div className="relative -top-[60px] md:-top-[200px] hidden md:block" style={{ minHeight: '400px', contain: 'layout' }}>
              <Suspense fallback={<div className="h-[400px] w-full" style={{ contain: 'layout' }} />}>
                <StickyScrollSection />
              </Suspense>
            </div>

            <div className="relative md:-top-[255px]">
              <FreeSetup />
            </div>

            <div className="relative md:-top-[255px]">
              <Pricing />
            </div>

            <div className="relative md:-top-[255px] bg-white -mb-16 md:-mb-16">
              <FAQ />
            </div>

            <div className="relative md:-top-[255px] bg-white">
              <FinalCTA />
            </div>

            <div className="relative md:-top-[255px]">
              <Footer />
            </div>
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default Home;
