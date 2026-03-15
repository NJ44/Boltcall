import React, { useEffect } from 'react';
import { updateMetaDescription } from '../lib/utils';
import GiveawayBar from '../components/GiveawayBar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Pricing from '../components/Pricing';

const PricingPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Boltcall Pricing - AI Receptionist Plans & Pricing';
    updateMetaDescription('Compare Boltcall pricing plans. Choose the perfect AI receptionist plan for your business. Free setup included. View plans now.');

    // Add canonical link
    let link = document.querySelector("link[rel='canonical']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = 'https://boltcall.org/pricing';

    return () => {
      const el = document.querySelector("link[rel='canonical']");
      if (el) el.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <GiveawayBar />
      <Header />
      <main className="pt-20">
        <h1 className="sr-only">Boltcall AI Receptionist Pricing Plans</h1>
        <Pricing />
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;

