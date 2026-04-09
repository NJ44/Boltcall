import { AnimatedRoadmap } from "@/components/ui/animated-roadmap";
import { CheckCircle } from "lucide-react";
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

            {/* How We Help You Rank on Google */}
            <section className="py-12 bg-gray-50">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">How We Help You Rank on Google</h2>
                    <div className="space-y-4">
                        <p className="text-gray-700 leading-relaxed">
                            We start with your Google Business Profile — the single most important factor for local search visibility. Most GBPs are incomplete or inconsistently formatted, which suppresses rankings in the local map pack. We optimize every field, add geo-tagged photos, build accurate local citations across the major directories, and ensure your business name, address, and phone number are consistent everywhere Google looks. These foundational steps alone move most clients from invisible to page one within 30 to 60 days.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            On top of the GBP work, we handle on-page SEO for your website — optimizing title tags, meta descriptions, headers, and internal linking so every page sends the right ranking signals. We also implement a structured review strategy that automatically requests feedback from your customers after each job, steadily building the volume and recency of Google reviews that Google's algorithm heavily weights for local rankings.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            Finally, we create AI-assisted content specifically structured to rank in both traditional search and AI-generated answer results. This includes FAQ pages, service area pages, and structured schema markup that helps Google understand exactly what you offer and where you serve. The result is a compounding SEO foundation that keeps generating traffic long after the initial work is done — without requiring you to run paid ads month after month.
                        </p>
                    </div>
                </div>
            </section>

            <FAQ />

            {/* Social Proof */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Trusted by Local Business Owners</h2>
              <p className="text-gray-500 text-center mb-8 text-sm">Join 500+ businesses using Boltcall to capture more leads and grow revenue.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { quote: "Boltcall paid for itself in the first week. We stopped losing calls after hours and our bookings jumped 40%.", name: "Marcus T.", role: "HVAC Owner, Texas" },
                  { quote: "I was skeptical about AI, but it just works. Our front desk handles 30% fewer interruptions now.", name: "Priya S.", role: "Dental Practice Manager, California" },
                  { quote: "We were losing 15-20 calls a week to voicemail. Boltcall captures every single one now.", name: "James R.", role: "Plumbing Business Owner, Florida" },
                ].map((item) => (
                  <div key={item.name} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed mb-4">"{item.quote}"</p>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Trust Signals */}
            <section className="bg-gray-50 border-t border-gray-100 py-8">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>100% Free — no credit card required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Used by 500+ local businesses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Results in 30 days or your money back</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Your data is never sold or shared</span>
                  </div>
                </div>
              </div>
            </section>

            <Footer />
        </div>
    );
};

export default RankOnGoogleOfferPage;
