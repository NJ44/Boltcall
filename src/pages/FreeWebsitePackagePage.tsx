
import React from "react";
import { HeroParallax } from "../components/ui/hero-parallax";
import Header from "../components/Header";
import Footer from "../components/Footer";
import GiveawayBar from "../components/GiveawayBar";
import { motion } from "framer-motion";
import FreeWebsiteFeatures from "../components/FreeWebsiteFeatures";

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
    return (
        <div className="min-h-screen w-full bg-black">
            <Header />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute top-0 left-0 w-full"
            >
                <HeroParallax products={products} />
                <FreeWebsiteFeatures />
                <Footer />
            </motion.div>
        </div>
    );
}

export default FreeWebsitePackagePage;
