import React from 'react';
import { useNavigate } from 'react-router-dom';
import Section from './ui/Section';
import { Users, Phone, Calendar, LucideIcon } from 'lucide-react';

export interface FinalCTAProps {
  headline?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
  icons?: [LucideIcon, LucideIcon, LucideIcon];
}

// ── Presets for different page types ────────────────────────────────────────
export const CALCULATOR_CTA: FinalCTAProps = {
  headline: 'Stop Losing Revenue to Missed Calls.',
  description: 'See how much you're leaving on the table. Set up your AI receptionist in 5 minutes — it's free.',
  buttonText: 'Start the free setup',
  buttonHref: '/signup',
};

export const HOW_TO_CTA: FinalCTAProps = {
  headline: 'See It Working in 5 Minutes.',
  description: 'Set up your AI receptionist now. It answers calls, books appointments, and follows up — automatically.',
  buttonText: 'Try it free',
  buttonHref: '/signup',
};

export const COMPARISON_CTA: FinalCTAProps = {
  headline: 'Ready to Switch?',
  description: 'Try Boltcall free — no contract, no commitment. See the difference in your first week.',
  buttonText: 'Start free',
  buttonHref: '/signup',
};

export const BLOG_CTA: FinalCTAProps = {
  headline: 'Put This Into Practice Today.',
  description: 'Boltcall handles calls, texts, and bookings for you — 24/7. Free to set up, no contract.',
  buttonText: 'Get started free',
  buttonHref: '/signup',
};

const FinalCTA: React.FC<FinalCTAProps> = ({
  headline = 'Fast. Simple. Scalable.',
  description = 'Get your helper ready in 5 minutes. It is free. Connect it to your phone, website, and messages.',
  buttonText = 'Start the free setup',
  buttonHref = '/signup',
  icons,
}) => {
  const navigate = useNavigate();
  const [Icon1, Icon2, Icon3] = icons || [Users, Phone, Calendar];

  return (
    <Section id="contact" background="white">
      <div className="max-w-4xl mx-auto py-20">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-8 w-full max-w-[800px] group hover:bg-gray-50 transition duration-500 hover:duration-200">
            <div className="flex justify-center isolate">
              <div className="bg-white size-12 grid place-items-center rounded-xl relative left-2.5 top-1.5 -rotate-6 shadow-lg ring-1 ring-gray-200 group-hover:-translate-x-5 group-hover:-rotate-12 group-hover:-translate-y-0.5 transition duration-500 group-hover:duration-200">
                <Icon1 className="w-5 h-5 text-blue-500" strokeWidth={2.5} />
              </div>
              <div className="bg-white size-12 grid place-items-center rounded-xl relative z-10 shadow-lg ring-1 ring-gray-200 group-hover:-translate-y-0.5 transition duration-500 group-hover:duration-200">
                <Icon2 className="w-5 h-5 text-blue-500" strokeWidth={2.5} />
              </div>
              <div className="bg-white size-12 grid place-items-center rounded-xl relative right-2.5 top-1.5 rotate-6 shadow-lg ring-1 ring-gray-200 group-hover:translate-x-5 group-hover:rotate-12 group-hover:-translate-y-0.5 transition duration-500 group-hover:duration-200">
                <Icon3 className="w-5 h-5 text-blue-500" strokeWidth={2.5} />
              </div>
            </div>
            <h2 className="text-gray-900 font-medium mt-4 text-2xl md:text-4xl">{headline}</h2>
            <p className="text-base text-gray-600 mt-2 whitespace-pre-line">{description}</p>
            <button
              onClick={() => navigate(buttonHref!)}
              className="mt-4 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 hover:text-gray-900 h-10 px-4 py-2 shadow-sm active:shadow-none"
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default FinalCTA;
