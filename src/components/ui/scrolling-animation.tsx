import { Phone, AlarmClock, RefreshCcw, Megaphone, MessageSquare, Globe } from "lucide-react"

interface Channel {
  title: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  href: string
  description: string
}

const channels: Channel[] = [
  { title: "Reminders", icon: AlarmClock, href: "/features/automated-reminders", description: "Automatically send appointment reminders so clients show up — fewer no-shows, zero manual effort." },
  { title: "Follow Ups", icon: RefreshCcw, href: "/features/ai-follow-up-system", description: "Re-engage leads who didn't book with smart follow-up messages sent at the right time." },
  { title: "Ads", icon: Megaphone, href: "/features/instant-form-reply", description: "Instantly reply to Facebook and Google ad form leads before a competitor gets there first." },
  { title: "SMS", icon: MessageSquare, href: "/features/sms-booking-assistant", description: "Book appointments via two-way SMS — customers reply in their own time, Boltcall handles the rest." },
  { title: "Website", icon: Globe, href: "/features/website-widget", description: "Capture leads from your website with a smart chat widget that qualifies and books in real time." },
  { title: "AI Receptionist", icon: Phone, href: "/features/ai-receptionist", description: "Answer every call 24/7, collect lead info, and book appointments — even while you're on another job." },
]

const EXPAND_RADIUS = 220
const ANGLE_STEP = (2 * Math.PI) / channels.length
const START_ANGLE = -Math.PI / 2

interface ScrollingAnimationProps {
  onNavigate?: (href: string) => void
}

export function ScrollingAnimation({ onNavigate }: ScrollingAnimationProps) {
  return (
    <div className="h-screen flex flex-col items-center justify-center p-8">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-[500px] h-[500px] md:w-[600px] md:h-[600px] rounded-full flex items-center justify-center border-2 border-white/10">
          {/* Middle ring */}
          <div className="w-[420px] h-[420px] md:w-[500px] md:h-[500px] rounded-full flex items-center justify-center relative border-2 border-blue-400/20">
            {/* Inner gradient ring */}
            <div className="w-[340px] h-[340px] md:w-[400px] md:h-[400px] rounded-full bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-400 p-0.5 flex items-center justify-center relative">
              <div className="w-full h-full rounded-full bg-brand-blue flex items-center justify-center relative">
                {/* Channel icon tiles */}
                {channels.map((channel, i) => {
                  const angle = START_ANGLE + i * ANGLE_STEP
                  const Icon = channel.icon
                  return (
                    <button
                      key={channel.title}
                      onClick={() => onNavigate?.(channel.href)}
                      className="absolute w-16 h-16 md:w-20 md:h-20 rounded-3xl shadow-xl bg-white/90 backdrop-blur-md border border-gray-200/50 flex flex-col items-center justify-center cursor-pointer z-0 gap-1"
                      style={{
                        transform: `translate(${EXPAND_RADIUS * Math.cos(angle)}px, ${EXPAND_RADIUS * Math.sin(angle)}px)`,
                      }}
                    >
                      <Icon className="w-7 h-7 md:w-8 md:h-8 text-blue-600" />
                      <span className="text-[9px] md:text-[10px] font-semibold text-gray-600 leading-none">{channel.title}</span>
                    </button>
                  )
                })}

                {/* Center text */}
                <div className="flex flex-col items-center justify-center relative z-20">
                  <span className="text-xs uppercase tracking-wider font-medium text-white/60 mb-2">SETUP</span>
                  <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-1">One Setup.</h2>
                  <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
                    All <span className="text-blue-400">Channels.</span>
                  </h2>
                  <p className="text-white/70 text-center max-w-[240px] text-sm md:text-base">
                    Get your agent ready in just a few minutes. Free to set up — no credit card needed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
