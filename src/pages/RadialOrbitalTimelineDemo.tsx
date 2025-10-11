"use client";

import { Megaphone, MessageSquare, Phone, FileText, MessageCircle } from "lucide-react";
import RadialOrbitalTimeline from "../components/ui/radial-orbital-timeline";

const timelineData = [
  {
    id: 1,
    title: "Ads",
    date: "Lead Source",
    content: "Capture leads from Google Ads, Facebook Ads, and other paid advertising campaigns. Our AI instantly responds to ad inquiries and qualifies prospects in real-time.",
    category: "Lead Capture",
    icon: Megaphone,
    relatedIds: [2, 3],
    status: "completed" as const,
    energy: 95,
  },
  {
    id: 2,
    title: "SMS",
    date: "Lead Source",
    content: "Engage leads through SMS messaging with automated responses. Schedule appointments, answer questions, and nurture leads via text messages 24/7.",
    category: "Lead Capture",
    icon: MessageSquare,
    relatedIds: [1, 4],
    status: "completed" as const,
    energy: 90,
  },
  {
    id: 3,
    title: "Phone",
    date: "Lead Source",
    content: "Never miss a call with our AI receptionist that answers 24/7. Handle incoming calls, schedule appointments, and provide instant support to callers automatically.",
    category: "Lead Capture",
    icon: Phone,
    relatedIds: [1, 5],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 4,
    title: "Form",
    date: "Lead Source",
    content: "Connect your web forms and landing pages to capture lead information instantly. Auto-respond to form submissions and book qualified leads on your calendar.",
    category: "Lead Capture",
    icon: FileText,
    relatedIds: [2, 5],
    status: "completed" as const,
    energy: 85,
  },
  {
    id: 5,
    title: "Widget",
    date: "Lead Source",
    content: "Embed our AI chat widget on your website to engage visitors in real-time. Answer questions, qualify leads, and convert website traffic into booked appointments.",
    category: "Lead Capture",
    icon: MessageCircle,
    relatedIds: [3, 4],
    status: "completed" as const,
    energy: 88,
  },
];

export function RadialOrbitalTimelineDemo() {
  return (
    <>
      <RadialOrbitalTimeline timelineData={timelineData} />
    </>
  );
}

export default RadialOrbitalTimelineDemo;

