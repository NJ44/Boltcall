import { Zap, Cpu, Fingerprint, Pencil, Settings2, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { FeatureCard } from '@/components/ui/grid-feature-cards';

const features = [
    {
        title: 'Faaast',
        icon: Zap,
        description: 'Blazing fast load times with optimized assets and code.',
    },
    {
        title: 'Powerful',
        icon: Cpu,
        description: 'Built on modern frameworks that handle complexity with ease.',
    },
    {
        title: 'Security',
        icon: Fingerprint,
        description: 'Enterprise-grade security best practices out of the box.',
    },
    {
        title: 'Customization',
        icon: Pencil,
        description: 'Fully customizable components to match your unique brand.',
    },
    {
        title: 'Control',
        icon: Settings2,
        description: 'Complete control over your data and infrastructure.',
    },
    {
        title: 'Built for AI',
        icon: Sparkles,
        description: 'Ready-to-use integrations for the latest AI models.',
    },
];

export default function FreeWebsiteFeatures() {
    return (
        <section className="py-16 md:py-32 w-full bg-black">
            <div className="mx-auto w-full max-w-5xl space-y-8 px-4">
                <AnimatedContainer className="mx-auto max-w-3xl text-center">
                    <h2 className="text-3xl font-bold tracking-wide text-balance md:text-4xl lg:text-5xl xl:font-extrabold text-white">
                        Power. Speed. Control.
                    </h2>
                    <p className="text-neutral-400 mt-4 text-sm tracking-wide text-balance md:text-base">
                        Everything you need to build fast, secure, scalable apps.
                    </p>
                </AnimatedContainer>

                <AnimatedContainer
                    delay={0.4}
                    className="grid grid-cols-1 divide-x-0 divide-y-0 sm:grid-cols-2 md:grid-cols-3 gap-4"
                >
                    {features.map((feature, i) => (
                        <FeatureCard key={i} feature={feature} />
                    ))}
                </AnimatedContainer>
            </div>
        </section>
    );
}

type ViewAnimationProps = {
    delay?: number;
    className?: React.ComponentProps<typeof motion.div>['className'];
    children: React.ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
    const shouldReduceMotion = useReducedMotion();

    if (shouldReduceMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
            whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay, duration: 1.2, ease: "easeOut" }} // Slower animation as requested
            className={className}
        >
            {children}
        </motion.div>
    );
}
