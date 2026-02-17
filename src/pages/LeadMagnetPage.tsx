import React, { useEffect } from 'react';
import { HalideLanding } from '@/components/ui/halide-landing';
import { updateMetaDescription } from '@/lib/utils';
import { Mail, Sparkles } from 'lucide-react';

const LeadMagnetPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Lead Magnet | Boltcall';
    updateMetaDescription('Get exclusive insights and resources. Sign up for our lead magnet and explore depth with Boltcall.');
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e0e0e0]">
      {/* Hero: full-viewport Halide 3D parallax */}
      <section className="relative">
        <HalideLanding />
      </section>

      {/* Scroll anchor and lead capture section */}
      <section id="lead-form" className="relative z-20 min-h-screen bg-[#0a0a0a] border-t border-white/10">
        <div className="max-w-2xl mx-auto px-6 py-24 flex flex-col items-center gap-12">
          <div className="flex items-center gap-2 text-[#ff3c00]">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-mono uppercase tracking-wider">Exclusive Resource</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-center font-['Syncopate',sans-serif] tracking-tight">
            Get the full guide
          </h2>

          <form
            className="w-full flex flex-col sm:flex-row gap-3"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#e0e0e0]/50" />
              <input
                type="email"
                placeholder="Email"
                className="w-full h-12 pl-12 pr-4 bg-white/5 border border-white/10 rounded-none text-[#e0e0e0] placeholder:text-[#e0e0e0]/40 focus:outline-none focus:border-[#ff3c00] transition-colors"
              />
            </div>
            <button
              type="submit"
              className="h-12 px-8 bg-[#e0e0e0] text-[#0a0a0a] font-bold uppercase tracking-wider hover:bg-[#ff3c00] hover:-translate-y-0.5 transition-all duration-300 clip-path-[polygon(0_0,100%_0,100%_70%,85%_100%,0_100%)]"
            >
              Get guide
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default LeadMagnetPage;
