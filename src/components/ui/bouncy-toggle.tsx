import { useState } from "react"
import { cn } from "@/lib/utils"
import { Check, X } from "lucide-react"

// --- MATERIAL DESIGN 3 PHYSICS ---
const SPRING_EASE = "cubic-bezier(0.175, 0.885, 0.32, 1.275)"

interface PremiumToggleProps {
  /** Controlled mode */
  checked?: boolean
  onChange?: (checked: boolean) => void
  /** Uncontrolled mode */
  defaultChecked?: boolean
  label?: string
  disabled?: boolean
  className?: string
}

export function PremiumToggle({
  checked,
  defaultChecked = false,
  onChange,
  label,
  disabled = false,
  className,
}: PremiumToggleProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked)
  const [isPressed, setIsPressed] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const isControlled = checked !== undefined
  const isChecked = isControlled ? checked : internalChecked

  const handleToggle = () => {
    if (disabled) return
    const newValue = !isChecked
    if (!isControlled) {
      setInternalChecked(newValue)
    }
    onChange?.(newValue)
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {label && (
        <span
          className={cn(
            "text-sm font-medium transition-colors duration-300",
            isChecked ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {label}
        </span>
      )}

      {/* Touch target wrapper */}
      <button
        type="button"
        role="switch"
        aria-checked={isChecked}
        disabled={disabled}
        onClick={handleToggle}
        onPointerDown={() => !disabled && setIsPressed(true)}
        onPointerUp={() => setIsPressed(false)}
        onPointerLeave={() => {
          setIsPressed(false)
          setIsHovered(false)
        }}
        onPointerEnter={() => !disabled && setIsHovered(true)}
        className={cn(
          "group relative inline-flex items-center justify-center min-w-[48px] min-h-[48px]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        {/* --- TRACK --- */}
        <div
          className={cn(
            "relative inline-flex h-8 w-[52px] shrink-0 items-center rounded-full border-2 transition-colors duration-300",
            isChecked
              ? "bg-primary border-primary"
              : "bg-muted border-border",
          )}
        >
          {/* --- HANDLE --- */}
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 rounded-full shadow-sm flex items-center justify-center transition-all duration-300 left-[2px]",
              isChecked
                ? "bg-primary-foreground"
                : "bg-foreground",
            )}
            style={{
              transitionTimingFunction: SPRING_EASE,
              // Position
              transform: `translateY(-50%) ${isChecked ? "translateX(20px)" : "translateX(0px)"}`,
              // Size morphing
              width: isPressed ? 28 : isChecked ? 24 : 24,
              height: isPressed ? 28 : isChecked ? 24 : 24,
              marginLeft: isPressed ? -2 : 0,
            }}
          >
            {/* --- ICON CONTAINER --- */}
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
              {/* CHECK ICON (shown when checked) */}
              <div
                className={cn(
                  "absolute inset-0 flex items-center justify-center transition-all duration-300",
                  isChecked
                    ? "opacity-100 scale-100 rotate-0"
                    : "opacity-0 scale-50 -rotate-45",
                )}
              >
                <Check
                  className="w-3.5 h-3.5 text-primary"
                  strokeWidth={4}
                />
              </div>

              {/* X ICON (shown when unchecked) */}
              <div
                className={cn(
                  "absolute inset-0 flex items-center justify-center transition-all duration-300",
                  !isChecked
                    ? "opacity-100 scale-100 rotate-0"
                    : "opacity-0 scale-50 rotate-45",
                )}
              >
                <X
                  className="w-3.5 h-3.5 text-muted"
                  strokeWidth={4}
                />
              </div>
            </div>
          </div>

          {/* --- HALO --- */}
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-all duration-200 w-10 h-10",
              isChecked ? "bg-primary" : "bg-foreground",
              isPressed
                ? "opacity-10 scale-100"
                : isHovered
                  ? "opacity-[0.05] scale-100"
                  : "opacity-0 scale-50",
            )}
            style={{
              left: isChecked ? 22 : 2,
              transform: "translate(-25%, -50%)",
            }}
          />
        </div>
      </button>
    </div>
  )
}
