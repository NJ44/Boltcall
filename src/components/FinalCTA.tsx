import React from 'react';
import { useNavigate } from 'react-router-dom';
import Section from './ui/Section';
import { EmptyState } from './ui/empty-state';
import { Users, Phone, Calendar } from 'lucide-react';

const FinalCTA: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Section id="contact" background="white">
      <div className="max-w-4xl mx-auto py-20">
        <div className="flex flex-col items-center justify-center text-center">
          <EmptyState
            title="Fast. Simple. Scalable."
            description="Launch an AI agent in 5 minutes at no cost. Connect it to all your business channels."
            icons={[Users, Phone, Calendar]}
            action={{
              label: "Start the free setup",
              onClick: () => navigate('/setup')
            }}
          />
        </div>
      </div>
    </Section>
  );
};

export default FinalCTA;
