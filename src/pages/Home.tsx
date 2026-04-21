import React, { useEffect, lazy, Suspense } from 'react';
import { updateMetaDescription } from '../lib/utils';
import Header from '../components/Header';
import Hero from '../components/Hero';
import LazySection from '../components/LazySection';
import BentoCard from '../components/ui/bento-card';

// Lazy load below-the-fold components to reduce initial bundle
const HowItWorks = lazy(() => import('../components/HowItWorks'));
const FreeSetup = lazy(() => import('../components/FreeSetup'));
const Pricing = lazy(() => import('../components/Pricing'));
const IntegrationHero = lazy(() => import('../components/ui/integration-hero'));
const FAQ = lazy(() => import('../components/FAQ'));
const FinalCTA = lazy(() => import('../components/FinalCTA'));
const Footer = lazy(() => import('../components/Footer'));
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
      {/* Content */}
      <div className="relative z-10 pt-32">
        <Header />
        <main className="pb-0">
          <Hero />

          {/* Boltcall Platform Preview — interactive dark bento card */}
          <section className="relative z-[2] py-8 px-4 sm:px-8 lg:px-16 -mt-[320px]">
            <BentoCard />
          </section>

          {/* HowItWorks — first below-fold section, preload aggressively */}
          <div className="relative mt-0 md:mt-0 md:top-[220px]">
            <LazySection rootMargin="500px" minHeight="600px">
              <Suspense fallback={<div className="min-h-[600px]" />}>
                <HowItWorks />
              </Suspense>
            </LazySection>
          </div>

          {/* StickyScrollSection — "Why Businesses Choose BoltCall", visible on all breakpoints */}
          <div className="relative md:-top-[200px]" style={{ minHeight: '400px' }}>
            <LazySection rootMargin="400px" minHeight="400px">
              <Suspense fallback={<div className="h-[400px] w-full" />}>
                <StickyScrollSection />
              </Suspense>
            </LazySection>
          </div>

          <div className="relative md:-top-[255px] md:mt-24">
            <LazySection rootMargin="400px" minHeight="500px">
              <Suspense fallback={<div className="min-h-[500px]" />}>
                <FreeSetup />
              </Suspense>
            </LazySection>
          </div>

          <div className="relative md:-top-[255px] md:mt-24">
            <LazySection rootMargin="400px" minHeight="400px">
              <Suspense fallback={<div className="min-h-[400px]" />}>
                <IntegrationHero />
              </Suspense>
            </LazySection>
          </div>

          <div className="relative md:-top-[255px] md:mt-24">
            <LazySection rootMargin="400px" minHeight="600px">
              <Suspense fallback={<div className="min-h-[600px]" />}>
                <Pricing />
              </Suspense>
            </LazySection>
          </div>

          <div className="relative md:-top-[255px] bg-white -mb-16 md:-mb-16">
            <LazySection rootMargin="400px" minHeight="400px">
              <Suspense fallback={<div className="min-h-[400px]" />}>
                <FAQ />
              </Suspense>
            </LazySection>
          </div>

          <div className="relative md:-top-[255px] bg-white">
            <LazySection rootMargin="400px" minHeight="300px">
              <Suspense fallback={<div className="min-h-[300px]" />}>
                <FinalCTA />
              </Suspense>
            </LazySection>
          </div>

          <div className="relative md:-top-[255px]">
            <LazySection rootMargin="400px" minHeight="400px">
              <Suspense fallback={<div className="min-h-[400px]" />}>
                <Footer />
              </Suspense>
            </LazySection>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
