import React, { useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import { HeroScrollDemo } from '../components/HeroScrollDemo';
import HowItWorks from '../components/HowItWorks';
import Pricing from '../components/Pricing';
import FAQ from '../components/FAQ';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';
import { HomeLightning } from '../components/HomeLightning';
import StickyScrollSection from '../components/StickyScrollSection';

const Home: React.FC = () => {
  // Add smooth-scroll class to body for homepage
  useEffect(() => {
    document.body.classList.add('smooth-scroll');
    return () => {
      document.body.classList.remove('smooth-scroll');
    };
  }, []);

  return (
    <div className="min-h-screen bg-white-smoke relative">
      {/* Lightning Background */}
      <div className="fixed inset-0 z-0 bg-black">
        <HomeLightning className="w-full h-full" />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <Header />
        <main>
          <Hero />
          
          <div className="relative -top-[435px]">
            <HeroScrollDemo />
          </div>
          
          <div className="relative -top-[555px]">
            <HowItWorks />
          </div>
          
          <StickyScrollSection />
          
          <Pricing />
          
          <FAQ />
          
          <FinalCTA />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Home;
