import { motion, type PanInfo } from "framer-motion";
import type React from "react";
import { useRef, useState } from "react";
import { flushSync } from "react-dom";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card-shadcn";
import {
  ArrowRight,
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
} from "lucide-react";

// ── Interfaces ──────────────────────────────────────────────────────────────
interface WorkflowNode {
  id: string;
  type: "use-case" | "agent" | "output";
  direction?: "inbound" | "outbound";
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  position: { x: number; y: number };
}

interface WorkflowConnection {
  from: string;
  to: string;
}

// ── Constants ───────────────────────────────────────────────────────────────
const NODE_WIDTH = 210;
const NODE_HEIGHT = 100;

// ── Initial data: Boltcall Agent Architecture ───────────────────────────────
const initialNodes: WorkflowNode[] = [
  // USE CASES — Left column
  {
    id: "uc-missed-call",
    type: "use-case",
    title: "Missed Call",
    description: "Caller reaches voicemail or no answer",
    icon: Phone,
    color: "emerald",
    position: { x: 40, y: 40 },
  },
  {
    id: "uc-website-chat",
    type: "use-case",
    title: "Website Chat",
    description: "Visitor starts conversation on site",
    icon: Globe,
    color: "emerald",
    position: { x: 40, y: 160 },
  },
  {
    id: "uc-sms-inquiry",
    type: "use-case",
    title: "SMS Inquiry",
    description: "Customer texts your business number",
    icon: MessageSquare,
    color: "emerald",
    position: { x: 40, y: 280 },
  },
  {
    id: "uc-ad-lead",
    type: "use-case",
    title: "Ad Lead Form",
    description: "Lead submits form from Facebook/Google ad",
    icon: Megaphone,
    color: "emerald",
    position: { x: 40, y: 400 },
  },

  // AGENTS — Center column
  {
    id: "agent-inbound",
    type: "agent",
    direction: "inbound",
    title: "Inbound Agent",
    description: "Handles incoming leads & customer requests",
    icon: ShieldCheck,
    color: "blue",
    position: { x: 340, y: 110 },
  },
  {
    id: "agent-outbound",
    type: "agent",
    direction: "outbound",
    title: "Outbound Agent",
    description: "Proactively reaches out to leads & customers",
    icon: Zap,
    color: "purple",
    position: { x: 340, y: 330 },
  },

  // OUTPUTS — Right column
  {
    id: "out-calendar",
    type: "output",
    title: "Calendar Booking",
    description: "Appointment scheduled automatically",
    icon: CalendarCheck,
    color: "amber",
    position: { x: 640, y: 20 },
  },
  {
    id: "out-sms-followup",
    type: "output",
    title: "SMS Follow-Up",
    description: "Instant text confirmation sent",
    icon: Send,
    color: "amber",
    position: { x: 640, y: 130 },
  },
  {
    id: "out-crm",
    type: "output",
    title: "CRM Update",
    description: "Lead record created or updated",
    icon: UserPlus,
    color: "amber",
    position: { x: 640, y: 240 },
  },
  {
    id: "out-review",
    type: "output",
    title: "Review Request",
    description: "Google review prompt sent after service",
    icon: Star,
    color: "amber",
    position: { x: 640, y: 350 },
  },
  {
    id: "out-reactivation",
    type: "output",
    title: "Lead Reactivation",
    description: "Cold leads re-engaged via SMS/call",
    icon: RotateCcw,
    color: "amber",
    position: { x: 640, y: 460 },
  },
];

const initialConnections: WorkflowConnection[] = [
  // Use cases → Inbound Agent
  { from: "uc-missed-call", to: "agent-inbound" },
  { from: "uc-website-chat", to: "agent-inbound" },
  { from: "uc-sms-inquiry", to: "agent-inbound" },
  { from: "uc-ad-lead", to: "agent-inbound" },
  // Inbound Agent → Outputs
  { from: "agent-inbound", to: "out-calendar" },
  { from: "agent-inbound", to: "out-sms-followup" },
  { from: "agent-inbound", to: "out-crm" },
  // Outbound Agent → Outputs
  { from: "agent-outbound", to: "out-review" },
  { from: "agent-outbound", to: "out-reactivation" },
  { from: "agent-outbound", to: "out-crm" },
];

const colorClasses: Record<string, string> = {
  emerald: "border-emerald-400/40 bg-emerald-400/10 text-emerald-400",
  blue: "border-blue-400/40 bg-blue-400/10 text-blue-400",
  amber: "border-amber-400/40 bg-amber-400/10 text-amber-400",
  purple: "border-purple-400/40 bg-purple-400/10 text-purple-400",
};

