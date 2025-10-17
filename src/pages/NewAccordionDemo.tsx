import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion'

export const NewAccordionDemo = () => (
  <div className="min-h-screen bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800 flex items-center justify-center p-12">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-4 text-zinc-900 dark:text-zinc-50">
        New Accordion Component
      </h1>
      <p className="text-center text-zinc-600 dark:text-zinc-400 mb-12">
        Custom styled accordion with unique design and animations
      </p>

      <Accordion className="w-full lg:w-[unset] space-y-6" type="single" collapsible>
        <AccordionItem className="lg:w-[700px] max-w-full" value="item-1">
          <AccordionTrigger className="text-lg py-6">Is it accessible?</AccordionTrigger>
          <AccordionContent className="text-base py-4">
            Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem className="lg:w-[700px] max-w-full" value="item-2">
          <AccordionTrigger className="text-lg py-6">What is the purpose of this component?</AccordionTrigger>
          <AccordionContent className="text-base py-4">
            This accordion component provides a clean, accessible way to display collapsible content with custom styling and smooth animations.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem className="lg:w-[700px] max-w-full" value="item-3">
          <AccordionTrigger className="text-lg py-6">How does it work?</AccordionTrigger>
          <AccordionContent className="text-base py-4">
            The component uses Radix UI primitives for accessibility and includes custom Tailwind classes for styling. It features smooth expand/collapse animations and a unique visual design.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem className="lg:w-[700px] max-w-full" value="item-4">
          <AccordionTrigger className="text-lg py-6">Can I customize the styling?</AccordionTrigger>
          <AccordionContent className="text-base py-4">
            Yes! The component uses CSS variables that can be customized in your global CSS file. You can modify colors, shadows, borders, and more through the CSS custom properties.
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-16 max-w-3xl mx-auto bg-white dark:bg-zinc-900 rounded-xl p-8 shadow-lg">
        <h3 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-zinc-50">
          Component Features
        </h3>
        <ul className="space-y-3 text-zinc-700 dark:text-zinc-300">
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span><strong>Custom Styling:</strong> Unique design with custom colors, shadows, and borders</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span><strong>Smooth Animations:</strong> Accordion expand/collapse with CSS keyframes</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span><strong>Accessibility:</strong> Built on Radix UI primitives for full accessibility support</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span><strong>Dark Mode:</strong> Full dark mode support with custom color schemes</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span><strong>Responsive:</strong> Adapts to different screen sizes with responsive design</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span><strong>TypeScript:</strong> Full TypeScript support with proper type definitions</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
)

export default NewAccordionDemo

