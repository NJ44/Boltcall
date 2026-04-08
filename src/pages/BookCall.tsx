import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Sparkles, Clock3, PhoneCall } from 'lucide-react';
import { Link } from 'react-router-dom';

const CAL_BOOKING_URL = 'https://cal.com/boltcall';

const BookCall: React.FC = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-blue-500/35 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-cyan-400/25 blur-3xl" />

      <main className="relative mx-auto flex min-h-screen max-w-6xl items-center px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
              <Sparkles className="h-4 w-4" />
              Priority strategy session
            </div>

            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              Book a Call and Plan Your
              <span className="block bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
                AI Growth System
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base text-slate-300 sm:text-lg">
              In 15 minutes, we will map your lead flow, identify missed revenue, and show you exactly how Boltcall can automate replies, bookings, and follow-ups for your business.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={CAL_BOOKING_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow-xl shadow-blue-500/25 transition hover:scale-[1.02]"
              >
                Open Live Calendar
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Back to Pricing
              </Link>
            </div>
          </motion.section>

          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-3xl border border-white/15 bg-white/[0.06] p-6 shadow-2xl shadow-black/40 backdrop-blur-xl"
          >
            <h2 className="text-2xl font-bold">What happens on the call</h2>
            <ul className="mt-5 space-y-4 text-sm text-slate-200">
              <li className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-4 w-4 text-cyan-300" />
                <span>Choose a time that fits your team schedule.</span>
              </li>
              <li className="flex items-start gap-3">
                <PhoneCall className="mt-0.5 h-4 w-4 text-cyan-300" />
                <span>Quick strategy call focused on your current bottlenecks.</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock3 className="mt-0.5 h-4 w-4 text-cyan-300" />
                <span>Get a clear 30-day execution plan before we end the call.</span>
              </li>
            </ul>

            <div className="mt-7 rounded-2xl border border-cyan-200/20 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">Instant booking</p>
              <p className="mt-2 text-sm text-slate-200">
                Click below to lock your slot now.
              </p>
              <a
                href={CAL_BOOKING_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-blue-300 px-4 py-3 text-sm font-bold text-slate-900 transition hover:brightness-105"
              >
                Book on Cal.com
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </motion.aside>
        </div>
      </main>
    </div>
  );
};

export default BookCall;
