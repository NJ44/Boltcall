
import React, { useRef } from 'react';
import { motion } from 'framer-motion';

function Feature() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const card = cardRefs.current[index];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Greatly reduce tilt for cards 0 (Instant Response) and 3 (Real-time Analytics)
    const tiltDivisor = (index === 0 || index === 3) ? 50 : 10;
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
              className="bg-muted rounded-xl lg:col-span-2 p-8 flex items-center shadow-xl h-64 transition-transform duration-300 ease-out cursor-pointer"
              style={{ transformStyle: 'preserve-3d' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-col text-left max-w-md">
                <h3 className="text-3xl font-semibold tracking-tight mb-3">Instant Response</h3>
                <p className="text-muted-foreground text-lg">
                  Respond to leads within seconds with AI-powered automation. Speed to lead is critical for conversion.
                </p>
              </div>
              <div className="flex-1"></div>
            </motion.div>
            
            {/* Box Card - Text on Top */}
            <motion.div 
              ref={(el) => { cardRefs.current[1] = el; }}
              onMouseMove={(e) => handleMouseMove(e, 1)}
              onMouseLeave={() => handleMouseLeave(1)}
              className="bg-muted rounded-xl p-8 flex flex-col shadow-xl h-64 transition-transform duration-300 ease-out cursor-pointer"
              style={{ transformStyle: 'preserve-3d' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-col text-left">
                <h3 className="text-2xl font-semibold tracking-tight mb-3">AI Receptionist</h3>
                <p className="text-muted-foreground text-base">
                  24/7 voice AI that answers calls, qualifies leads, and books appointments automatically.
                </p>
              </div>
              <div className="flex-1"></div>
            </motion.div>

            {/* Box Card - Text on Top */}
            <motion.div 
              ref={(el) => { cardRefs.current[2] = el; }}
              onMouseMove={(e) => handleMouseMove(e, 2)}
              onMouseLeave={() => handleMouseLeave(2)}
              className="bg-muted rounded-xl p-8 flex flex-col shadow-xl h-64 transition-transform duration-300 ease-out cursor-pointer"
              style={{ transformStyle: 'preserve-3d' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-col text-left">
                <h3 className="text-2xl font-semibold tracking-tight mb-3">SMS Automation</h3>
                <p className="text-muted-foreground text-base">
                  Automated SMS follow-ups and WhatsApp booking ensure you stay connected with leads.
                </p>
              </div>
              <div className="flex-1"></div>
            </motion.div>
            
            {/* Wide Card - Text on Left */}
            <motion.div 
              ref={(el) => { cardRefs.current[3] = el; }}
              onMouseMove={(e) => handleMouseMove(e, 3)}
              onMouseLeave={() => handleMouseLeave(3)}
              className="bg-muted rounded-xl lg:col-span-2 p-8 flex items-center shadow-xl h-64 transition-transform duration-300 ease-out cursor-pointer"
              style={{ transformStyle: 'preserve-3d' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-col text-left max-w-md">
                <h3 className="text-3xl font-semibold tracking-tight mb-3">Real-time Analytics</h3>
                <p className="text-muted-foreground text-lg">
                  Track response times, booked jobs, missed leads, and call transcripts all in one powerful dashboard.
                </p>
              </div>
              <div className="flex-1"></div>
            </motion.div>
      </div>
    </div>
  );
}

export { Feature };

