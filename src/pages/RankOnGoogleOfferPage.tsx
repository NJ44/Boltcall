
import { AnimatedRoadmap } from "@/components/ui/animated-roadmap";
import { Button } from "@/components/ui/Button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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

import GiveawayBar from "../components/GiveawayBar";

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
                                <Button
                                    className="w-fit bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white transition-all duration-300 font-bold text-lg px-8 py-6 rounded-2xl border-2 border-blue-500/20 hover:border-blue-400/40 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                >
                                    Get Your Ranking Offer
                                </Button>

                                <div className="space-y-2 mt-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                        <p>The webiste and system are kive in 24 hours.</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
                                        <p>The lead reactivation will cover teh costs of teh first month, if they wont, We will refund the rest</p>
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
            <Footer />
        </div>
    );
};

export default RankOnGoogleOfferPage;
