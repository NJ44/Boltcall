const ICONS_ROW1 = [
  "https://cdn-icons-png.flaticon.com/512/2111/2111432.png",   // Zapier
  "https://cdn-icons-png.flaticon.com/512/281/281764.png",     // Google Maps / GBP
  "https://cdn-icons-png.flaticon.com/512/281/281763.png",     // Google Calendar
  "https://cdn-icons-png.flaticon.com/512/732/732084.png",     // Gmail
  "https://cdn-icons-png.flaticon.com/512/5968/5968841.png",   // Facebook
  "https://cdn-icons-png.flaticon.com/512/733/733585.png",     // WhatsApp
  "https://cdn-icons-png.flaticon.com/512/3670/3670382.png",   // Outlook
];

const ICONS_ROW2 = [
  "https://cdn-icons-png.flaticon.com/512/5968/5968756.png",   // Stripe
  "https://cdn-icons-png.flaticon.com/512/5968/5968854.png",   // Slack
  "https://cdn-icons-png.flaticon.com/512/888/888841.png",     // HubSpot
  "https://cdn-icons-png.flaticon.com/512/5968/5968875.png",   // Notion
  "https://cdn-icons-png.flaticon.com/512/732/732190.png",     // Google Drive
  "https://cdn-icons-png.flaticon.com/512/174/174857.png",     // LinkedIn
  "https://cdn-icons-png.flaticon.com/512/732/732221.png",     // Microsoft / Teams
];

const repeatedIcons = (icons: string[], repeat = 4) =>
  Array.from({ length: repeat }).flatMap(() => icons);

export default function IntegrationHero() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-brand-blue">
      {/* Light grid background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl lg:text-6xl font-bold tracking-tight text-white">
          Integrate with favorite tools
        </h2>
        <p className="mt-4 text-lg text-blue-100 max-w-xl mx-auto">
          250+ top apps are available to integrate seamlessly with your workflow.
        </p>

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
          <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-brand-blue to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-brand-blue to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
