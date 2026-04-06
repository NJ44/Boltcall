import { useEffect, useRef, useState } from "react"
import { AlarmClock, RefreshCcw, Megaphone, MessageSquare, Globe, Phone } from "lucide-react"

interface Channel {
  title: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  href: string
  bgColor: string
  iconColor: string
}

const channels: Channel[] = [
  { title: "Reminders", icon: AlarmClock, href: "/features/automated-reminders", bgColor: "bg-amber-100", iconColor: "text-amber-600" },
  { title: "Follow Ups", icon: RefreshCcw, href: "/features/ai-follow-up-system", bgColor: "bg-green-100", iconColor: "text-green-600" },
  { title: "Ads", icon: Megaphone, href: "/features/instant-form-reply", bgColor: "bg-purple-100", iconColor: "text-purple-600" },
  { title: "SMS", icon: MessageSquare, href: "/features/sms-booking-assistant", bgColor: "bg-pink-100", iconColor: "text-pink-600" },
  { title: "Website", icon: Globe, href: "/features/website-widget", bgColor: "bg-cyan-100", iconColor: "text-cyan-600" },
  { title: "AI Receptionist", icon: Phone, href: "/features/ai-receptionist", bgColor: "bg-blue-100", iconColor: "text-blue-600" },
]

interface ScrollingAnimationProps {
  onNavigate?: (href: string) => void
}

export function ScrollingAnimation({ onNavigate }: ScrollingAnimationProps) {
  const [scrollY, setScrollY] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)
  const [sectionTop, setSectionTop] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect()
      setSectionTop(rect.top + window.scrollY)
    }
  }, [])

  const relativeScroll = Math.max(0, scrollY - sectionTop + window.innerHeight * 0.5)
  const animationProgress = Math.min(relativeScroll / 500, 1)
  const expandRadius = animationProgress * 220

  const angleStep = (2 * Math.PI) / channels.length
  const startAngle = -Math.PI / 2

  return (
    <div ref={sectionRef} className="min-h-[150vh]">
      <div className="h-screen flex items-center justify-center p-8 sticky top-0">
        <div className="relative">
          {/* Outer ring */}
          <div
            className={`w-[500px] h-[500px] md:w-[600px] md:h-[600px] rounded-full flex items-center justify-center transition-all duration-500 ${
              animationProgress > 0.6 ? "border-2 border-white/10" : ""
            }`}
          >
            {/* Middle ring */}
            <div
              className={`w-[420px] h-[420px] md:w-[500px] md:h-[500px] rounded-full flex items-center justify-center relative transition-all duration-500 ${
                animationProgress > 0.2 ? "border-2 border-blue-400/20" : ""
              }`}
            >
              {/* Inner gradient ring */}
              <div className="w-[340px] h-[340px] md:w-[400px] md:h-[400px] rounded-full bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-400 p-0.5 flex items-center justify-center relative">
                <div className="w-full h-full rounded-full bg-brand-blue flex items-center justify-center relative">
                  {/* Channel icon tiles */}
                  {channels.map((channel, i) => {
                    const angle = startAngle + i * angleStep
                    const Icon = channel.icon
                    return (
                      <button
                        key={channel.title}
                        onClick={() => onNavigate?.(channel.href)}
                        className="absolute w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-4 border-white/90 shadow-lg transition-all duration-300 ease-out z-0 flex flex-col items-center justify-center gap-1 bg-white cursor-pointer hover:scale-110"
                        style={{
                          transform: `translate(${expandRadius * Math.cos(angle)}px, ${expandRadius * Math.sin(angle)}px)`,
                        }}
                      >
                        <div className={`w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center ${channel.bgColor}`}>
                          <Icon className={`w-5 h-5 ${channel.iconColor}`} />
                        </div>
                        <span className="text-[10px] md:text-xs font-semibold text-gray-800 leading-tight text-center px-1">
                          {channel.title}
                        </span>
                      </button>
                    )
                  })}

                  {/* Center text - fades in as icons expand */}
                  <div
                    className={`flex flex-col items-center justify-center relative z-20 transition-opacity duration-500 ${
                      animationProgress > 0.5 ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <span className="text-xs uppercase tracking-wider font-medium text-white/60 mb-2">SETUP</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-1">One Setup.</h2>
                    <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
                      All <span className="text-blue-400">Channels.</span>
                    </h2>
                    <p className="text-white/70 text-center max-w-[240px] text-sm md:text-base">
                      Get your helper ready in just a few minutes. Free to set up — no credit card needed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
