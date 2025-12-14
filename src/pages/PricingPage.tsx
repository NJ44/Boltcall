import React, { useEffect } from 'react';
import { updateMetaDescription } from '../lib/utils';
import GiveawayBar from '../components/GiveawayBar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Pricing from '../components/Pricing';

const PricingPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Pricing';
    updateMetaDescription('Boltcall pricing plans for AI receptionist services. Compare plans, features, and pricing. Free setup included.');
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <GiveawayBar />
      <Header />
      <div className="pt-32">
        <Pricing />
      </div>
      <Footer />
    </div>
  );
};

export default PricingPage;

