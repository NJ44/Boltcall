import React, { useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import { HeroScrollDemo } from '../components/HeroScrollDemo';
import HowItWorks from '../components/HowItWorks';
import FreeSetup from '../components/FreeSetup';
import Pricing from '../components/Pricing';
import FAQ from '../components/FAQ';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';
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
    <div className="bg-blue-600 relative">
      {/* Content */}
      <div className="relative z-10">
        <Header />
        <main className="pb-0">
          <Hero />
          
          <div className="relative -top-[500px] z-[100] pointer-events-none">
            <HeroScrollDemo />
          </div>
          
          <div className="relative -top-[555px]">
            <HowItWorks />
          </div>
          
          <div className="relative -top-[400px]">
            <StickyScrollSection />
          </div>
          
          <div className="relative -top-[555px] bg-white">
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
        <div className="-mt-[555px]"></div>
      </div>
    </div>
  );
};

export default Home;
