import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GiveawayBar from '@/components/GiveawayBar';
import { FunnelChart, type FunnelStage } from '@/components/ui/funnel-chart';
import { Slider } from '@/components/ui/slider-number-flow';
import { Button } from '@/components/ui/button-shadcn';
import { Check, Users } from 'lucide-react';
import { GiveawayMultiStepForm } from '@/components/ui/giveaway-multistep-form';

const FunnelOptimiser = () => {
  const [visitors, setVisitors] = useState(12400);
  const [leadsPct, setLeadsPct] = useState(55);
  const [qualifiedPct, setQualifiedPct] = useState(50);
  const [proposalsPct, setProposalsPct] = useState(50);

  // Quiz State
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allowNotifications, setAllowNotifications] = useState(false);
  const [surveyData, setSurveyData] = useState({
    name: 'Demo User',
    industry: 'Real Estate',
    email: 'demo@example.com'
  });

  useEffect(() => {
    document.title = 'Funnel Optimiser | Boltcall';
  }, []);

  const handleFormDataUpdate = (data: Record<string, string>) => {
    setSurveyData(prev => ({ ...prev, ...data }));
  };

  const handleQuizSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('https://noamyakoby6--boltcall-funnel-optimizer-analyze-funnel.modal.run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: surveyData.name?.trim() || 'Your Business',
          email: surveyData.email?.trim() || '',
          niche: surveyData.industry || 'General',
          visitors,
          v2l: leadsPct,
          l2q: qualifiedPct,
          q2c: proposalsPct,
          deal_value: 2000,
        }),
      });
      if (!response.ok) throw new Error('Webhook failed');
    } catch (err) {
      console.error('Funnel report webhook error:', err);
    }
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const leadsValue = Math.round(visitors * (leadsPct / 100));
  const qualifiedValue = Math.round(leadsValue * (qualifiedPct / 100));
  const proposalsValue = Math.round(qualifiedValue * (proposalsPct / 100));

  const data: FunnelStage[] = [
    { label: 'Visitors', value: visitors },
    { label: 'Leads', value: leadsValue },
    { label: 'Qualified', value: qualifiedValue },
    { label: 'Proposals', value: proposalsValue },
  ];

  const CombinedSlidersContent = (
    <div className="space-y-6">
      <div className="bg-white/10 p-4 rounded-2xl border border-white/20">
        <div className="flex items-center gap-4">
          <div className="bg-white/10 p-2.5 rounded-xl border border-white/10 shrink-0">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest block mb-0.5">
              Initial Monthly Visitors
            </label>
            <input
              type="number"
              value={visitors}
              onChange={(e) => setVisitors(Number(e.target.value))}
              className="bg-transparent font-mono text-xl font-bold text-white outline-none w-full"
            />
          </div>
        </div>
      </div>

      <div className="space-y-6 bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/10">
        <div className="group">
          <div className="flex justify-between items-center gap-4 mb-3">
            <label className="text-sm font-bold text-white/90 min-w-0 flex-shrink truncate">Lead Capture Rate</label>
            <span className="text-sm font-mono font-bold text-blue-300 bg-blue-500/20 px-2 py-1 rounded shrink-0 whitespace-nowrap">{leadsPct}%</span>
          </div>
          <Slider
            value={[leadsPct]}
            min={0}
            max={100}
            step={1}
            onValueChange={(val) => setLeadsPct(val[0] ?? 0)}
            className="w-full text-white"
          />
        </div>

        <div className="group">
          <div className="flex justify-between items-center gap-4 mb-3">
            <label className="text-sm font-bold text-white/90 min-w-0 flex-shrink truncate">Qualification Rate</label>
            <span className="text-sm font-mono font-bold text-blue-300 bg-blue-500/20 px-2 py-1 rounded shrink-0 whitespace-nowrap">{qualifiedPct}%</span>
          </div>
          <Slider
            value={[qualifiedPct]}
            min={0}
            max={100}
            step={1}
            onValueChange={(val) => setQualifiedPct(val[0] ?? 0)}
            className="w-full text-white"
          />
        </div>

        <div className="group">
          <div className="flex justify-between items-center gap-4 mb-3">
            <label className="text-sm font-bold text-white/90 min-w-0 flex-shrink truncate">Proposal Rate</label>
            <span className="text-sm font-mono font-bold text-blue-300 bg-blue-500/20 px-2 py-1 rounded shrink-0 whitespace-nowrap">{proposalsPct}%</span>
          </div>
          <Slider
            value={[proposalsPct]}
            min={0}
            max={100}
            step={1}
            onValueChange={(val) => setProposalsPct(val[0] ?? 0)}
            className="w-full text-white"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafafa] text-text">
      <GiveawayBar />
      <Header />
      <style>{`
        .funnel-chart-black-values [class*="text-foreground"] {
          color: #000 !important;
        }
      `}</style>
      <main className="container mx-auto px-6 py-20 max-w-5xl">
        <div className="space-y-12">
          {/* Header Section */}
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-black uppercase">
              Funnel Optimiser
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Quiz Section - 5/12 width (narrower) */}
            <div className="lg:col-span-5 w-full text-white h-full relative z-10">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl shadow-blue-200/50 min-h-[700px]">
                <div className="max-w-md mx-auto">
                  {!isSubmitted ? (
                    <GiveawayMultiStepForm
                      formData={surveyData}
                      setFormData={handleFormDataUpdate}
                      allowNotifications={allowNotifications}
                      setAllowNotifications={setAllowNotifications}
                      onSubmit={handleQuizSubmit}
                      isSubmitting={isSubmitting}
                      isSubmitted={isSubmitted}
                      step2Extras={CombinedSlidersContent}
                    />
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-10"
                    >
                      <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-10">
                        <Check className="w-12 h-12 text-white" strokeWidth={3} />
                      </div>
                      <h2 className="text-4xl font-bold mb-4">Optimization Strategy Ready!</h2>
                      <p className="text-xl text-blue-100 mb-10 opacity-90">We've generated your custom funnel analysis based on the latest parameters.</p>
                      <Button 
                        onClick={() => setIsSubmitted(false)}
                        className="bg-white text-blue-600 hover:bg-white/90 font-bold px-10 py-5 rounded-2xl text-xl h-auto transition-all active:scale-95 shadow-xl shadow-black/10"
                      >
                        Run New Simulation
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {/* Visualization Section - 7/12 width (wider) */}
            <div className="lg:col-span-7 w-full sticky top-24">
              <div className="bg-white p-8 md:p-12 rounded-3xl border border-zinc-200/60 shadow-sm flex flex-col items-center">
                <div className="w-full h-[400px]">
                  <FunnelChart
                    data={data}
                    orientation="vertical"
                    color="#2563eb"
                    layers={3}
                    gap={0}
                    grid={false}
                    className="funnel-chart-black-values"
                    style={{ height: '100%' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FunnelOptimiser;
