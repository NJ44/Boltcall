import React, { useEffect, lazy, Suspense } from 'react';
import { updateMetaDescription } from '../lib/utils';
import GiveawayBar from '../components/GiveawayBar';
import Header from '../components/Header';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import FreeSetup from '../components/FreeSetup';
import Pricing from '../components/Pricing';
import FAQ from '../components/FAQ';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';

// Lazy load heavy components that aren't above the fold
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
  }, []);

  return (
    <div className="relative overflow-x-hidden md:overflow-x-visible">
      {/* Giveaway Bar (hidden on mobile) */}
      <div className="hidden md:block">
        <GiveawayBar />
      </div>
      
      {/* Content */}
      <div className="relative z-10 pt-32 overflow-x-hidden md:overflow-x-visible">
        <Header />
        <main className="pb-0 overflow-x-hidden md:overflow-x-visible">
          <Hero />
          
          <div className="relative -top-[500px] z-[100] pointer-events-none hidden md:block" style={{ minHeight: '600px', contain: 'layout' }}>
            <Suspense fallback={<div className="h-[600px] w-full" style={{ contain: 'layout' }} />}>
              <HeroScrollDemo />
            </Suspense>
          </div>
          
          <div className="relative mt-[170px] md:mt-0 md:-top-[600px]">
            <HowItWorks />
          </div>
          
          <div className="relative -top-[60px] md:-top-[500px]" style={{ minHeight: '400px', contain: 'layout' }}>
            <Suspense fallback={<div className="h-[400px] w-full" style={{ contain: 'layout' }} />}>
            <StickyScrollSection />
            </Suspense>
          </div>
          
          <div className="relative -top-[500px] md:-top-[555px]">
            <FreeSetup />
          </div>
          
          <div className="relative -top-[555px]">
            <Pricing />
          </div>
          
          <div className="relative -top-[555px] bg-white -mb-16">
            <FAQ />
          </div>
          
          <div className="relative -top-[555px] bg-white">
            <FinalCTA />
          </div>
          
          <div className="relative -top-[555px]">
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
