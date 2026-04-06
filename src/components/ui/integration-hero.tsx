import { Button } from "./button-shadcn";
import React from "react";

const ICONS_ROW1 = [
  "https://cdn-icons-png.flaticon.com/512/5968/5968854.png",   // Slack
  "https://cdn-icons-png.flaticon.com/512/732/732221.png",     // Microsoft
  "https://cdn-icons-png.flaticon.com/512/733/733609.png",     // GitHub
  "https://cdn-icons-png.flaticon.com/512/732/732084.png",     // Gmail
  "https://cdn-icons-png.flaticon.com/512/733/733585.png",     // WhatsApp
  "https://cdn-icons-png.flaticon.com/512/281/281763.png",     // Google Calendar
  "https://cdn-icons-png.flaticon.com/512/888/888879.png",     // Zapier
];

const ICONS_ROW2 = [
  "https://cdn-icons-png.flaticon.com/512/174/174857.png",     // LinkedIn
  "https://cdn-icons-png.flaticon.com/512/906/906324.png",     // Trello
  "https://cdn-icons-png.flaticon.com/512/888/888841.png",     // HubSpot
  "https://cdn-icons-png.flaticon.com/512/5968/5968875.png",   // Notion
  "https://cdn-icons-png.flaticon.com/512/906/906361.png",     // Asana
  "https://cdn-icons-png.flaticon.com/512/732/732190.png",     // Drive
  "https://cdn-icons-png.flaticon.com/512/888/888847.png",     // Salesforce
];

const repeatedIcons = (icons: string[], repeat = 4) =>
  Array.from({ length: repeat }).flatMap(() => icons);

export default function IntegrationHero() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-white">
      {/* Light grid background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.04)_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 text-center">
        <span className="inline-block px-3 py-1 mb-4 text-sm rounded-full border border-gray-200 bg-white text-black">
          ⚡ Integrations
        </span>
        <h2 className="text-4xl lg:text-6xl font-bold tracking-tight text-text-main">
          Integrate with favorite tools
        </h2>
        <p className="mt-4 text-lg text-text-muted max-w-xl mx-auto">
          250+ top apps are available to integrate seamlessly with your workflow.
        </p>
        <Button
          variant="default"
          className="mt-8 px-6 py-3 rounded-lg bg-brand-blue text-white font-medium hover:bg-brand-blueDark transition"
        >
          Get started
        </Button>

        {/* Carousel */}
        <div className="mt-12 overflow-hidden relative pb-2">
          {/* Row 1 */}
          <div className="flex gap-10 whitespace-nowrap animate-integration-scroll-left">
            {repeatedIcons(ICONS_ROW1, 4).map((src, i) => (
              <div
                key={i}
                className="h-16 w-16 flex-shrink-0 rounded-full bg-white shadow-md flex items-center justify-center"
              >
                <img src={src} alt="icon" className="h-10 w-10 object-contain" loading="lazy" />
              </div>
            ))}
          </div>

          {/* Row 2 */}
          <div className="flex gap-10 whitespace-nowrap mt-6 animate-integration-scroll-right">
            {repeatedIcons(ICONS_ROW2, 4).map((src, i) => (
              <div
                key={i}
                className="h-16 w-16 flex-shrink-0 rounded-full bg-white shadow-md flex items-center justify-center"
              >
                <img src={src} alt="icon" className="h-10 w-10 object-contain" loading="lazy" />
              </div>
            ))}
          </div>

          {/* Fade overlays */}
          <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-white to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-white to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
