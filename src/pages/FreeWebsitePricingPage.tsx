import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PricingSection5 from '../components/ui/pricing';

import GiveawayBar from '../components/GiveawayBar';

const FreeWebsitePricingPage: React.FC = () => {
    // Set page title
    React.useEffect(() => {
        document.title = "Pricing Packages | Boltcall";
    }, []);

    return (
        <div className="min-h-screen w-full bg-white">
            <GiveawayBar />
            <Header />
            <div className="pt-24">
                <PricingSection5 />
            </div>
            <Footer />
        </div>
    );
};

export default FreeWebsitePricingPage;
