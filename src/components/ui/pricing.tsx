"use client";
import { useRef, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { Briefcase, CheckCheck, Database, Server } from "lucide-react";
import { motion } from "framer-motion";

const plans = [
    {
        name: "Starter",
        description: "Great for small businesses and startups looking to get started with AI",
        price: 12,
        yearlyPrice: 99,
        buttonText: "Get started",
        buttonVariant: "outline" as const,
        features: [
            { text: "Up to 10 boards per workspace", icon: <Briefcase size={20} /> },
            { text: "Up to 10GB storage", icon: <Database size={20} /> },
            { text: "Limited analytics", icon: <Server size={20} /> },
        ],
        includes: [
            "Free includes:",
            "Unlimted Cards",
            "Custom background & stickers",
            "2-factor authentication",
            "Up to 2 individual users",
            "Up to 2 workspaces",
        ],
    },
    {
        name: "Business",
        description: "Best value for growing businesses that need more advanced features",
        price: 48,
        yearlyPrice: 399,
        buttonText: "Get started",
        buttonVariant: "default" as const,
        popular: true,
        features: [
            { text: "Unlimted boards", icon: <Briefcase size={20} /> },
            { text: "Storage (250MB/file)", icon: <Database size={20} /> },
            { text: "100 workspace command runs", icon: <Server size={20} /> },
        ],
        includes: [
            "Everything in Starter, plus:",
            "Advanced checklists",
            "Custom fields",
            "Servedless functions",
            "Up to 10 individual users",
            "Up to 10 workspaces",
        ],
    },
    {
        name: "Enterprise",
        description: "Advanced plan with enhanced security and unlimited access for large teams",
        price: 96,
        yearlyPrice: 899,
        buttonText: "Get started",
        buttonVariant: "outline" as const,
        features: [
            { text: "Unlimited board", icon: <Briefcase size={20} /> },
            { text: "Unlimited storage ", icon: <Database size={20} /> },
            { text: "Unlimited workspaces", icon: <Server size={20} /> },
        ],
        includes: [
            "Everything in Business, plus:",
            "Multi-board management",
            "Multi-board guest",
            "Attachment permissions",
            "Custom roles",
            "Custom boards",
        ],
    },
];

const PricingSwitch = ({
    onSwitch,
    className,
}: {
    onSwitch: (value: string) => void;
    className?: string;
}) => {
    const [selected, setSelected] = useState("0");

    const handleSwitch = (value: string) => {
        setSelected(value);
        onSwitch(value);
    };

    return (
        <div className={cn("flex justify-center", className)}>
            <div className="relative z-10 mx-auto flex w-fit rounded-xl bg-neutral-50 border border-gray-200 p-1">
                <button
                    onClick={() => handleSwitch("0")}
                    className={cn(
                        "relative z-10 w-fit cursor-pointer h-10 rounded-lg sm:px-4 px-3 sm:py-2 py-1 font-medium transition-colors text-sm",
                        selected === "0"
                            ? "text-white"
                            : "text-muted-foreground hover:text-black",
                    )}
                >
                    {selected === "0" && (
                        <motion.span
                            layoutId={"switch"}
                            className="absolute top-0 left-0  h-10 w-full rounded-lg border-2 shadow-sm shadow-blue-600 border-blue-600 bg-gradient-to-t from-blue-600 via-blue-500 to-blue-700"
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                    )}
                    <span className="relative z-10">Monthly Billing</span>
                </button>

                <button
                    onClick={() => handleSwitch("1")}
                    className={cn(
                        "relative z-10 w-fit cursor-pointer h-10 flex-shrink-0 rounded-lg sm:px-4 px-3 sm:py-2 py-1 font-medium transition-colors text-sm",
                        selected === "1"
                            ? "text-white"
                            : "text-muted-foreground hover:text-black",
                    )}
                >
                    {selected === "1" && (
                        <motion.span
                            layoutId={"switch"}
                            className="absolute top-0 left-0  h-10 w-full rounded-lg border-2 shadow-sm shadow-blue-600 border-blue-600 bg-gradient-to-t from-blue-600 via-blue-500 to-blue-700"
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                        Yearly Billing
                        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600">
                            Save 20%
                        </span>
                    </span>
                </button>
            </div>
        </div>
    );
};

export default function PricingSection5() {
    const [isYearly, setIsYearly] = useState(false);
    const pricingRef = useRef<HTMLDivElement>(null);

    const togglePricingPeriod = (value: string) =>
        setIsYearly(Number.parseInt(value) === 1);

    return (
        <div
            className="px-4 pt-10 pb-10 max-w-5xl mx-auto relative"
            ref={pricingRef}
        >
            <article className="text-left mb-6 space-y-2 max-w-xl">
                <h2 className="md:text-4xl text-2xl capitalize font-medium text-gray-900 mb-2">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        We've got a plan that's perfect for you
                    </motion.div>
                </h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="md:text-sm text-xs text-gray-600 w-full"
                >
                    Trusted by millions, We help teams all around the world, Explore which
                    option is right for you.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <PricingSwitch onSwitch={togglePricingPeriod} className="w-fit mt-4" />
                </motion.div>
            </article>

            <div className="grid md:grid-cols-3 gap-4 py-4">
                {plans.map((plan, index) => (
                    <motion.div
                        key={plan.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                    >
                        <Card
                            className={`relative border border-neutral-200 ${plan.popular
                                ? "ring-1 ring-blue-600 bg-blue-50/30"
                                : "bg-white "
                                }`}
                        >
                            <CardHeader className="text-left p-4 pb-2">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {plan.name} Plan
                                    </h3>
                                    {plan.popular && (
                                        <div className="">
                                            <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-[10px] font-medium">
                                                Popular
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-gray-600 mb-2 min-h-[2.5em]">
                                    {plan.description}
                                </p>
                                <div className="flex items-baseline">
                                    <span className="text-3xl font-semibold text-gray-900">
                                        $
                                        {isYearly ? plan.yearlyPrice : plan.price}
                                    </span>
                                    <span className="text-gray-600 ml-1 text-sm">
                                        /{isYearly ? "year" : "month"}
                                    </span>
                                </div>
                            </CardHeader>

                            <CardContent className="p-4 pt-0">
                                <button
                                    className={`w-full mb-3 p-2 text-sm rounded-lg font-medium transition-all ${plan.popular
                                        ? "bg-gradient-to-t from-blue-600 to-blue-500 shadow-md shadow-blue-500/20 border border-blue-400 text-white hover:opacity-90"
                                        : plan.buttonVariant === "outline"
                                            ? "bg-white border border-neutral-300 text-neutral-900 hover:bg-neutral-50"
                                            : ""
                                        }`}
                                >
                                    {plan.buttonText}
                                </button>


                                <div className="space-y-2 pt-3 border-t border-neutral-200">
                                    <h2 className="text-xs font-semibold uppercase text-gray-900 mb-2">
                                        Features
                                    </h2>
                                    <h4 className="font-medium text-xs text-gray-900 mb-2">
                                        {plan.includes[0]}
                                    </h4>
                                    <ul className="space-y-1.5 ">
                                        {plan.includes.slice(1).map((feature, featureIndex) => (
                                            <li key={featureIndex} className="flex items-start">
                                                <span className="h-4 w-4 bg-blue-50 border border-blue-200 rounded-full grid place-content-center mt-0.5 mr-2 flex-shrink-0">
                                                    <CheckCheck className="h-2.5 w-2.5 text-blue-600" />
                                                </span>
                                                <span className="text-xs text-gray-600 leading-tight">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
