import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, BarChart3, Clock, Phone, Zap, FileText, Users } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { updateMetaDescription } from '../lib/utils';

const WEBHOOK_URL = 'https://n8n.srv974118.hstgr.cloud/webhook/solar-benchmark-2026';

const FINDINGS = [
  { stat: '~8%', label: 'of solar companies respond in under 5 minutes' },
  { stat: '22%', label: 'never respond to a web form lead at all' },
  { stat: '4.5 hrs', label: 'average response time across 500 companies' },
  { stat: '6%', label: 'have any automated after-hours response' },
];

const WHATS_INSIDE = [
  'Full A–F grade breakdown by state and region',
  'Response time distribution histogram (0–72 hours)',
  'After-hours black hole data — what happens to 8:30pm leads',
  'Phone vs. form — where companies fail most',
  'The top 10% pattern analysis — what fast responders do differently',
  'The CAC math — how slow response translates to wasted ad spend',
  'UK vs. US comparison (100 UK companies included)',
  'Full appendix: state-by-state rankings table',
];

const SolarBenchmark2026: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'The 2026 Solar Speed-to-Lead Benchmark Report | Boltcall';
    updateMetaDescription(
      'We mystery-shopped 500 solar installers on lead response speed. Get the full benchmark report — industry grades, state rankings, and what the top 10% do differently.'
    );

    const schema = document.createElement('script');
    schema.type = 'application/ld+json';
    schema.id = 'benchmark-schema';
    schema.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Report',
      'name': 'The 2026 Solar Speed-to-Lead Benchmark',
      'description': 'We mystery-shopped 500 solar installers on lead response speed. The first industry benchmark of its kind.',
      'url': 'https://boltcall.org/solar-benchmark-2026',
      'author': { '@type': 'Organization', 'name': 'Boltcall', 'url': 'https://boltcall.org' },
      'datePublished': '2026',
      'inLanguage': 'en',
    });
    document.head.appendChild(schema);
    return () => { document.getElementById('benchmark-schema')?.remove(); };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, company, phone, source: 'solar-benchmark-2026' }),
      });
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again or email noamyakoby6@gmail.com.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <main>
        {/* Hero */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center">
              {/* Left: copy */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 mb-6">
                  Industry First — 2026
                </span>
                <h1 className="text-3xl md:text-5xl font-bold text-[#0B1220] mb-6 leading-tight">
                  The 2026 Solar<br />Speed-to-Lead<br />Benchmark
                </h1>
                <p className="text-lg text-slate-600 mb-8">
                  We submitted real inquiries to 500 solar installers across the US and UK — and measured exactly how fast they responded. The results are alarming.
                </p>

                {/* Expected findings */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {FINDINGS.map((f, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-4">
                      <p className="text-2xl font-bold text-[#0B1220] mb-1">{f.stat}</p>
                      <p className="text-xs text-gray-500">{f.label}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>50-page PDF report · Free download · Instant delivery</span>
                </div>
              </motion.div>

              {/* Right: form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white rounded-2xl border border-gray-200 shadow-xl p-8"
              >
                {!submitted ? (
                  <>
                    <h2 className="text-xl font-bold text-[#0B1220] mb-2">Get the Full Report</h2>
                    <p className="text-sm text-gray-500 mb-6">Free. Instant PDF delivery. No credit card.</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
                        <input
                          type="text"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          required
                          placeholder="Alex Thompson"
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Work email</label>
                        <input
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          required
                          placeholder="alex@solarcompany.com"
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company name</label>
                        <input
                          type="text"
                          value={company}
                          onChange={e => setCompany(e.target.value)}
                          required
                          placeholder="Your Solar Company"
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          required
                          placeholder="+1 (555) 000-0000"
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                        />
                      </div>

                      {error && <p className="text-sm text-red-600">{error}</p>}

                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg px-6 py-4 shadow-[4px_4px_0px_0px_#000] border-2 border-black hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all duration-200"
                      >
                        {submitting ? 'Sending...' : (
                          <>Send Me the Report <ArrowRight className="w-4 h-4" /></>
                        )}
                      </button>
                      <p className="text-xs text-center text-gray-400">
                        Delivered immediately to your email. We may follow up about your company's score.
                      </p>
                    </form>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-4"
                  >
                    <CheckCircle className="w-14 h-14 text-emerald-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-[#0B1220] mb-2">You're in</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      The 2026 Solar Speed-to-Lead Benchmark is on its way to <strong>{email}</strong>.
                    </p>
                    <p className="text-xs text-gray-400">
                      Check your inbox (and spam folder if needed). While you wait:
                    </p>
                    <a
                      href="/solar-speed-score"
                      className="inline-flex items-center gap-2 mt-6 text-sm font-medium text-blue-600 hover:text-blue-700 underline"
                    >
                      See your company's speed score <ArrowRight className="w-4 h-4" />
                    </a>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* What's inside */}
        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl md:text-4xl font-bold text-[#0B1220] mb-4">
                What's Inside the Report
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                50 pages of industry-first data on solar lead response speed — with rankings, benchmarks, and the fix.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {WHATS_INSIDE.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3 bg-white rounded-xl border border-gray-200 p-4"
                >
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Methodology */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl md:text-4xl font-bold text-[#0B1220] mb-4">
                How We Ran the Audit
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Real mystery shopping. No scraped data. No estimates.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: <FileText className="w-6 h-6 text-blue-600" />,
                  title: 'Web Form Submission',
                  body: 'We submitted a real solar inquiry form to each company between 10am–2pm local time. We measured time to first response — whether SMS, email, or phone call.',
                },
                {
                  icon: <Phone className="w-6 h-6 text-blue-600" />,
                  title: 'Live Phone Test',
                  body: 'We called every company\'s main listed number on a Tuesday or Wednesday at 11am–1pm. We scored each as: live answer, voicemail, or no answer.',
                },
                {
                  icon: <Clock className="w-6 h-6 text-blue-600" />,
                  title: 'After-Hours Subset',
                  body: '50 companies received a form submission at 8:30pm local time. We measured whether they responded before the next business day — and what method they used.',
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-[#0B1220] mb-3">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.body}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mt-8 bg-gray-50 rounded-xl border border-gray-200 p-6 max-w-3xl mx-auto text-center"
            >
              <div className="flex items-center justify-center gap-2 mb-3">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-[#0B1220]">500 Companies Audited</span>
              </div>
              <p className="text-sm text-gray-600">
                400 US installers across 14 states + 100 UK installers across 6 regions. All residential solar — no utility-scale, no lead aggregators.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Who published */}
        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mx-auto mb-6">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#0B1220] mb-4">
                Published by Boltcall
              </h2>
              <p className="text-gray-600 text-base mb-6">
                Boltcall is a speed-to-lead platform built specifically for solar installers and other home service businesses. We built this report because the data didn't exist — and because every solar company deserves to know exactly where they stand.
              </p>
              <div className="flex items-center justify-center gap-3">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-500">boltcall.org</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-16" />
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
              Get the Full Benchmark Report — Free
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              500 companies audited. Industry first. Download instantly.
            </p>
            <a
              href="#"
              onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-8 py-4 shadow-[4px_4px_0px_0px_#000] border-2 border-black hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all duration-200"
            >
              Get the Report <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SolarBenchmark2026;
