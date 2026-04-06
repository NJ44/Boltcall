import { useEffect, useRef, useState, useCallback } from "react"
import { AlarmClock, RefreshCcw, Megaphone, MessageSquare, Globe, Phone } from "lucide-react"

interface Channel {
  title: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  href: string
}

const channels: Channel[] = [
  { title: "Reminders", icon: AlarmClock, href: "/features/automated-reminders" },
  { title: "Follow Ups", icon: RefreshCcw, href: "/features/ai-follow-up-system" },
  { title: "Ads", icon: Megaphone, href: "/features/instant-form-reply" },
  { title: "SMS", icon: MessageSquare, href: "/features/sms-booking-assistant" },
  { title: "Website", icon: Globe, href: "/features/website-widget" },
  { title: "AI Receptionist", icon: Phone, href: "/features/ai-receptionist" },
]

interface ScrollingAnimationProps {
  onNavigate?: (href: string) => void
}

export function ScrollingAnimation({ onNavigate }: ScrollingAnimationProps) {
  const [animationProgress, setAnimationProgress] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)

  const updateProgress = useCallback(() => {
    if (!sectionRef.current) return
    const rect = sectionRef.current.getBoundingClientRect()
    const viewportH = window.innerHeight
    // Animation starts when the section's top reaches the middle of the viewport
    // and completes 350px of scroll later
    const scrolledPast = viewportH * 0.5 - rect.top
    const progress = Math.max(0, Math.min(scrolledPast / 350, 1))
    setAnimationProgress(progress)
    rafRef.current = requestAnimationFrame(updateProgress)
  }, [])

  useEffect(() => {
    rafRef.current = requestAnimationFrame(updateProgress)
    return () => cancelAnimationFrame(rafRef.current)
  }, [updateProgress])

  const expandRadius = animationProgress * 220
  const angleStep = (2 * Math.PI) / channels.length
  const startAngle = -Math.PI / 2

  return (
    <div ref={sectionRef} className="min-h-[130vh]">
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
                  {/* Channel icon tiles — hero-style floating icons */}
                  {channels.map((channel, i) => {
                    const angle = startAngle + i * angleStep
                    const Icon = channel.icon
                    return (
                      <button
                        key={channel.title}
                        onClick={() => onNavigate?.(channel.href)}
                        className="absolute w-16 h-16 md:w-20 md:h-20 rounded-3xl shadow-xl bg-white/90 backdrop-blur-md border border-gray-200/50 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-300 ease-out z-0"
                        style={{
                          transform: `translate(${expandRadius * Math.cos(angle)}px, ${expandRadius * Math.sin(angle)}px)`,
                        }}
                      >
                        <Icon className="w-8 h-8 md:w-10 md:h-10 text-blue-600" />
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
