import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ValueProps from '../components/ValueProps';
import HowItWorks from '../components/HowItWorks';
import FeaturesTabs from '../components/FeaturesTabs';
import Pricing from '../components/Pricing';
import FAQ from '../components/FAQ';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white-smoke">
      <Header />
      <main>
        <Hero />
        <ValueProps />
        <HowItWorks />
        <FeaturesTabs />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
