import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Coins, Gift, Clock, Phone, MessageCircle, MessageSquare, Loader2, CheckCircle2, Circle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTokens } from '../../../contexts/TokenContext';
import { TOKEN_REWARDS, tokensToMinutes, tokensToMessages, tokensToSms } from '../../../lib/tokens';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';

interface TokenTransaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  created_at: string;
}

const UsagePage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { balance, bonusBalance, totalAvailable, monthlyAllocation, tokensUsed, isLoading } = useTokens();
  const [transactions, setTransactions] = useState<TokenTransaction[]>([]);
  const [txLoading, setTxLoading] = useState(true);
  const [claimedRewards, setClaimedRewards] = useState<string[]>([]);

  // Fetch recent transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user?.id) return;
      setTxLoading(true);
      try {
        const { data, error } = await supabase
          .from('token_transactions')
          .select('id, amount, category, description, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);

        if (!error && data) {
          setTransactions(data);
        }
      } catch (err) {
        console.error('Error fetching token transactions:', err);
      } finally {
        setTxLoading(false);
      }
    };

    fetchTransactions();
  }, [user?.id]);

  // Fetch claimed rewards
  useEffect(() => {
    const fetchClaimedRewards = async () => {
      if (!user?.id) return;
      try {
        const { data, error } = await supabase
          .from('token_rewards_claimed')
          .select('reward_type')
          .eq('user_id', user.id);

        if (!error && data) {
          setClaimedRewards(data.map(r => r.reward_type));
        }
      } catch (err) {
        console.error('Error fetching claimed rewards:', err);
      }
    };

    fetchClaimedRewards();
  }, [user?.id]);

  const usagePercent = monthlyAllocation > 0
    ? Math.min((tokensUsed / monthlyAllocation) * 100, 100)
    : 0;

  const getUsageColor = () => {
    if (usagePercent >= 90) return 'text-red-600';
    if (usagePercent >= 75) return 'text-amber-600';
    return 'text-blue-600';
  };

  const getBarColor = () => {
    if (usagePercent >= 90) return 'bg-red-500';
    if (usagePercent >= 75) return 'bg-amber-500';
    return 'bg-blue-500';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Token Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <Coins className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{t('tokens.balance')}</h2>
            <p className="text-sm text-gray-500">{t('tokens.currentPeriod')}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">{t('tokens.planTokens')}</p>
            <p className="text-xl font-bold text-gray-900">{balance.toLocaleString()}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-xs text-blue-600 mb-1">{t('tokens.bonusTokens')}</p>
            <p className="text-xl font-bold text-blue-700">{bonusBalance.toLocaleString()}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-xs text-green-600 mb-1">{t('tokens.totalAvailable')}</p>
            <p className="text-xl font-bold text-green-700">{totalAvailable.toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">{t('tokens.monthlyAllocation')}</p>
            <p className="text-xl font-bold text-gray-900">{monthlyAllocation.toLocaleString()}</p>
          </div>
        </div>

        {/* Usage Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{t('tokens.usedThisPeriod')}</span>
            <span className={`font-semibold ${getUsageColor()}`}>
              {tokensUsed.toLocaleString()} / {monthlyAllocation.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${usagePercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`h-2.5 rounded-full ${getBarColor()}`}
            />
          </div>
          <p className="text-xs text-gray-500">{usagePercent.toFixed(1)}% used</p>
        </div>
      </motion.div>

      {/* Token Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
      >
        <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('tokens.whatYouGet')}</h3>
        <div className="border-t border-gray-100 pt-4">
          <p className="text-sm text-gray-600 mb-4">
            Your <span className="font-semibold text-gray-900">{totalAvailable.toLocaleString()}</span> tokens are equivalent to approximately:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 bg-blue-50 rounded-lg p-4">
              <Phone className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div>
                <p className="text-lg font-bold text-gray-900">~{tokensToMinutes(totalAvailable).toLocaleString()}</p>
                <p className="text-xs text-gray-600">{t('tokens.voiceMinutes')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-green-50 rounded-lg p-4">
              <MessageCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-lg font-bold text-gray-900">~{tokensToMessages(totalAvailable).toLocaleString()}</p>
                <p className="text-xs text-gray-600">{t('tokens.chatMessages')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-purple-50 rounded-lg p-4">
              <MessageSquare className="w-5 h-5 text-purple-600 flex-shrink-0" />
              <div>
                <p className="text-lg font-bold text-gray-900">~{tokensToSms(totalAvailable).toLocaleString()}</p>
                <p className="text-xs text-gray-600">{t('tokens.smsMessages')}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bonus Tokens Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
            <Gift className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Bonus Token Rewards</h3>
            <p className="text-xs text-gray-500">Complete actions to earn bonus tokens</p>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-4 space-y-2.5">
          {Object.entries(TOKEN_REWARDS).map(([key, reward]) => {
            const isClaimed = claimedRewards.includes(key);
            return (
              <div
                key={key}
                className={`flex items-center justify-between py-2 px-3 rounded-lg ${
                  isClaimed ? 'bg-green-50' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {isClaimed ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-300 flex-shrink-0" />
                  )}
                  <span className={`text-sm ${isClaimed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                    {reward.label}
                  </span>
                </div>
                <span className={`text-sm font-semibold ${isClaimed ? 'text-green-600' : 'text-amber-600'}`}>
                  {isClaimed ? 'Claimed' : `+${reward.tokens} tokens`}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Usage History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <Clock className="w-4 h-4 text-gray-600" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900">Usage History</h3>
        </div>

        {txLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8 border-t border-gray-100">
            <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No usage history yet</p>
            <p className="text-xs text-gray-400 mt-1">Token transactions will appear here as you use features</p>
          </div>
        ) : (
          <div className="overflow-x-auto border-t border-gray-100">
            <table className="w-full min-w-[480px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Tokens</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(tx.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                        {tx.category.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{tx.description}</td>
                    <td className={`py-3 px-4 text-sm font-semibold text-right ${
                      tx.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default UsagePage;
