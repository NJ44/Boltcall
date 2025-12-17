import { IconHover3D } from "@/components/ui/icon-3d-hover";
import { Phone, Calendar, MessageSquare, Mail, Users, Zap } from "lucide-react";

const cards = [
  {
    icon: Phone,
    heading: "Phone",
    text: "AI-powered phone system that answers calls 24/7, books appointments, and captures leads automatically. Never miss a call again."
  },
  {
    icon: Calendar,
    heading: "Calendar",
    text: "Smart scheduling system that manages appointments, sends reminders, and syncs across all your devices. Stay organized effortlessly."
  },
  {
    icon: MessageSquare,
    heading: "Messaging",
    text: "Instant messaging platform that connects your team and customers in real-time. Fast, secure, and always available."
  },
  {
    icon: Mail,
    heading: "Email",
    text: "Automated email management that sorts, prioritizes, and responds to messages. Save hours every day with intelligent automation."
  },
  {
    icon: Users,
    heading: "Team",
    text: "Collaboration tools that bring your team together. Share files, track projects, and communicate seamlessly across departments."
  },
  {
    icon: Zap,
    heading: "Automation",
    text: "Powerful automation workflows that eliminate repetitive tasks. Focus on what matters while AI handles the rest."
  }
];

const DemoOne = () => {
  return (
    <div className="min-h-screen p-8 bg-blue-600">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Our Services</h1>
          <p className="text-blue-100 text-lg">Discover powerful tools that transform your business</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <div key={index} className="flex justify-center">
              <IconHover3D 
                heading={card.heading}
                text={card.text}
                icon={card.icon}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DemoOne;

