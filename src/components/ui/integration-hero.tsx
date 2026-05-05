const ICONS_ROW1 = [
  { src: "https://www.hubspot.com/hubfs/HubSpot_Logos/HubSpot-Inversed-Favicon.png", alt: "HubSpot" },
  { src: "/pipedrive_logo.png", alt: "Pipedrive" },
  { src: "/gohighlevel_logo.png", alt: "GoHighLevel" },
  { src: "https://cdn.zapier.com/zapier/images/favicon.ico", alt: "Zapier" },
  { src: "https://www.make.com/favicon.ico", alt: "Make.com" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg", alt: "WhatsApp Business" },
];

const ICONS_ROW2 = [
  { src: "/cal.com_logo.png", alt: "Cal.com" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg", alt: "Google Calendar" },
  { src: "https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico", alt: "Gmail" },
  { src: "/google_business_logo.svg", alt: "Google Business Profile" },
  { src: "/servicetitan-logo.png", alt: "ServiceTitan" },
];

const repeatedIcons = (icons: { src: string; alt: string }[], repeat = 4) =>
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
          Connect your CRM, calendar, and automation tools — all in one place.
        </p>

        {/* Carousel */}
        <div className="mt-12 overflow-hidden relative pb-2">
          {/* Row 1 */}
          <div className="flex gap-10 whitespace-nowrap animate-integration-scroll-left">
            {repeatedIcons(ICONS_ROW1, 4).map((icon, i) => (
              <div
                key={i}
                className="h-16 w-16 flex-shrink-0 rounded-full bg-white shadow-md flex items-center justify-center"
              >
                <img src={icon.src} alt={icon.alt} width={40} height={40} className="h-10 w-10 object-contain" loading="lazy" decoding="async" />
              </div>
            ))}
          </div>

          {/* Row 2 */}
          <div className="flex gap-10 whitespace-nowrap mt-6 animate-integration-scroll-right">
            {repeatedIcons(ICONS_ROW2, 4).map((icon, i) => (
              <div
                key={i}
                className="h-16 w-16 flex-shrink-0 rounded-full bg-white shadow-md flex items-center justify-center"
              >
                <img src={icon.src} alt={icon.alt} width={40} height={40} className="h-10 w-10 object-contain" loading="lazy" decoding="async" />
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
