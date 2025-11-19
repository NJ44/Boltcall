import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Share2, Check } from 'lucide-react';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { motion } from 'framer-motion';

const GiveawayPage: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://boltcall.com/giveaway';
  const shareText = encodeURIComponent("I'm entering Boltcall's giveaway — if either of us wins, we both win! Join here:");
  const encodedUrl = encodeURIComponent(shareUrl);
  const twitterHref = `https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`;
  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

  useEffect(() => {
    const endsAt = new Date();
    endsAt.setDate(endsAt.getDate() + 14); // 14 days from now
    const target = endsAt.getTime();

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(target - now, 0);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AuroraBackground className="min-h-screen h-auto items-start justify-start bg-white">
      <header className="w-full py-8">
        <div className="max-w-4xl mx-auto px-4 flex justify-center">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: 'easeOut' }}>
            <Link to="/" className="block">
              <img src="/boltcall_full_logo.png" alt="Boltcall" className="h-16 w-auto" />
            </Link>
          </motion.div>
        </div>
      </header>

        <motion.div className="max-w-4xl mx-auto px-4 pb-16" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: 'easeOut', delay: 0.15 }}>
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl overflow-hidden shadow-[0_35px_60px_-12px_rgba(0,0,0,0.6)]">
          {/* Left: dark panel */}
          <div className="bg-gray-900 text-white p-10 md:p-12 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white">
                <span className="text-white">3 Months</span> <span className="text-blue-500">Pro Plan</span> <span className="text-white">+</span> <span className="text-blue-500">smart website</span> <span className="text-white">package</span>
              </h1>

              <p className="mt-10 text-white text-base md:text-lg leading-6 max-w-md">
                We're rewarding one lucky winner with <span className="text-blue-500">3 months</span> of our <span className="text-blue-500">Pro plan</span> plus a complete <span className="text-blue-500">website package</span>.
              </p>

              {/* Prize highlights */}
              <ul className="mt-6 space-y-3 text-white/90 text-sm">
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 mt-0.5 text-brand-blue" />
                  <span>AI Receptionist</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 mt-0.5 text-brand-blue" />
                  <span>SMS messaging</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 mt-0.5 text-brand-blue" />
                  <span>Instant form replies</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 mt-0.5 text-brand-blue" />
                  <span>Instant follow-ups</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 mt-0.5 text-brand-blue" />
                  <span>Plus more bonuses</span>
                </li>
              </ul>
            </div>

            {/* Disclaimer removed per request */}
          </div>

          {/* Right: brand panel */}
          <div className="bg-gradient-to-b from-brand-blue to-brand-sky text-white p-10 md:p-12">
            <div className="text-center">
              <p className="uppercase tracking-widest text-xs text-white/80">Giveaway ends in:</p>
              <div className="mt-4 flex items-center justify-center gap-6">
                {[
                  { label: 'days', value: timeLeft.days },
                  { label: 'hours', value: timeLeft.hours },
                  { label: 'mins', value: timeLeft.minutes },
                  { label: 'secs', value: timeLeft.seconds },
                ].map((t) => (
                  <div key={t.label} className="text-center">
                    <div className="text-3xl font-extrabold leading-none">{t.value}</div>
                    <div className="text-[10px] uppercase tracking-widest opacity-80">{t.label}</div>
                  </div>
                ))}
              </div>

              <a
                href="https://form.typeform.com/to/tmB4QfSf"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center justify-center px-6 py-3 bg-white text-brand-blue font-semibold rounded-md shadow hover:bg-gray-50 transition-colors"
              >
                Enter Giveaway
              </a>

              <div className="my-8 h-px w-40 bg-white/30 mx-auto" />

              <div className="text-sm md:text-base opacity-90">Share the giveaway on your socials for a higher chance to win!</div>
              <div className="mt-4 flex items-center justify-center gap-2.5 px-2">
                <a
                  href={twitterHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on X (Twitter)"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white hover:bg-white/20 transition"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="w-3.5 h-3.5" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.49 11.24H16.29l-5.486-7.163-6.272 7.163H1.223l7.73-8.833L.75 2.25h6.043l4.957 6.51 6.494-6.51zm-1.158 19.5h1.833L7.01 3.89H5.048l12.038 17.86z"/></svg>
                </a>
                <a
                  href={facebookHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on Facebook"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white hover:bg-white/20 transition"
                >
                  <Facebook className="w-3.5 h-3.5" />
                </a>
                <a
                  href={linkedinHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on LinkedIn"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white hover:bg-white/20 transition"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="w-3.5 h-3.5" fill="currentColor"><path d="M4.983 3.5C4.983 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.483 1.12 2.483 2.5zM.25 8.25h4.5v15.5H.25zM8.75 8.25h4.31v2.12h.06c.6-1.14 2.06-2.34 4.24-2.34 4.53 0 5.37 2.98 5.37 6.85v7.88h-4.5v-6.98c0-1.66-.03-3.8-2.31-3.8-2.31 0-2.67 1.8-2.67 3.66v7.12h-4.5z"/></svg>
                </a>
              </div>

              <div className="my-8 h-px w-40 bg-white/30 mx-auto" />

              <div className="text-sm opacity-90">Share it with a friend. if either of you wins, you both win the big prize!</div>
              <div className="mt-4 flex items-center justify-center gap-4">
                <a href="https://twitter.com/intent/tweet" target="_blank" rel="noopener noreferrer" className="bg-white/20 hover:bg-white/25 px-3 py-2 rounded-md">
                  <Share2 className="w-4 h-4" />
                </a>
              </div>

              <p className="mt-10 text-xs text-white/80">©{new Date().getFullYear()} Boltcall</p>
            </div>
          </div>
        </div>
        </motion.div>
    </AuroraBackground>
  );
};

export default GiveawayPage;
