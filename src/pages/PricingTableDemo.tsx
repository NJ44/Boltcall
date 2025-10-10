import React from 'react';
import { PricingTable } from '../components/ui/pricing-table';

const PricingTableDemo: React.FC = () => {
  const features = [
    { name: "Basic Analytics", included: "starter" },
    { name: "Up to 5 team members", included: "starter" },
    { name: "Basic support", included: "starter" },
    { name: "Advanced Analytics", included: "pro" },
    { name: "Up to 20 team members", included: "pro" },
    { name: "Priority support", included: "pro" },
    { name: "Custom integrations", included: "all" },
    { name: "Unlimited team members", included: "all" },
    { name: "24/7 phone support", included: "all" },
  ];

  const plans = [
    {
      name: "Starter",
      level: "starter",
      price: { monthly: 15, yearly: 144 },
    },
    {
      name: "Pro",
      level: "pro",
      price: { monthly: 49, yearly: 470 },
      popular: true,
    },
    {
      name: "Enterprise",
      level: "all",
      price: { monthly: 99, yearly: 990 },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">PricingTable Component Demo</h1>
          <p className="text-gray-600 text-lg">Interactive pricing table with feature comparison</p>
        </div>
        
        <PricingTable
          features={features}
          plans={plans}
          defaultPlan="pro"
          defaultInterval="monthly"
          onPlanSelect={(plan) => {
            console.log("Selected plan:", plan);
            alert(`You selected the ${plan} plan!`);
          }}
          containerClassName="py-12"
          buttonClassName="bg-blue-600 hover:bg-blue-700"
        />
      </div>
    </div>
  );
};

export default PricingTableDemo;





