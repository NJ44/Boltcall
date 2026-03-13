import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Download, CheckCircle, Star, Loader2, ExternalLink } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { getUserSubscription, getUserInvoices, redirectToCheckout, PLAN_INFO, type PlanLevel } from '../../../lib/stripe';

interface Subscription {
  id: string;
  plan_level: string;
  billing_interval: string;
  status: string;
  current_period_end: string;
  stripe_customer_id: string;
}

interface Invoice {
  id: string;
  stripe_invoice_id: string;
  amount_paid: number;
  currency: string;
  status: string;
  invoice_url: string;
  invoice_pdf: string;
  period_start: string;
  period_end: string;
  created_at: string;
}

const PlanBillingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'plan' | 'billing'>('plan');
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);

  // Check for success param from Stripe redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [sub, invs] = await Promise.all([
          getUserSubscription(),
          getUserInvoices(),
        ]);
        setSubscription(sub);
        setInvoices(invs);
      } catch (err) {
        console.error('Error loading billing data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const currentPlanLevel = subscription?.plan_level || 'free';
  const currentInterval = (subscription?.billing_interval || 'monthly') as 'monthly' | 'yearly';

  const availablePlans = [
    {
      level: 'starter' as PlanLevel,
      name: 'Starter',
      price: { monthly: 197, yearly: 1970 },
      description: 'Perfect for getting started',
      features: [
        'AI Receptionist',
        'SMS & Call Management',
        'Calendar Integration',
        'Basic Analytics',
        'Speed to Lead',
      ],
    },
    {
      level: 'pro' as PlanLevel,
      name: 'Pro',
      price: { monthly: 497, yearly: 4970 },
      description: 'Most popular for growing businesses',
      popular: true,
      features: [
        'Everything in Starter',
        'Advanced Analytics',
        'Call Transcripts',
        'Full Funnel Speed to Lead',
        'SMS Chat',
        'Website Widget',
      ],
    },
    {
      level: 'agency' as PlanLevel,
      name: 'Agency',
      price: { monthly: 1497, yearly: 14970 },
      description: 'For multi-location businesses',
      features: [
        'Everything in Pro',
        'Multiple Locations',
        'AI Audits',
        'White-glove Onboarding',
        'VIP Support',
        'Custom Integrations',
      ],
    },
  ];

  const handleUpgrade = async (plan: PlanLevel) => {
    setUpgrading(plan);
    try {
      await redirectToCheckout({ plan, interval: currentInterval });
    } catch (error) {
      console.error('Upgrade error:', error);
    } finally {
      setUpgrading(null);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatAmount = (cents: number, currency = 'usd') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(cents / 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
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
          {/* Current Plan Status */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {subscription ? `${PLAN_INFO[currentPlanLevel as PlanLevel]?.name || currentPlanLevel} Plan` : 'Free Plan'}
                </h2>
                {subscription && (
                  <p className="text-sm text-gray-600 mt-1">
                    {subscription.status === 'active' && (
                      <>Next billing date: {formatDate(subscription.current_period_end)}</>
                    )}
                    {subscription.status === 'canceled' && 'Subscription canceled'}
                    {subscription.status === 'past_due' && (
                      <span className="text-red-600">Payment past due - please update your payment method</span>
                    )}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {subscription?.status === 'active' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Active
                  </span>
                )}
                {subscription?.status === 'past_due' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Past Due
                  </span>
                )}
                {!subscription && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Free
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Available Plans */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Plans</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {availablePlans.map((plan, index) => {
                const isCurrent = currentPlanLevel === plan.level;
                return (
                  <motion.div
                    key={plan.name}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative rounded-xl border-2 p-6 ${
                      isCurrent
                        ? 'border-blue-500 bg-blue-50'
                        : plan.popular
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    {plan.popular && !isCurrent && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          Most Popular
                        </div>
                      </div>
                    )}

                    {isCurrent && (
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
                        <span className="text-4xl font-bold text-gray-900">
                          ${currentInterval === 'yearly' ? Math.round(plan.price.yearly / 12) : plan.price.monthly}
                        </span>
                        <span className="text-gray-600">/month</span>
                      </div>
                      {currentInterval === 'yearly' && (
                        <p className="text-xs text-green-600 mt-1">Billed ${plan.price.yearly}/year (save 17%)</p>
                      )}
                    </div>

                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      variant={isCurrent ? "outline" : plan.popular ? "primary" : "outline"}
                      size="lg"
                      className="w-full"
                      disabled={isCurrent || upgrading !== null}
                      onClick={() => !isCurrent && handleUpgrade(plan.level)}
                    >
                      {upgrading === plan.level ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Redirecting...
                        </span>
                      ) : isCurrent ? (
                        'Current Plan'
                      ) : (
                        'Upgrade Now'
                      )}
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Billing Tab */}
      {activeTab === 'billing' && (
        <div className="space-y-8">
          {/* Billing History */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Billing History</h2>
                <p className="text-gray-600">Your recent invoices and payments</p>
              </div>
            </div>

            {invoices.length === 0 ? (
              <div className="text-center py-12">
                <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No invoices yet</p>
                <p className="text-sm text-gray-400 mt-1">Invoices will appear here after your first payment</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-gray-600">{formatDate(invoice.created_at)}</td>
                        <td className="py-3 px-4 font-medium text-gray-900">
                          {formatAmount(invoice.amount_paid, invoice.currency)}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            invoice.status === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : invoice.status === 'open'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {invoice.status === 'paid' && <CheckCircle className="w-3 h-3 mr-1" />}
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {invoice.invoice_url && (
                              <a
                                href={invoice.invoice_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                              >
                                <ExternalLink className="w-3 h-3" />
                                View
                              </a>
                            )}
                            {invoice.invoice_pdf && (
                              <a
                                href={invoice.invoice_pdf}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                              >
                                <Download className="w-3 h-3" />
                                PDF
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanBillingPage;
