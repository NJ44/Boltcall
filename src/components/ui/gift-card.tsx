import * as React from "react"
import { motion, useMotionValue, useTransform } from "framer-motion"
import { cn } from "../../lib/utils"
import { Sparkles, Gift } from "lucide-react"

const PERSPECTIVE = 1000
const CARD_ANIMATION_DURATION = 0.6

interface GiftCardProps extends React.HTMLAttributes<HTMLDivElement> {
  balance?: string
  variant?: "gradient" | "dark" | "glass" | "gold" | "silver"
  showFullPage?: boolean
}

export default function GiftCard({
  balance = "$250.00",
  variant = "gradient",
  showFullPage = false,
}: GiftCardProps) {
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

  const variantStyles = {
    gradient: "bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700",
    dark: "bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900",
    glass: "bg-white/15 dark:bg-white/10 backdrop-blur-xl border border-white/20",
    gold: "bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600",
    silver: "bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500",
  }


  return (
    <div className={cn(
      "flex items-center justify-center relative overflow-hidden w-full",
      showFullPage ? "min-h-screen" : ""
    )}>
      {showFullPage && (
        <>
          {/* Background with brand colors */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-sky via-brand-blue to-brand-blueDark dark:from-blue-900 dark:via-blue-800 dark:to-blue-700" />
          
          {/* Animated background orbs */}
          <motion.div
            className="absolute top-20 left-20 w-96 h-96 bg-brand-sky/20 dark:bg-brand-blue/10 rounded-full blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-96 h-96 bg-brand-blue/20 dark:bg-brand-blueDark/10 rounded-full blur-3xl"
            animate={{
              x: [0, -50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </>
      )}

      <div className="relative">
        <motion.div
          className="relative w-72 h-44"
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
                "absolute inset-0 rounded-xl p-6 shadow-2xl overflow-hidden",
                variantStyles[variant],
                "backface-hidden"
              )}
              style={{ 
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden"
              }}
            >
              {/* Decorative Pattern Overlay */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-full h-full" style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                  backgroundSize: '20px 20px'
                }} />
              </div>

              {/* Shimmer Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2,
                  ease: "linear"
                }}
              />

              {/* Sparkle Decorations */}
              <div className="absolute top-2 right-2">
                <Sparkles className="w-4 h-4 text-white/60" />
              </div>
              <div className="absolute top-4 left-3">
                <Gift className="w-3 h-3 text-white/50" />
              </div>
              <div className="absolute bottom-3 right-4">
                <Sparkles className="w-3 h-3 text-white/40" />
              </div>

              {/* Card content */}
              <div className="relative h-full flex flex-col justify-between text-white z-10">
                {/* Top section */}
                <div className="flex justify-between items-start">
                  <div className="text-xs font-semibold opacity-80 tracking-wider">BOLTCALL</div>
                  <div className="text-xs font-semibold opacity-80">GIFT</div>
                </div>

                {/* Card number */}
                <motion.div
                  className="text-2xl font-black tracking-wider text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  GIFT CARD
                </motion.div>

                {/* Balance preview */}
                <div className="text-center">
                  <div className="text-xs opacity-70 mb-1">Value</div>
                  <div className="text-lg font-bold">{balance}</div>
                </div>

                {/* Bottom section */}
                <div className="flex justify-between items-end">
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
                  <div className="text-xs opacity-60">Click to flip</div>
                </div>
              </div>
            </motion.div>

            {/* Back of card */}
            <motion.div
              className={cn(
                "absolute inset-0 rounded-xl shadow-2xl overflow-hidden",
                variantStyles[variant],
                "backface-hidden"
              )}
              style={{ 
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)"
              }}
            >
              {/* Decorative Pattern Overlay */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full" style={{
                  backgroundImage: `linear-gradient(45deg, transparent 30%, white 30%, white 50%, transparent 50%, transparent 80%, white 80%, white)`,
                  backgroundSize: '15px 15px'
                }} />
              </div>

              {/* Magnetic strip */}
              <div className="absolute top-4 left-0 right-0 h-8 bg-black/90" />
              
              {/* Balance panel */}
              <div className="absolute top-16 left-4 right-4 bg-white/95 h-10 rounded-lg flex items-center justify-between px-3 shadow-lg">
                <div className="text-black font-semibold text-xs">BALANCE</div>
                <motion.div 
                  className="text-black font-mono font-bold text-base"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {balance}
                </motion.div>
              </div>

              {/* Card number display */}
              <div className="absolute top-28 left-4 right-4">
                <div className="text-white/60 text-[10px] mb-1">Card Number</div>
                <div className="text-white font-mono text-xs tracking-wider">**** **** **** 1234</div>
              </div>

              {/* Card info */}
              <div className="absolute bottom-4 left-4 right-4 text-white text-[10px] space-y-1 opacity-70">
                <p>This gift card is non-refundable</p>
                <p>Valid for all Boltcall services</p>
                <p className="text-[9px] opacity-60">
                  Balance does not expire. Terms apply.
                </p>
              </div>

              {/* Decorative corner elements */}
              <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-white/30 rounded-tr-lg" />
              <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-white/30 rounded-bl-lg" />
            </motion.div>
          </motion.div>

          {/* Floating elements */}
          <motion.div
            className="absolute -top-4 -right-4 w-20 h-20 bg-brand-sky/30 dark:bg-brand-blue/20 rounded-full blur-2xl"
            animate={{
              scale: isClicked ? [1, 1.5, 1] : [1, 1.2, 1],
              opacity: isClicked ? [0.2, 0.6, 0.2] : [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: isClicked ? 0.3 : 3,
              repeat: isClicked ? 0 : Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -bottom-4 -left-4 w-24 h-24 bg-brand-blue/30 dark:bg-brand-blueDark/20 rounded-full blur-2xl"
            animate={{
              scale: isClicked ? [1, 1.6, 1] : [1, 1.3, 1],
              opacity: isClicked ? [0.2, 0.6, 0.2] : [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: isClicked ? 0.3 : 4,
              repeat: isClicked ? 0 : Infinity,
              ease: "easeInOut",
            }}
          />
          
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
        {showFullPage && (
          <motion.div
            className="text-center text-gray-600 dark:text-gray-400 text-sm mt-8"
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
