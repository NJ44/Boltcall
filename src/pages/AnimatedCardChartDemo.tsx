import {
  AnimatedCard,
  CardBody,
  CardDescription,
  CardTitle,
  CardVisual,
  Visual3,
} from "../components/ui/animated-card-chart";
import { Tilt } from "../components/ui/tilt";

const AnimatedCardChartDemo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800 flex items-center justify-center p-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 text-zinc-900 dark:text-zinc-50">
          Animated Card Chart
        </h1>
        <p className="text-center text-zinc-600 dark:text-zinc-400 mb-12">
          Hover over the card to see the 3D tilt and animated chart effects
        </p>

        <div className="flex justify-center">
          <Tilt
            rotationFactor={15}
            isRevese
            springOptions={{
              stiffness: 26.7,
              damping: 4.1,
              mass: 0.2,
            }}
            className="rounded-xl shadow-2xl hover:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] transition-shadow duration-300"
          >
            <AnimatedCard className="shadow-xl">
              <CardVisual>
                <Visual3 mainColor="#3b82f6" secondaryColor="#06b6d4" />
              </CardVisual>
              <CardBody>
                <CardTitle>Lead Analytics</CardTitle>
                <CardDescription>
                  Monitor lead conversion rates and engagement metrics
                </CardDescription>
              </CardBody>
            </AnimatedCard>
          </Tilt>
        </div>

        <div className="mt-16 max-w-3xl mx-auto bg-white dark:bg-zinc-900 rounded-xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-zinc-50">
            Component Features
          </h3>
          <ul className="space-y-3 text-zinc-700 dark:text-zinc-300">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>3D Tilt Effect:</strong> Card tilts in 3D space based on mouse position</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>Interactive Hover Effects:</strong> Charts animate and scale on hover</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>Customizable Colors:</strong> Support for main and secondary color themes</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>Layered Animations:</strong> Multiple animation layers for depth and interest</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>Grid Overlay:</strong> Professional grid pattern with radial masking</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>Percentage Badges:</strong> Display growth metrics with color indicators</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>Dark Mode Support:</strong> Seamless dark/light theme switching</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AnimatedCardChartDemo;

