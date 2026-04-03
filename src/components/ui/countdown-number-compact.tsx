import { useEffect, useState } from "react"
import NumberFlow from "@number-flow/react"
import { motion } from "framer-motion"

const MotionNumberFlow = motion.create(NumberFlow)

interface CountdownCompactProps {
  endDate: Date
  startDate?: Date
  className?: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function AnimatedNumberCountdownCompact({
  endDate,
  startDate,
  className,
}: CountdownCompactProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const start = startDate ? new Date(startDate) : new Date()
      const end = new Date(endDate)
      const difference = end.getTime() - start.getTime()

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
        const minutes = Math.floor((difference / 1000 / 60) % 60)
        const seconds = Math.floor((difference / 1000) % 60)

        setTimeLeft({ days, hours, minutes, seconds })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [endDate, startDate])

  return (
    <div className={`flex items-center gap-1 sm:gap-2 ${className}`}>
      <div className="flex items-center">
        <MotionNumberFlow
          value={timeLeft.days}
          className="text-[10px] sm:text-sm font-bold tabular-nums min-w-[1.5rem] sm:min-w-[2rem] text-center"
          format={{ minimumIntegerDigits: 2 }}
        />
        <span className="text-[10px] sm:text-sm ml-0.5">d</span>
      </div>
      <span className="text-white/60 text-[10px] sm:text-sm">:</span>
      <div className="flex items-center">
        <MotionNumberFlow
          value={timeLeft.hours}
          className="text-[10px] sm:text-sm font-bold tabular-nums min-w-[1.5rem] sm:min-w-[2rem] text-center"
          format={{ minimumIntegerDigits: 2 }}
        />
        <span className="text-[10px] sm:text-sm ml-0.5">h</span>
      </div>
      <span className="text-white/60 text-[10px] sm:text-sm">:</span>
      <div className="flex items-center">
        <MotionNumberFlow
          value={timeLeft.minutes}
          className="text-[10px] sm:text-sm font-bold tabular-nums min-w-[1.5rem] sm:min-w-[2rem] text-center"
          format={{ minimumIntegerDigits: 2 }}
        />
        <span className="text-[10px] sm:text-sm ml-0.5">m</span>
      </div>
      <span className="text-white/60 text-[10px] sm:text-sm">:</span>
      <div className="flex items-center">
        <MotionNumberFlow
          value={timeLeft.seconds}
          className="text-[10px] sm:text-sm font-bold tabular-nums min-w-[1.5rem] sm:min-w-[2rem] text-center"
          format={{ minimumIntegerDigits: 2 }}
        />
        <span className="text-[10px] sm:text-sm ml-0.5">s</span>
      </div>
    </div>
  )
}

