import { Card, CardHeader } from './card-shadcn'
import { cn } from '../../lib/utils'
import { MapIcon } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import RadialOrbitalTimeline from './radial-orbital-timeline'
import { Megaphone, MessageSquare, Phone, FileText, MessageCircle } from 'lucide-react'

const timelineData = [
  {
    id: 1,
    title: "Ads",
    date: "Lead Source",
    content: "Capture leads from Google Ads, Facebook Ads, and other paid advertising campaigns. Our AI instantly responds to ad inquiries and qualifies prospects in real-time.",
    category: "Lead Capture",
    icon: Megaphone,
    relatedIds: [2, 3],
    status: "completed" as const,
    energy: 95,
  },
  {
    id: 2,
    title: "SMS",
    date: "Lead Source",
    content: "Engage leads through SMS messaging with automated responses. Schedule appointments, answer questions, and nurture leads via text messages 24/7.",
    category: "Lead Capture",
    icon: MessageSquare,
    relatedIds: [1, 4],
    status: "completed" as const,
    energy: 90,
  },
  {
    id: 3,
    title: "Phone",
    date: "Lead Source",
    content: "Never miss a call with our AI receptionist that answers 24/7. Handle incoming calls, schedule appointments, and provide instant support to callers automatically.",
    category: "Lead Capture",
    icon: Phone,
    relatedIds: [1, 5],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 4,
    title: "Form",
    date: "Lead Source",
    content: "Connect your web forms and landing pages to capture lead information instantly. Auto-respond to form submissions and book qualified leads on your calendar.",
    category: "Lead Capture",
    icon: FileText,
    relatedIds: [2, 5],
    status: "completed" as const,
    energy: 85,
  },
  {
    id: 5,
    title: "Widget",
    date: "Lead Source",
    content: "Embed our AI chat widget on your website to engage visitors in real-time. Answer questions, qualify leads, and convert website traffic into booked appointments.",
    category: "Lead Capture",
    icon: MessageCircle,
    relatedIds: [3, 4],
    status: "completed" as const,
    energy: 88,
  },
];

export function Features() {
    return (
        <div className="mx-auto max-w-2xl px-6 lg:max-w-5xl">
            <div className="mx-auto grid gap-4 lg:grid-cols-2">
                    <FeatureCard className="p-6 lg:col-span-2">
                        <p className="mx-auto my-6 max-w-md text-balance text-center text-2xl font-semibold">Smart scheduling with automated reminders for maintenance.</p>

                        <div className="flex justify-center gap-6 overflow-hidden">
                            <CircularUI
                                label="Inclusion"
                                circles={[{ pattern: 'border' }, { pattern: 'border' }]}
                            />

                            <CircularUI
                                label="Inclusion"
                                circles={[{ pattern: 'none' }, { pattern: 'primary' }]}
                            />

                            <CircularUI
                                label="Join"
                                circles={[{ pattern: 'blue' }, { pattern: 'none' }]}
                            />

                            <CircularUI
                                label="Exclusion"
                                circles={[{ pattern: 'primary' }, { pattern: 'none' }]}
                                className="hidden sm:block"
                            />
                        </div>
                    </FeatureCard>

                    <FeatureCard>
                        <div className="relative mb-6 sm:mb-0 h-[400px] bg-transparent">
                            <RadialOrbitalTimeline timelineData={timelineData} />
                        </div>
                    </FeatureCard>

                    <FeatureCard className="p-6">
                        <p className="mx-auto my-6 max-w-md text-balance text-center text-2xl font-semibold">Connect all your lead sources seamlessly</p>

                        <div className="flex justify-center gap-6 overflow-hidden">
                            <CircularUI
                                label="Ads"
                                circles={[{ pattern: 'border' }, { pattern: 'border' }]}
                            />

                            <CircularUI
                                label="SMS"
                                circles={[{ pattern: 'none' }, { pattern: 'primary' }]}
                            />

                            <CircularUI
                                label="Phone"
                                circles={[{ pattern: 'blue' }, { pattern: 'none' }]}
                            />

                            <CircularUI
                                label="Forms"
                                circles={[{ pattern: 'primary' }, { pattern: 'none' }]}
                                className="hidden sm:block"
                            />
                            
                            <CircularUI
                                label="Widget"
                                circles={[{ pattern: 'border' }, { pattern: 'primary' }]}
                                className="hidden sm:block"
                            />
                        </div>
                    </FeatureCard>
            </div>
        </div>
    )
}

