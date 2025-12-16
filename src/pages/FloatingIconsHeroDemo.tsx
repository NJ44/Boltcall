import * as React from 'react';
import {
  FloatingIconsHero,
  type FloatingIconsHeroProps,
} from '@/components/ui/floating-icons-hero-section';
import { 
  Phone, 
  Calendar, 
  MessageSquare, 
  Mail, 
  Bell, 
  Zap, 
  Globe, 
  Users, 
  Target, 
  TrendingUp,
  CheckCircle,
  Clock,
  FileText,
  BarChart,
  Settings,
  Headphones
} from 'lucide-react';

// Business-related icon components using lucide-react
const IconPhone = (props: React.SVGProps<SVGSVGElement>) => <Phone {...props} strokeWidth={2.5} />;
const IconCalendar = (props: React.SVGProps<SVGSVGElement>) => <Calendar {...props} strokeWidth={2.5} />;
const IconSMS = (props: React.SVGProps<SVGSVGElement>) => <MessageSquare {...props} strokeWidth={2.5} />;
const IconMail = (props: React.SVGProps<SVGSVGElement>) => <Mail {...props} strokeWidth={2.5} />;
const IconBell = (props: React.SVGProps<SVGSVGElement>) => <Bell {...props} strokeWidth={2.5} />;
const IconZap = (props: React.SVGProps<SVGSVGElement>) => <Zap {...props} strokeWidth={2.5} />;
const IconGlobe = (props: React.SVGProps<SVGSVGElement>) => <Globe {...props} strokeWidth={2.5} />;
const IconUsers = (props: React.SVGProps<SVGSVGElement>) => <Users {...props} strokeWidth={2.5} />;
const IconTarget = (props: React.SVGProps<SVGSVGElement>) => <Target {...props} strokeWidth={2.5} />;
const IconTrendingUp = (props: React.SVGProps<SVGSVGElement>) => <TrendingUp {...props} strokeWidth={2.5} />;
const IconCheckCircle = (props: React.SVGProps<SVGSVGElement>) => <CheckCircle {...props} strokeWidth={2.5} />;
const IconClock = (props: React.SVGProps<SVGSVGElement>) => <Clock {...props} strokeWidth={2.5} />;
const IconFileText = (props: React.SVGProps<SVGSVGElement>) => <FileText {...props} strokeWidth={2.5} />;
const IconBarChart = (props: React.SVGProps<SVGSVGElement>) => <BarChart {...props} strokeWidth={2.5} />;
const IconSettings = (props: React.SVGProps<SVGSVGElement>) => <Settings {...props} strokeWidth={2.5} />;
const IconHeadphones = (props: React.SVGProps<SVGSVGElement>) => <Headphones {...props} strokeWidth={2.5} />;

// Define the icons with their unique positions for the demo.
const demoIcons: FloatingIconsHeroProps['icons'] = [
  { id: 1, icon: IconPhone, className: 'top-[10%] left-[10%]' },
  { id: 2, icon: IconCalendar, className: 'top-[20%] right-[8%]' },
  { id: 3, icon: IconSMS, className: 'top-[70%] left-[10%]' },
  { id: 4, icon: IconBell, className: 'top-[5%] left-[30%]' },
  { id: 5, icon: IconZap, className: 'top-[5%] right-[30%]' },
  { id: 6, icon: IconUsers, className: 'top-[40%] left-[15%]' },
  { id: 7, icon: IconTarget, className: 'top-[65%] right-[25%]' },
  { id: 8, icon: IconCheckCircle, className: 'top-[50%] right-[5%]' },
  { id: 9, icon: IconClock, className: 'top-[55%] left-[5%]' },
];

export default function FloatingIconsHeroDemo() {
  return (
    <FloatingIconsHero
      title="A World of Innovation"
      subtitle="Explore a universe of possibilities with our platform, connecting you to the tools and technologies that shape the future."
      ctaText="Join the Revolution"
      ctaHref="/coming-soon"
      icons={demoIcons}
      className="bg-white"
    />
  );
}
