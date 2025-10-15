import { Accordion05 } from "../components/ui/accordion-05";

export default function AccordionDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800 flex items-center justify-center p-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 text-zinc-900 dark:text-zinc-50">
          Accordion Component Demo
        </h1>
        <p className="text-center text-zinc-600 dark:text-zinc-400 mb-12">
          Interactive accordion with smooth animations and modern design
        </p>

        <div className="flex justify-center">
          <Accordion05 />
        </div>

        <div className="mt-16 max-w-3xl mx-auto bg-white dark:bg-zinc-900 rounded-xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-zinc-50">
            Component Features
          </h3>
          <ul className="space-y-3 text-zinc-700 dark:text-zinc-300">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>Smooth Animations:</strong> Accordion items expand and collapse with fluid transitions</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>Accessible:</strong> Built with Radix UI primitives for full keyboard navigation and screen reader support</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>Customizable:</strong> Easy to customize styling and behavior with Tailwind CSS</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>Responsive:</strong> Adapts beautifully to different screen sizes</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>TypeScript:</strong> Fully typed for better development experience</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
