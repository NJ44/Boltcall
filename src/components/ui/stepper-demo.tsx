import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from '@/components/ui/stepper';
import { Check, LoaderCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = [
  {
    title: 'Create Agent',
    description: 'Set up your AI agent',
    link: '/dashboard/agents',
  },
  {
    title: 'Connect Cal.com',
    description: 'Link your calendar',
    link: '/dashboard/calcom',
  },
  {
    title: 'Setup AI Receptionist',
    description: 'Configure your receptionist',
    link: '/dashboard/agents',
  },
  {
    title: 'Configure Phone Numbers',
    description: 'Set up your phone numbers',
    link: '/dashboard/phone-numbers',
  },
  {
    title: 'Setup Knowledge Base',
    description: 'Add your business information',
    link: '/dashboard/knowledge-base',
  },
  {
    title: 'Test Your Agent',
    description: 'Test and verify your setup',
    link: '/dashboard/agents',
  },
];

const StepItem = ({ step, index, isLeftColumn }: { step: typeof steps[0], index: number, isLeftColumn: boolean }) => {
  const stepNumber = isLeftColumn ? index + 1 : index + 4;
  const isLastInColumn = isLeftColumn ? index === 2 : index === 2;
  
  return (
    <StepperItem
      step={stepNumber}
      loading={stepNumber === 3}
      className="relative items-start not-last:flex-1"
    >
      <div className="flex items-start gap-4 w-full">
        <StepperTrigger className="items-start pb-6 last:pb-0 gap-2.5 text-black flex-1">
          <StepperIndicator className="data-[state=completed]:bg-green-500 data-[state=completed]:text-white data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:text-gray-500">
            {stepNumber}
          </StepperIndicator>
          <div className="mt-0.5 text-left">
            <StepperTitle className="text-black">
              {stepNumber === 2 || stepNumber === 3 ? (
                <Link to={step.link} className="hover:underline text-blue-600">
                  {step.title}
                </Link>
              ) : (
                step.title
              )}
            </StepperTitle>
            <StepperDescription className="text-black">{step.description}</StepperDescription>
          </div>
        </StepperTrigger>
        <Link
          to={step.link}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap mt-0.5"
        >
          Go
        </Link>
      </div>
      {!isLastInColumn && (
        <StepperSeparator className="absolute inset-y-0 top-7 left-3 -order-1 m-0 -translate-x-1/2 group-data-[orientation=vertical]/stepper-nav:h-[calc(100%-1.5rem)] group-data-[state=completed]/step:bg-green-500" />
      )}
    </StepperItem>
  );
};

export default function StepperDemo() {
  const leftSteps = steps.slice(0, 3);
  const rightSteps = steps.slice(3, 6);

  return (
    <section className="min-h-screen bg-white text-black py-16">
      <div className="flex items-center justify-center p-8">
        <div className="bg-gray-100 rounded-lg p-8 max-w-5xl w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Setup Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Steps 1-3 */}
            <div className="flex-1">
              <Stepper
                className="flex flex-col items-start justify-center gap-10"
                defaultValue={2}
                orientation="vertical"
                indicators={{
                  completed: <Check className="size-4" />,
                  loading: <LoaderCircle className="size-4 animate-spin" />,
                }}
              >
                <StepperNav>
                  {leftSteps.map((step, index) => (
                    <StepItem
                      key={index}
                      step={step}
                      index={index}
                      isLeftColumn={true}
                    />
                  ))}
                </StepperNav>
              </Stepper>
            </div>

            {/* Right Column - Steps 4-6 */}
            <div className="flex-1">
              <Stepper
                className="flex flex-col items-start justify-center gap-10"
                defaultValue={5}
                orientation="vertical"
                indicators={{
                  completed: <Check className="size-4" />,
                  loading: <LoaderCircle className="size-4 animate-spin" />,
                }}
              >
                <StepperNav>
                  {rightSteps.map((step, index) => (
                    <StepItem
                      key={index}
                      step={step}
                      index={index}
                      isLeftColumn={false}
                    />
                  ))}
                </StepperNav>
              </Stepper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

