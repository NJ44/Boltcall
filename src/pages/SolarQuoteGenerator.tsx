import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { updateMetaDescription } from '../lib/utils';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GiveawayBar from '../components/GiveawayBar';
import { Link, useSearchParams } from 'react-router-dom';

const BRAND_COLORS = [
  '#F59E0B',
  '#3B82F6',
  '#10B981',
  '#EF4444',
  '#8B5CF6',
  '#EC4899',
  '#06B6D4',
  '#1E293B',
];

function darkenColor(hex: string, amount = 30): string {
  let r = parseInt(hex.slice(1, 3), 16) - amount;
  let g = parseInt(hex.slice(3, 5), 16) - amount;
  let b = parseInt(hex.slice(5, 7), 16) - amount;
  r = Math.max(0, r);
  g = Math.max(0, g);
  b = Math.max(0, b);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function fmt(n: number): string {
  return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

function generateQuoteNumber(companyName: string): string {
  const initials = companyName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 3);
  const num = Math.floor(Math.random() * 9000 + 1000);
  return `${initials}-${num}`;
}

const SolarQuoteGenerator: React.FC = () => {
  const [searchParams] = useSearchParams();
  const quoteNumRef = useRef('');

  // Company fields
  const [companyName, setCompanyName] = useState('Apex Solar Solutions');
  const [companyPhone, setCompanyPhone] = useState('(555) 123-4567');
  const [companyLicense, setCompanyLicense] = useState('ROC #312456');
  const [companyTagline, setCompanyTagline] = useState('Powering Homes. Cutting Bills. Since 2018.');
  const [brandColor, setBrandColor] = useState('#F59E0B');

  // Customer fields
  const [customerName, setCustomerName] = useState('John & Sarah Mitchell');
  const [quoteDate, setQuoteDate] = useState('');
  const [customerAddress, setCustomerAddress] = useState('1847 Sunset Drive, Phoenix, AZ 85042');
  const [currentBill, setCurrentBill] = useState('245');

  // System fields
  const [systemSize, setSystemSize] = useState('9.6');
  const [panelCount, setPanelCount] = useState('24');
  const [panelBrand, setPanelBrand] = useState('REC Alpha Pure-R 400W');
  const [inverterBrand, setInverterBrand] = useState('Enphase IQ8+');
  const [rackingBrand, setRackingBrand] = useState('IronRidge XR100');
  const [monitorBrand, setMonitorBrand] = useState('Enphase Enlighten');
  const [annualProduction, setAnnualProduction] = useState('16200');

  // Pricing fields
  const [equipmentCost, setEquipmentCost] = useState('14400');
  const [laborCost, setLaborCost] = useState('5200');
  const [permitCost, setPermitCost] = useState('1800');
  const [electricalCost, setElectricalCost] = useState('2400');
  const [taxCredit, setTaxCredit] = useState('30');
  const [stateRebate, setStateRebate] = useState('1500');
  const [monthlyPayment, setMonthlyPayment] = useState('158');

  // Warranty fields
  const [panelWarranty, setPanelWarranty] = useState('25');
  const [inverterWarranty, setInverterWarranty] = useState('25');
  const [workWarranty, setWorkWarranty] = useState('10');

  // Notes
  const [customNotes, setCustomNotes] = useState(
    'This proposal is valid for 30 days from the date above. Installation typically completes within 4–6 weeks of signed agreement. All permits and utility interconnection included. Customer is responsible for verifying tax credit eligibility with a tax professional.'
  );

  // Share link copied state
  const [linkCopied, setLinkCopied] = useState(false);

  // Load from URL params on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Solar Quote Generator | Boltcall';
    updateMetaDescription(
      'Create branded, professional solar quotes in 60 seconds. Free tool for solar professionals — live PDF preview, instant sharing, and print-ready output.'
    );

    const fieldMap: Record<string, (v: string) => void> = {
      companyName: setCompanyName,
      companyPhone: setCompanyPhone,
      companyLicense: setCompanyLicense,
      companyTagline: setCompanyTagline,
      customerName: setCustomerName,
      customerAddress: setCustomerAddress,
      currentBill: setCurrentBill,
      systemSize: setSystemSize,
      panelCount: setPanelCount,
      panelBrand: setPanelBrand,
      inverterBrand: setInverterBrand,
      rackingBrand: setRackingBrand,
      monitorBrand: setMonitorBrand,
      annualProduction: setAnnualProduction,
      equipmentCost: setEquipmentCost,
      laborCost: setLaborCost,
      permitCost: setPermitCost,
      electricalCost: setElectricalCost,
      taxCredit: setTaxCredit,
      stateRebate: setStateRebate,
      monthlyPayment: setMonthlyPayment,
      panelWarranty: setPanelWarranty,
      inverterWarranty: setInverterWarranty,
      workWarranty: setWorkWarranty,
    };

    if (searchParams.toString()) {
      searchParams.forEach((val, key) => {
        if (key === 'color') {
          setBrandColor(val);
        } else if (fieldMap[key]) {
          fieldMap[key](val);
        }
      });
    }

    if (!searchParams.get('quoteDate')) {
      setQuoteDate(new Date().toISOString().split('T')[0]);
    }
    const bcScript = document.createElement('script');
    bcScript.type = 'application/ld+json';
    bcScript.id = 'breadcrumb-jsonld';
    bcScript.text = JSON.stringify({"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Home", "item": "https://boltcall.org"}, {"@type": "ListItem", "position": 2, "name": "Tools", "item": "https://boltcall.org/tools"}, {"@type": "ListItem", "position": 3, "name": "Solar Quote Generator", "item": "https://boltcall.org/tools/solar-quote-generator"}]});
    document.head.appendChild(bcScript);
    return () => { document.getElementById('breadcrumb-jsonld')?.remove(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Generate quote number once
  if (!quoteNumRef.current) {
    quoteNumRef.current = generateQuoteNumber(companyName);
  }

  // Derived calculations
  const calculations = useMemo(() => {
    const equip = parseFloat(equipmentCost) || 0;
    const labor = parseFloat(laborCost) || 0;
    const permit = parseFloat(permitCost) || 0;
    const electrical = parseFloat(electricalCost) || 0;
    const subtotal = equip + labor + permit + electrical;

    const taxPct = parseFloat(taxCredit) || 0;
    const taxAmt = Math.round(subtotal * taxPct / 100);
    const rebate = parseFloat(stateRebate) || 0;
    const netCost = subtotal - taxAmt - rebate;

    const bill = parseFloat(currentBill) || 0;
    const payment = parseFloat(monthlyPayment) || 0;
    const monthlySavings = bill - payment;
    const yearlySavings = monthlySavings * 12;
    const paybackYears = netCost > 0 && yearlySavings > 0 ? netCost / yearlySavings : 0;
    const totalSavings25 = bill * 12 * 25 - netCost;

    const panels = parseInt(panelCount) || 0;
    const size = parseFloat(systemSize) || 0;

    const tableRows = [
      { name: panelBrand, desc: `${panels} panels · ${size} kW system`, qty: panels, amount: equip * 0.55 },
      { name: inverterBrand, desc: 'Microinverter system', qty: panels, amount: equip * 0.3 },
      { name: rackingBrand, desc: 'Roof mounting system', qty: 1, amount: equip * 0.15 },
      { name: 'Installation Labor', desc: 'Professional crew installation', qty: 1, amount: labor },
      { name: 'Permits & Engineering', desc: 'Structural review, permits, interconnection', qty: 1, amount: permit },
      { name: 'Electrical & BOS', desc: 'Wiring, conduit, disconnect, meter', qty: 1, amount: electrical },
      { name: monitorBrand, desc: 'Real-time system monitoring', qty: 1, amount: 0 },
    ];

    return {
      subtotal,
      taxPct,
      taxAmt,
      rebate,
      netCost,
      monthlySavings,
      paybackYears,
      totalSavings25,
      tableRows,
    };
  }, [
    equipmentCost, laborCost, permitCost, electricalCost,
    taxCredit, stateRebate, currentBill, monthlyPayment,
    panelCount, systemSize, panelBrand, inverterBrand,
    rackingBrand, monitorBrand,
  ]);

  const formattedDate = useMemo(() => {
    if (quoteDate) {
      return new Date(quoteDate + 'T00:00:00').toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, [quoteDate]);

  const darker = useMemo(() => darkenColor(brandColor), [brandColor]);

  const copyQuoteLink = useCallback(() => {
    const fields: Record<string, string> = {
      companyName, companyPhone, companyLicense, companyTagline,
      customerName, customerAddress, currentBill, systemSize,
      panelCount, panelBrand, inverterBrand, rackingBrand,
      monitorBrand, annualProduction, equipmentCost, laborCost,
      permitCost, electricalCost, taxCredit, stateRebate,
      monthlyPayment, panelWarranty, inverterWarranty, workWarranty,
      color: brandColor,
    };
    const params = new URLSearchParams(fields);
    const url = window.location.origin + '/tools/solar-quote-generator?' + params.toString();
    navigator.clipboard.writeText(url).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    });
  }, [
    companyName, companyPhone, companyLicense, companyTagline,
    customerName, customerAddress, currentBill, systemSize,
    panelCount, panelBrand, inverterBrand, rackingBrand,
    monitorBrand, annualProduction, equipmentCost, laborCost,
    permitCost, electricalCost, taxCredit, stateRebate,
    monthlyPayment, panelWarranty, inverterWarranty, workWarranty,
    brandColor,
  ]);

  const resetForm = useCallback(() => {
    setCompanyName('Apex Solar Solutions');
    setCompanyPhone('(555) 123-4567');
    setCompanyLicense('ROC #312456');
    setCompanyTagline('Powering Homes. Cutting Bills. Since 2018.');
    setBrandColor('#F59E0B');
    setCustomerName('John & Sarah Mitchell');
    setQuoteDate(new Date().toISOString().split('T')[0]);
    setCustomerAddress('1847 Sunset Drive, Phoenix, AZ 85042');
    setCurrentBill('245');
    setSystemSize('9.6');
    setPanelCount('24');
    setPanelBrand('REC Alpha Pure-R 400W');
    setInverterBrand('Enphase IQ8+');
    setRackingBrand('IronRidge XR100');
    setMonitorBrand('Enphase Enlighten');
    setAnnualProduction('16200');
    setEquipmentCost('14400');
    setLaborCost('5200');
    setPermitCost('1800');
    setElectricalCost('2400');
    setTaxCredit('30');
    setStateRebate('1500');
    setMonthlyPayment('158');
    setPanelWarranty('25');
    setInverterWarranty('25');
    setWorkWarranty('10');
    setCustomNotes(
      'This proposal is valid for 30 days from the date above. Installation typically completes within 4–6 weeks of signed agreement. All permits and utility interconnection included. Customer is responsible for verifying tax credit eligibility with a tax professional.'
    );
    quoteNumRef.current = generateQuoteNumber('Apex Solar Solutions');
  }, []);

  const inputClasses =
    'w-full rounded-lg border border-[#2A3352] bg-[#1E2642] px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none transition-colors [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none';

  return (
    <div className="min-h-screen bg-white">
      <GiveawayBar />
      <Header />
      <main className="pt-20">
        <div className="min-h-screen bg-[#0B0F1A] text-slate-100" style={{ fontFamily: "'Inter', sans-serif" }}>
          {/* Hero */}
          <section
            className="text-center px-6 pt-12 pb-9"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.06) 0%, transparent 60%)' }}
          >
            <div className="text-5xl mb-4">📋</div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-500 mb-4">
              🚀 Free Tool for Solar Pros
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-2.5">
              Instant Solar{' '}
              <span className="bg-gradient-to-br from-amber-500 to-emerald-500 bg-clip-text text-transparent">
                Quote Generator
              </span>
            </h1>
            <p className="text-slate-400 text-lg max-w-lg mx-auto">
              Create branded, professional quotes that make you look like a $10M company. 60 seconds flat.
            </p>
          </section>

          {/* Main Layout */}
          <div className="max-w-[1200px] mx-auto px-6 pb-20 grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8">
            {/* LEFT: FORM */}
            <div className="flex flex-col gap-4">
              {/* Company Info Card */}
              <div className="rounded-[14px] border border-[#2A3352] bg-[#141928] p-5">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base bg-amber-500/10 shrink-0">
                    🏢
                  </div>
                  <div>
                    <div className="text-sm font-bold">Your Company</div>
                    <div className="text-xs text-slate-500">Brand your quote</div>
                  </div>
                </div>
                <div className="mb-3.5">
                  <label className="block text-xs font-medium text-slate-400 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className={inputClasses}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2.5 mb-3.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Phone</label>
                    <input
                      type="text"
                      value={companyPhone}
                      onChange={(e) => setCompanyPhone(e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">License #</label>
                    <input
                      type="text"
                      value={companyLicense}
                      onChange={(e) => setCompanyLicense(e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                </div>
                <div className="mb-3.5">
                  <label className="block text-xs font-medium text-slate-400 mb-1">Tagline</label>
                  <input
                    type="text"
                    value={companyTagline}
                    onChange={(e) => setCompanyTagline(e.target.value)}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Brand Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {BRAND_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-8 h-8 rounded-lg cursor-pointer border-2 transition-all hover:scale-110 hover:border-white ${
                          brandColor === color ? 'border-white scale-110' : 'border-transparent'
                        }`}
                        style={{ background: color }}
                        onClick={() => setBrandColor(color)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Customer Info Card */}
              <div className="rounded-[14px] border border-[#2A3352] bg-[#141928] p-5">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base bg-blue-500/10 shrink-0">
                    👤
                  </div>
                  <div>
                    <div className="text-sm font-bold">Customer Info</div>
                    <div className="text-xs text-slate-500">Who's getting the quote</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2.5 mb-3.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Customer Name</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Quote Date</label>
                    <input
                      type="date"
                      value={quoteDate}
                      onChange={(e) => setQuoteDate(e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                </div>
                <div className="mb-3.5">
                  <label className="block text-xs font-medium text-slate-400 mb-1">Address</label>
                  <input
                    type="text"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Current Monthly Bill</label>
                  <input
                    type="number"
                    value={currentBill}
                    onChange={(e) => setCurrentBill(e.target.value)}
                    className={inputClasses}
                  />
                </div>
              </div>

              {/* System Details Card */}
              <div className="rounded-[14px] border border-[#2A3352] bg-[#141928] p-5">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base bg-emerald-500/10 shrink-0">
                    ⚡
                  </div>
                  <div>
                    <div className="text-sm font-bold">System Details</div>
                    <div className="text-xs text-slate-500">Equipment and specs</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2.5 mb-3.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">System Size (kW)</label>
                    <input
                      type="number"
                      value={systemSize}
                      onChange={(e) => setSystemSize(e.target.value)}
                      step="0.1"
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Number of Panels</label>
                    <input
                      type="number"
                      value={panelCount}
                      onChange={(e) => setPanelCount(e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2.5 mb-3.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Panel Brand</label>
                    <input
                      type="text"
                      value={panelBrand}
                      onChange={(e) => setPanelBrand(e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Inverter</label>
                    <input
                      type="text"
                      value={inverterBrand}
                      onChange={(e) => setInverterBrand(e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2.5 mb-3.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Racking System</label>
                    <input
                      type="text"
                      value={rackingBrand}
                      onChange={(e) => setRackingBrand(e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Monitoring</label>
                    <input
                      type="text"
                      value={monitorBrand}
                      onChange={(e) => setMonitorBrand(e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Est. Annual Production (kWh)</label>
                  <input
                    type="number"
                    value={annualProduction}
                    onChange={(e) => setAnnualProduction(e.target.value)}
                    className={inputClasses}
                  />
                </div>
              </div>

              {/* Pricing Card */}
              <div className="rounded-[14px] border border-[#2A3352] bg-[#141928] p-5">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base bg-violet-500/10 shrink-0">
                    💰
                  </div>
                  <div>
                    <div className="text-sm font-bold">Pricing</div>
                    <div className="text-xs text-slate-500">Costs and incentives</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2.5 mb-3.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Equipment Cost</label>
                    <input
                      type="number"
                      value={equipmentCost}
                      onChange={(e) => setEquipmentCost(e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Installation Labor</label>
                    <input
                      type="number"
                      value={laborCost}
                      onChange={(e) => setLaborCost(e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2.5 mb-3.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Permits & Engineering</label>
                    <input
                      type="number"
                      value={permitCost}
                      onChange={(e) => setPermitCost(e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Electrical / BOS</label>
                    <input
                      type="number"
                      value={electricalCost}
                      onChange={(e) => setElectricalCost(e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2.5 mb-3.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Federal Tax Credit (%)</label>
                    <input
                      type="number"
                      value={taxCredit}
                      onChange={(e) => setTaxCredit(e.target.value)}
                      min="0"
                      max="50"
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">State / Utility Rebate ($)</label>
                    <input
                      type="number"
                      value={stateRebate}
                      onChange={(e) => setStateRebate(e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Financing (monthly payment, optional)
                  </label>
                  <input
                    type="number"
                    value={monthlyPayment}
                    onChange={(e) => setMonthlyPayment(e.target.value)}
                    className={inputClasses}
                  />
                </div>
              </div>

              {/* Warranty Card */}
              <div className="rounded-[14px] border border-[#2A3352] bg-[#141928] p-5">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base bg-emerald-500/10 shrink-0">
                    🛡️
                  </div>
                  <div>
                    <div className="text-sm font-bold">Warranty</div>
                    <div className="text-xs text-slate-500">Coverage info</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2.5 mb-3.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Panel Warranty (years)</label>
                    <input
                      type="number"
                      value={panelWarranty}
                      onChange={(e) => setPanelWarranty(e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Inverter Warranty (years)</label>
                    <input
                      type="number"
                      value={inverterWarranty}
                      onChange={(e) => setInverterWarranty(e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Workmanship Warranty (years)
                  </label>
                  <input
                    type="number"
                    value={workWarranty}
                    onChange={(e) => setWorkWarranty(e.target.value)}
                    className={inputClasses}
                  />
                </div>
              </div>

              {/* Notes Card */}
              <div className="rounded-[14px] border border-[#2A3352] bg-[#141928] p-5">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base bg-amber-500/10 shrink-0">
                    📝
                  </div>
                  <div>
                    <div className="text-sm font-bold">Additional Notes</div>
                    <div className="text-xs text-slate-500">Terms, conditions, custom text</div>
                  </div>
                </div>
                <textarea
                  rows={4}
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  className="w-full rounded-lg border border-[#2A3352] bg-[#1E2642] px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none transition-colors resize-y min-h-[60px]"
                />
              </div>

              {/* Download Button */}
              <button
                onClick={() => window.print()}
                className="w-full rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 px-4 py-3.5 text-base font-bold text-black transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(245,158,11,0.3)]"
              >
                📄 Download as PDF
              </button>
            </div>

            {/* RIGHT: PREVIEW */}
            <div className="lg:sticky lg:top-6 lg:max-h-[calc(100vh-48px)] lg:overflow-auto">
              {/* Preview Actions */}
              <div className="flex gap-2.5 mb-4 flex-wrap print:hidden">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 px-5 py-2.5 text-sm font-semibold text-black transition-all hover:-translate-y-0.5"
                >
                  📄 Download PDF
                </button>
                <button
                  onClick={copyQuoteLink}
                  className="flex items-center gap-1.5 rounded-lg border border-[#2A3352] bg-[#141928] px-5 py-2.5 text-sm font-semibold text-slate-100 transition-all hover:border-amber-500"
                >
                  {linkCopied ? '✅ Copied!' : '🔗 Share Link'}
                </button>
                <button
                  onClick={resetForm}
                  className="flex items-center gap-1.5 rounded-lg border border-[#2A3352] bg-[#141928] px-5 py-2.5 text-sm font-semibold text-slate-100 transition-all hover:border-amber-500"
                >
                  🔄 Reset
                </button>
              </div>

              {/* Quote Page (PDF Preview) */}
              <div className="bg-white text-gray-900 rounded-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)] text-sm leading-relaxed">
                {/* Quote Header */}
                <div
                  className="px-10 pt-9 pb-7 text-white relative"
                  style={{ background: `linear-gradient(135deg, ${brandColor}, ${darker})` }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-black tracking-tight">{companyName}</h2>
                      <p className="text-sm opacity-80 mt-0.5">{companyTagline}</p>
                    </div>
                    <div className="text-right text-sm opacity-90">
                      <strong className="block text-lg">Quote #{quoteNumRef.current}</strong>
                      <span>{formattedDate}</span>
                    </div>
                  </div>
                  <div className="flex gap-8 mt-5 pt-4 border-t border-white/20 flex-wrap">
                    <div>
                      <label className="block text-[0.7rem] uppercase tracking-wider opacity-70 mb-0.5">
                        Prepared For
                      </label>
                      <span className="font-semibold text-sm">{customerName}</span>
                    </div>
                    <div>
                      <label className="block text-[0.7rem] uppercase tracking-wider opacity-70 mb-0.5">
                        Property
                      </label>
                      <span className="font-semibold text-sm">{customerAddress}</span>
                    </div>
                    <div>
                      <label className="block text-[0.7rem] uppercase tracking-wider opacity-70 mb-0.5">
                        Contact
                      </label>
                      <span className="font-semibold text-sm">{companyPhone}</span>
                    </div>
                  </div>
                </div>

                {/* Quote Body */}
                <div className="px-10 py-8">
                  {/* System Specifications */}
                  <div
                    className="text-xs font-bold uppercase tracking-wider mb-3 pb-1.5 border-b-2"
                    style={{ borderColor: brandColor, color: brandColor }}
                  >
                    System Specifications
                  </div>

                  <table className="w-full border-collapse mb-7">
                    <thead>
                      <tr>
                        <th className="text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-500 px-3 py-2 border-b border-slate-200">
                          Item
                        </th>
                        <th className="text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-500 px-3 py-2 border-b border-slate-200">
                          Details
                        </th>
                        <th className="text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-500 px-3 py-2 border-b border-slate-200">
                          Qty
                        </th>
                        <th className="text-right text-[0.7rem] font-bold uppercase tracking-wider text-slate-500 px-3 py-2 border-b border-slate-200">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {calculations.tableRows.map((row, i) => (
                        <tr key={i}>
                          <td className="px-3 py-3 border-b border-slate-50">
                            <div className="font-semibold">{row.name}</div>
                            <div className="text-slate-500 text-xs">{row.desc}</div>
                          </td>
                          <td className="px-3 py-3 border-b border-slate-50 text-sm">
                            {row.desc.split('·')[0]}
                          </td>
                          <td className="px-3 py-3 border-b border-slate-50 text-sm">{row.qty}</td>
                          <td className="px-3 py-3 border-b border-slate-50 text-sm text-right font-semibold">
                            {row.amount > 0 ? fmt(Math.round(row.amount)) : 'Included'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Totals Box */}
                  <div className="ml-auto w-[280px] mb-7">
                    <div className="flex justify-between py-2 text-sm">
                      <span className="text-slate-500">Subtotal</span>
                      <span className="font-semibold">{fmt(calculations.subtotal)}</span>
                    </div>
                    <div className="flex justify-between py-2 text-sm">
                      <span className="text-slate-500">Federal Tax Credit ({calculations.taxPct}%)</span>
                      <span className="font-semibold text-emerald-500">-{fmt(calculations.taxAmt)}</span>
                    </div>
                    <div className="flex justify-between py-2 text-sm">
                      <span className="text-slate-500">State/Utility Rebate</span>
                      <span className="font-semibold text-emerald-500">-{fmt(calculations.rebate)}</span>
                    </div>
                    <div
                      className="flex justify-between pt-3 mt-1 text-lg font-extrabold border-t-2"
                      style={{ borderColor: brandColor }}
                    >
                      <span>Net Investment</span>
                      <span style={{ color: brandColor }}>{fmt(calculations.netCost)}</span>
                    </div>
                  </div>

                  {/* Savings Banner */}
                  <div
                    className="rounded-xl p-5 mb-7 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center border"
                    style={{
                      background: `${brandColor}10`,
                      borderColor: `${brandColor}33`,
                    }}
                  >
                    <div>
                      <label className="block text-[0.7rem] uppercase tracking-wider text-slate-500 mb-0.5">
                        Monthly Savings
                      </label>
                      <div className="text-xl font-extrabold text-emerald-500">
                        {fmt(calculations.monthlySavings)}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[0.7rem] uppercase tracking-wider text-slate-500 mb-0.5">
                        25-Year Savings
                      </label>
                      <div className="text-xl font-extrabold" style={{ color: brandColor }}>
                        {fmt(Math.round(calculations.totalSavings25))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[0.7rem] uppercase tracking-wider text-slate-500 mb-0.5">
                        Payback Period
                      </label>
                      <div className="text-xl font-extrabold text-blue-500">
                        {calculations.paybackYears > 0
                          ? calculations.paybackYears.toFixed(1) + ' yrs'
                          : 'N/A'}
                      </div>
                    </div>
                  </div>

                  {/* Warranty Coverage */}
                  <div
                    className="text-xs font-bold uppercase tracking-wider mb-3 pb-1.5 border-b-2"
                    style={{ borderColor: brandColor, color: brandColor }}
                  >
                    Warranty Coverage
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-7">
                    <div className="text-center p-3.5 bg-slate-50 rounded-lg">
                      <div className="text-2xl font-black" style={{ color: brandColor }}>
                        {panelWarranty}
                      </div>
                      <div className="text-xs text-slate-500">Panel Warranty</div>
                    </div>
                    <div className="text-center p-3.5 bg-slate-50 rounded-lg">
                      <div className="text-2xl font-black" style={{ color: brandColor }}>
                        {inverterWarranty}
                      </div>
                      <div className="text-xs text-slate-500">Inverter Warranty</div>
                    </div>
                    <div className="text-center p-3.5 bg-slate-50 rounded-lg">
                      <div className="text-2xl font-black" style={{ color: brandColor }}>
                        {workWarranty}
                      </div>
                      <div className="text-xs text-slate-500">Workmanship</div>
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="text-sm text-slate-500 leading-relaxed mb-7">
                    <h4 className="text-gray-900 font-semibold mb-1.5">Terms & Conditions</h4>
                    <p>{customNotes}</p>
                  </div>

                  {/* Signature Area */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-5 border-t border-slate-200">
                    <div>
                      <label className="block text-[0.7rem] uppercase tracking-wider text-slate-500 mb-1.5">
                        Customer Signature
                      </label>
                      <div className="border-b border-slate-300 h-10" />
                      <label className="block text-[0.7rem] uppercase tracking-wider text-slate-500 mt-1.5 mb-1.5">
                        Date
                      </label>
                      <div className="border-b border-slate-300 h-10" />
                    </div>
                    <div>
                      <label className="block text-[0.7rem] uppercase tracking-wider text-slate-500 mb-1.5">
                        Company Representative
                      </label>
                      <div className="border-b border-slate-300 h-10" />
                      <label className="block text-[0.7rem] uppercase tracking-wider text-slate-500 mt-1.5 mb-1.5">
                        Date
                      </label>
                      <div className="border-b border-slate-300 h-10" />
                    </div>
                  </div>
                </div>

                {/* Quote Footer */}
                <div className="px-10 py-4 bg-slate-50 text-center text-sm text-slate-500 border-t border-slate-200">
                  {companyName} · {companyPhone} · {companyLicense}
                </div>
              </div>

              {/* CTA Section */}
              <div className="text-center mt-10 px-6 py-9 rounded-[14px] border border-[#2A3352] bg-gradient-to-br from-amber-500/5 to-emerald-500/5 print:hidden">
                <h3 className="text-xl font-extrabold mb-2">Want Quotes That Close Themselves?</h3>
                <p className="text-slate-400 mb-4 text-base">
                  We help solar installers build sales systems that convert 40%+ of consultations.
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-gradient-to-br from-amber-500 to-amber-600 text-black font-bold px-7 py-3.5 rounded-xl text-base transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(245,158,11,0.3)]"
                >
                  Book Free Strategy Call →
                </Link>
              </div>
            </div>
          </div>

          {/* Branding */}
          <div className="text-center py-6 text-slate-500 text-sm print:hidden">
            Built with ☀️ by{' '}
            <Link to="/" className="text-amber-500 font-semibold no-underline hover:underline">
              Boltcall
            </Link>{' '}
            — The Growth Partner for Solar Pros
          </div>
        </div>
      </main>

      {/* Trust + Social Proof */}
      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-medium text-gray-500 mb-5">
            Trusted by 1,000+ local businesses &middot; No credit card required &middot; Cancel anytime
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {[
              { quote: '"Paid for itself within the first week."', author: 'HVAC contractor, Texas' },
              { quote: '"Set up in 30 minutes. Never missed a lead since."', author: 'Dental practice, Florida' },
            ].map((t) => (
              <div key={t.author} className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-4 text-left max-w-xs">
                <div className="text-yellow-400 text-sm mb-2">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                <p className="text-gray-700 text-sm leading-relaxed italic">{t.quote}</p>
                <p className="text-gray-400 text-xs mt-2">&mdash; {t.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default SolarQuoteGenerator;
