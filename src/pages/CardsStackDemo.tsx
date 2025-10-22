import { ContainerScroll, CardSticky } from "../components/ui/cards-stack"

const PROCESS_PHASES = [
  {
    id: "process-1",
    title: "Lead Discovery",
    description:
      "Our AI instantly identifies and engages with potential leads from multiple channels. Whether it's ads, forms, SMS, or phone calls, we ensure no opportunity is missed.",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
  },
  {
    id: "process-2",
    title: "Instant Response",
    description:
      "Speed to lead is critical. Our AI receptionist responds within seconds, qualifying prospects and booking appointments while they're still hot.",
    imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80"
  },
  {
    id: "process-3",
    title: "Smart Qualification",
    description:
      "The AI asks the right questions to qualify leads based on your criteria. Only serious, qualified prospects make it to your calendar.",
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80"
  },
]

const WORK_PROJECTS = [
  {
    id: "work-project-1",
    title: "Real Estate Agency",
    services: ["AI Phone", "Lead Forms", "SMS Automation", "Calendar Sync"],
    imageUrl:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
  },
  {
    id: "work-project-2",
    title: "Home Services",
    services: ["Ad Integration", "Instant Reply", "Appointment Booking"],
    imageUrl:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
  },
  {
    id: "work-project-3",
    title: "Healthcare Clinic",
    services: ["Patient Intake", "SMS Reminders", "Multi-channel", "Dashboard"],
    imageUrl:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
  },
]

const ACHIEVEMENTS = [
  {
    id: "achievement-1",
    title: "391%",
    description: "increase in sales conversions",
    bg: "rgb(59,130,246)",
  },
  {
    id: "achievement-2",
    title: "< 30s",
    description: "average response time",
    bg: "rgb(16,185,129)",
  },
  {
    id: "achievement-3",
    title: "24/7",
    description: "AI receptionist availability",
    bg: "rgb(139,92,246)",
  },
  {
    id: "achievement-4",
    title: "100%",
    description: "lead capture rate",
    bg: "rgb(234,88,12)",
  },
]

const Process = () => {
  return (
    <div className="container min-h-svh place-content-center bg-stone-50 px-6 text-stone-900 xl:px-12">
      <div className="grid md:grid-cols-2 md:gap-8 xl:gap-12">
        <div className="left-0 top-0 md:sticky md:h-svh md:py-12">
          <h5 className="text-base uppercase tracking-wide font-semibold text-blue-600">How it works</h5>
          <h2 className="mb-8 mt-6 text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight" style={{ fontSize: '0.5em' }}>
            Close leads in{" "}
            <span className="text-blue-600">lightning speed</span>
          </h2>
          <p className="max-w-prose text-lg md:text-xl leading-relaxed text-gray-700">
            BoltCall transforms how you capture and convert leads. Our AI-powered system works 24/7 to ensure you never miss an opportunity, responding instantly to every inquiry and booking qualified appointments automatically.
          </p>
        </div>
        <ContainerScroll className="min-h-[300vh] space-y-12 py-12">
          {PROCESS_PHASES.map((phase, index) => (
            <CardSticky
              key={phase.id}
              index={index + 2}
              incrementY={15}
              className="rounded-2xl border-2 border-gray-200 bg-white shadow-2xl overflow-hidden max-w-lg"
            >
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                    {phase.title}
                  </h2>
                  <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-bold">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-6">{phase.description}</p>
              </div>
              <div className="relative h-48 md:h-56 overflow-hidden">
                <img 
                  src={phase.imageUrl} 
                  alt={phase.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </CardSticky>
          ))}
        </ContainerScroll>
      </div>
    </div>
  )
}

const Work = () => {
  return (
    <div className="container min-h-svh place-content-center bg-slate-900 p-12 text-stone-50">
      <div className="text-center">
        <h5 className="text-xs uppercase tracking-wide">Success Stories</h5>
        <h2 className="mb-4 mt-1 text-4xl font-bold tracking-tight">
          Industries we <span className="text-blue-500">empower</span>
        </h2>
        <p className="mx-auto max-w-prose text-sm text-gray-400">
          From real estate to healthcare, home services to professional services,
          BoltCall helps businesses across industries capture more leads and close more deals.
        </p>
      </div>
      <ContainerScroll className="min-h-[500vh] py-12">
        {WORK_PROJECTS.map((project, index) => (
          <CardSticky
            key={project.id}
            index={index}
            className="w-full overflow-hidden rounded-sm border border-x-blue-900 border-y-blue-500 bg-blue-950"
            incrementY={60}
            incrementZ={5}
          >
            <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
              <h2 className="text-2xl font-bold tracking-tighter">
                {project.title}
              </h2>
              <div className="flex flex-wrap gap-1">
                {project.services.map((service) => (
                  <div
                    key={service}
                    className="flex rounded-xl bg-blue-900 px-2 py-1"
                  >
                    <span className="text-xs tracking-tighter text-gray-300">
                      {service}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <img
              className="size-full object-cover"
              width="100%"
              height="100%"
              src={project.imageUrl}
              alt={project.title}
            />
          </CardSticky>
        ))}
      </ContainerScroll>
    </div>
  )
}

const Achievements = () => {
  return (
    <div className="container min-h-svh place-content-center bg-zinc-900 py-12">
      <div className="text-center mb-12">
        <h5 className="text-xs uppercase tracking-wide text-zinc-400">Our Impact</h5>
        <h2 className="mb-4 mt-1 text-4xl font-bold tracking-tight text-white">
          Results that <span className="text-blue-500">speak volumes</span>
        </h2>
      </div>
      <ContainerScroll className="min-h-[400vh] place-items-center space-y-8 px-12 text-center text-zinc-50">
        {ACHIEVEMENTS.map((achievement, index) => (
          <CardSticky
            key={achievement.id}
            incrementY={20}
            index={index + 2}
            className="flex h-72 w-[420px] flex-col place-content-center justify-evenly rounded-2xl border border-current p-8 shadow-2xl"
            style={{ rotate: `${index + 2}deg`, background: achievement.bg }}
          >
            <h1 className="text-left text-6xl font-semibold opacity-80">
              {achievement.title}
            </h1>
            <div className="place-items-end text-right">
              <h3 className="max-w-[10ch] text-wrap text-4xl font-semibold capitalize tracking-tight">
                {achievement.description}
              </h3>
            </div>
          </CardSticky>
        ))}
      </ContainerScroll>
    </div>
  )
}

const CardsStackDemo = () => {
  return (
    <div>
      <Process />
      <Work />
      <Achievements />
    </div>
  )
}

export default CardsStackDemo
export { Process, Work, Achievements }

