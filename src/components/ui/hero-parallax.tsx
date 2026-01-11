import React from "react";
import {
    motion,
    useScroll,
    useTransform,
    useSpring,
    MotionValue,
} from "framer-motion";
import { Link } from "react-router-dom";

export const HeroParallax = ({
    products,
    onCtaClick,
}: {
    products: {
        title: string;
        link: string;
        thumbnail: string;
    }[];
    onCtaClick?: () => void;
}) => {
    const firstRow = products.slice(0, 5);
    const secondRow = products.slice(5, 10);
    const thirdRow = products.slice(10, 15);
    const ref = React.useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

    const translateX = useSpring(
        useTransform(scrollYProgress, [0, 1], [0, 1000]),
        springConfig
    );
    const translateXReverse = useSpring(
        useTransform(scrollYProgress, [0, 1], [0, -1000]),
        springConfig
    );
    const rotateX = useSpring(
        useTransform(scrollYProgress, [0, 0.2], [15, 0]),
        springConfig
    );
    const opacity = useSpring(
        useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
        springConfig
    );
    const rotateZ = useSpring(
        useTransform(scrollYProgress, [0, 0.2], [20, 0]),
        springConfig
    );
    const translateY = useSpring(
        useTransform(scrollYProgress, [0, 0.2], [-500, 100]),
        springConfig
    );

    // Fade out the third row as we transition to the second stage
    const thirdRowOpacity = useSpring(
        useTransform(scrollYProgress, [0, 0.2], [1, 0]),
        springConfig
    );

    return (
        <div
            ref={ref}
            className="h-[250vh] py-40 overflow-hidden  antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
        >
            <HeroHeader onCtaClick={onCtaClick} />
            <motion.div
                style={{
                    rotateX,
                    rotateZ,
                    translateY,
                    opacity,
                }}
                className=""
            >
                <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
                    {firstRow.map((product) => (
                        <ProductCard
                            product={product}
                            translate={translateX}
                            key={product.title}
                        />
                    ))}
                </motion.div>
                <motion.div className="flex flex-row  mb-20 space-x-20 ">
                    {secondRow.map((product) => (
                        <ProductCard
                            product={product}
                            translate={translateXReverse}
                            key={product.title}
                        />
                    ))}
                </motion.div>
                <motion.div
                    style={{ opacity: thirdRowOpacity }}
                    className="flex flex-row-reverse space-x-reverse space-x-20"
                >
                    {thirdRow.map((product) => (
                        <ProductCard
                            product={product}
                            translate={translateX}
                            key={product.title}
                        />
                    ))}
                </motion.div>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="w-full py-40 flex flex-col items-center justify-center z-10 relative mt-auto bg-black"
            >
                <h2 className="text-4xl md:text-7xl font-bold text-white mb-12 text-center">Ready to get started?</h2>
                <button
                    onClick={onCtaClick}
                    className="inline-block px-8 py-4 bg-white text-black font-semibold text-xl rounded-full hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                    Get Your Free Website
                </button>
            </motion.div>
        </div >
    );
};

export const HeroHeader = ({ onCtaClick }: { onCtaClick?: () => void }) => {
    return (
        <div className="max-w-7xl relative mx-auto pt-0 pb-20 md:pb-40 px-4 w-full left-0 top-0 z-50 pointer-events-none">
            <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                className="text-2xl md:text-5xl font-bold text-white pointer-events-auto"
            >
                The Ultimate <br /> development studio
            </motion.h1>
            <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
                className="max-w-2xl text-sm md:text-base mt-8 text-neutral-200 pointer-events-auto"
            >
                We build beautiful products with the latest technologies and frameworks.
                We are a team of passionate developers and designers that love to build
                amazing products.
            </motion.p>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 1.0, ease: "easeOut" }}
                className="mt-8 pointer-events-auto"
            >
                <button
                    onClick={onCtaClick}
                    className="inline-block px-6 py-3 bg-white text-black font-semibold text-lg rounded-full hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                    Get Your Free Website
                </button>
            </motion.div>
        </div>
    );
};



export const ProductCard = ({
    product,
    translate,
}: {
    product: {
        title: string;
        link: string;
        thumbnail: string;
    };
    translate: MotionValue<number>;
}) => {
    const [imgSrc, setImgSrc] = React.useState(product.thumbnail);

    return (
        <motion.div
            style={{
                x: translate,
            }}
            whileHover={{
                y: -20,
            }}
            key={product.title}
            className="group/product h-48 w-[15rem] relative flex-shrink-0"
        >
            <Link
                to={product.link}
                className="block group-hover/product:shadow-2xl "
            >
                <img
                    src={imgSrc}
                    className="object-cover object-left-top absolute h-full w-full inset-0"
                    alt={product.title}
                    onError={() => setImgSrc("https://images.unsplash.com/photo-1531297422935-40280f35a96e?auto=format&fit=crop&q=80&w=240&h=192")}
                />
            </Link>

        </motion.div>
    );
};
