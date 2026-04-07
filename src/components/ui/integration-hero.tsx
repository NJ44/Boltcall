const ICONS_ROW1 = [
  "/icons/integrations/zapier.webp",
  "/icons/integrations/google-maps.webp",
  "/icons/integrations/google-calendar.webp",
  "/icons/integrations/gmail.webp",
  "/icons/integrations/facebook.webp",
  "/icons/integrations/whatsapp.webp",
  "/icons/integrations/outlook.webp",
];

const ICONS_ROW2 = [
  "/icons/integrations/stripe.webp",
  "/icons/integrations/slack.webp",
  "/icons/integrations/hubspot.webp",
  "/icons/integrations/notion.webp",
  "/icons/integrations/google-drive.webp",
  "/icons/integrations/linkedin.webp",
  "/icons/integrations/microsoft.webp",
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
                <img src={src} alt="Integration icon" width={40} height={40} className="h-10 w-10 object-contain" loading="lazy" decoding="async" />
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
                <img src={src} alt="Integration icon" width={40} height={40} className="h-10 w-10 object-contain" loading="lazy" decoding="async" />
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