interface FeatureCardProps {
    children: ReactNode
    className?: string
}

const FeatureCard = ({ children, className }: FeatureCardProps) => (
    <Card className={cn('group relative rounded-none shadow-zinc-950/5', className)}>
        <CardDecorator />
        {children}
    </Card>
)

const CardDecorator = () => (
    <>
        <span className="border-primary absolute -left-px -top-px block size-2 border-l-2 border-t-2"></span>
        <span className="border-primary absolute -right-px -top-px block size-2 border-r-2 border-t-2"></span>
        <span className="border-primary absolute -bottom-px -left-px block size-2 border-b-2 border-l-2"></span>
        <span className="border-primary absolute -bottom-px -right-px block size-2 border-b-2 border-r-2"></span>
    </>
)

interface CardHeadingProps {
    icon: LucideIcon
    title: string
    description: string
}

const CardHeading = ({ icon: Icon, title, description }: CardHeadingProps) => (
    <div className="p-6">
        <span className="text-muted-foreground flex items-center gap-2">
            <Icon className="size-4" />
            {title}
        </span>
        <p className="mt-8 text-2xl font-semibold">{description}</p>
    </div>
)

interface DualModeImageProps {
    darkSrc: string
    lightSrc: string
    alt: string
    width: number
    height: number
    className?: string
}

const DualModeImage = ({ darkSrc, lightSrc, alt, width, height, className }: DualModeImageProps) => (
    <>
        <img
            src={darkSrc}
            className={cn('hidden dark:block', className)}
            alt={`${alt} dark`}
            width={width}
            height={height}
        />
        <img
            src={lightSrc}
            className={cn('shadow dark:hidden', className)}
            alt={`${alt} light`}
            width={width}
            height={height}
        />
    </>
)

interface CircleConfig {
    pattern: 'none' | 'border' | 'primary' | 'blue'
}

interface CircularUIProps {
    label: string
    circles: CircleConfig[]
    className?: string
}

const CircularUI = ({ label, circles, className }: CircularUIProps) => (
    <div className={className}>
        <div className="bg-gradient-to-b from-border size-fit rounded-2xl to-transparent p-px">
            <div className="bg-gradient-to-b from-background to-muted/25 relative flex aspect-square w-fit items-center -space-x-4 rounded-[15px] p-4">
                {circles.map((circle, i) => (
                    <div
                        key={i}
                        className={cn('size-7 rounded-full border sm:size-8', {
                            'border-primary': circle.pattern === 'none',
                            'border-primary bg-[repeating-linear-gradient(-45deg,hsl(var(--border)),hsl(var(--border))_1px,transparent_1px,transparent_4px)]': circle.pattern === 'border',
                            'border-primary bg-background bg-[repeating-linear-gradient(-45deg,hsl(var(--primary)),hsl(var(--primary))_1px,transparent_1px,transparent_4px)]': circle.pattern === 'primary',
                            'bg-background z-1 border-blue-500 bg-[repeating-linear-gradient(-45deg,theme(colors.blue.500),theme(colors.blue.500)_1px,transparent_1px,transparent_4px)]': circle.pattern === 'blue',
                        })}></div>
                ))}
            </div>
        </div>
        <span className="text-muted-foreground mt-1.5 block text-center text-sm">{label}</span>
    </div>
)

