"use client";

import DisplayCards from "../components/ui/display-cards";
import { User } from "lucide-react";

const defaultCards = [
  {
    icon: <User className="size-4 text-blue-300" />,
    title: "John booked",
    description: "appointment booked to 12:30 tomorrow",
    date: "Just now",
    iconClassName: "text-blue-500",
    titleClassName: "text-blue-500",
    className:
      "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
  },
  {
    icon: <User className="size-4 text-blue-300" />,
    title: "Mike booked",
    description: "appointment booked to 2:15 this afternoon",
    date: "2 days ago",
    iconClassName: "text-blue-500",
    titleClassName: "text-blue-500",
    className:
      "[grid-area:stack] translate-x-12 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
  },
  {
    icon: <User className="size-4 text-blue-300" />,
    title: "David booked",
    description: "appointment booked to 9:00 AM today",
    date: "Today",
    iconClassName: "text-blue-500",
    titleClassName: "text-blue-500",
    className:
      "[grid-area:stack] translate-x-24 translate-y-20 hover:translate-y-10",
  },
];

const boltcallCards = [
  {
    icon: <User className="size-4 text-blue-300" />,
    title: "Sarah booked",
    description: "Massage therapy session",
    date: "Just now",
    iconClassName: "text-blue-500",
    titleClassName: "text-blue-500",
    className:
      "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
  },
  {
    icon: <User className="size-4 text-blue-300" />,
    title: "Alex booked",
    description: "Personal training session",
    date: "This week",
    iconClassName: "text-blue-500",
    titleClassName: "text-blue-500",
    className:
      "[grid-area:stack] translate-x-12 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
  },
  {
    icon: <User className="size-4 text-blue-300" />,
    title: "Emma booked",
    description: "Beauty treatment",
    date: "Today",
    iconClassName: "text-blue-500",
    titleClassName: "text-blue-500",
    className:
      "[grid-area:stack] translate-x-24 translate-y-20 hover:translate-y-10",
  },
];

const DisplayCardsDemo = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 text-gray-900">
          Display Cards Component
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Interactive stacked cards with hover effects and animations
        </p>

        <div className="space-y-16">
          {/* Default Cards */}
          <div>
            <h2 className="text-2xl font-bold mb-8 text-gray-900 text-center">
              Appointment Bookings
            </h2>
            <div className="flex min-h-[500px] w-full items-center justify-center py-32 px-16">
              <div className="w-full max-w-6xl">
                <DisplayCards cards={defaultCards} />
              </div>
            </div>
          </div>

        </div>

        <div className="mt-16 max-w-3xl mx-auto bg-gray-100 rounded-xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold mb-4 text-gray-900">
            Component Features
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>Stacked Layout:</strong> Cards are positioned in a 3D stacked arrangement</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>Hover Effects:</strong> Interactive animations on hover with grayscale transitions</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>Skewed Design:</strong> Cards have a unique -8deg skew for visual interest</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>Gradient Overlay:</strong> Subtle gradient effects for depth and visual appeal</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>Customizable:</strong> Full control over icons, colors, and content</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>Responsive:</strong> Adapts to different screen sizes and layouts</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DisplayCardsDemo;
