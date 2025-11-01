import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Download, CheckCircle, Star } from 'lucide-react';
import Button from '../../../components/ui/Button';

const PlanBillingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'plan' | 'billing'>('plan');

  const currentPlan = {
    name: 'Pro Plan',
    price: '$49',
    period: '/month',
    status: 'active',
    nextBilling: '2024-01-15',
    features: [
      'Up to 10,000 AI conversations',
      '5,000 phone call minutes',
      '50,000 website visitors',
      '2,000 lead storage',
      '100,000 API calls',
      'Priority support',
      'Advanced analytics',
      'Custom integrations'
    ]
  };

  const availablePlans = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      description: 'Perfect for getting started',
      features: [
        '1,000 AI conversations',
        '500 phone call minutes',
        '5,000 website visitors',
        '100 lead storage',
        '10,000 API calls',
        'Basic support'
      ],
      current: false,
      popular: false
    },
    {
      name: 'Pro',
      price: '$49',
      period: '/month',
      description: 'Most popular for growing businesses',
      features: [
        '10,000 AI conversations',
        '5,000 phone call minutes',
        '50,000 website visitors',
        '2,000 lead storage',
        '100,000 API calls',
        'Priority support',
        'Advanced analytics',
        'Custom integrations'
      ],
      current: true,
      popular: true
    },
    {
      name: 'Elite',
      price: '$99',
      period: '/month',
      description: 'For enterprise-level needs',
      features: [
        'Unlimited AI conversations',
        'Unlimited phone call minutes',
        'Unlimited website visitors',
        'Unlimited lead storage',
        'Unlimited API calls',
        '24/7 dedicated support',
        'Advanced analytics',
        'Custom integrations',
        'White-label solution',
        'Advanced security features'
      ],
      current: false,
      popular: false
    }
  ];

  const billingHistory = [
    {
      id: 'INV-001',
      date: '2024-01-15',
      amount: '$49.00',
      status: 'paid',
      description: 'Pro Plan - Monthly'
    },
    {
      id: 'INV-002',
      date: '2023-12-15',
      amount: '$49.00',
      status: 'paid',
      description: 'Pro Plan - Monthly'
    },
    {
      id: 'INV-003',
      date: '2023-11-15',
      amount: '$49.00',
      status: 'paid',
      description: 'Pro Plan - Monthly'
    }
  ];

  const paymentMethods = [
    {
      id: '1',
      type: 'card',
      last4: '4242',
      brand: 'Visa',
      expiry: '12/25',
      isDefault: true
    },
    {
      id: '2',
      type: 'card',
      last4: '5555',
      brand: 'Mastercard',
      expiry: '08/26',
      isDefault: false
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('plan')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'plan'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Subscription Plan
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'billing'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Billing & Invoices
          </button>
        </nav>
      </div>

      {/* Plan Tab */}
      {activeTab === 'plan' && (
        <div className="space-y-8">
          {/* Current Plan */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900">{currentPlan.name}</h2>
          </div>

          {/* Available Plans */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Plans</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {availablePlans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative rounded-xl border-2 p-6 ${
                    plan.popular 
                      ? 'border-purple-500 bg-purple-50' 
                      : plan.current
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        Most Popular
                      </div>
                    </div>
                  )}

                  {plan.current && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Current Plan
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600">{plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={plan.current ? "outline" : plan.popular ? "primary" : "outline"}
                    size="lg"
                    className="w-full"
                    disabled={plan.current}
                  >
                    {plan.current ? 'Current Plan' : plan.popular ? 'Upgrade Now' : 'Choose Plan'}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Billing Tab */}
      {activeTab === 'billing' && (
        <div className="space-y-8">
          {/* Payment Methods */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Payment Methods</h2>
                <p className="text-gray-600">Manage your payment information</p>
              </div>
              <Button variant="outline" size="sm">
                Add Payment Method
              </Button>
            </div>

            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{method.brand} •••• {method.last4}</span>
                        {method.isDefault && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Default</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">Expires {method.expiry}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {method.isDefault ? (
                      <Button variant="outline" size="sm" disabled>
                        Default
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm">
                        Set Default
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Billing History */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Billing History</h2>
                <p className="text-gray-600">Your recent invoices and payments</p>
              </div>
              <Button variant="outline" size="sm" className="flex items-center">
                <Download className="w-4 h-4 mr-2 flex-shrink-0" />
                Export All
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Invoice</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Description</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {billingHistory.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium text-gray-900">{invoice.id}</td>
                      <td className="py-3 px-4 text-gray-600">{invoice.date}</td>
                      <td className="py-3 px-4 text-gray-600">{invoice.description}</td>
                      <td className="py-3 px-4 font-medium text-gray-900">{invoice.amount}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Paid
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="outline" size="sm" className="flex items-center">
                          <Download className="w-4 h-4 mr-1 flex-shrink-0" />
                          Download
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default PlanBillingPage;
