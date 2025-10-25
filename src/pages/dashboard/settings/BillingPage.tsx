import React from 'react';
import { CreditCard, Download } from 'lucide-react';
import { PricingTable } from '../../../components/ui/pricing-table';

const BillingPage: React.FC = () => {

  const pricingFeatures = [
    { name: "AI Receptionist", included: "all" },
    { name: "Call minutes per month", included: "all" },
    { name: "SMS messages per month", included: "all" },
    { name: "Calendar integration", included: "all" },
    { name: "Call recording & transcripts", included: "all" },
    { name: "Basic analytics", included: "all" },
    { name: "Advanced analytics & reporting", included: "pro" },
    { name: "Custom call flows", included: "pro" },
    { name: "Priority support", included: "pro" },
    { name: "Dedicated account manager", included: "all" },
    { name: "Custom integrations", included: "all" },
    { name: "White-label options", included: "all" },
  ];

  const pricingPlans = [
    {
      name: "STARTER",
      level: "starter",
      price: { monthly: 197, yearly: 1970 },
      description: "Good for testing things out, something like that.",
    },
    {
      name: "PRO",
      level: "pro",
      price: { monthly: 497, yearly: 4970 },
      popular: true,
      description: "Everything on Starter plus:",
    },
    {
      name: "ENTERPRISE",
      level: "custom",
      price: { monthly: 1497, yearly: 14970 },
      description: "Everything on PRO plus:",
      isCustom: true,
    },
  ];

  return (
    <div className="space-y-8">

      {/* Current Plan */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Plan</h2>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-gray-900">Starter Plan</div>
            <div className="text-gray-600 mt-1">$197/month • Billed monthly</div>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            Active
          </span>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Next billing date:</span>
            <span className="font-medium text-gray-900">March 1, 2025</span>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
        
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-gray-400" />
            <div>
              <div className="font-medium text-gray-900">•••• •••• •••• 4242</div>
              <div className="text-sm text-gray-600">Expires 12/25</div>
            </div>
          </div>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Update
          </button>
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Billing History</h2>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
            <Download className="w-4 h-4" />
            Download All
          </button>
        </div>
        
        <div className="space-y-3">
          {[
            { date: '2025-02-01', amount: '$197.00', status: 'Paid', invoice: 'INV-001' },
            { date: '2025-01-01', amount: '$197.00', status: 'Paid', invoice: 'INV-002' },
            { date: '2024-12-01', amount: '$197.00', status: 'Paid', invoice: 'INV-003' },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div>
                  <div className="font-medium text-gray-900">{item.amount}</div>
                  <div className="text-sm text-gray-600">{item.date}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  {item.status}
                </span>
                <button className="text-blue-600 hover:text-blue-700 text-sm">
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Available Plans</h2>
        
        <PricingTable
          features={pricingFeatures}
          plans={pricingPlans}
          defaultPlan="starter"
          defaultInterval="monthly"
          onPlanSelect={(plan) => {
            console.log("Selected plan:", plan);
            // Handle plan change
          }}
          containerClassName="py-0"
          buttonClassName="bg-blue-600 hover:bg-blue-700"
        />
      </div>
    </div>
  );
};

export default BillingPage;

