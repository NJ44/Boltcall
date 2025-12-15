import React, { useEffect } from 'react';
import { MultiStepForm } from '@/components/ui/multistep-form';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GiveawayBar from '@/components/GiveawayBar';

const MultiStepFormDemo: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Multi-Step Form Demo | Boltcall';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <GiveawayBar />
      <Header />
      <div className="flex min-h-[calc(100vh-200px)] items-center justify-center bg-background p-4 w-full pt-32">
        <MultiStepForm />
      </div>
      <Footer />
    </div>
  );
};

export default MultiStepFormDemo;

