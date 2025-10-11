import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  background?: 'white' | 'gray' | 'brand';
  roundedTop?: boolean;
  style?: React.CSSProperties;
}

const Section: React.FC<SectionProps> = ({
  children,
  className = '',
  id,
  background = 'white',
  roundedTop = false,
  style
}) => {
  const backgroundClasses = {
    white: 'bg-gradient-to-b from-light-blue to-white',
    gray: 'bg-gradient-to-b from-white to-light-blue', 
    brand: 'bg-gradient-to-b from-white to-light-blue'
  };

  return (
    <section
      id={id}
      className={`py-16 lg:py-24 ${backgroundClasses[background]} ${roundedTop ? 'rounded-t-[80px]' : ''} ${className}`}
      style={style}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
};

export default Section;
