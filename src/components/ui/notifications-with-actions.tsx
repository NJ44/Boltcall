import * as React from "react"
import { Bell, GripVertical, Trash2, Archive, ChevronRight, AlertTriangle, XCircle, Info } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import type { Alert } from "@/types/dashboard"

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
  const [dismissed, setDismissed] = React.useState<Set<string>>(new Set())
  const [activeId, setActiveId] = React.useState<string | null>(null)

  const visible = alerts.filter((a) => !dismissed.has(a.id))

  const handleArchive = () => {
    setActiveId(null)
  }

  const handleDelete = (id: string) => {
    setDismissed((prev) => new Set([...prev, id]))
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
            <div className="p-4 text-sm text-gray-500 text-center">
              All clear — no active alerts
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
                        <p className="text-sm font-medium leading-snug text-gray-900 truncate">
                          {alert.message}
                        </p>
                        {alert.link && (
                          <a
                            href={alert.link}
                            className="text-xs text-blue-500 hover:underline mt-0.5 inline-block"
                          >
                            View details
                          </a>
                        )}
                      </div>
                    </motion.div>

                    {/* Right controls */}
                    <div className="ml-2 flex items-center flex-shrink-0">
                      {isActive ? (
                        <div className="flex items-center space-x-1">
                          <button
                            className="p-1 rounded-md hover:bg-gray-100"
                            onClick={handleArchive}
                            title="Dismiss"
                          >
                            <Archive className="h-4 w-4 text-gray-400" />
                          </button>
                          <button
                            className="p-1 rounded-md hover:bg-gray-100"
                            onClick={() => handleDelete(alert.id)}
                            title="Delete"
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
