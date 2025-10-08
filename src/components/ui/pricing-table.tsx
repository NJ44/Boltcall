"use client"

import * as React from "react"
import { cn } from "../../lib/utils"
import { CheckIcon } from "@radix-ui/react-icons"
import NumberFlow from "@number-flow/react"

export type PlanLevel = "starter" | "pro" | "all" | string

export interface PricingFeature {
  name: string
  included: PlanLevel | null
}

export interface PricingPlan {
  name: string
  level: PlanLevel
  price: {
    monthly: number
    yearly: number
  }
  popular?: boolean
  description?: string
}

export interface PricingTableProps
  extends React.HTMLAttributes<HTMLDivElement> {
  features: PricingFeature[]
  plans: PricingPlan[]
  onPlanSelect?: (plan: PlanLevel) => void
  defaultPlan?: PlanLevel
  defaultInterval?: "monthly" | "yearly"
  containerClassName?: string
  buttonClassName?: string
}

export function PricingTable({
  features,
  plans,
  onPlanSelect,
  defaultPlan = "pro",
  defaultInterval = "monthly",
  className,
  containerClassName,
  buttonClassName,
  ...props
}: PricingTableProps) {
  const [isYearly, setIsYearly] = React.useState(defaultInterval === "yearly")


  return (
    <section
      className={cn(
        "bg-background text-foreground",
        "py-12 sm:py-24 md:py-32 px-4",
        "fade-bottom overflow-hidden pb-0",
      )}
    >
      <div
        className={cn("w-full max-w-3xl mx-auto px-4", containerClassName)}
        {...props}
      >
        <div className="flex justify-center mb-4 sm:mb-8">
          <div className="inline-flex items-center bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setIsYearly(false)}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                !isYearly 
                  ? "bg-white text-gray-900 shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setIsYearly(true)}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2",
                isYearly 
                  ? "bg-white text-gray-900 shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              Yearly
              <span className="text-xs font-semibold text-green-600">3 months free</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "flex-1 p-4 rounded-xl text-left transition-all bg-white",
                "border border-zinc-200 dark:border-zinc-800",
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{plan.name}</span>
                {plan.popular && (
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded-full">
                    Popular
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1">
                <NumberFlow
                  format={{
                    style: "currency",
                    currency: "USD",
                  }}
                  value={isYearly ? plan.price.yearly / 12 : plan.price.monthly}
                  className="text-2xl font-bold"
                />
                <span className="text-sm font-normal text-zinc-500">
                  /month
                </span>
              </div>
              {plan.description && (
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2">
                  {plan.description}
                </p>
              )}
              
              {/* Feature List */}
              <div className="mt-4 space-y-2">
                {plan.level === 'starter' && (
                  <>
                    <div className="flex items-center text-xs text-zinc-600">
                      <svg className="w-3 h-3 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      AI Receptionist
                    </div>
                    <div className="flex items-center text-xs text-zinc-600">
                      <svg className="w-3 h-3 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      SMS & Call Management
                    </div>
                    <div className="flex items-center text-xs text-zinc-600">
                      <svg className="w-3 h-3 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Calendar Integration
                    </div>
                  </>
                )}
                {plan.level === 'pro' && (
                  <>
                    <div className="flex items-center text-xs text-zinc-600">
                      <svg className="w-3 h-3 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Everything in Starter
                    </div>
                    <div className="flex items-center text-xs text-zinc-600">
                      <svg className="w-3 h-3 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Advanced Analytics
                    </div>
                    <div className="flex items-center text-xs text-zinc-600">
                      <svg className="w-3 h-3 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Call Transcripts
                    </div>
                  </>
                )}
                {plan.level === 'all' && (
                  <>
                    <div className="flex items-center text-xs text-zinc-600">
                      <svg className="w-3 h-3 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Everything in Pro
                    </div>
                    <div className="flex items-center text-xs text-zinc-600">
                      <svg className="w-3 h-3 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      White-glove Onboarding
                    </div>
                    <div className="flex items-center text-xs text-zinc-600">
                      <svg className="w-3 h-3 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      VIP Support
                    </div>
                  </>
                )}
              </div>
              
              <button
                onClick={() => onPlanSelect?.(plan.level)}
                className={cn(
                  "w-full mt-4 px-6 py-3 text-sm font-medium rounded-lg transition-all duration-300",
                  "bg-white text-gray-900 border border-gray-200",
                  "shadow-lg hover:shadow-xl transform hover:-translate-y-1",
                  "hover:bg-gray-50 active:shadow-inner",
                  buttonClassName
                )}
                style={{
                  boxShadow: '6px 6px 12px #c5c5c5, -6px -6px 12px #ffffff'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '8px 8px 16px #c5c5c5, -8px -8px 16px #ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '6px 6px 12px #c5c5c5, -6px -6px 12px #ffffff';
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.boxShadow = 'inset 4px 4px 12px #c5c5c5, inset -4px -4px 12px #ffffff';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.boxShadow = '6px 6px 12px #c5c5c5, -6px -6px 12px #ffffff';
                }}
              >
                Get Started for Free
              </button>
            </div>
          ))}
        </div>

        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[640px] divide-y divide-zinc-200 dark:divide-zinc-800">
              <div className="flex items-center p-4 bg-zinc-50 dark:bg-zinc-900">
                <div className="flex-1 text-sm font-medium text-gray-600">Features</div>
                <div className="flex items-center gap-8 text-sm">
                  {plans.map((plan) => (
                    <div
                      key={plan.level}
                      className="w-16 text-center font-medium text-gray-600"
                    >
                      {plan.name}
                    </div>
                  ))}
                </div>
              </div>
              {features.map((feature) => (
                <div
                  key={feature.name}
                  className="flex items-center p-4 transition-colors"
                >
                  <div className="flex-1 text-sm">{feature.name}</div>
                  <div className="flex items-center gap-8 text-sm">
                    {plans.map((plan) => (
                      <div
                        key={plan.level}
                        className="w-16 flex justify-center"
                      >
                        {shouldShowCheck(feature.included, plan.level) ? (
                          <CheckIcon className="w-5 h-5 text-blue-500" />
                        ) : (
                          <span className="text-zinc-300 dark:text-zinc-700">
                            -
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

function shouldShowCheck(
  included: PricingFeature["included"],
  level: string,
): boolean {
  if (included === "all") return true
  if (included === "pro" && (level === "pro" || level === "all")) return true
  if (
    included === "starter" &&
    (level === "starter" || level === "pro" || level === "all")
  )
    return true
  return false
}
