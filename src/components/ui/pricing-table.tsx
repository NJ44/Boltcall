"use client"

import * as React from "react"
import { cn } from "../../lib/utils"
import { CheckIcon } from "@radix-ui/react-icons"
import NumberFlow from "@number-flow/react"

export type PlanLevel = "starter" | "pro" | "all" | "custom" | string

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
  isCustom?: boolean
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
        "bg-transparent text-foreground",
        "py-12 sm:py-24 md:py-32 px-4",
        "fade-bottom pb-0",
      )}
    >
      <div
        className={cn("w-full max-w-6xl mx-auto px-4", containerClassName)}
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
                "flex-1 p-4 rounded-xl text-left flex flex-col min-h-[360px]",
                plan.isCustom 
                  ? "bg-gray-900 text-white border border-gray-700 shadow-2xl"
                  : "bg-white border border-zinc-200 dark:border-zinc-800 shadow-lg",
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={cn("text-2xl font-bold", plan.isCustom && "text-white")}>
                  {plan.name}
                </span>
                {plan.popular && (
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded-full">
                    Popular
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1">
                {plan.isCustom ? (
                  <span className="text-2xl font-bold text-white">Custom</span>
                ) : (
                  <>
                    <NumberFlow
                      format={{
                        style: "currency",
                        currency: "USD",
                      }}
                      value={isYearly ? plan.price.yearly / 12 : plan.price.monthly}
                      className="text-lg font-bold"
                    />
                    <span className="text-xs font-normal text-zinc-500">
                      /month
                    </span>
                  </>
                )}
              </div>
              {plan.description && (
                <p className={cn("text-xs mt-2", plan.isCustom ? "text-gray-300" : "text-zinc-600 dark:text-zinc-400")}>
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
                {plan.level === 'custom' && (
                  <>
                    <div className="flex items-center text-xs text-white">
                      <svg className="w-3 h-3 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Everything in Enterprise
                    </div>
                    <div className="flex items-center text-xs text-white">
                      <svg className="w-3 h-3 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Dedicated Account Manager
                    </div>
                    <div className="flex items-center text-xs text-white">
                      <svg className="w-3 h-3 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Custom Integration
                    </div>
                  </>
                )}
              </div>
              
              <div className="mt-auto">
                {/* Divider line just above button */}
                <div className="w-3/4 mx-auto border-t border-gray-200 mb-3"></div>
                
                <button
                  onClick={() => plan.isCustom ? window.location.href = '/contact' : onPlanSelect?.(plan.level)}
                  className={cn(
                    "w-full px-6 py-3 text-sm font-medium rounded-lg transition-all duration-300 shadow-lg",
                  plan.isCustom
                    ? "bg-white text-gray-900 hover:bg-gray-100 border-2 border-white"
                    : "bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-600/90 hover:to-blue-400/90 text-white",
                  !plan.isCustom && buttonClassName
                  )}
                >
                  {plan.isCustom ? "Contact Us" : "Get Started for Free"}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white mt-8 shadow-lg">
          <div>
            <div>
              <div className="flex items-center p-4 bg-white sticky top-16 z-10 border-b border-gray-200">
                <div className="flex-1 text-base font-semibold text-gray-600 pl-4">Features</div>
                <div className="flex items-center text-base" style={{ gap: '80px', paddingRight: '16px' }}>
                  {plans.map((plan) => (
                    <div
                      key={plan.level}
                      className={cn(
                        "w-20 flex justify-center items-center font-bold py-2 text-lg",
                        plan.isCustom || plan.name === "ENTERPRISE" ? "text-white bg-gray-900 rounded" : "text-gray-600"
                      )}
                      style={{ marginLeft: '0px' }}
                    >
                      {plan.name}
                    </div>
                  ))}
                </div>
              </div>
              {features.map((feature) => (
                <div
                  key={feature.name}
                  className="flex items-center p-4 transition-all duration-300 hover:bg-gray-50"
                >
                  <div className="flex-1 text-sm pl-4">{feature.name}</div>
                  <div className="flex items-center text-sm" style={{ gap: '80px', paddingRight: '16px' }}>
                    {plans.map((plan) => (
                      <div
                        key={plan.level}
                        className={cn(
                          "w-20 flex justify-center items-center py-6",
                          (plan.isCustom || plan.name === "ENTERPRISE") && "bg-gray-900"
                        )}
                        style={{ marginLeft: '0px' }}
                      >
                        {shouldShowCheck(feature.included, plan.level) ? (
                          <CheckIcon className={cn("w-5 h-5 -ml-0.5", (plan.isCustom || plan.name === "ENTERPRISE") ? "text-blue-400" : "text-blue-500")} />
                        ) : (
                          <span className={cn((plan.isCustom || plan.name === "ENTERPRISE") ? "text-gray-600" : "text-zinc-300 dark:text-zinc-700")}>
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
  if (included === "custom" && level === "custom") return true
  if (level === "custom") return true
  if (included === "pro" && (level === "pro" || level === "all")) return true
  if (
    included === "starter" &&
    (level === "starter" || level === "pro" || level === "all")
  )
    return true
  return false
}
