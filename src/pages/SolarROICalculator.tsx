import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, DollarSign, AlertTriangle, Zap, Clock } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { updateMetaDescription } from '../lib/utils';

const RESPONSE_OPTIONS = [
  { label: 'Under 5 minutes', value: 5, penalty: 0.05, label_short: '<5 min' },
  { label: '5–30 minutes', value: 30, penalty: 0.18, label_short: '5–30 min' },
  { label: '30–60 minutes', value: 60, penalty: 0.26, label_short: '30–60 min' },
  { label: '1–4 hours', value: 240, penalty: 0.34, label_short: '1–4 hrs' },
  { label: '4–24 hours', value: 1440, penalty: 0.42, label_short: '4–24 hrs' },
  { label: 'Next day or longer', value: 9999, penalty: 0.52, label_short: 'Next day+' },
];

function fmt$(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${Math.round(n).toLocaleString()}`;
}

function fmtN(n: number) {
  return Math.round(n).toLocaleString();
}

const SolarROICalculator: React.FC = () => {
  const [monthlyLeads, setMonthlyLeads] = useState(80);
  const [closeRate, setCloseRate] = useState(15);
  const [contractValue, setContractValue] = useState(22000);
  const [responseIdx, setResponseIdx] = useState(3);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Solar Lead Response ROI Calculator | Boltcall';
    updateMetaDescription(
      'Free solar ROI calculator: see exactly how much revenue you lose every month because of slow lead response — and what 11-second response could recover.'
    );

    const schema = document.createElement('script');
    schema.type = 'application/ld+json';
    schema.id = 'solar-roi-calc-schema';
    schema.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Solar Lead Response ROI Calculator',
      'description': 'Calculate the revenue impact of slow lead response on solar installer businesses.',
      'url': 'https://boltcall.org/solar-roi-calculator',
      'applicationCategory': 'BusinessApplication',
      'operatingSystem': 'Web',
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    });
    document.head.appendChild(schema);
    return () => { document.getElementById('solar-roi-calc-schema')?.remove(); };
  }, []);

  const calc = useMemo(() => {
    const selected = RESPONSE_OPTIONS[responseIdx];
    const penalty = selected.penalty;
    const rate = closeRate / 100;

    const currentCloses = monthlyLeads * rate;
    const currentRevenue = currentCloses * contractValue;

    const recoverableLeads = monthlyLeads * penalty;
    const additionalCloses = recoverableLeads * rate * 0.65;
    const additionalRevenue = additionalCloses * contractValue;
    const annualUpside = additionalRevenue * 12;

    const leadCost = 350;
    const cacWasted = recoverableLeads * leadCost;
    const annualCacWasted = cacWasted * 12;

    const currentAnnual = currentRevenue * 12;
    const potentialAnnual = currentAnnual + annualUpside;

    const upliftPct = additionalRevenue > 0 ? Math.round((additionalRevenue / currentRevenue) * 100) : 0;

    return {
      currentCloses,
      currentRevenue,
      recoverableLeads,
      additionalCloses,
      additionalRevenue,
      annualUpside,
      cacWasted,
      annualCacWasted,
      currentAnnual,
      potentialAnnual,
      upliftPct,
    };
  }, [monthlyLeads, closeRate, contractValue, responseIdx]);

  const gradeFromPenalty = () => {
    const p = RESPONSE_OPTIONS[responseIdx].penalty;
    if (p <= 0.05) return { grade: 'A', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', label: 'Excellent' };
    if (p <= 0.18) return { grade: 'B', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', label: 'Good' };
    if (p <= 0.26) return { grade: 'C', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', label: 'Average' };
    if (p <= 0.34) return { grade: 'D', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', label: 'Below Average' };
    return { grade: 'F', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', label: 'Critical' };
  };

  const speedGrade = gradeFromPenalty();

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <main>
        {/* Hero */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 mb-6">
                Free Tool
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-[#0B1220] mb-6">
                Solar Lead Response<br />ROI Calculator
              </h1>
              <p className="text-lg text-slate-600">
                See exactly how much revenue you lose every month because of slow follow-up — and what responding in 11 seconds would recover.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Calculator */}
        <section className="py-8 lg:py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12 items-start">
              {/* Inputs */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8"
              >
                <h2 className="text-xl font-bold text-[#0B1220] mb-6">Your Numbers</h2>

                <div className="space-y-6">
                  {/* Monthly leads */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-semibold text-gray-700">Monthly inbound leads</label>
                      <span className="text-blue-600 font-bold text-lg">{monthlyLeads}</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={500}
                      step={5}
                      value={monthlyLeads}
                      onChange={e => setMonthlyLeads(Number(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>10</span><span>500</span>
                    </div>
                  </div>

                  {/* Close rate */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-semibold text-gray-700">Current close rate</label>
                      <span className="text-blue-600 font-bold text-lg">{closeRate}%</span>
                    </div>
                    <input
                      type="range"
                      min={3}
                      max={50}
                      step={1}
                      value={closeRate}
                      onChange={e => setCloseRate(Number(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>3%</span><span>50%</span>
                    </div>
                  </div>

                  {/* Contract value */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-semibold text-gray-700">Average contract value</label>
                      <span className="text-blue-600 font-bold text-lg">${contractValue.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min={8000}
                      max={60000}
                      step={1000}
                      value={contractValue}
                      onChange={e => setContractValue(Number(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>$8K</span><span>$60K</span>
                    </div>
                  </div>

                  {/* Response time */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-3">
                      Typical form lead response time
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {RESPONSE_OPTIONS.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => setResponseIdx(i)}
                          className={`px-3 py-2 rounded-lg text-xs font-medium border-2 transition-all duration-200 ${
                            responseIdx === i
                              ? 'border-blue-600 bg-blue-600 text-white'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'
                          }`}
                        >
                          {opt.label_short}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Speed grade badge */}
                  <div className={`rounded-xl border p-4 ${speedGrade.bg} ${speedGrade.border}`}>
                    <div className="flex items-center gap-3">
                      <span className={`text-3xl font-bold ${speedGrade.color}`}>{speedGrade.grade}</span>
                      <div>
                        <p className={`font-semibold text-sm ${speedGrade.color}`}>{speedGrade.label} Response Speed</p>
                        <p className="text-xs text-gray-500">{RESPONSE_OPTIONS[responseIdx].label} average response</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Results */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-4"
              >
                {/* Monthly revenue lost */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Monthly revenue lost to slow response</p>
                      <p className="text-3xl font-bold text-[#0B1220]">{fmt$(calc.additionalRevenue)}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        ~{fmtN(calc.recoverableLeads)} leads/month lost to faster competitors
                      </p>
                    </div>
                  </div>
                </div>

                {/* Annual upside */}
                <div className="bg-white rounded-2xl border border-blue-200 shadow-lg p-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-60 pointer-events-none" />
                  <div className="relative flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Annual revenue recoverable with 11-second response</p>
                      <p className="text-3xl font-bold text-blue-600">{fmt$(calc.annualUpside)}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        +{calc.upliftPct}% on top of your current {fmt$(calc.currentAnnual)}/yr
                      </p>
                    </div>
                  </div>
                </div>

                {/* CAC wasted */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Monthly ad spend wasted on non-responses</p>
                      <p className="text-3xl font-bold text-[#0B1220]">{fmt$(calc.cacWasted)}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        At $350/lead avg CAC — {fmt$(calc.annualCacWasted)} wasted annually
                      </p>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <h3 className="text-base font-semibold text-[#0B1220] mb-4">Current vs. With Boltcall</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Monthly closes (current)', value: fmtN(calc.currentCloses) },
                      { label: 'Monthly closes (with 11s response)', value: `+${fmtN(calc.additionalCloses)} more` },
                      { label: 'Current annual revenue', value: fmt$(calc.currentAnnual) },
                      { label: 'Potential annual revenue', value: fmt$(calc.potentialAnnual), highlight: true },
                    ].map((row, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                        <span className="text-sm text-gray-600">{row.label}</span>
                        <span className={`text-sm font-bold ${row.highlight ? 'text-blue-600' : 'text-[#0B1220]'}`}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <a
                  href="/solar-speed-playbook"
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-6 py-4 shadow-[4px_4px_0px_0px_#000] border-2 border-black hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all duration-200 w-full"
                >
                  Get the Solar Speed Playbook (Free) <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Context */}
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
                The Numbers Behind This Calculator
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Based on published industry research — not guesswork.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  stat: '78%',
                  label: 'Solar buyers go with the first company that responds',
                  icon: <Zap className="w-6 h-6 text-blue-600" />,
                  source: 'Harvard Business Review / InsideSales.com',
                },
                {
                  stat: '4.5 hrs',
                  label: 'Industry average response time to a new solar lead',
                  icon: <Clock className="w-6 h-6 text-blue-600" />,
                  source: '2026 Solar Speed-to-Lead Benchmark (Boltcall)',
                },
                {
                  stat: '381%',
                  label: 'Conversion lift when responding within 10 seconds vs. 10 minutes',
                  icon: <TrendingUp className="w-6 h-6 text-blue-600" />,
                  source: 'Lead Connect Research',
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
                  <p className="text-3xl font-bold text-[#0B1220] mb-2">{item.stat}</p>
                  <p className="text-gray-700 text-sm mb-3">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.source}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-16" />
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to Stop Losing Leads to Faster Competitors?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Boltcall responds to every solar lead in 11 seconds — 24/7, no headcount required.
            </p>
            <a
              href="/pricing"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-8 py-4 shadow-[4px_4px_0px_0px_#000] border-2 border-black hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all duration-200"
            >
              See Pricing <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SolarROICalculator;
