
import { useState } from "react";
import React from "react";
import { HeroParallax } from "../components/ui/hero-parallax";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import FreeWebsiteFeatures from "../components/FreeWebsiteFeatures";
import { BackgroundBoxesDemo } from "../components/BackgroundBoxesDemo";
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
        thumbnail: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
    },
    {
        title: "Fashion Brand",
        link: "#",
        thumbnail: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
    },
    {
        title: "Design Agency",
        link: "#",
        thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
    },
    {
        title: "Consulting Firm",
        link: "#",
        thumbnail: "https://images.unsplash.com/photo-1552581234-26160f608093?w=800&q=80",
    },
    {
        title: "Analytics Dashboard",
        link: "#",
        thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    },
    {
        title: "Lifestyle Shop",
        link: "#",
        thumbnail: "https://images.unsplash.com/photo-1472851294608-415522f96385?w=800&q=80",
    },
    {
        title: "Digital Artist",
        link: "#",
        thumbnail: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",
    },
    {
        title: "Enterprise Services",
        link: "#",
        thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    },
    {
        title: "Cloud Infrastructure",
        link: "#",
        thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
    },
    {
        title: "Boutique Store",
        link: "#",
        thumbnail: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&q=80",
    },
    {
        title: "Creative Studio",
        link: "#",
        thumbnail: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    },
];

const FreeWebsitePackagePage: React.FC = () => {
    // Set page title
    React.useEffect(() => {
        document.title = "Get Your Free Website | Boltcall";
    }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form state handling
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [allowNotifications, setAllowNotifications] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const payload = {
                ...formData,
                allowNotifications,
                // Map the new field to whyChoose if the backend expects it, or just send it as is. 
                // Sending both to be safe and ensure data capture.
                whyChoose: formData.referralSource || formData.whyChoose,
                referralId: '0' // Default to 0 as we don't have referral logic explicitly set up here yet, or we could add it.
            };

            console.log('Submitting form with payload:', payload);

            // Call webhook
            const response = await fetch('https://n8n.srv974118.hstgr.cloud/webhook/9b2699f0-f411-4a5d-911d-5d562fd0b828', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const responseText = await response.text();
                throw new Error(`Failed to submit form: ${response.status} ${responseText}`);
            }

            console.log("Form submitted successfully");
            setIsSubmitted(true);
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to submit form. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
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
                <BackgroundBoxesDemo onCtaClick={handleCtaClick} />
                <Footer theme="dark" showLogo={false} />
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
