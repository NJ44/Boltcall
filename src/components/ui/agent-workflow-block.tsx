import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import type React from "react";
import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card-shadcn";
import {
  Phone,
  MessageSquare,
  Globe,
  Megaphone,
  CalendarCheck,
  Star,
  UserPlus,
  Send,
  RotateCcw,
  Bot,
  ShieldCheck,
  Zap,
  Settings,
  Lock,
  Bell,
  Shield,
} from "lucide-react";

interface WorkflowNode {
  id: string;
  type: "use-case" | "agent" | "output";
  direction?: "inbound" | "outbound";
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  configured: boolean;
  locked?: boolean;
  position: { x: number; y: number };
}

interface WorkflowConnection {
  from: string;
  to: string;
}

const NODE_WIDTH = 170;
const NODE_HEIGHT = 56;
const AGENT_SIZE = 90; // circular agent nodes
const ROW_GAP = 68;

const initialNodes: WorkflowNode[] = [
  // Inbound use cases (emerald)
  { id: "uc-ai-receptionist", type: "use-case", title: "Call Enters", description: "Answers inbound calls 24/7, qualifies callers, books appointments", icon: Phone, color: "emerald", configured: true, position: { x: 30, y: 30 } },
  { id: "uc-sms-inquiry", type: "use-case", title: "Inbound SMS", description: "Handles inbound text messages — answers questions, books appointments", icon: MessageSquare, color: "emerald", configured: true, position: { x: 30, y: 30 + ROW_GAP } },
  { id: "uc-missed-call", type: "use-case", title: "Missed Call", description: "Sends an instant text when a call goes unanswered", icon: Phone, color: "emerald", configured: true, position: { x: 30, y: 30 + ROW_GAP * 2 } },
  // Outbound use cases (purple)
  { id: "uc-instant-ad-reply", type: "use-case", title: "Ad Lead", description: "Responds to Facebook/Google ad leads within seconds via SMS", icon: Megaphone, color: "purple", configured: true, position: { x: 30, y: 30 + ROW_GAP * 3 } },
  { id: "uc-instant-web-reply", type: "use-case", title: "Website Lead", description: "Auto-responds to website form submissions and chat inquiries", icon: Globe, color: "purple", configured: true, position: { x: 30, y: 30 + ROW_GAP * 4 } },

  // Agents — centered vertically against their use-case groups
  // inbound: avg center of 3 use-cases (y 30,98,166) = 126 → y = 126 - AGENT_SIZE/2
  { id: "agent-inbound", type: "agent", direction: "inbound", title: "Inbound Agent", description: "Handles all incoming leads & customer requests across channels", icon: ShieldCheck, color: "blue", configured: true, position: { x: 290, y: 81 } },
  // outbound: avg center of 2 use-cases (y 234,302) = 296 → y = 296 - AGENT_SIZE/2
  { id: "agent-outbound", type: "agent", direction: "outbound", title: "Outbound Agent", description: "Proactively reaches out to existing leads & past customers", icon: Zap, color: "purple", configured: false, position: { x: 290, y: 251 } },

  // Outputs — configured
  { id: "out-calendar", type: "output", title: "Calendar Booking", description: "Appointment scheduled automatically into your calendar", icon: CalendarCheck, color: "amber", configured: true, position: { x: 550, y: 30 } },
  { id: "out-sms-followup", type: "output", title: "SMS Follow-Up", description: "Instant text confirmation or follow-up sent to the lead", icon: Send, color: "amber", configured: true, position: { x: 550, y: 30 + ROW_GAP } },
  { id: "out-crm", type: "output", title: "CRM Update", description: "Lead record created or updated in your CRM automatically", icon: UserPlus, color: "amber", configured: true, position: { x: 550, y: 30 + ROW_GAP * 2 } },
  // Outputs — not configured
  { id: "out-review", type: "output", title: "Review Request", description: "Google review prompt sent to customer after service is complete", icon: Star, color: "amber", configured: false, position: { x: 550, y: 30 + ROW_GAP * 3 } },
  { id: "out-reactivation", type: "output", title: "Lead Reactivation", description: "Cold leads re-engaged with personalized SMS or call campaign", icon: RotateCcw, color: "amber", configured: false, position: { x: 550, y: 30 + ROW_GAP * 4 } },
  // Outputs — locked (premium)
  { id: "out-reminders", type: "output", title: "Reminders", description: "Automated appointment and follow-up reminders sent to contacts before they're due", icon: Bell, color: "slate", configured: false, locked: true, position: { x: 550, y: 30 + ROW_GAP * 5 } },
  { id: "out-reputation", type: "output", title: "Reputation Manager", description: "Monitor and respond to reviews across Google, Yelp, and more from one place", icon: Shield, color: "slate", configured: false, locked: true, position: { x: 550, y: 30 + ROW_GAP * 6 } },
];

