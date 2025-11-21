import React from 'react';
import BannerDemo from '../components/ui/banner-demo';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GiveawayBar from '../components/GiveawayBar';

const BannerDemoPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <GiveawayBar />
      <Header />
      <BannerDemo />
      <Footer />
    </div>
  );
};

export default BannerDemoPage;

