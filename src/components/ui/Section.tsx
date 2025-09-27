import React from 'react';
import { motion } from 'framer-motion';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  background?: 'white' | 'gray' | 'brand';
}

const Section: React.FC<SectionProps> = ({
  children,
  className = '',
  id,
  background = 'white'
}) => {
  const backgroundClasses = {
    white: 'bg-gradient-to-b from-light-blue to-white',
    gray: 'bg-gradient-to-b from-white to-light-blue', 
    brand: 'bg-gradient-to-b from-white to-light-blue'
  };

  return (
    <motion.section
      id={id}
      className={`py-16 lg:py-24 ${backgroundClasses[background]} ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </motion.section>
  );
};

export default Section;