const initialConnections: WorkflowConnection[] = [
  // Inbound use cases → inbound agent
  { from: "uc-ai-receptionist", to: "agent-inbound" },
  { from: "uc-sms-inquiry", to: "agent-inbound" },
  { from: "uc-missed-call", to: "agent-inbound" },
  // Outbound use cases → outbound agent
  { from: "uc-instant-ad-reply", to: "agent-outbound" },
  { from: "uc-instant-web-reply", to: "agent-outbound" },
  // Inbound agent outputs
  { from: "agent-inbound", to: "out-calendar" },
  { from: "agent-inbound", to: "out-sms-followup" },
  { from: "agent-inbound", to: "out-crm" },
  // Outbound agent outputs
  { from: "agent-outbound", to: "out-review" },
  { from: "agent-outbound", to: "out-reactivation" },
  { from: "agent-outbound", to: "out-crm" },
  // Locked outputs (outbound)
  { from: "agent-outbound", to: "out-reminders" },
  { from: "agent-outbound", to: "out-reputation" },
];

const colorClasses: Record<string, string> = {
  emerald: "border-emerald-400/40 bg-emerald-400/10 text-emerald-400",
  blue: "border-blue-400/40 bg-blue-400/10 text-blue-400",
  amber: "border-amber-400/40 bg-amber-400/10 text-amber-400",
  purple: "border-purple-400/40 bg-purple-400/10 text-purple-400",
  slate: "border-slate-500/30 bg-slate-500/5 text-slate-400/50",
};

const columnLabels: Record<string, string> = { "use-case": "USE CASES", agent: "AGENTS", output: "OUTPUTS" };
const columnColors: Record<string, string> = { "use-case": "text-emerald-400", agent: "text-blue-400", output: "text-amber-400" };

function nodeRight(node: WorkflowNode) {
  return node.position.x + (node.type === "agent" ? AGENT_SIZE : NODE_WIDTH);
}
function nodeCenterY(node: WorkflowNode) {
  return node.position.y + (node.type === "agent" ? AGENT_SIZE / 2 : NODE_HEIGHT / 2);
}

function WorkflowConnectionLine({ from, to, nodes, locked }: { from: string; to: string; nodes: WorkflowNode[]; locked?: boolean }) {
  const fromNode = nodes.find((n) => n.id === from);
  const toNode = nodes.find((n) => n.id === to);
  if (!fromNode || !toNode) return null;
  const startX = nodeRight(fromNode);
  const startY = nodeCenterY(fromNode);
  const endX = toNode.position.x;
  const endY = nodeCenterY(toNode);
  const cp1X = startX + (endX - startX) * 0.5;
  const cp2X = endX - (endX - startX) * 0.5;
  const d = `M${startX},${startY} C${cp1X},${startY} ${cp2X},${endY} ${endX},${endY}`;
  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeDasharray="6,5"
        strokeLinecap="round"
        opacity={locked ? 0.08 : 0.2}
        className="text-foreground"
      />
      <circle cx={endX} cy={endY} r={2.5} fill="currentColor" opacity={locked ? 0.12 : 0.35} className="text-foreground" />
    </g>
  );
}

function NodeTooltip({
  description,
  configured,
  locked,
}: {
  description: string;
  configured: boolean;
  locked?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.15 }}
      className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-[60] w-52 rounded-lg border border-border/50 bg-background/95 px-3 py-2.5 text-[10px] leading-relaxed text-foreground/70 shadow-xl backdrop-blur pointer-events-none"
    >
      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-l border-t border-border/50 bg-background/95" />
      <span className="relative block mb-2">{description}</span>
      {locked ? (
        <div className="flex w-full items-center justify-center gap-1 rounded-md border border-amber-400/30 bg-amber-400/10 px-2 py-1 text-[9px] uppercase tracking-[0.12em] text-amber-400/90">
          <Lock className="h-2.5 w-2.5" />
          Upgrade to Unlock
        </div>
      ) : !configured ? (
        <div className="flex w-full items-center justify-center gap-1 rounded-md border border-foreground/20 bg-foreground/5 px-2 py-1 text-[9px] uppercase tracking-[0.12em] text-foreground/60">
          <Settings className="h-2.5 w-2.5" />
          Configure
        </div>
      ) : null}
    </motion.div>
  );
}

