import React from 'react';
import Section from './ui/Section';
import { EmptyState } from './ui/empty-state';
import { Users, Phone, Calendar } from 'lucide-react';

const FinalCTA: React.FC = () => {
  return (
    <Section id="contact" background="white">
      <div className="max-w-4xl mx-auto py-20">
        <div className="flex flex-col items-center justify-center text-center">
          <EmptyState
            title="Fast. Simple. Scalable."
            description="Create one ai agent free in 5 minutes, and assign to any of your business channels."
            icons={[Users, Phone, Calendar]}
            action={{
              label: "Start the free setup",
              onClick: () => console.log("Setup guide clicked")
            }}
          />
        </div>
      </div>
    </Section>
  );
};

export default FinalCTA;
