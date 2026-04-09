import { AnimatedRoadmap } from "@/components/ui/animated-roadmap";

import { ThreeDButton } from "@/components/ui/ThreeDButton";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GiveawayBar from "../components/GiveawayBar";
import FAQ from "../components/FAQ";
import Breadcrumbs from "../components/Breadcrumbs";

const milestonesData = [
    {
        id: 1,
        name: "Google SEO",
        status: "complete" as const,
        position: { top: "70%", left: "5%" },
    },
    {
        id: 2,
        name: "Google reviews system",
        status: "complete" as const,
        position: { top: "15%", left: "20%" },
    },
    {
        id: 3,
        name: "Lead Reactivation",
        status: "in-progress" as const,
        position: { top: "45%", left: "55%" },
    },
    {
        id: 4,
        name: "Free Website Rebranding",
        status: "pending" as const,
        position: { top: "10%", right: "10%" },
    },
];

const RankOnGoogleOfferPage = () => {
    return (
        <div className="w-full bg-white text-foreground min-h-screen flex flex-col">
            {/* Giveaway Bar (hidden on mobile) */}
            <div className="hidden md:block">
                <GiveawayBar />
            </div>

            <Header />
            {/* Container for the Hero Content */}
            <div className="flex-grow pt-10 md:pt-16">
                <div className="container mx-auto px-4 py-8 md:py-12">
                    <Breadcrumbs />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left Column: Text content */}
                        <div className="flex flex-col text-left space-y-6">
                            <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl text-black">
                                Stay ahead with a clear product plan
                            </h1>
                            <p className="max-w-xl text-base text-muted-foreground md:text-lg">
                                Visualize your roadmap, assign tasks, and hit every milestone—faster and smarter.
                            </p>
                            <div className="flex flex-col space-y-4 pt-4">
                                <ThreeDButton />

                                <div className="space-y-2 mt-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                        <p>The website and system are live in 24 hours.</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
                                        <p>The lead reactivation will cover the costs of the first month. If it doesn't, we refund the difference.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Animated Roadmap Component */}
                        <div className="w-full flex justify-center lg:justify-end">
                            <div className="w-full max-w-md lg:scale-95 lg:origin-right">
                                <AnimatedRoadmap
                                    milestones={milestonesData}
                                    mapImageSrc="https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-SsfjxCJh43Hr1dqzkbFWUGH3ICZQbH.png&w=320&q=75"
                                    aria-label="An animated roadmap showing project milestones from kick-off to launch."
                                    className="py-0"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* What's Included */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">What's Included in the Offer</h2>
                <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
                    This isn't a one-size-fits-all package. It's a done-for-you growth system built specifically for local businesses that want to rank on Google, capture more leads, and convert them automatically — without hiring a full marketing team.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                    {[
                        { title: 'Google SEO Setup', desc: 'We optimize your Google Business Profile, build local citations, and target the keywords your customers are actually searching. Most clients see ranking improvements within 30–60 days.' },
                        { title: 'Google Reviews System', desc: 'An automated review request system that contacts customers after each job, dramatically increasing your review velocity and average star rating over time.' },
                        { title: 'Lead Reactivation Campaign', desc: 'We reach out to your existing leads and past customers who never converted. This campaign typically covers the cost of the entire first month through recovered revenue.' },
                        { title: 'Free Website Rebranding', desc: 'A professional website redesign optimized for conversion — clear headline, prominent call-to-action, trust signals, and mobile-first layout. Delivered as part of your onboarding.' },
                    ].map((item) => (
                        <div key={item.title} className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                            <h3 className="text-sm font-semibold text-gray-900 mb-2">{item.title}</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 text-center">
                    <p className="text-sm text-gray-700 font-medium mb-1">Risk-Free Guarantee</p>
                    <p className="text-sm text-gray-600">The lead reactivation campaign is designed to cover the cost of your first month. If it doesn't generate enough revenue to offset our fee, we refund the difference. You only pay for results.</p>
                </div>
            </section>

            <FAQ />
            <Footer />
        </div>
    );
};

export default RankOnGoogleOfferPage;
