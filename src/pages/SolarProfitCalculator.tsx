import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { updateMetaDescription } from '../lib/utils';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FinalCTA, { CALCULATOR_CTA } from '../components/FinalCTA';
import GiveawayBar from '../components/GiveawayBar';

interface BreakdownItem {
  label: string;
  value: number;
  color: string;
}

const SolarProfitCalculator: React.FC = () => {
  // Form state
  const [systemSize, setSystemSize] = useState(8);
  const [pricePerWatt, setPricePerWatt] = useState(3.0);
  const [costPanels, setCostPanels] = useState(4800);
  const [costInverters, setCostInverters] = useState(2200);
  const [costRacking, setCostRacking] = useState(1200);
  const [costBOS, setCostBOS] = useState(800);
  const [costLabor, setCostLabor] = useState(3500);
  const [costPermits, setCostPermits] = useState(500);
  const [costTravel, setCostTravel] = useState(300);
  const [costOverhead, setCostOverhead] = useState(400);
  const [commissionRate, setCommissionRate] = useState(8);
  const [leadCost, setLeadCost] = useState(350);
  const [jobsPerMonth, setJobsPerMonth] = useState(6);
  const [shareBtnText, setShareBtnText] = useState('🔗 Share Results');

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Solar Profit Calculator | Boltcall';
    updateMetaDescription(
      'Free Solar Profit Calculator — know your exact profit per job, margins, and annual revenue projections in 60 seconds. Built for solar pros.'
    );

    // Load from URL params
    const params = new URLSearchParams(window.location.search);
    if (params.size > 0) {
      const p = (k: string) => params.get(k);
      if (p('systemSize')) setSystemSize(Number(p('systemSize')));
      if (p('pricePerWatt')) setPricePerWatt(Number(p('pricePerWatt')));
      if (p('costPanels')) setCostPanels(Number(p('costPanels')));
      if (p('costInverters')) setCostInverters(Number(p('costInverters')));
      if (p('costRacking')) setCostRacking(Number(p('costRacking')));
      if (p('costBOS')) setCostBOS(Number(p('costBOS')));
      if (p('costLabor')) setCostLabor(Number(p('costLabor')));
      if (p('costPermits')) setCostPermits(Number(p('costPermits')));
      if (p('costTravel')) setCostTravel(Number(p('costTravel')));
      if (p('costOverhead')) setCostOverhead(Number(p('costOverhead')));
      if (p('commissionRate')) setCommissionRate(Number(p('commissionRate')));
      if (p('leadCost')) setLeadCost(Number(p('leadCost')));
      if (p('jobsPerMonth')) setJobsPerMonth(Number(p('jobsPerMonth')));
    }
  }, []);

  // Calculations
  const calc = useMemo(() => {
    const systemWatts = systemSize * 1000;
    const revenue = systemWatts * pricePerWatt;

    const materials = costPanels + costInverters + costRacking + costBOS;
    const labor = costLabor;
    const permits = costPermits;
    const travel = costTravel;
    const overhead = costOverhead;
    const commission = revenue * (commissionRate / 100);
    const softCosts = permits + travel + overhead + commission + leadCost;

    const totalCosts = materials + labor + softCosts;
    const profit = revenue - totalCosts;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
    const costPerWatt = systemWatts > 0 ? totalCosts / systemWatts : 0;
    const profitPerWatt = systemWatts > 0 ? profit / systemWatts : 0;

    const jobsYear = jobsPerMonth * 12;
    const annualRevenue = revenue * jobsYear;
    const annualCosts = totalCosts * jobsYear;
    const annualProfit = profit * jobsYear;

    const lowJobs = Math.round(jobsYear * 0.67);
    const midJobs = jobsYear;
    const highJobs = Math.round(jobsYear * 1.33);

    // Donut chart
    const circumference = 2 * Math.PI * 55; // ~345.6
    const total = revenue > 0 ? revenue : 1;
    const matPct = materials / total;
    const labPct = labor / total;
    const softPct = softCosts / total;
    const profPct = Math.max(0, profit) / total;

    let offset = 0;
    const donutMaterials = { dash: matPct * circumference, gap: circumference - matPct * circumference, offset: -(offset * circumference) };
    offset += matPct;
    const donutLabor = { dash: labPct * circumference, gap: circumference - labPct * circumference, offset: -(offset * circumference) };
    offset += labPct;
    const donutSoft = { dash: softPct * circumference, gap: circumference - softPct * circumference, offset: -(offset * circumference) };
    offset += softPct;
    const donutProfit = { dash: profPct * circumference, gap: circumference - profPct * circumference, offset: -(offset * circumference) };

    // Bar widths
    const maxBar = annualRevenue || 1;
    const barCostsWidth = Math.round((annualCosts / maxBar) * 100);
    const barProfitWidth = Math.max(5, Math.round((Math.max(0, annualProfit) / maxBar) * 100));

    // Breakdown
    const breakdownData: BreakdownItem[] = [
      { label: 'Panels', value: costPanels, color: '#F59E0B' },
      { label: 'Inverter(s)', value: costInverters, color: '#FBBF24' },
      { label: 'Racking', value: costRacking, color: '#F97316' },
      { label: 'BOS / Wiring', value: costBOS, color: '#FB923C' },
      { label: 'Crew Labor', value: labor, color: '#0EA5E9' },
      { label: 'Permits & Fees', value: permits, color: '#8B5CF6' },
      { label: 'Travel', value: travel, color: '#A78BFA' },
      { label: 'Overhead', value: overhead, color: '#C084FC' },
      { label: `Commission (${commissionRate}%)`, value: commission, color: '#7C3AED' },
      { label: 'Lead Cost', value: leadCost, color: '#6D28D9' },
    ];

    return {
      revenue, materials, labor, softCosts, totalCosts, profit, margin,
      costPerWatt, profitPerWatt, jobsYear, annualRevenue, annualCosts, annualProfit,
      lowJobs, midJobs, highJobs,
      donutMaterials, donutLabor, donutSoft, donutProfit,
      barCostsWidth, barProfitWidth, breakdownData,
    };
  }, [systemSize, pricePerWatt, costPanels, costInverters, costRacking, costBOS,
      costLabor, costPermits, costTravel, costOverhead, commissionRate, leadCost, jobsPerMonth]);

  // Formatters
  const fmt = (n: number) => {
    if (Math.abs(n) >= 1000000) return '$' + (n / 1000000).toFixed(2) + 'M';
    if (Math.abs(n) >= 1000) return '$' + (n / 1000).toFixed(0) + 'K';
    return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 });
  };

  const fmtFull = (n: number) => '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 });

  const shareLink = useCallback(() => {
    const params = new URLSearchParams({
      systemSize: String(systemSize),
      pricePerWatt: String(pricePerWatt),
      costPanels: String(costPanels),
      costInverters: String(costInverters),
      costRacking: String(costRacking),
      costBOS: String(costBOS),
      costLabor: String(costLabor),
      costPermits: String(costPermits),
      costTravel: String(costTravel),
      costOverhead: String(costOverhead),
      commissionRate: String(commissionRate),
      leadCost: String(leadCost),
      jobsPerMonth: String(jobsPerMonth),
    });
    const url = window.location.origin + window.location.pathname + '?' + params.toString();
    navigator.clipboard.writeText(url).then(() => {
      setShareBtnText('✅ Link Copied!');
      setTimeout(() => setShareBtnText('🔗 Share Results'), 2000);
    }).catch(() => {
      prompt('Copy this link:', url);
    });
  }, [systemSize, pricePerWatt, costPanels, costInverters, costRacking, costBOS,
      costLabor, costPermits, costTravel, costOverhead, commissionRate, leadCost, jobsPerMonth]);

  const resetAll = () => {
    setSystemSize(8);
    setPricePerWatt(3.0);
    setCostPanels(4800);
    setCostInverters(2200);
    setCostRacking(1200);
    setCostBOS(800);
    setCostLabor(3500);
    setCostPermits(500);
    setCostTravel(300);
    setCostOverhead(400);
    setCommissionRate(8);
    setLeadCost(350);
    setJobsPerMonth(6);
  };

  const exportPDF = () => {
    window.print();
  };

  const marginBadgeBg = calc.margin >= 30
    ? 'bg-emerald-500/15 text-emerald-500'
    : calc.margin >= 15
      ? 'bg-amber-500/15 text-amber-500'
      : 'bg-red-500/15 text-red-500';

  return (
    <div className="min-h-screen bg-white">
      <GiveawayBar />
      <Header />
      <main className="pt-20">
        <div className="bg-slate-900 text-slate-50" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>

          {/* HERO */}
          <section className="relative px-6 pt-16 pb-10 text-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1a1a3e 50%, #0F172A 100%)' }}>
            <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] animate-pulse" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(245,158,11,0.06) 0%, transparent 60%)' }} />

            {/* Sun Icon */}
            <div className="w-16 h-16 mx-auto mb-5 relative">
              <svg viewBox="0 0 64 64" fill="none" className="w-full h-full animate-spin" style={{ animationDuration: '20s', filter: 'drop-shadow(0 0 20px rgba(245,158,11,0.4))' }}>
                <circle cx="32" cy="32" r="14" fill="#F59E0B" />
                <g stroke="#F59E0B" strokeWidth="3" strokeLinecap="round">
                  <line x1="32" y1="2" x2="32" y2="10" />
                  <line x1="32" y1="54" x2="32" y2="62" />
                  <line x1="2" y1="32" x2="10" y2="32" />
                  <line x1="54" y1="32" x2="62" y2="32" />
                  <line x1="10.8" y1="10.8" x2="16.4" y2="16.4" />
                  <line x1="47.6" y1="47.6" x2="53.2" y2="53.2" />
                  <line x1="10.8" y1="53.2" x2="16.4" y2="47.6" />
                  <line x1="47.6" y1="16.4" x2="53.2" y2="10.8" />
                </g>
              </svg>
            </div>

            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-4 py-1.5 rounded-full text-[13px] font-semibold text-amber-500 mb-5 relative">
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              Free Tool for Solar Pros
            </div>

            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none mb-3 relative">
              Solar{' '}
              <span className="bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 bg-clip-text text-transparent">
                Profit Calculator
              </span>
            </h1>
            <p className="text-slate-400 text-lg max-w-lg mx-auto relative">
              Stop guessing your margins. Know your exact profit per job and annual revenue in 60 seconds.
            </p>
          </section>

          {/* MAIN APP */}
          <div className="max-w-[1280px] mx-auto px-6 py-8 pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* LEFT: INPUTS */}
              <div className="space-y-5">

                {/* Job Revenue Card */}
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-7 transition-all duration-300 hover:border-amber-500/20 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-[10px] flex items-center justify-center text-lg bg-amber-500/15">💰</div>
                    <div>
                      <div className="text-[1.05rem] font-bold tracking-tight">Job Revenue</div>
                      <div className="text-xs text-slate-500 mt-0.5">What you charge the customer</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="flex justify-between items-center text-sm font-medium text-slate-400 mb-1.5">
                      System Size <span className="text-xs text-slate-500 font-normal">kW</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={systemSize}
                        onChange={(e) => setSystemSize(Number(e.target.value))}
                        min={1}
                        max={100}
                        step={0.5}
                        className="w-full bg-slate-700 border border-slate-600 rounded-[10px] px-3.5 pr-12 py-3 text-slate-50 text-[0.95rem] font-medium transition-all duration-200 focus:outline-none focus:border-amber-500 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.1)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium pointer-events-none">kW</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="flex justify-between items-center text-sm font-medium text-slate-400 mb-1.5">
                      Price Per Watt <span className="text-xs text-slate-500 font-normal">Industry avg: $2.50–$3.50</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-semibold pointer-events-none">$</span>
                      <input
                        type="number"
                        value={pricePerWatt}
                        onChange={(e) => setPricePerWatt(Number(e.target.value))}
                        min={0.5}
                        max={10}
                        step={0.05}
                        className="w-full bg-slate-700 border border-slate-600 rounded-[10px] pl-7 pr-3.5 py-3 text-slate-50 text-[0.95rem] font-medium transition-all duration-200 focus:outline-none focus:border-amber-500 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.1)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                  </div>

                  <div className="mb-0">
                    <label className="flex justify-between items-center text-sm font-medium text-slate-400 mb-1.5">
                      Total Job Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-semibold pointer-events-none">$</span>
                      <input
                        type="text"
                        value={fmtFull(calc.revenue).replace('$', '')}
                        readOnly
                        className="w-full bg-slate-700 border border-slate-600 rounded-[10px] pl-7 pr-3.5 py-3 text-slate-50 text-[0.95rem] font-medium opacity-70 cursor-default"
                      />
                    </div>
                  </div>
                </div>

                {/* Material Costs Card */}
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-7 transition-all duration-300 hover:border-amber-500/20 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-[10px] flex items-center justify-center text-lg bg-sky-500/15">🔩</div>
                    <div>
                      <div className="text-[1.05rem] font-bold tracking-tight">Material Costs</div>
                      <div className="text-xs text-slate-500 mt-0.5">Panels, inverters, racking, BOS</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-400 mb-1.5">Panels</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-semibold pointer-events-none">$</span>
                        <input type="number" value={costPanels} onChange={(e) => setCostPanels(Number(e.target.value))} min={0} step={100}
                          className="w-full bg-slate-700 border border-slate-600 rounded-[10px] pl-7 pr-3.5 py-3 text-slate-50 text-[0.95rem] font-medium transition-all duration-200 focus:outline-none focus:border-amber-500 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.1)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-400 mb-1.5">Inverter(s)</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-semibold pointer-events-none">$</span>
                        <input type="number" value={costInverters} onChange={(e) => setCostInverters(Number(e.target.value))} min={0} step={100}
                          className="w-full bg-slate-700 border border-slate-600 rounded-[10px] pl-7 pr-3.5 py-3 text-slate-50 text-[0.95rem] font-medium transition-all duration-200 focus:outline-none focus:border-amber-500 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.1)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="mb-0">
                      <label className="block text-sm font-medium text-slate-400 mb-1.5">Racking / Mounting</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-semibold pointer-events-none">$</span>
                        <input type="number" value={costRacking} onChange={(e) => setCostRacking(Number(e.target.value))} min={0} step={50}
                          className="w-full bg-slate-700 border border-slate-600 rounded-[10px] pl-7 pr-3.5 py-3 text-slate-50 text-[0.95rem] font-medium transition-all duration-200 focus:outline-none focus:border-amber-500 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.1)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                      </div>
                    </div>
                    <div className="mb-0">
                      <label className="block text-sm font-medium text-slate-400 mb-1.5">BOS / Wiring</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-semibold pointer-events-none">$</span>
                        <input type="number" value={costBOS} onChange={(e) => setCostBOS(Number(e.target.value))} min={0} step={50}
                          className="w-full bg-slate-700 border border-slate-600 rounded-[10px] pl-7 pr-3.5 py-3 text-slate-50 text-[0.95rem] font-medium transition-all duration-200 focus:outline-none focus:border-amber-500 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.1)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Labor & Overhead Card */}
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-7 transition-all duration-300 hover:border-amber-500/20 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-[10px] flex items-center justify-center text-lg bg-emerald-500/15">👷</div>
                    <div>
                      <div className="text-[1.05rem] font-bold tracking-tight">Labor & Overhead</div>
                      <div className="text-xs text-slate-500 mt-0.5">Crew, permits, and fixed costs</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-400 mb-1.5">Crew Labor</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-semibold pointer-events-none">$</span>
                        <input type="number" value={costLabor} onChange={(e) => setCostLabor(Number(e.target.value))} min={0} step={100}
                          className="w-full bg-slate-700 border border-slate-600 rounded-[10px] pl-7 pr-3.5 py-3 text-slate-50 text-[0.95rem] font-medium transition-all duration-200 focus:outline-none focus:border-amber-500 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.1)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-400 mb-1.5">Permits & Fees</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-semibold pointer-events-none">$</span>
                        <input type="number" value={costPermits} onChange={(e) => setCostPermits(Number(e.target.value))} min={0} step={50}
                          className="w-full bg-slate-700 border border-slate-600 rounded-[10px] pl-7 pr-3.5 py-3 text-slate-50 text-[0.95rem] font-medium transition-all duration-200 focus:outline-none focus:border-amber-500 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.1)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-400 mb-1.5">Truck / Travel</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-semibold pointer-events-none">$</span>
                        <input type="number" value={costTravel} onChange={(e) => setCostTravel(Number(e.target.value))} min={0} step={50}
                          className="w-full bg-slate-700 border border-slate-600 rounded-[10px] pl-7 pr-3.5 py-3 text-slate-50 text-[0.95rem] font-medium transition-all duration-200 focus:outline-none focus:border-amber-500 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.1)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-400 mb-1.5">Insurance / Overhead</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-semibold pointer-events-none">$</span>
                        <input type="number" value={costOverhead} onChange={(e) => setCostOverhead(Number(e.target.value))} min={0} step={50}
                          className="w-full bg-slate-700 border border-slate-600 rounded-[10px] pl-7 pr-3.5 py-3 text-slate-50 text-[0.95rem] font-medium transition-all duration-200 focus:outline-none focus:border-amber-500 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.1)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-slate-700 my-6" />

                  {/* Sales Commission Slider */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-slate-400">Sales Commission</label>
                      <span className="text-sm font-bold text-amber-500">{commissionRate}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={25}
                      value={commissionRate}
                      step={0.5}
                      onChange={(e) => setCommissionRate(Number(e.target.value))}
                      className="w-full h-1.5 rounded-sm bg-slate-700 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500 [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(245,158,11,0.4)] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform"
                    />
                  </div>

                  {/* Lead Acquisition Cost Slider */}
                  <div className="mb-0">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-slate-400">Lead Acquisition Cost</label>
                      <span className="text-sm font-bold text-amber-500">{fmtFull(leadCost)}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={2000}
                      value={leadCost}
                      step={25}
                      onChange={(e) => setLeadCost(Number(e.target.value))}
                      className="w-full h-1.5 rounded-sm bg-slate-700 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500 [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(245,158,11,0.4)] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform"
                    />
                  </div>
                </div>

                {/* Annual Volume Card */}
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-7 transition-all duration-300 hover:border-amber-500/20 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-[10px] flex items-center justify-center text-lg bg-violet-500/15">📈</div>
                    <div>
                      <div className="text-[1.05rem] font-bold tracking-tight">Annual Volume</div>
                      <div className="text-xs text-slate-500 mt-0.5">How many jobs you close per month</div>
                    </div>
                  </div>

                  <div className="mb-0">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-slate-400">Jobs Per Month</label>
                      <span className="text-sm font-bold text-amber-500">{jobsPerMonth} jobs/mo</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={50}
                      value={jobsPerMonth}
                      step={1}
                      onChange={(e) => setJobsPerMonth(Number(e.target.value))}
                      className="w-full h-1.5 rounded-sm bg-slate-700 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500 [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(245,158,11,0.4)] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform"
                    />
                  </div>
                </div>
              </div>

              {/* RIGHT: RESULTS */}
              <div className="lg:sticky lg:top-6 self-start space-y-5">

                {/* Profit Hero Card */}
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-7 transition-all duration-300 hover:border-amber-500/20 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]">
                  <div className="text-center px-6 py-8 rounded-[14px] mb-6 border border-amber-500/15" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(16,185,129,0.08))' }}>
                    <div className="text-xs text-slate-500 font-medium uppercase tracking-widest mb-1">Profit Per Job</div>
                    <div className={`text-5xl font-black tracking-tight leading-none mb-2 transition-all duration-300 ${calc.profit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      {fmtFull(calc.profit)}
                    </div>
                    <div className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-sm font-bold ${marginBadgeBg}`}>
                      <span>{calc.margin.toFixed(1)}%</span> margin
                    </div>
                  </div>

                  {/* Key Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="bg-slate-700 rounded-xl p-4 text-center">
                      <div className="text-[0.7rem] text-slate-500 font-medium uppercase tracking-wider mb-1">Revenue</div>
                      <div className="text-xl font-extrabold tracking-tight text-amber-500">{fmtFull(calc.revenue)}</div>
                    </div>
                    <div className="bg-slate-700 rounded-xl p-4 text-center">
                      <div className="text-[0.7rem] text-slate-500 font-medium uppercase tracking-wider mb-1">Total Costs</div>
                      <div className="text-xl font-extrabold tracking-tight text-sky-500">{fmtFull(calc.totalCosts)}</div>
                    </div>
                    <div className="bg-slate-700 rounded-xl p-4 text-center">
                      <div className="text-[0.7rem] text-slate-500 font-medium uppercase tracking-wider mb-1">Cost / Watt</div>
                      <div className="text-xl font-extrabold tracking-tight text-violet-500">${calc.costPerWatt.toFixed(2)}</div>
                    </div>
                    <div className="bg-slate-700 rounded-xl p-4 text-center">
                      <div className="text-[0.7rem] text-slate-500 font-medium uppercase tracking-wider mb-1">Profit / Watt</div>
                      <div className="text-xl font-extrabold tracking-tight text-emerald-500">${calc.profitPerWatt.toFixed(2)}</div>
                    </div>
                  </div>
                </div>

                {/* Cost Breakdown Donut Card */}
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-7 transition-all duration-300 hover:border-amber-500/20 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-[10px] flex items-center justify-center text-lg bg-sky-500/15">📊</div>
                    <div>
                      <div className="text-[1.05rem] font-bold tracking-tight">Cost Breakdown</div>
                      <div className="text-xs text-slate-500 mt-0.5">Where your money goes</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-6 my-5">
                    <svg className="w-[140px] h-[140px] -rotate-90" viewBox="0 0 140 140">
                      <circle cx="70" cy="70" r="55" fill="none" strokeWidth="18" stroke="#F59E0B"
                        strokeDasharray={`${calc.donutMaterials.dash} ${calc.donutMaterials.gap}`}
                        strokeDashoffset={calc.donutMaterials.offset}
                        className="transition-all duration-700" style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }} />
                      <circle cx="70" cy="70" r="55" fill="none" strokeWidth="18" stroke="#0EA5E9"
                        strokeDasharray={`${calc.donutLabor.dash} ${calc.donutLabor.gap}`}
                        strokeDashoffset={calc.donutLabor.offset}
                        className="transition-all duration-700" style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }} />
                      <circle cx="70" cy="70" r="55" fill="none" strokeWidth="18" stroke="#8B5CF6"
                        strokeDasharray={`${calc.donutSoft.dash} ${calc.donutSoft.gap}`}
                        strokeDashoffset={calc.donutSoft.offset}
                        className="transition-all duration-700" style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }} />
                      <circle cx="70" cy="70" r="55" fill="none" strokeWidth="18" stroke="#10B981"
                        strokeDasharray={`${calc.donutProfit.dash} ${calc.donutProfit.gap}`}
                        strokeDashoffset={calc.donutProfit.offset}
                        className="transition-all duration-700" style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }} />
                    </svg>

                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: '#F59E0B' }} />
                        Materials — {fmtFull(calc.materials)}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: '#0EA5E9' }} />
                        Labor — {fmtFull(calc.labor)}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: '#8B5CF6' }} />
                        Soft Costs — {fmtFull(calc.softCosts)}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: '#10B981' }} />
                        Profit — {fmtFull(calc.profit)}
                      </div>
                    </div>
                  </div>

                  {/* Breakdown List */}
                  <ul className="list-none">
                    {calc.breakdownData.map((item, i) => (
                      <li key={i} className="flex justify-between items-center py-2.5 border-b border-slate-700/50 last:border-b-0 text-sm">
                        <span className="text-slate-400 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }} />
                          {item.label}
                        </span>
                        <span className="font-semibold">{fmtFull(item.value)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Annual Projection */}
                <div className="rounded-[14px] p-6 border border-sky-500/15" style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.06), rgba(139,92,246,0.06))' }}>
                  <div className="flex items-center gap-2.5 mb-4">
                    <span className="text-xl">🚀</span>
                    <h3 className="text-base font-bold">Annual Projection</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="text-center py-3.5 px-2 rounded-[10px] bg-slate-900/50">
                      <div className="text-[0.7rem] text-slate-500 uppercase tracking-wider">Conservative</div>
                      <div className="text-xs text-slate-400 mb-1.5">{calc.lowJobs} jobs</div>
                      <div className="text-xl font-extrabold text-slate-400">{fmt(calc.profit * calc.lowJobs)}</div>
                    </div>
                    <div className="text-center py-3.5 px-2 rounded-[10px] bg-slate-900/50">
                      <div className="text-[0.7rem] text-slate-500 uppercase tracking-wider">Moderate</div>
                      <div className="text-xs text-slate-400 mb-1.5">{calc.midJobs} jobs</div>
                      <div className="text-xl font-extrabold text-sky-500">{fmt(calc.profit * calc.midJobs)}</div>
                    </div>
                    <div className="text-center py-3.5 px-2 rounded-[10px] bg-slate-900/50">
                      <div className="text-[0.7rem] text-slate-500 uppercase tracking-wider">Growth</div>
                      <div className="text-xs text-slate-400 mb-1.5">{calc.highJobs} jobs</div>
                      <div className="text-xl font-extrabold text-emerald-500">{fmt(calc.profit * calc.highJobs)}</div>
                    </div>
                  </div>
                </div>

                {/* Annual Numbers Bar Chart */}
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-7 transition-all duration-300 hover:border-amber-500/20 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-[10px] flex items-center justify-center text-lg bg-emerald-500/15">💵</div>
                    <div>
                      <div className="text-[1.05rem] font-bold tracking-tight">Annual Numbers</div>
                      <div className="text-xs text-slate-500 mt-0.5">Based on {calc.jobsYear} jobs/year</div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-20 text-xs text-slate-500 text-right shrink-0">Revenue</div>
                      <div className="flex-1 h-7 bg-slate-700 rounded-md overflow-hidden relative">
                        <div className="h-full rounded-md flex items-center px-2.5 text-xs font-bold text-white transition-all duration-700"
                          style={{ width: '100%', background: 'linear-gradient(135deg, #F59E0B, #D97706, #B45309)', transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}>
                          {fmt(calc.annualRevenue)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-20 text-xs text-slate-500 text-right shrink-0">Costs</div>
                      <div className="flex-1 h-7 bg-slate-700 rounded-md overflow-hidden relative">
                        <div className="h-full rounded-md flex items-center px-2.5 text-xs font-bold text-white transition-all duration-700"
                          style={{ width: `${calc.barCostsWidth}%`, background: 'linear-gradient(135deg, #0EA5E9, #0369A1)', transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}>
                          {fmt(calc.annualCosts)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-20 text-xs text-slate-500 text-right shrink-0">Profit</div>
                      <div className="flex-1 h-7 bg-slate-700 rounded-md overflow-hidden relative">
                        <div className="h-full rounded-md flex items-center px-2.5 text-xs font-bold text-white transition-all duration-700"
                          style={{ width: `${calc.barProfitWidth}%`, background: 'linear-gradient(135deg, #10B981, #059669)', transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}>
                          {fmt(calc.annualProfit)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Export Buttons */}
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={exportPDF}
                    className="inline-flex items-center gap-2 bg-slate-700 text-slate-50 font-semibold text-sm px-6 py-3 rounded-[10px] border border-slate-600 cursor-pointer transition-all duration-200 hover:border-amber-500 hover:bg-slate-750"
                  >
                    📄 Export PDF Report
                  </button>
                  <button
                    onClick={shareLink}
                    className="inline-flex items-center gap-2 bg-slate-700 text-slate-50 font-semibold text-sm px-6 py-3 rounded-[10px] border border-slate-600 cursor-pointer transition-all duration-200 hover:border-amber-500 hover:bg-slate-750"
                  >
                    {shareBtnText}
                  </button>
                  <button
                    onClick={resetAll}
                    className="inline-flex items-center gap-2 bg-slate-700 text-slate-50 font-semibold text-sm px-6 py-3 rounded-[10px] border border-slate-600 cursor-pointer transition-all duration-200 hover:border-amber-500 hover:bg-slate-750"
                  >
                    🔄 Reset
                  </button>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center mt-10 px-6 py-10 rounded-2xl border border-slate-700" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.05), rgba(14,165,233,0.05))' }}>
              <h3 className="text-xl font-extrabold mb-2">Want More Solar Installs at Higher Margins?</h3>
              <p className="text-slate-400 mb-5 text-[0.95rem]">We help solar installers get 15–30 qualified leads per month without buying lead lists.</p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 font-bold text-base px-8 py-3.5 rounded-xl border-none cursor-pointer transition-all duration-200 text-black hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(245,158,11,0.3)]"
                style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706, #B45309)' }}
              >
                Book a Free Strategy Call →
              </a>
            </div>
          </div>

          {/* Branding Strip */}
          <div className="text-center py-6 text-slate-500 text-xs">
            Built with ☀️ by{' '}
            <a href="/" className="text-amber-500 no-underline font-semibold">Boltcall</a>
            {' '}— The Growth Partner for Solar Pros
          </div>
        </div>
      </main>
      <FinalCTA {...CALCULATOR_CTA} />
      <Footer />
    </div>
  );
};

export default SolarProfitCalculator;
