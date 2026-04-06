import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ScrollingAnimation } from './ui/scrolling-animation';

const FreeSetup: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="hidden md:block">
      <ScrollingAnimation onNavigate={(href) => navigate(href)} />
    </section>
  );
};

export default FreeSetup;
