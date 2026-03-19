import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Download, CheckCircle, Loader2, ExternalLink, Zap } from 'lucide-react';
import { getUserSubscription, getUserInvoices, redirectToCheckout, type PlanLevel } from '../../../lib/stripe';

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
  const [activeTab, setActiveTab] = useState<'plan' | 'invoices'>('plan');
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);

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

  const planDetails: Record<string, { name: string; price: { monthly: number; yearly: number } }> = {
    free: { name: 'Free', price: { monthly: 0, yearly: 0 } },
    starter: { name: 'Starter', price: { monthly: 197, yearly: 1970 } },
    pro: { name: 'Pro', price: { monthly: 497, yearly: 4970 } },
    agency: { name: 'Agency', price: { monthly: 1497, yearly: 14970 } },
  };

  const currentPlan = planDetails[currentPlanLevel] || planDetails.free;

  // Usage data (would come from API in production)
  const usageItems = [
    { label: 'AI Conversations', used: 2847, limit: 10000 },
    { label: 'Phone Calls', used: 1234, limit: 5000 },
    { label: 'Leads Stored', used: 456, limit: 2000 },
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

  const tabs = [
    { id: 'plan' as const, label: 'Subscription' },
    { id: 'invoices' as const, label: 'Payment & Invoices' },
  ];

  return (
    <div className="space-y-6">
      {/* Secondary Tabs — like Instantly's "Email Outreach / Credits / CRM" row */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* ── Subscription Tab ── */}
      {activeTab === 'plan' && (
        <div className="space-y-6">
          {/* Current Plan Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Current Plan</h3>
            <div className="border-t border-gray-100 pt-5">
              <div className="flex flex-wrap items-start justify-between gap-6">
                {/* Plan name + price */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-gray-900">{currentPlan.name}</p>
                    <p className="text-gray-600 text-sm">
                      <span className="font-semibold text-gray-900">
                        ${currentInterval === 'yearly'
                          ? Math.round(currentPlan.price.yearly / 12)
                          : currentPlan.price.monthly}
                      </span>
                      {' '}/ month
                    </p>
                  </div>
                </div>

                {/* Primary usage metric */}
                <div className="flex-1 min-w-[200px] max-w-xs">
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="text-sm text-gray-700">AI Conversations</span>
                    <span className="text-sm">
                      <span className={usageItems[0].used / usageItems[0].limit > 0.9 ? 'text-red-600 font-semibold' : 'text-blue-600 font-semibold'}>
                        {usageItems[0].used.toLocaleString()}
                      </span>
                      {' / '}
                      <span className={usageItems[0].used / usageItems[0].limit > 0.9 ? 'text-red-600 font-semibold' : 'text-blue-600 font-semibold'}>
                        {usageItems[0].limit.toLocaleString()}
                      </span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all ${
                        usageItems[0].used / usageItems[0].limit > 0.9
                          ? 'bg-red-500'
                          : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min((usageItems[0].used / usageItems[0].limit) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Add more capacity with an add-on.
                  </p>
                </div>

                {/* Billing cycle */}
                <div className="text-right text-sm text-gray-600">
                  <p>Billed {currentInterval === 'yearly' ? 'Annually' : 'Monthly'}</p>
                  {subscription?.current_period_end && (
                    <p>Renews {formatDate(subscription.current_period_end)}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Upgrade to annual CTA */}
            {currentInterval === 'monthly' && subscription && (
              <div className="mt-6">
                <button
                  onClick={() => handleUpgrade(currentPlanLevel as PlanLevel)}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                >
                  Upgrade to annual
                </button>
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800">
                  Save 20%
                </span>
              </div>
            )}
          </div>

          {/* Usage Overview */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Plan Usage</h3>
            <div className="border-t border-gray-100 pt-5 space-y-5">
              {usageItems.map((item) => {
                const pct = Math.min((item.used / item.limit) * 100, 100);
                const isHigh = pct >= 90;
                const isMid = pct >= 75;

                return (
                  <div key={item.label}>
                    <div className="flex items-baseline justify-between mb-1.5">
                      <span className="text-sm text-gray-700">{item.label}</span>
                      <span className="text-sm text-gray-500">
                        {item.used.toLocaleString()} / {item.limit.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8 }}
                        className={`h-1.5 rounded-full ${
                          isHigh ? 'bg-red-500' : isMid ? 'bg-amber-500' : 'bg-blue-500'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Available Plans */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Available Plans</h3>
            <div className="border-t border-gray-100 pt-5">
              <div className="grid md:grid-cols-3 gap-4">
                {(['starter', 'pro', 'agency'] as PlanLevel[]).map((level) => {
                  const plan = planDetails[level];
                  const isCurrent = currentPlanLevel === level;
                  const isPopular = level === 'pro';

                  return (
                    <div
                      key={level}
                      className={`relative rounded-lg border p-5 ${
                        isCurrent
                          ? 'border-blue-500 bg-blue-50/40'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {isPopular && !isCurrent && (
                        <span className="absolute -top-2.5 left-4 px-2 py-0.5 bg-blue-600 text-white text-[10px] font-semibold rounded-full uppercase tracking-wide">
                          Popular
                        </span>
                      )}
                      {isCurrent && (
                        <span className="absolute -top-2.5 left-4 px-2 py-0.5 bg-blue-600 text-white text-[10px] font-semibold rounded-full uppercase tracking-wide">
                          Current
                        </span>
                      )}

                      <p className="text-sm font-semibold text-gray-900 mt-1">{plan.name}</p>
                      <p className="mt-2">
                        <span className="text-2xl font-bold text-gray-900">
                          ${currentInterval === 'yearly' ? Math.round(plan.price.yearly / 12) : plan.price.monthly}
                        </span>
                        <span className="text-gray-500 text-sm"> /mo</span>
                      </p>

                      <button
                        disabled={isCurrent || upgrading !== null}
                        onClick={() => !isCurrent && handleUpgrade(level)}
                        className={`mt-4 w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                          isCurrent
                            ? 'bg-gray-100 text-gray-400 cursor-default'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {upgrading === level ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Redirecting...
                          </span>
                        ) : isCurrent ? (
                          'Current Plan'
                        ) : (
                          'Upgrade'
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Payment & Invoices Tab ── */}
      {activeTab === 'invoices' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Billing History</h3>

          {invoices.length === 0 ? (
            <div className="text-center py-12 border-t border-gray-100">
              <CreditCard className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No invoices yet</p>
              <p className="text-xs text-gray-400 mt-1">
                Invoices will appear here after your first payment
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto border-t border-gray-100">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {formatDate(invoice.created_at)}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        {formatAmount(invoice.amount_paid, invoice.currency)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                            invoice.status === 'paid'
                              ? 'bg-green-50 text-green-700'
                              : invoice.status === 'open'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {invoice.status === 'paid' && <CheckCircle className="w-3 h-3" />}
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {invoice.invoice_url && (
                            <a
                              href={invoice.invoice_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 text-xs flex items-center gap-1"
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
                              className="text-blue-600 hover:text-blue-700 text-xs flex items-center gap-1"
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
      )}
    </div>
  );
};

export default PlanBillingPage;
