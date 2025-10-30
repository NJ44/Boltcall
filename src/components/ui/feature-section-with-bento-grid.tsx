
import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AnimatedCard,
  CardBody,
  CardDescription,
  CardTitle,
  CardVisual,
  Visual3,
} from './animated-card-chart';
import { Tilt } from './tilt';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Clock } from 'lucide-react';
import {
  AreaChart,
  Area,
  ResponsiveContainer
} from "recharts";
import CountUp from "react-countup";

function Feature() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isChartVisible, setIsChartVisible] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  const chartData = [
    { month: "Jan", value: 50 },
    { month: "Feb", value: 90 },
    { month: "Mar", value: 140 },
    { month: "Apr", value: 200 },
    { month: "May", value: 240 },
    { month: "Jun", value: 300 },
  ];

  // Reset chart animation when component mounts
  useEffect(() => {
    setIsChartVisible(false);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const card = cardRefs.current[index];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Greatly reduce tilt for cards 0 (Instant Response) and 2 (Real-time Analytics)
    const tiltDivisor = (index === 0 || index === 2) ? 50 : 10;
    const rotateX = (y - centerY) / tiltDivisor;
    const rotateY = (centerX - x) / tiltDivisor;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
  };

  const handleMouseLeave = (index: number) => {
    const card = cardRefs.current[index];
    if (!card) return;
    
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl ml-8">
            {/* Wide Card - Text on Left */}
            <motion.div 
              ref={(el) => { cardRefs.current[0] = el; }}
              onMouseMove={(e) => handleMouseMove(e, 0)}
              onMouseLeave={() => handleMouseLeave(0)}
              className="bg-muted rounded-xl lg:col-span-2 p-6 flex items-center shadow-2xl h-64 transition-transform duration-300 ease-out cursor-pointer"
              style={{ transformStyle: 'preserve-3d' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              onAnimationStart={() => {
                // Start chart animation when card starts fading in
                setTimeout(() => {
                  setIsChartVisible(true);
                }, 100);
              }}
            >
              {/* Left side - Text content */}
              <div className="flex flex-col text-left max-w-xs">
                <h3 className="text-2xl font-semibold tracking-tight mb-2 text-black">Increased closing rates</h3>
                <p className="text-muted-foreground text-base mb-4">
                  Answering a lead within 60 seconds or less makes you 391% more likely to close the deal. Speed is everything in lead conversion.
                </p>
              </div>

              {/* Right side - Chart */}
              <div className="flex-1 flex items-center justify-center ml-6">
                <div ref={chartRef} className="relative w-full h-48 bg-muted rounded-xl overflow-hidden">
                  {/* Chart */}
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={isChartVisible ? chartData : []}>
                      <defs>
                        <linearGradient id="ruixenBlue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        fill="url(#ruixenBlue)"
                        animationDuration={3000}
                        animationEasing="ease-in-out"
                        isAnimationActive={isChartVisible}
                      />
                    </AreaChart>
                  </ResponsiveContainer>

                  {/* Overlay Hero Number */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                    <div className="px-4 py-2 rounded-lg">
                      <h3 className="text-4xl font-extrabold text-gray-900 drop-shadow-md">
                        {isChartVisible ? <CountUp end={391} duration={5} /> : '0'}%
                      </h3>
                      <p className="text-gray-500 text-sm">Sales conversions</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Animated Card Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <Tilt
                rotationFactor={15}
                isRevese
                springOptions={{
                  stiffness: 26.7,
                  damping: 4.1,
                  mass: 0.2,
                }}
                className="rounded-xl shadow-2xl hover:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] transition-shadow duration-300"
              >
                <AnimatedCard className="shadow-xl">
                  <CardVisual>
                    <Visual3 mainColor="#3b82f6" secondaryColor="#06b6d4" />
                  </CardVisual>
                  <CardBody>
                    <CardTitle>Increased Revenue</CardTitle>
                    <CardDescription>
                      Faster responses capture more opportunities, boosting conversions and revenue.
                    </CardDescription>
                  </CardBody>
                </AnimatedCard>
              </Tilt>
            </motion.div>

            {/* Box Card - Text on Top */}
            <motion.div 
              ref={(el) => { cardRefs.current[1] = el; }}
              onMouseMove={(e) => handleMouseMove(e, 1)}
              onMouseLeave={() => handleMouseLeave(1)}
              className="bg-muted rounded-xl p-6 flex flex-col shadow-2xl h-[235px] transition-transform duration-300 ease-out cursor-pointer -mt-[42px] relative"
              style={{ transformStyle: 'preserve-3d' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              {/* Background Clock Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Clock className="w-52 h-52 text-gray-300 opacity-40" />
              </div>
              
              {/* Centered Content */}
              <div className="flex flex-col text-center items-center justify-center flex-1 relative z-10">
                <h3 className="text-3xl font-semibold tracking-tight mb-3 text-black">Save time</h3>
                <p className="text-muted-foreground text-base max-w-xs">
                  BoltCall handles the repetitive work so you can focus on growing your business.
                </p>
              </div>
            </motion.div>
            
            {/* Wide Card - Text on Left */}
            <motion.div 
              ref={(el) => { cardRefs.current[2] = el; }}
              onMouseMove={(e) => handleMouseMove(e, 2)}
              onMouseLeave={() => handleMouseLeave(2)}
              className="bg-muted rounded-xl lg:col-span-2 p-6 flex items-center shadow-2xl h-48 transition-transform duration-300 ease-out cursor-pointer"
              style={{ transformStyle: 'preserve-3d' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-col text-left max-w-sm">
                <h3 className="text-2xl font-semibold tracking-tight mb-2 text-black">Customer satisfaction</h3>
                <p className="text-muted-foreground text-base">
                  Deliver exceptional customer experiences with instant responses and personalized interactions that build trust and loyalty.
                </p>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="w-48 h-48">
                  <DotLottieReact
                    src="/costumer_statisfication.lottie"
                    loop
                    autoplay
                  />
                </div>
              </div>
            </motion.div>
      </div>
    </div>
  );
}

export { Feature };

