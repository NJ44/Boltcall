import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Facebook, Share2, Check } from 'lucide-react';

const GiveawayPage: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

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
    <div className="min-h-screen bg-gray-100">
      <header className="w-full py-8">
        <div className="max-w-4xl mx-auto px-4 flex justify-center">
          <Link to="/" className="block">
            <img src="/boltcall_full_logo.png" alt="Boltcall" className="h-16 w-auto" />
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl overflow-hidden shadow-xl">
          {/* Left: dark panel */}
          <div className="bg-gray-900 text-white p-10 md:p-12 flex flex-col justify-between">
            <div>
              <h2 className="uppercase tracking-widest text-sm text-white/70">Enter for a</h2>
              <h1 className="mt-1 text-3xl md:text-4xl font-extrabold">
                Chance to win <span className="text-brand-blue">Dinner for Two</span>.
              </h1>

              <p className="mt-10 text-white/80 text-sm leading-6 max-w-md">
                We’re rewarding one lucky winner with a five-course feast. Enter your email before the deadline. Signing up also gives you early access to Boltcall news, special events, and exclusive discounts.
              </p>

              {/* Prize highlights */}
              <ul className="mt-6 space-y-3 text-white/90 text-sm">
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 mt-0.5 text-brand-blue" />
                  <span>Five-course ramen feast for two</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 mt-0.5 text-brand-blue" />
                  <span>Appetizers and tempura included</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 mt-0.5 text-brand-blue" />
                  <span>Early access to special events</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 mt-0.5 text-brand-blue" />
                  <span>Exclusive discounts for subscribers</span>
                </li>
              </ul>
            </div>

            <p className="mt-6 text-xs text-white/50">Disclaimer: Terms apply. Any taxes or fees are the responsibility of the winner.</p>
          </div>

          {/* Right: brand panel */}
          <div className="bg-gradient-to-b from-brand-blue to-brand-sky text-white p-10 md:p-12">
            <div className="text-center">
              <p className="uppercase tracking-widest text-xs text-white/80">Contest ends in:</p>
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
                Enter Contest
              </a>

              <div className="my-8 h-px w-40 bg-white/30 mx-auto" />

              <div className="text-sm opacity-90">Like us on Facebook so you don’t miss out on future contests.</div>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-2 bg-[#1877F2] text-white px-4 py-2 rounded-md shadow hover:opacity-95"
              >
                <Facebook className="w-4 h-4" /> Like
              </a>

              <div className="my-8 h-px w-40 bg-white/30 mx-auto" />

              <div className="text-sm opacity-90">Share it with a friend—if either of you wins, you both celebrate the prize together!</div>
              <div className="mt-4 flex items-center justify-center gap-4">
                <a href="https://twitter.com/intent/tweet" target="_blank" rel="noreferrer" className="bg-white/20 hover:bg-white/25 px-3 py-2 rounded-md">
                  <Share2 className="w-4 h-4" />
                </a>
              </div>

              <p className="mt-10 text-xs text-white/80">©{new Date().getFullYear()} Boltcall</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GiveawayPage;
