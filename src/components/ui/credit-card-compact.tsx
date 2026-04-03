"use client"

import * as React from "react"
import { motion, useMotionValue, useTransform } from "framer-motion"
import { Eye, EyeOff, Wifi } from "lucide-react"
import { cn } from "../../lib/utils"

const PERSPECTIVE = 1000
const CARD_ANIMATION_DURATION = 0.6
const INITIAL_DELAY = 0.2

interface CreditCardCompactProps extends React.HTMLAttributes<HTMLDivElement> {
  cardNumber?: string
  cardHolder?: string
  expiryDate?: string
  cvv?: string
  variant?: "gradient" | "dark" | "glass"
  size?: "sm" | "md" | "lg"
  showInstructions?: boolean
}

export function CreditCardCompact({
  cardNumber = "4532 1234 5678 9010",
  cardHolder = "ANKIT VERMA",
  expiryDate = "12/28",
  cvv = "123",
  variant = "gradient",
  size = "md",
  showInstructions = false,
  className,
  ...props
}: CreditCardCompactProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const [isFlipped, setIsFlipped] = React.useState(false)
  const [isClicked, setIsClicked] = React.useState(false)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-100, 100], [10, -10])
  const rotateY = useTransform(x, [-100, 100], [-10, 10])

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set(event.clientX - centerX)
    y.set(event.clientY - centerY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const getMaskedNumber = (number: string) => {
    const cleaned = number.replace(/\s/g, '')
    const lastFour = cleaned.slice(-4)
    return `•••• •••• •••• ${lastFour}`
  }

  const variantStyles = {
    gradient: "bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600",
    dark: "bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900",
    glass: "bg-white/15 dark:bg-white/10 backdrop-blur-xl border border-white/20",
  }

  const sizeStyles = {
    sm: "w-72 h-44",
    md: "w-80 h-48", 
    lg: "w-96 h-56"
  }

  const textSizes = {
    sm: {
      cardNumber: "text-lg",
      cardHolder: "text-xs",
      expiry: "text-xs",
      visa: "text-xl"
    },
    md: {
      cardNumber: "text-xl",
      cardHolder: "text-sm", 
      expiry: "text-sm",
      visa: "text-2xl"
    },
    lg: {
      cardNumber: "text-2xl",
      cardHolder: "text-sm",
      expiry: "text-sm", 
      visa: "text-3xl"
    }
  }

  return (
    <div className={cn("flex items-center justify-center", className)} {...props}>
      <div className="relative">
        <motion.div
          className={cn("relative", sizeStyles[size])}
          style={{ perspective: PERSPECTIVE }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: CARD_ANIMATION_DURATION }}
        >
          <motion.div
            className="relative w-full h-full cursor-pointer"
            style={{ 
              transformStyle: "preserve-3d",
              rotateX,
              rotateY: isFlipped ? 180 : rotateY,
            }}
            animate={{ 
              scale: isClicked ? 0.98 : 1,
            }}
            transition={{ 
              duration: 0.3, 
              type: "spring", 
              stiffness: 400, 
              damping: 30,
              mass: 0.8
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              setIsClicked(true)
              setTimeout(() => setIsClicked(false), 150)
              setTimeout(() => setIsFlipped(!isFlipped), 75)
            }}
          >
            {/* Front of card */}
            <motion.div
              className={cn(
                "absolute inset-0 rounded-2xl p-6 shadow-2xl",
                variantStyles[variant],
                "backface-hidden"
              )}
              style={{ 
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden"
              }}
            >
              {/* Card shimmer effect */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 3,
                    ease: "linear",
                  }}
                />
              </div>

              {/* Card content */}
              <div className="relative h-full flex flex-col justify-between text-white">
                {/* Top section */}
                <div className="flex justify-between items-start">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: INITIAL_DELAY }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-6 rounded bg-gradient-to-br from-amber-600 to-yellow-700 shadow-inner" />
                    <Wifi className="w-4 h-4 rotate-90" />
                  </motion.div>

                  <motion.button
                    className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      delay: 0.4,
                      type: "spring",
                      stiffness: 200,
                      damping: 15
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsVisible(!isVisible)
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </motion.button>
                </div>

                {/* Card number */}
                <motion.div
                  className={cn("font-mono tracking-wider", textSizes[size].cardNumber)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {isVisible ? cardNumber : getMaskedNumber(cardNumber)}
                </motion.div>

                {/* Bottom section */}
                <div className="flex justify-between items-end">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="text-xs opacity-70 mb-1">CARD HOLDER</div>
                    <div className={cn("font-medium tracking-wide", textSizes[size].cardHolder)}>{cardHolder}</div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="text-xs opacity-70 mb-1">EXPIRES</div>
                    <div className={cn("font-medium", textSizes[size].expiry)}>{isVisible ? expiryDate : "••/••"}</div>
                  </motion.div>

                  <motion.div
                    className={cn("font-bold italic", textSizes[size].visa)}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      delay: 0.6,
                      type: "spring",
                      stiffness: 200
                    }}
                  >
                    VISA
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Back of card */}
            <motion.div
              className={cn(
                "absolute inset-0 rounded-2xl shadow-2xl",
                variantStyles[variant],
                "backface-hidden"
              )}
              style={{ 
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)"
              }}
            >
              {/* Magnetic strip */}
              <div className="absolute top-6 left-0 right-0 h-8 bg-black/80" />
              
              {/* Signature panel */}
              <div className="absolute top-16 left-4 right-4 bg-white/90 h-8 rounded flex items-center justify-end px-3">
                <motion.div 
                  className="text-black font-mono font-bold text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {isVisible ? cvv : "•••"}
                </motion.div>
              </div>

              {/* Card info */}
              <div className="absolute bottom-6 left-6 right-6 text-white text-xs space-y-1 opacity-70">
                <p>This card is property of issuing bank</p>
                <p>Customer Service: 1-800-VISA</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Click ripple effect */}
          {isClicked && (
            <motion.div
              className="absolute inset-0 rounded-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.1, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="h-full w-full rounded-2xl border-2 border-white/50 dark:border-white/30" />
            </motion.div>
          )}
        </motion.div>

        {/* Instructions */}
        {showInstructions && (
          <motion.div
            className="text-center text-gray-600 dark:text-gray-400 text-sm mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <p>Click to flip • 3D mouse effect • Eye reveals details</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
