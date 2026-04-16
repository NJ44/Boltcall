import { createClient, SupabaseClient } from '@supabase/supabase-js';

export function getSupabase(): SupabaseClient {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
  return createClient(url, key);
}

export type TokenCategory =
  | 'ai_voice_minute'
  | 'ai_chat_message'
  | 'sms_sent'
  | 'email_sent'
  | 'email_received'
  | 'email_ai_draft'
  | 'outbound_call'
  | 'lead_processed'
  | 'kb_document_sync'
  | 'web_scrape'
  | 'ai_self_heal'
  | 'ai_kb_extract'
  | 'whatsapp_sent'
  | 'whatsapp_ai_draft';

export const TOKEN_COSTS: Record<TokenCategory, number> = {
  ai_voice_minute: 10,
  ai_chat_message: 1,
  sms_sent: 5,
  email_sent: 3,
  email_received: 1,
  email_ai_draft: 8,
  outbound_call: 15,
  lead_processed: 2,
  kb_document_sync: 3,
  web_scrape: 5,
  ai_self_heal: 20,
  ai_kb_extract: 5,
  whatsapp_sent: 6,
  whatsapp_ai_draft: 8,
};

interface DeductResult {
  success: boolean;
  tokensDeducted: number;
  remainingBalance: number;
  error?: string;
}

/**
 * Deduct tokens from a user's balance in a Netlify function context.
 * Deducts from bonus_balance first, then from balance.
 * Also logs the transaction in token_transactions.
 */
export async function deductTokens(
  userId: string,
  cost: number,
  category: TokenCategory,
  description: string,
  metadata?: Record<string, unknown>,
  supabaseOverride?: SupabaseClient
): Promise<DeductResult> {
  const supabase = supabaseOverride || getSupabase();

  // Get current balance
  const { data: balance, error: fetchError } = await supabase
    .from('token_balances')
    .select('balance, bonus_balance, tokens_used_this_period')
    .eq('user_id', userId)
    .single();

  if (fetchError || !balance) {
    return {
      success: false,
      tokensDeducted: 0,
      remainingBalance: 0,
      error: fetchError?.message || 'No token balance found for user',
    };
  }

  const totalAvailable = (balance.balance || 0) + (balance.bonus_balance || 0);
  if (totalAvailable < cost) {
    return {
      success: false,
      tokensDeducted: 0,
      remainingBalance: totalAvailable,
      error: 'Insufficient token balance',
    };
  }

  // Deduct from bonus first, then balance
  const bonusDeduct = Math.min(balance.bonus_balance || 0, cost);
  const balanceDeduct = cost - bonusDeduct;

  const newBonusBalance = (balance.bonus_balance || 0) - bonusDeduct;
  const newBalance = (balance.balance || 0) - balanceDeduct;
  const newTokensUsed = (balance.tokens_used_this_period || 0) + cost;

  const { error: updateError } = await supabase
    .from('token_balances')
    .update({
      bonus_balance: newBonusBalance,
      balance: newBalance,
      tokens_used_this_period: newTokensUsed,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  if (updateError) {
    return {
      success: false,
      tokensDeducted: 0,
      remainingBalance: totalAvailable,
      error: `Failed to update balance: ${updateError.message}`,
    };
  }

  // Log the transaction
  const { error: txError } = await supabase.from('token_transactions').insert({
    user_id: userId,
    amount: cost,
    type: 'debit',
    category,
    description,
    metadata: {
      bonus_deducted: bonusDeduct,
      balance_deducted: balanceDeduct,
      ...(metadata || {}),
    },
  });

  if (txError) {
    console.error('Failed to log token transaction:', txError.message);
    // Non-fatal: balance was already deducted, just log the error
  }

  return {
    success: true,
    tokensDeducted: cost,
    remainingBalance: newBalance + newBonusBalance,
  };
}

/**
 * Deduct tokens for multiple items in a batch (e.g., multiple voice minutes).
 * This is more efficient than calling deductTokens in a loop.
 */
export async function deductTokensBatch(
  userId: string,
  items: Array<{ cost: number; category: TokenCategory; description: string; metadata?: Record<string, unknown> }>,
  supabaseOverride?: SupabaseClient
): Promise<DeductResult> {
  if (items.length === 0) {
    return { success: true, tokensDeducted: 0, remainingBalance: 0 };
  }

  const totalCost = items.reduce((sum, item) => sum + item.cost, 0);
  const supabase = supabaseOverride || getSupabase();

  // Get current balance
  const { data: balance, error: fetchError } = await supabase
    .from('token_balances')
    .select('balance, bonus_balance, tokens_used_this_period')
    .eq('user_id', userId)
    .single();

  if (fetchError || !balance) {
    return {
      success: false,
      tokensDeducted: 0,
      remainingBalance: 0,
      error: fetchError?.message || 'No token balance found for user',
    };
  }

  const totalAvailable = (balance.balance || 0) + (balance.bonus_balance || 0);
  if (totalAvailable < totalCost) {
    return {
      success: false,
      tokensDeducted: 0,
      remainingBalance: totalAvailable,
      error: 'Insufficient token balance for batch',
    };
  }

  // Deduct from bonus first, then balance
  const bonusDeduct = Math.min(balance.bonus_balance || 0, totalCost);
  const balanceDeduct = totalCost - bonusDeduct;

  const newBonusBalance = (balance.bonus_balance || 0) - bonusDeduct;
  const newBalance = (balance.balance || 0) - balanceDeduct;
  const newTokensUsed = (balance.tokens_used_this_period || 0) + totalCost;

  const { error: updateError } = await supabase
    .from('token_balances')
    .update({
      bonus_balance: newBonusBalance,
      balance: newBalance,
      tokens_used_this_period: newTokensUsed,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  if (updateError) {
    return {
      success: false,
      tokensDeducted: 0,
      remainingBalance: totalAvailable,
      error: `Failed to update balance: ${updateError.message}`,
    };
  }

  // Log each transaction individually
  const transactions = items.map((item) => ({
    user_id: userId,
    amount: item.cost,
    type: 'debit' as const,
    category: item.category,
    description: item.description,
    metadata: item.metadata || {},
  }));

  const { error: txError } = await supabase
    .from('token_transactions')
    .insert(transactions);

  if (txError) {
    console.error('Failed to log batch token transactions:', txError.message);
  }

  return {
    success: true,
    tokensDeducted: totalCost,
    remainingBalance: newBalance + newBonusBalance,
  };
}
