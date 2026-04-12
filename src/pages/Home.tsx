import React, { useEffect, lazy, Suspense } from 'react';
import { updateMetaDescription } from '../lib/utils';
import GiveawayBar from '../components/GiveawayBar';
import Header from '../components/Header';
import Hero from '../components/Hero';
import LazySection from '../components/LazySection';

// Lazy load below-the-fold components to reduce initial bundle
const HowItWorks = lazy(() => import('../components/HowItWorks'));
const FreeSetup = lazy(() => import('../components/FreeSetup'));
const Pricing = lazy(() => import('../components/Pricing'));
const IntegrationHero = lazy(() => import('../components/ui/integration-hero'));
const FAQ = lazy(() => import('../components/FAQ'));
const FinalCTA = lazy(() => import('../components/FinalCTA'));
const Footer = lazy(() => import('../components/Footer'));
const HeroScrollDemo = lazy(() => import('../components/HeroScrollDemo').then(module => ({ default: module.HeroScrollDemo })));
const StickyScrollSection = lazy(() => import('../components/StickyScrollSection').then(module => ({ default: module.StickyScrollSection })));

const Home: React.FC = () => {
  // Add smooth-scroll class to body for homepage
  useEffect(() => {
    document.body.classList.add('smooth-scroll');

    const bcScript = document.createElement('script');
    bcScript.type = 'application/ld+json';
    bcScript.id = 'breadcrumb-jsonld';
    bcScript.text = JSON.stringify({"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Home", "item": "https://boltcall.org"}, {"@type": "ListItem", "position": 2, "name": "Home", "item": "https://boltcall.org/"}]});
    document.head.appendChild(bcScript);
    return () => {
      document.getElementById('breadcrumb-jsonld')?.remove();
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

          {/* Social proof strip — trust signal right below hero (video: Ch.3 "Can I trust it?") */}
          <div className="relative z-20 -mt-20 md:-mt-28 pb-8 md:pb-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg px-6 py-5 md:px-8 md:py-6">
                <div className="flex items-center justify-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" /></svg>
                  ))}
                </div>
                <blockquote className="text-sm md:text-base text-gray-700 italic leading-relaxed">
                  "We were losing 40+ calls a month after hours. Boltcall picked up every single one — booked 12 new patients in the first week."
                </blockquote>
                <p className="text-xs md:text-sm text-gray-500 mt-2 font-medium">Dr. Emily R. — Dental Practice Owner</p>
              </div>
            </div>
          </div>

          {/* HeroScrollDemo — desktop only, near fold; start loading immediately */}
          <div className="relative -top-[120px] z-[100] pointer-events-none hidden md:block" style={{ minHeight: '600px', contain: 'layout' }}>
            <LazySection rootMargin="0px" minHeight="600px">
              <Suspense fallback={<div className="h-[600px] w-full" style={{ contain: 'layout' }} />}>
                <HeroScrollDemo />
              </Suspense>
            </LazySection>
          </div>

          {/* HowItWorks — first below-fold section, preload aggressively */}
          <div className="relative mt-0 md:mt-0 md:-top-[300px]">
            <LazySection rootMargin="500px" minHeight="600px">
              <Suspense fallback={<div className="min-h-[600px]" />}>
                <HowItWorks />
              </Suspense>
            </LazySection>
          </div>

          {/* StickyScrollSection — desktop only, behind HowItWorks */}
          <div className="relative -top-[60px] md:-top-[200px] hidden md:block" style={{ minHeight: '400px', contain: 'layout' }}>
            <LazySection rootMargin="400px" minHeight="400px">
              <Suspense fallback={<div className="h-[400px] w-full" style={{ contain: 'layout' }} />}>
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

          <div className="relative md:-top-[255px] md:mt-24 bg-white -mb-16 md:-mb-16">
            <LazySection rootMargin="400px" minHeight="400px">
              <Suspense fallback={<div className="min-h-[400px]" />}>
                <FAQ />
              </Suspense>
            </LazySection>
          </div>

          <div className="relative md:-top-[255px] md:mt-24 bg-white">
            <LazySection rootMargin="400px" minHeight="300px">
              <Suspense fallback={<div className="min-h-[300px]" />}>
                <FinalCTA />
              </Suspense>
            </LazySection>
          </div>

          <div className="relative md:-top-[255px] md:mt-24">
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
