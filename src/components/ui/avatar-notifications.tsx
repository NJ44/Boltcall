import * as React from "react"
import { Bell, X, AlertTriangle, XCircle, Info, ExternalLink } from "lucide-react"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { Alert } from "@/types/dashboard"

interface AlertsNotificationsProps {
  alerts: Alert[]
  onClearAll?: () => void
}

function getAlertIcon(type: Alert["type"]) {
  if (type === "error") return XCircle
  if (type === "warning") return AlertTriangle
  return Info
}

function getAlertColors(type: Alert["type"]) {
  if (type === "error") return { icon: "text-red-500", bg: "bg-red-50 dark:bg-red-950/30", border: "border-red-200 dark:border-red-800" }
  if (type === "warning") return { icon: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-950/30", border: "border-yellow-200 dark:border-yellow-800" }
  return { icon: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30", border: "border-blue-200 dark:border-blue-800" }
}

export default function AlertsNotifications({ alerts, onClearAll }: AlertsNotificationsProps) {
  const hasAlerts = alerts.length > 0

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="relative inline-flex items-center justify-center rounded-full p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none transition-colors"
          aria-label="Alerts"
        >
          <Bell className="h-5 w-5" />
          {/* Blinking dot when there are alerts */}
          <span
            className={cn(
              "absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white",
              hasAlerts ? "bg-red-500 animate-ping" : "bg-gray-300"
            )}
          />
          {hasAlerts && (
            <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-red-500" />
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0" side="bottom" align="center">
        <div className="max-h-80 overflow-y-auto">
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-900">Alerts</h2>
            {hasAlerts && onClearAll && (
              <button
                onClick={onClearAll}
                className="h-6 w-6 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            )}
          </div>

          {!hasAlerts ? (
            <div className="p-4 text-sm text-gray-500 text-center">
              All clear — no active alerts
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 p-2 space-y-1">
              {alerts.map((alert) => {
                const Icon = getAlertIcon(alert.type)
                const colors = getAlertColors(alert.type)
                return (
                  <li
                    key={alert.id}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg border transition",
                      colors.bg,
                      colors.border
                    )}
                  >
                    <Icon className={cn("h-4 w-4 flex-shrink-0 mt-0.5", colors.icon)} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-snug text-gray-900">{alert.message}</p>
                      {alert.link && (
                        <a
                          href={alert.link}
                          className="inline-flex items-center gap-1 text-xs mt-1 text-gray-500 hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View details
                        </a>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
