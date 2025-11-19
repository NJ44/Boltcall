import {
  Stepper,
  StepperContent,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
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
];

export default function StepperDemo() {
  return (
    <section className="min-h-screen bg-white text-black py-16">
      <div className="flex items-center justify-center p-8">
        <Stepper
          className="flex flex-col items-center justify-center gap-10"
          defaultValue={2}
          orientation="vertical"
          indicators={{
            completed: <Check className="size-4" />,
            loading: <LoaderCircle className="size-4 animate-spin" />,
          }}
        >
          <StepperNav>
            {steps.map((step, index) => (
              <StepperItem
                key={index}
                step={index + 1}
                loading={index === 2}
                className="relative items-start not-last:flex-1"
              >
                <StepperTrigger className="items-start pb-12 last:pb-0 gap-2.5 text-black">
                  <StepperIndicator className="data-[state=completed]:bg-green-500 data-[state=completed]:text-white data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:text-gray-500">
                    {index + 1}
                  </StepperIndicator>
                  <div className="mt-0.5 text-left">
                    <StepperTitle className="text-black">
                      {index === 1 || index === 2 ? (
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
                {index < steps.length - 1 && (
                  <StepperSeparator className="absolute inset-y-0 top-7 left-3 -order-1 m-0 -translate-x-1/2 group-data-[orientation=vertical]/stepper-nav:h-[calc(100%-2rem)] group-data-[state=completed]/step:bg-green-500" />
                )}
              </StepperItem>
            ))}
          </StepperNav>

          <StepperPanel className="text-sm w-56 text-center text-black">
            {steps.map((step, index) => (
              <StepperContent key={index} value={index + 1}>
                Step {step.title} content
              </StepperContent>
            ))}
          </StepperPanel>
        </Stepper>
      </div>
    </section>
  );
}