export function AgentWorkflowBlock() {
  const [nodes, setNodes] = useState<WorkflowNode[]>(initialNodes);
  const [connections] = useState<WorkflowConnection[]>(initialConnections);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragStartPosition = useRef<{ x: number; y: number } | null>(null);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [contentSize, setContentSize] = useState(() => {
    const maxX = Math.max(...initialNodes.map((n) => n.position.x + (n.type === "agent" ? AGENT_SIZE : NODE_WIDTH)));
    const maxY = Math.max(...initialNodes.map((n) => n.position.y + (n.type === "agent" ? AGENT_SIZE : NODE_HEIGHT)));
    return { width: maxX + 50, height: maxY + 50 };
  });

  const handleDragStart = (nodeId: string) => {
    setDraggingNodeId(nodeId);
    const node = nodes.find((n) => n.id === nodeId);
    if (node) dragStartPosition.current = { x: node.position.x, y: node.position.y };
  };

  const handleDrag = (nodeId: string, { offset }: PanInfo) => {
    if (draggingNodeId !== nodeId || !dragStartPosition.current) return;
    const constrainedX = Math.max(0, dragStartPosition.current.x + offset.x);
    const constrainedY = Math.max(0, dragStartPosition.current.y + offset.y);
    flushSync(() => {
      setNodes((prev) =>
        prev.map((node) =>
          node.id === nodeId
            ? { ...node, position: { x: constrainedX, y: constrainedY } }
            : node
        )
      );
    });
    const draggedNode = nodes.find((n) => n.id === nodeId);
    const w = draggedNode?.type === "agent" ? AGENT_SIZE : NODE_WIDTH;
    const h = draggedNode?.type === "agent" ? AGENT_SIZE : NODE_HEIGHT;
    setContentSize((prev) => ({
      width: Math.max(prev.width, constrainedX + w + 50),
      height: Math.max(prev.height, constrainedY + h + 50),
    }));
  };

  const handleDragEnd = () => {
    setDraggingNodeId(null);
    dragStartPosition.current = null;
  };

  const useCaseCount = nodes.filter((n) => n.type === "use-case").length;
  const agentCount = nodes.filter((n) => n.type === "agent").length;
  const outputCount = nodes.filter((n) => n.type === "output").length;
  const unconfiguredCount = nodes.filter((n) => !n.configured && !n.locked).length;

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-border/40 bg-background/60 backdrop-blur p-4 sm:p-6">
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="rounded-full border-blue-400/40 bg-blue-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">
            <Bot className="mr-1.5 h-3 w-3" />
            Architecture
          </Badge>
          <span className="text-xs sm:text-sm uppercase tracking-[0.25em] text-foreground/50">
            Agent Channel Map
          </span>
        </div>
        <div className="flex items-center gap-2">
        </div>
      </div>

      {/* Column Labels */}
      <div className="mb-2 grid grid-cols-3 px-2">
        {(["use-case", "agent", "output"] as const).map((type) => (
          <div key={type} className="flex items-center gap-2">
            <div className={`h-1.5 w-1.5 rounded-full ${type === "use-case" ? "bg-emerald-400" : type === "agent" ? "bg-blue-400" : "bg-amber-400"}`} />
            <span className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${columnColors[type]}`}>{columnLabels[type]}</span>
          </div>
        ))}
      </div>

      {/* Canvas — height grows with content, no scrollbar */}
      <div
        ref={canvasRef}
        className="relative w-full overflow-hidden rounded-xl border border-border/30 bg-background/40"
        style={{ height: contentSize.height + 20 }}
        role="region"
        aria-label="Agent architecture canvas"
        tabIndex={0}
      >
        <div className="relative" style={{ minWidth: contentSize.width, minHeight: contentSize.height }}>
          <svg
            className="absolute top-0 left-0 pointer-events-none"
            width={contentSize.width}
            height={contentSize.height}
            style={{ overflow: "visible" }}
            aria-hidden="true"
          >
            {connections.map((c) => {
              const toNode = nodes.find((n) => n.id === c.to);
              return (
                <WorkflowConnectionLine
                  key={`${c.from}-${c.to}`}
                  from={c.from}
                  to={c.to}
                  nodes={nodes}
                  locked={toNode?.locked}
                />
              );
            })}
          </svg>

          {nodes.map((node) => {
            const Icon = node.icon;
            const isDragging = draggingNodeId === node.id;
            const isHovered = hoveredNodeId === node.id;

            const isAgent = node.type === "agent";

            return (
              <motion.div
                key={node.id}
                drag
                dragMomentum={false}
                dragConstraints={{ left: 0, top: 0, right: 100000, bottom: 100000 }}
                onDragStart={() => handleDragStart(node.id)}
                onDrag={(_, info) => handleDrag(node.id, info)}
                onDragEnd={handleDragEnd}
                onHoverStart={() => setHoveredNodeId(node.id)}
                onHoverEnd={() => setHoveredNodeId(null)}
                style={{
                  x: node.position.x,
                  y: node.position.y,
                  width: isAgent ? AGENT_SIZE : NODE_WIDTH,
                  height: isAgent ? AGENT_SIZE : undefined,
                  transformOrigin: "0 0",
                  zIndex: isHovered ? 100 : isDragging ? 50 : 1,
                }}
                className="absolute cursor-grab"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2, delay: nodes.indexOf(node) * 0.03 }}
                whileHover={{ scale: 1.06 }}
                whileDrag={{ scale: 1.08, cursor: "grabbing" }}
                aria-grabbed={isDragging}
              >
                {isAgent ? (
                  /* Circular agent node */
                  <div
                    className={`relative flex flex-col items-center justify-center rounded-full border-2 ${colorClasses[node.color]} bg-background/80 backdrop-blur transition-all ${isDragging ? "shadow-2xl" : "shadow-lg"} ${node.direction === "inbound" ? "ring-2 ring-blue-400/30 ring-offset-2 ring-offset-background" : "ring-2 ring-purple-400/30 ring-offset-2 ring-offset-background"} ${!node.configured ? "opacity-75 border-dashed" : ""}`}
                    style={{ width: AGENT_SIZE, height: AGENT_SIZE }}
                    role="article"
                    aria-label={`agent node: ${node.title}`}
                  >
                    {/* Glow backdrop */}
                    <div
                      className={`absolute inset-0 rounded-full opacity-20 blur-md ${node.direction === "inbound" ? "bg-blue-400" : "bg-purple-400"}`}
                      aria-hidden="true"
                    />
                    <div
                      className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full mb-1"
                      aria-hidden="true"
                    >
                      <img
                        src="/boltcall_small_logo.webp"
                        alt="Boltcall"
                        className={`h-7 w-7 object-contain ${node.direction === "outbound" ? "brightness-0 invert" : ""}`}
                      />
                    </div>
                    <span className="relative text-[9px] font-bold tracking-tight text-foreground text-center leading-tight px-1 max-w-full truncate">
                      {node.title}
                    </span>
                    <AnimatePresence>
                      {isHovered && !isDragging && (
                        <NodeTooltip
                          description={node.description}
                          configured={node.configured}
                          locked={node.locked}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  /* Standard rectangular node */
                  <Card
                    className={`group/node relative w-full overflow-visible rounded-lg border ${colorClasses[node.color]} bg-background/70 px-2.5 py-2 backdrop-blur transition-all hover:shadow-lg ${isDragging ? "shadow-xl ring-2 ring-primary/50 " : ""}${node.locked ? "opacity-40 border-dashed" : !node.configured ? "opacity-75 border-dashed" : ""}`}
                    role="article"
                    aria-label={`${node.type} node: ${node.title}`}
                  >
                    <div className="relative flex items-center gap-2">
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border ${colorClasses[node.color]} bg-background/80 backdrop-blur`}
                        aria-hidden="true"
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-semibold tracking-tight text-foreground leading-tight">
                          {node.title}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Badge
                            variant="outline"
                            className="rounded-full border-border/40 bg-background/80 px-1.5 py-0 text-[8px] uppercase tracking-[0.12em] text-foreground/50 leading-none"
                          >
                            {node.type === "use-case" ? "trigger" : "result"}
                          </Badge>
                          {node.locked && (
                            <Lock className="h-2.5 w-2.5 text-amber-400/60" aria-label="Premium feature" />
                          )}
                        </div>
                      </div>
                    </div>
                    <AnimatePresence>
                      {isHovered && !isDragging && (
                        <NodeTooltip
                          description={node.description}
                          configured={node.configured}
                          locked={node.locked}
                        />
                      )}
                    </AnimatePresence>
                  </Card>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/30 bg-background/40 px-4 py-2.5 backdrop-blur-sm" role="status" aria-live="polite">
        <div className="flex flex-wrap items-center gap-4 text-xs text-foreground/60">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
            <span className="uppercase tracking-[0.15em]">{useCaseCount} Triggers</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-400" aria-hidden="true" />
            <span className="uppercase tracking-[0.15em]">{agentCount} Agents</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-amber-400" aria-hidden="true" />
            <span className="uppercase tracking-[0.15em]">{outputCount} Outputs</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
            <span className="uppercase tracking-[0.15em]">{connections.length} Connections</span>
          </div>
        </div>
        {unconfiguredCount > 0 ? (
          <Link
            to="/dashboard/agents"
            className="rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-amber-400 hover:bg-amber-400/20 transition-colors"
          >
            {unconfiguredCount} output{unconfiguredCount !== 1 ? "s" : ""} not set up →
          </Link>
        ) : (
          <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/40">
            Hover for details · Drag to reposition
          </p>
        )}
      </div>
    </div>
  );
}
