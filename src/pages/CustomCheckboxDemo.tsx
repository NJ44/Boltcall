"use client"

import { CustomCheckbox, GradientCheckbox, TransformerCheckbox, AnimatedCheckbox } from "../components/ui/custom-checkbox"

function DefaultCheckbox() {
  return (
    <div className="flex flex-col items-center gap-4 p-1 text-center xl:gap-8">
      <CustomCheckbox />
      <span>Just a normal one</span>
    </div>
  )
}

function GradientCheckboxDemo() {
  return (
    <div className="flex flex-col items-center gap-4 p-1 text-center xl:gap-8">
      <GradientCheckbox />
      <span>With gradient shadow</span>
    </div>
  )
}

function TransformerCheckboxDemo() {
  return (
    <div className="flex flex-col items-center gap-4 p-1 text-center xl:gap-8">
      <TransformerCheckbox />
      <span>Transformer</span>
    </div>
  )
}

function AnimatedCheckboxDemo() {
  return (
    <div className="flex flex-col items-center gap-4 p-1 text-center xl:gap-8">
      <AnimatedCheckbox />
      <span>With animation</span>
    </div>
  )
}

const CustomCheckboxDemo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800 flex items-center justify-center p-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 text-zinc-900 dark:text-zinc-50">
          Custom Checkbox Components
        </h1>
        <p className="text-center text-zinc-600 dark:text-zinc-400 mb-12">
          Interactive checkbox components with different styles and animations
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <DefaultCheckbox />
          <GradientCheckboxDemo />
          <TransformerCheckboxDemo />
          <AnimatedCheckboxDemo />
        </div>

        <div className="mt-16 max-w-3xl mx-auto bg-white dark:bg-zinc-900 rounded-xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-zinc-50">
            Component Features
          </h3>
          <ul className="space-y-3 text-zinc-700 dark:text-zinc-300">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>CustomCheckbox:</strong> Standard checkbox with blue accent and smooth animations</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>GradientCheckbox:</strong> Checkbox with gradient shadow effects and color transitions</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>TransformerCheckbox:</strong> Morphing checkbox that transforms into a checkmark</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>AnimatedCheckbox:</strong> Circular checkbox with pulse animation and color changes</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>Accessibility:</strong> Full keyboard navigation and screen reader support</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>Dark Mode:</strong> Automatic theme adaptation for all components</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default CustomCheckboxDemo
