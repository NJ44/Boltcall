"use client";

import { Bot, Megaphone, FormInput, Globe, MessageSquare } from "lucide-react";
import RadialOrbitalTimeline from "./radial-orbital-timeline";

const timelineData = [
  {
    id: 1,
    title: "AI Receptionist",
    date: "2024",
    content: "Intelligent AI-powered receptionist that handles calls 24/7 with natural conversation.",
    category: "AI",
    icon: Bot,
    relatedIds: [2, 3],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 2,
    title: "Ads",
    date: "2024",
    content: "AI-powered advertising campaigns that optimize for maximum ROI and engagement.",
    category: "Marketing",
    icon: Megaphone,
    relatedIds: [1, 4],
    status: "completed" as const,
    energy: 90,
  },
  {
    id: 3,
    title: "Web Forms",
    date: "2024",
    content: "Smart web forms that capture leads and integrate seamlessly with your CRM.",
    category: "Lead Generation",
    icon: FormInput,
    relatedIds: [1, 5],
    status: "in-progress" as const,
    energy: 80,
  },
  {
    id: 4,
    title: "Website Widget",
    date: "2024",
    content: "Interactive website widgets that engage visitors and convert them into leads.",
    category: "Engagement",
    icon: Globe,
    relatedIds: [2, 5],
    status: "in-progress" as const,
    energy: 70,
  },
  {
    id: 5,
    title: "SMS",
    date: "2024",
    content: "Automated SMS campaigns that nurture leads and drive conversions.",
    category: "Communication",
    icon: MessageSquare,
    relatedIds: [3, 4],
    status: "pending" as const,
    energy: 60,
  },
];

export function RadialOrbitalTimelineDemo() {
  return (
    <>
      <RadialOrbitalTimeline timelineData={timelineData} />
    </>
  );
}

export default {
  RadialOrbitalTimelineDemo,
};
