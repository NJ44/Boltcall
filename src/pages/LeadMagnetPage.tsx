import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HalideLanding } from '@/components/ui/halide-landing';
import { updateMetaDescription } from '@/lib/utils';
import { Mail, Sparkles, Loader2 } from 'lucide-react';

const LeadMagnetPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Lead Magnet | Boltcall';
    updateMetaDescription('Get exclusive insights and resources. Sign up for our lead magnet and explore depth with Boltcall.');
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      navigate('/lead-magnet/thank-you');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e0e0e0] min-h-[100dvh]">
      {/* Hero: full-viewport Halide 3D parallax */}
      <section className="relative">
        <HalideLanding />
      </section>

      {/* Scroll anchor and lead capture section — mobile-optimised */}
      <section id="lead-form" className="relative z-20 min-h-screen bg-[#0a0a0a] border-t border-white/10 min-h-[100dvh] pb-8">
        <div className="max-w-2xl mx-auto px-4 py-12 sm:px-6 sm:py-24 flex flex-col items-center gap-8 sm:gap-12">
          <div className="flex items-center gap-2 text-brand-blue">
            <Sparkles className="w-5 h-5 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-mono uppercase tracking-wider">Exclusive Resource</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center font-['Syncopate',sans-serif] tracking-tight px-1">
            Get the full guide
          </h2>

          <form
            className="w-full flex flex-col gap-3 sm:flex-row"
            onSubmit={handleSubmit}
          >
            <div className="relative flex-1 w-full min-w-0">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#e0e0e0]/50 pointer-events-none" />
              <input
                type="email"
                placeholder="Email"
                inputMode="email"
                autoComplete="email"
                className="w-full min-h-[44px] h-12 pl-12 pr-4 bg-white/5 border border-white/10 rounded-none text-white-smoke placeholder:text-[#e0e0e0]/40 focus:outline-none focus:border-brand-blue transition-colors text-base"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="min-h-[44px] h-12 px-8 bg-[#e0e0e0] text-[#0a0a0a] font-bold uppercase tracking-wider hover:bg-brand-blue hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 clip-path-[polygon(0_0,100%_0,100%_70%,85%_100%,0_100%)] disabled:opacity-80 disabled:pointer-events-none disabled:translate-y-0 flex items-center justify-center gap-2 min-w-[8rem] w-full sm:w-auto touch-manipulation"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden />
              ) : (
                'Get guide'
              )}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default LeadMagnetPage;
