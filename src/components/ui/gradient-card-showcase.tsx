import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface Card {
  title: string;
  desc: string;
  gradientFrom: string;
  gradientTo: string;
  href?: string;
}

interface GradientCardShowcaseProps {
  cards?: Card[];
  showLinks?: boolean;
}

const defaultCards: Card[] = [
  {
    title: 'Level 1',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    gradientFrom: '#3b82f6',
    gradientTo: '#2563eb',
  },
  {
    title: 'Level 2',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    gradientFrom: '#2563eb',
    gradientTo: '#1e40af',
  },
  {
    title: 'Level 3',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    gradientFrom: '#1e40af',
    gradientTo: '#6b21a8',
  },
];

export default function GradientCardShowcase({ cards = defaultCards, showLinks = false }: GradientCardShowcaseProps) {
  return (
    <>
      <div className="flex justify-center items-center flex-nowrap gap-16 py-10 min-h-[600px]">
        {cards.map(({ title, gradientFrom, gradientTo, href }, idx) => (
          <div
            key={idx}
            className="group relative w-[320px] h-[400px] flex-shrink-0 transition-all duration-500"
          >
            {/* Skewed gradient panels */}
            <span
              className="absolute top-0 left-[50px] w-1/2 h-full rounded-lg transform skew-x-[15deg] transition-all duration-500 group-hover:skew-x-0 group-hover:left-[20px] group-hover:w-[calc(100%-90px)]"
              style={{
                background: `linear-gradient(315deg, ${gradientFrom}, ${gradientTo})`,
              }}
            />
            <span
              className="absolute top-0 left-[50px] w-1/2 h-full rounded-lg transform skew-x-[15deg] blur-[30px] transition-all duration-500 group-hover:skew-x-0 group-hover:left-[20px] group-hover:w-[calc(100%-90px)]"
              style={{
                background: `linear-gradient(315deg, ${gradientFrom}, ${gradientTo})`,
              }}
            />

            {/* Animated blurs */}
            <span className="pointer-events-none absolute inset-0 z-10">
              <span className="absolute top-0 left-0 w-0 h-0 rounded-lg opacity-0 bg-[rgba(255,255,255,0.1)] backdrop-blur-[10px] shadow-[0_5px_15px_rgba(0,0,0,0.08)] transition-all duration-100 animate-blob group-hover:top-[-50px] group-hover:left-[50px] group-hover:w-[100px] group-hover:h-[100px] group-hover:opacity-100" />
              <span className="absolute bottom-0 right-0 w-0 h-0 rounded-lg opacity-0 bg-[rgba(255,255,255,0.1)] backdrop-blur-[10px] shadow-[0_5px_15px_rgba(0,0,0,0.08)] transition-all duration-500 animate-blob animation-delay-1000 group-hover:bottom-[-50px] group-hover:right-[50px] group-hover:w-[100px] group-hover:h-[100px] group-hover:opacity-100" />
            </span>

            {/* Content */}
            <div className="relative z-20 left-0 p-[20px_40px] bg-[rgba(255,255,255,0.05)] backdrop-blur-[10px] shadow-lg rounded-lg text-white transition-all duration-500 group-hover:left-[-25px] group-hover:p-[60px_40px]">
              <div className="text-3xl font-semibold text-white/80 mb-3 uppercase">Level {idx + 1}</div>
              <h2 className="text-2xl mb-4 font-bold text-white">{title}</h2>
              {showLinks && href ? (
                <Link
                  to={href}
                  className="inline-flex items-center gap-2 text-lg font-bold text-white bg-white/20 px-3 py-2 rounded hover:bg-white/30 hover:border hover:border-white/40 hover:shadow-md transition-colors border border-white/20"
                >
                  Get started <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-lg font-bold text-white bg-white/20 px-3 py-2 rounded hover:bg-white/30 hover:border hover:border-white/40 hover:shadow-md transition-colors border border-white/20"
                >
                  Get started <ArrowRight className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Tailwind custom utilities for animation and shadows */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translateY(10px); }
          50% { transform: translate(-10px); }
        }
        .animate-blob { animation: blob 2s ease-in-out infinite; }
        .animation-delay-1000 { animation-delay: -1s; }
      `}</style>
    </>
  );
}

