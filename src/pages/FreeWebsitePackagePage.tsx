
import { useState } from "react";
import React from "react";
import { HeroParallax } from "../components/ui/hero-parallax";
import Header from "../components/Header";
import Footer from "../components/Footer";
import GiveawayBar from "../components/GiveawayBar";
import { motion } from "framer-motion";
import FreeWebsiteFeatures from "../components/FreeWebsiteFeatures";
import SimpleModal from "../components/ui/simple-modal";
import { GiveawayMultiStepForm } from "../components/ui/giveaway-multistep-form";

export const products = [
    {
        title: "Modern SaaS Platform",
        link: "#",
        thumbnail: "/images/hero-examples/hero-saas.png",
    },
    {
        title: "E-commerce Store",
        link: "#",
        thumbnail: "/images/hero-examples/hero-ecommerce.png",
    },
    {
        title: "Creative Portfolio",
        link: "#",
        thumbnail: "/images/hero-examples/hero-portfolio.png",
    },
    {
        title: "Corporate Solutions",
        link: "#",
        thumbnail: "/images/hero-examples/hero-corporate.png",
    },
    {
        title: "Tech Startup",
        link: "#",
        thumbnail: "/images/hero-examples/hero-saas.png",
    },
    {
        title: "Fashion Brand",
        link: "#",
        thumbnail: "/images/hero-examples/hero-ecommerce.png",
    },
    {
        title: "Design Agency",
        link: "#",
        thumbnail: "/images/hero-examples/hero-portfolio.png",
    },
    {
        title: "Consulting Firm",
        link: "#",
        thumbnail: "/images/hero-examples/hero-corporate.png",
    },
    {
        title: "Analytics Dashboard",
        link: "#",
        thumbnail: "/images/hero-examples/hero-saas.png",
    },
    {
        title: "Lifestyle Shop",
        link: "#",
        thumbnail: "/images/hero-examples/hero-ecommerce.png",
    },
    {
        title: "Digital Artist",
        link: "#",
        thumbnail: "/images/hero-examples/hero-portfolio.png",
    },
    {
        title: "Enterprise Services",
        link: "#",
        thumbnail: "/images/hero-examples/hero-corporate.png",
    },
    {
        title: "Cloud Infrastructure",
        link: "#",
        thumbnail: "/images/hero-examples/hero-saas.png",
    },
    {
        title: "Boutique Store",
        link: "#",
        thumbnail: "/images/hero-examples/hero-ecommerce.png",
    },
    {
        title: "Creative Studio",
        link: "#",
        thumbnail: "/images/hero-examples/hero-portfolio.png",
    },
];

const FreeWebsitePackagePage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form state handling
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [allowNotifications, setAllowNotifications] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log("Form Data:", formData, "Notifications:", allowNotifications);
        setIsSubmitting(false);
        setIsSubmitted(true);
        // Close modal after success message logic if needed, or keep it open with success state
        // For now let's just show success
    };

    const handleCtaClick = () => {
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen w-full bg-black">
            <Header />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative w-full"
            >
                <HeroParallax products={products} onCtaClick={handleCtaClick} />
                <FreeWebsiteFeatures />
                <Footer />
            </motion.div>

            <SimpleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Get Your Free Website"
            >
                {isSubmitted ? (
                    <div className="text-center py-10 space-y-4">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white">Application Received!</h3>
                        <p className="text-neutral-400">We'll review your details and get back to you shortly.</p>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="mt-6 px-6 py-2 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200"
                        >
                            Close
                        </button>
                    </div>
                ) : (
                    <GiveawayMultiStepForm
                        formData={formData}
                        setFormData={setFormData}
                        allowNotifications={allowNotifications}
                        setAllowNotifications={setAllowNotifications}
                        onSubmit={handleSubmit}
                        isSubmitting={isSubmitting}
                        isSubmitted={isSubmitted}
                    />
                )}
            </SimpleModal>
        </div>
    );
}

export default FreeWebsitePackagePage;
