import { AgentWorkflowBlock } from "@/components/ui/agent-workflow-block";

export default function AgentArchitecturePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 sm:px-8">
      {/* Page header */}
      <div className="mb-8 max-w-2xl text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
          Agent Architecture
        </h1>
        <p className="mt-3 text-sm text-foreground/60 sm:text-base">
          Each agent connects to channels through <strong>use cases</strong>, not
          channels directly. Inbound agents handle incoming leads. Outbound agents
          proactively reach out. Channels are just the pipes.
        </p>
      </div>

      {/* Diagram */}
      <div className="w-full max-w-5xl">
        <AgentWorkflowBlock />
      </div>

      {/* Explanation cards */}
      <div className="mt-10 grid w-full max-w-5xl gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-5">
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Triggers
          </h3>
          <p className="text-sm text-foreground/70">
            What initiates the agent — missed calls, website visitors, SMS messages,
            or ad form submissions.
          </p>
        </div>
        <div className="rounded-xl border border-blue-400/20 bg-blue-400/5 p-5">
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
            Agents
          </h3>
          <p className="text-sm text-foreground/70">
            Direction determines capabilities. Inbound agents respond. Outbound
            agents initiate. Upgrade to unlock outbound use cases.
          </p>
        </div>
        <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-5">
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
            Outputs
          </h3>
          <p className="text-sm text-foreground/70">
            The value delivered — booked appointments, CRM updates, review requests,
            and lead reactivation.
          </p>
        </div>
      </div>
    </div>
  );
}
