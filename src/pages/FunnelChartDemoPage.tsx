import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FunnelChart, type FunnelStage } from '@/components/ui/funnel-chart';
import { Slider } from '@/components/ui/slider-number-flow';

const VISITORS_BASE = 12400;

const FunnelChartDemoPage = () => {
  // Leads are % of visitors; Qualified are % of Leads; Proposals are % of Qualified.
  const [leadsPct, setLeadsPct] = useState(55);
  const [qualifiedPct, setQualifiedPct] = useState(50);
  const [proposalsPct, setProposalsPct] = useState(50);

  const leadsValue = Math.round(VISITORS_BASE * (leadsPct / 100));
  const qualifiedValue = Math.round(leadsValue * (qualifiedPct / 100));
  const proposalsValue = Math.round(qualifiedValue * (proposalsPct / 100));

  const data: FunnelStage[] = [
    { label: 'Visitors', value: VISITORS_BASE },
    { label: 'Leads', value: leadsValue },
    { label: 'Qualified', value: qualifiedValue },
    { label: 'Proposals', value: proposalsValue },
  ];

  return (
    <div className="min-h-screen bg-white text-text">
      <Header />
      <main className="container mx-auto flex gap-12 px-4 py-16">
        <aside className="w-full max-w-xs space-y-6">
          <h2 className="text-xl font-heading text-text">Adjust funnel widths</h2>
          <div className="space-y-4">
            <div>
              <div className="mb-1 text-sm font-medium text-muted-foreground">
                Leads
              </div>
              <Slider
                value={[leadsPct]}
                min={0}
                max={100}
                step={1}
                onValueChange={(val) => setLeadsPct(val[0] ?? 0)}
                className="w-full"
              />
            </div>
            <div>
              <div className="mb-1 text-sm font-medium text-muted-foreground">
                Qualified
              </div>
              <Slider
                value={[qualifiedPct]}
                min={0}
                max={100}
                step={1}
                onValueChange={(val) => setQualifiedPct(val[0] ?? 0)}
                className="w-full"
              />
            </div>
            <div>
              <div className="mb-1 text-sm font-medium text-muted-foreground">
                Proposals
              </div>
              <Slider
                value={[proposalsPct]}
                min={0}
                max={100}
                step={1}
                onValueChange={(val) => setProposalsPct(val[0] ?? 0)}
                className="w-full"
              />
            </div>
          </div>
        </aside>

        <section className="ml-auto max-w-xl">
          <header className="mb-10 text-right">
            <h1 className="text-4xl font-heading mb-3">
              Funnel Chart Component Demo
            </h1>
          </header>

          <div className="w-full">
            <FunnelChart
              data={data}
              orientation="vertical"
              color="var(--chart-1)"
              layers={3}
              gap={0}
              grid={false}
              style={{ height: 338 }}
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FunnelChartDemoPage;

