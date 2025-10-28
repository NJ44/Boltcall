"use client"

import * as React from "react"
import { motion, useMotionValue, useTransform } from "framer-motion"
import { cn } from "../../lib/utils"

const PERSPECTIVE = 1000
const CARD_ANIMATION_DURATION = 0.6
const INITIAL_DELAY = 0.2

interface GiftCardCompactProps extends React.HTMLAttributes<HTMLDivElement> {
  cardNumber?: string
  cardHolder?: string
  balance?: string
  variant?: "gradient" | "dark" | "glass" | "gold" | "silver"
  brand?: "boltcall" | "apple" | "google" | "starbucks" | "target"
  size?: "sm" | "md" | "lg"
  showInstructions?: boolean
}

export function GiftCardCompact({
  cardNumber = "GIFT-1234-5678-9012",
  cardHolder = "SARAH JOHNSON",
  balance = "$250.00",
  variant = "gradient",
  brand = "boltcall",
  size = "md",
  showInstructions = false,
  className,
  ...props
}: GiftCardCompactProps) {
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
    const cleaned = number.replace(/[-\s]/g, '')
    const lastFour = cleaned.slice(-4)
    return `GIFT-••••-••••-${lastFour}`
  }

  const variantStyles = {
    gradient: "bg-gradient-to-br from-brand-blue via-brand-blueDark to-blue-800",
    dark: "bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900",
    glass: "bg-white/15 dark:bg-white/10 backdrop-blur-xl border border-white/20",
    gold: "bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600",
    silver: "bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500",
  }

  const brandStyles = {
    boltcall: {
      logo: "BOLTCALL",
      color: "text-blue-500",
      icon: "⚡"
    },
    apple: {
      logo: "APPLE",
      color: "text-gray-800",
      icon: "🍎"
    },
    google: {
      logo: "GOOGLE PLAY",
      color: "text-blue-500",
      icon: "🎮"
    },
    starbucks: {
      logo: "STARBUCKS",
      color: "text-green-600",
      icon: "☕"
    },
    target: {
      logo: "TARGET",
      color: "text-red-500",
      icon: "🎯"
    }
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
      brand: "text-xl"
    },
    md: {
      cardNumber: "text-xl",
      cardHolder: "text-sm", 
      expiry: "text-sm",
      brand: "text-2xl"
    },
    lg: {
      cardNumber: "text-2xl",
      cardHolder: "text-sm",
      expiry: "text-sm", 
      brand: "text-3xl"
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
              willChange: "transform",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
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
              {/* Card content */}
              <div className="relative h-full flex flex-col justify-between text-white">
                {/* Top section */}
                <div className="flex justify-between items-start">
                </div>

                {/* Card number */}
                <motion.div
                  className={cn("font-black tracking-wider text-center", textSizes[size].cardNumber)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  GIFT CARD
                </motion.div>

                {/* Bottom section */}
                <div className="flex justify-end items-end pb-1">
                  <motion.img 
                    src="/boltcall_full_logo.png" 
                    alt="Boltcall" 
                    className="h-8 w-auto opacity-90"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      delay: 0.6,
                      type: "spring",
                      stiffness: 200
                    }}
                  />
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
              
              {/* Balance panel */}
              <div className="absolute top-16 left-4 right-4 bg-white/90 h-10 rounded flex items-center justify-between px-3">
                <div className="text-black font-semibold text-xs">BALANCE</div>
                <motion.div 
                  className="text-black font-mono font-bold text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {balance}
                </motion.div>
              </div>

              {/* Card info */}
              <div className="absolute bottom-6 left-6 right-6 text-white text-xs space-y-1 opacity-70">
                <p>This gift card is non-refundable</p>
                <p>Customer Service: 1-800-GIFT</p>
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