const columnLabels: Record<string, string> = {
  "use-case": "USE CASES",
  agent: "AGENTS",
  output: "OUTPUTS",
};

const columnColors: Record<string, string> = {
  "use-case": "text-emerald-400",
  agent: "text-blue-400",
  output: "text-amber-400",
};

// ── Connection Line Component ───────────────────────────────────────────────
function WorkflowConnectionLine({
  from,
  to,
  nodes,
}: {
  from: string;
  to: string;
  nodes: WorkflowNode[];
}) {
  const fromNode = nodes.find((n) => n.id === from);
  const toNode = nodes.find((n) => n.id === to);
  if (!fromNode || !toNode) return null;

  const startX = fromNode.position.x + NODE_WIDTH;
  const startY = fromNode.position.y + NODE_HEIGHT / 2;
  const endX = toNode.position.x;
  const endY = toNode.position.y + NODE_HEIGHT / 2;

  const cp1X = startX + (endX - startX) * 0.5;
  const cp2X = endX - (endX - startX) * 0.5;

  const path = `M${startX},${startY} C${cp1X},${startY} ${cp2X},${endY} ${endX},${endY}`;

  return (
    <g>
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeDasharray="8,6"
        strokeLinecap="round"
        opacity={0.25}
        className="text-foreground"
      />
      {/* Arrow head */}
      <circle
        cx={endX}
        cy={endY}
        r={3}
        fill="currentColor"
        opacity={0.4}
        className="text-foreground"
      />
    </g>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────
export function AgentWorkflowBlock() {
  const [nodes, setNodes] = useState<WorkflowNode[]>(initialNodes);
  const [connections] = useState<WorkflowConnection[]>(initialConnections);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragStartPosition = useRef<{ x: number; y: number } | null>(null);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [contentSize, setContentSize] = useState(() => {
    const maxX = Math.max(
      ...initialNodes.map((n) => n.position.x + NODE_WIDTH)
    );
    const maxY = Math.max(
      ...initialNodes.map((n) => n.position.y + NODE_HEIGHT)
    );
    return { width: maxX + 60, height: maxY + 60 };
  });

  // ── Drag Handlers ─────────────────────────────────────────────────────────
  const handleDragStart = (nodeId: string) => {
    setDraggingNodeId(nodeId);
    const node = nodes.find((n) => n.id === nodeId);
    if (node) {
      dragStartPosition.current = { x: node.position.x, y: node.position.y };
    }
  };

  const handleDrag = (nodeId: string, { offset }: PanInfo) => {
    if (draggingNodeId !== nodeId || !dragStartPosition.current) return;

    const newX = dragStartPosition.current.x + offset.x;
    const newY = dragStartPosition.current.y + offset.y;
    const constrainedX = Math.max(0, newX);
    const constrainedY = Math.max(0, newY);

    flushSync(() => {
      setNodes((prev) =>
        prev.map((node) =>
          node.id === nodeId
            ? { ...node, position: { x: constrainedX, y: constrainedY } }
            : node
        )
      );
    });

    setContentSize((prev) => ({
      width: Math.max(prev.width, constrainedX + NODE_WIDTH + 60),
      height: Math.max(prev.height, constrainedY + NODE_HEIGHT + 60),
    }));
  };

  const handleDragEnd = () => {
    setDraggingNodeId(null);
    dragStartPosition.current = null;
  };

  // ── Column stats ──────────────────────────────────────────────────────────
  const useCaseCount = nodes.filter((n) => n.type === "use-case").length;
  const agentCount = nodes.filter((n) => n.type === "agent").length;
  const outputCount = nodes.filter((n) => n.type === "output").length;

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-border/40 bg-background/60 backdrop-blur p-4 sm:p-6">
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="rounded-full border-blue-400/40 bg-blue-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-blue-400"
          >
            <Bot className="mr-1.5 h-3 w-3" />
            Architecture
          </Badge>
          <span className="text-xs sm:text-sm uppercase tracking-[0.25em] text-foreground/50">
            Agent Channel Map
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="rounded-full border-emerald-400/40 bg-emerald-400/10 px-2.5 py-0.5 text-[10px] text-emerald-400">
            Inbound
          </Badge>
          <Badge variant="outline" className="rounded-full border-purple-400/40 bg-purple-400/10 px-2.5 py-0.5 text-[10px] text-purple-400">
            Outbound
          </Badge>
        </div>
      </div>

      {/* Column Labels */}
      <div className="mb-2 grid grid-cols-3 px-2">
        {(["use-case", "agent", "output"] as const).map((type) => (
          <div key={type} className="flex items-center gap-2">
            <div
              className={`h-1.5 w-1.5 rounded-full ${
                type === "use-case"
                  ? "bg-emerald-400"
                  : type === "agent"
                  ? "bg-blue-400"
                  : "bg-amber-400"
              }`}
            />
            <span
              className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${columnColors[type]}`}
            >
              {columnLabels[type]}
            </span>
          </div>
        ))}
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="relative h-[500px] w-full overflow-auto rounded-xl border border-border/30 bg-background/40 sm:h-[580px] md:h-[620px]"
        style={{ minHeight: "500px" }}
        role="region"
        aria-label="Agent architecture canvas"
        tabIndex={0}
      >
        <div
          className="relative"
          style={{
            minWidth: contentSize.width,
            minHeight: contentSize.height,
          }}
        >
          {/* SVG Connections */}
          <svg
            className="absolute top-0 left-0 pointer-events-none"
            width={contentSize.width}
            height={contentSize.height}
            style={{ overflow: "visible" }}
            aria-hidden="true"
          >
            {connections.map((c) => (
              <WorkflowConnectionLine
                key={`${c.from}-${c.to}`}
                from={c.from}
                to={c.to}
                nodes={nodes}
              />
            ))}
          </svg>

          {/* Nodes */}
          {nodes.map((node) => {
            const Icon = node.icon;
            const isDragging = draggingNodeId === node.id;

            return (
              <motion.div
                key={node.id}
                drag
                dragMomentum={false}
                dragConstraints={{
                  left: 0,
                  top: 0,
                  right: 100000,
                  bottom: 100000,
                }}
                onDragStart={() => handleDragStart(node.id)}
                onDrag={(_, info) => handleDrag(node.id, info)}
                onDragEnd={handleDragEnd}
                style={{
                  x: node.position.x,
                  y: node.position.y,
                  width: NODE_WIDTH,
                  transformOrigin: "0 0",
                }}
                className="absolute cursor-grab"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.25, delay: nodes.indexOf(node) * 0.04 }}
                whileHover={{ scale: 1.03 }}
                whileDrag={{ scale: 1.06, zIndex: 50, cursor: "grabbing" }}
                aria-grabbed={isDragging}
              >
                <Card
                  className={`group/node relative w-full overflow-hidden rounded-xl border ${colorClasses[node.color]} bg-background/70 p-3 backdrop-blur transition-all hover:shadow-lg ${
                    isDragging ? "shadow-xl ring-2 ring-primary/50" : ""
                  } ${
                    node.type === "agent"
                      ? "ring-1 ring-offset-1 ring-offset-background " +
                        (node.direction === "inbound"
                          ? "ring-blue-400/30"
                          : "ring-purple-400/30")
                      : ""
                  }`}
                  role="article"
                  aria-label={`${node.type} node: ${node.title}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.04] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/node:opacity-100" />

                  <div className="relative space-y-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${colorClasses[node.color]} bg-background/80 backdrop-blur`}
                        aria-hidden="true"
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <Badge
                            variant="outline"
                            className="rounded-full border-border/40 bg-background/80 px-1.5 py-0 text-[9px] uppercase tracking-[0.15em] text-foreground/60"
                          >
                            {node.type === "use-case"
                              ? "trigger"
                              : node.type === "agent"
                              ? node.direction
                              : "result"}
                          </Badge>
                        </div>
                        <h3 className="truncate text-xs font-semibold tracking-tight text-foreground">
                          {node.title}
                        </h3>
                      </div>
                    </div>
                    <p className="line-clamp-2 text-[10px] leading-relaxed text-foreground/70">
                      {node.description}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] text-foreground/50">
                      <ArrowRight className="h-2.5 w-2.5" aria-hidden="true" />
                      <span className="uppercase tracking-[0.1em]">
                        {node.type === "use-case"
                          ? "→ Agent"
                          : node.type === "agent"
                          ? "→ Outputs"
                          : "Delivered"}
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer Stats */}
      <div
        className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/30 bg-background/40 px-4 py-2.5 backdrop-blur-sm"
        role="status"
        aria-live="polite"
      >
        <div className="flex flex-wrap items-center gap-4 text-xs text-foreground/60">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
            <span className="uppercase tracking-[0.15em]">
              {useCaseCount} Triggers
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-400" aria-hidden="true" />
            <span className="uppercase tracking-[0.15em]">
              {agentCount} Agents
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-amber-400" aria-hidden="true" />
            <span className="uppercase tracking-[0.15em]">
              {outputCount} Outputs
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
            <span className="uppercase tracking-[0.15em]">
              {connections.length} Connections
            </span>
          </div>
        </div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/40">
          Drag nodes to reposition
        </p>
      </div>
    </div>
  );
}
