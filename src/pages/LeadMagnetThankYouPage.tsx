import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { updateMetaDescription } from '@/lib/utils';
import { CheckCircle2, ArrowRight, Calendar } from 'lucide-react';

const LeadMagnetThankYouPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Thank You | Boltcall';
    updateMetaDescription('Thanks for signing up. Check your email for your free guide from Boltcall.');
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e0e0e0] flex flex-col items-center justify-center px-6 py-16">
      <div className="max-w-lg mx-auto text-center flex flex-col items-center gap-8">
        <div className="w-20 h-20 rounded-full bg-brand-blue/20 flex items-center justify-center">
          <CheckCircle2 className="w-12 h-12 text-brand-blue" strokeWidth={2} />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-['Syncopate',sans-serif] tracking-tight">
          Thank you
        </h1>
        <p className="text-[#e0e0e0]/80 text-lg">
          Check your inbox for the guide. We’ve sent you everything you need to get started.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 h-12 px-8 bg-[#e0e0e0] text-[#0a0a0a] font-bold uppercase tracking-wider hover:bg-brand-blue hover:text-white hover:-translate-y-0.5 transition-all duration-300 clip-path-[polygon(0_0,100%_0,100%_70%,85%_100%,0_100%)]"
        >
          Back to Boltcall
          <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
        </Link>

        <div className="w-full pt-10 mt-10 border-t border-white/10">
          <p className="text-xs font-medium uppercase tracking-widest text-[#e0e0e0]/50 mb-3">
            Next step
          </p>
          <h2 className="text-xl font-semibold text-[#e0e0e0] mb-2">
            Book a free consultation call
          </h2>
          <p className="text-[#e0e0e0]/70 text-sm leading-relaxed max-w-md mx-auto mb-6">
            Discuss your goals with our team. No obligation—just a focused conversation to see how we can help you capture more leads and never miss a call.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 h-11 px-6 bg-brand-blue text-white font-semibold text-sm rounded-sm hover:bg-brand-blueDark hover:-translate-y-0.5 transition-all duration-200"
          >
            <Calendar className="w-4 h-4" strokeWidth={2.5} />
            Schedule free call
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LeadMagnetThankYouPage;
