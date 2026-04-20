import * as React from "react"
import { Bell, GripVertical, Trash2, ChevronRight, AlertTriangle, XCircle, Info } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import type { Alert } from "@/types/dashboard"

const DISMISSED_KEY = "boltcall_dismissed_notifications"

function loadDismissed(): Set<string> {
  try {
    const raw = localStorage.getItem(DISMISSED_KEY)
    if (raw) return new Set(JSON.parse(raw) as string[])
  } catch {
    // ignore parse errors
  }
  return new Set()
}

function saveDismissed(ids: Set<string>) {
  try {
    localStorage.setItem(DISMISSED_KEY, JSON.stringify([...ids]))
  } catch {
    // ignore storage errors
  }
}

interface NotificationsWithActionsProps {
  alerts: Alert[]
  placement?: "top" | "right" | "bottom" | "left"
}

function getAlertIcon(type: Alert["type"]) {
  if (type === "error") return XCircle
  if (type === "warning") return AlertTriangle
  return Info
}

function getAlertIconColor(type: Alert["type"]) {
  if (type === "error") return "text-red-500"
  if (type === "warning") return "text-yellow-500"
  return "text-blue-500"
}

export default function NotificationsWithActions({
  alerts,
  placement = "bottom",
}: NotificationsWithActionsProps) {
  // Initialise dismissed set from localStorage so dismissals survive refresh
  const [dismissed, setDismissed] = React.useState<Set<string>>(() => loadDismissed())
  const [activeId, setActiveId] = React.useState<string | null>(null)

  // Filter out any alert that has been dismissed
  const visible = alerts.filter((a) => !dismissed.has(a.id))

  const handleDelete = (id: string) => {
    setDismissed((prev) => {
      const next = new Set([...prev, id])
      saveDismissed(next)
      return next
    })
    setActiveId(null)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="relative inline-flex items-center justify-center rounded-full p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors focus:outline-none"
          aria-label="Alerts"
        >
          <Bell className="h-5 w-5" />
          {visible.length > 0 && (
            <Badge
              variant="default"
              className="absolute -top-1 -right-1 text-xs px-1.5 py-0 min-w-[1.1rem] h-[1.1rem] flex items-center justify-center bg-red-500 border-0 text-white"
            >
              {visible.length}
            </Badge>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="center" side={placement}>
        <Card className="max-h-80 overflow-y-auto rounded-lg border-none shadow-none">
          {visible.length === 0 ? (
            <div className="p-6 flex flex-col items-center gap-2 text-center">
              <Bell className="h-8 w-8 text-gray-300" />
              <p className="text-sm font-medium text-gray-500">No alerts</p>
              <p className="text-xs text-gray-400">You're all caught up</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {visible.map((alert) => {
                const isActive = activeId === alert.id
                const Icon = getAlertIcon(alert.type)
                const iconColor = getAlertIconColor(alert.type)
                return (
                  <li
                    key={alert.id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition overflow-hidden"
                  >
                    {/* Left content with slide animation */}
                    <motion.div
                      animate={{ x: isActive ? -40 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-start gap-2 flex-1 min-w-0"
                    >
                      <Icon className={`h-4 w-4 flex-shrink-0 mt-0.5 ${iconColor}`} />
                      <div className="flex-1 min-w-0">
                        {alert.title ? (
                          <>
                            <p className="text-sm font-semibold leading-snug text-gray-900 truncate">
                              {alert.title}
                            </p>
                            <p className="text-xs text-gray-500 truncate mt-0.5">
                              {alert.message}
                            </p>
                          </>
                        ) : (
                          <p className="text-sm font-medium leading-snug text-gray-900 truncate">
                            {alert.message}
                          </p>
                        )}
                      </div>
                    </motion.div>

                    {/* Right controls */}
                    <div className="ml-2 flex items-center flex-shrink-0">
                      {isActive ? (
                        <div className="flex items-center space-x-1">
                          <button
                            className="p-1 rounded-md hover:bg-gray-100"
                            onClick={() => handleDelete(alert.id)}
                            title="Dismiss"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </button>
                          <button
                            className="p-1 rounded-md hover:bg-gray-100"
                            onClick={() => setActiveId(null)}
                            title="Close"
                          >
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          </button>
                        </div>
                      ) : (
                        <button
                          className="p-1 rounded-md hover:bg-gray-100"
                          onClick={() => setActiveId(isActive ? null : alert.id)}
                          title="Actions"
                        >
                          <GripVertical className="h-4 w-4 text-gray-400" />
                        </button>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </Card>
      </PopoverContent>
    </Popover>
  )
}
