import { EmptyState } from "../components/ui/empty-state"
import { 
  Users,
  Calendar,
  Phone
} from "lucide-react"


function EmptyStateLeads() {
  return (
    <EmptyState
      title="No Leads Yet"
      description="Your leads will appear here once customers start reaching out through your BoltCall system."
      icons={[Users, Phone, Calendar]}
      action={{
        label: "Start the free setup",
        onClick: () => console.log("Setup guide clicked")
      }}
    />
  )
}


const EmptyStateDemo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800 flex items-center justify-center p-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 text-zinc-900 dark:text-zinc-50">
          Empty State Components
        </h1>
        <p className="text-center text-zinc-600 dark:text-zinc-400 mb-12">
          Interactive empty state components with different styles and use cases
        </p>

        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            <EmptyStateLeads />
          </div>
        </div>

        <div className="mt-16 max-w-3xl mx-auto bg-white dark:bg-zinc-900 rounded-xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-zinc-50">
            Component Features
          </h3>
          <ul className="space-y-3 text-zinc-700 dark:text-zinc-300">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>Flexible Icons:</strong> Support for 1-3 icons with animated stacking effects</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>Interactive Animations:</strong> Hover effects with smooth transitions</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>Action Buttons:</strong> Optional call-to-action buttons with custom handlers</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>Responsive Design:</strong> Adapts to different screen sizes and layouts</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>Customizable:</strong> Full control over styling and behavior</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>Accessibility:</strong> Proper semantic markup and keyboard navigation</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default EmptyStateDemo
