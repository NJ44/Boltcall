// Token plan allocations
export const TOKEN_PLANS = {
  starter: { monthlyTokens: 1000, price: 549 },
  pro: { monthlyTokens: 3000, price: 897 },
  ultimate: { monthlyTokens: 10000, price: 4997 },
} as const;

// Token costs per feature action
export const TOKEN_COSTS = {
  ai_voice_minute: 10,
  ai_chat_message: 1,
  sms_sent: 5,
  email_received: 1,
  email_ai_draft: 8,
  email_sent: 3,
  lead_processed: 2,
  kb_document_sync: 3,
  web_scrape: 5,
} as const;

// Bonus token rewards for feature configuration
export const TOKEN_REWARDS = {
  complete_business_profile: { tokens: 50, label: 'Complete business profile' },
  add_first_kb_document: { tokens: 30, label: 'Add first KB document' },
  connect_phone_number: { tokens: 50, label: 'Connect phone number' },
  setup_ai_agent: { tokens: 100, label: 'Set up AI agent' },
  connect_facebook: { tokens: 75, label: 'Connect Facebook Ads' },
  upload_first_file: { tokens: 20, label: 'Upload first file to KB' },
  configure_reminders: { tokens: 25, label: 'Configure reminders' },
  enable_reputation: { tokens: 25, label: 'Enable reputation manager' },
  connect_email: { tokens: 75, label: 'Connect email inbox' },
} as const;

export type TokenRewardType = keyof typeof TOKEN_REWARDS;
export type TokenCostType = keyof typeof TOKEN_COSTS;

// Convert tokens to approximate feature units
export function tokensToMinutes(tokens: number): number {
  return Math.floor(tokens / TOKEN_COSTS.ai_voice_minute);
}
export function tokensToMessages(tokens: number): number {
  return Math.floor(tokens / TOKEN_COSTS.ai_chat_message);
}
export function tokensToSms(tokens: number): number {
  return Math.floor(tokens / TOKEN_COSTS.sms_sent);
}
export function tokensToEmailResponses(tokens: number): number {
  return Math.floor(tokens / (TOKEN_COSTS.email_received + TOKEN_COSTS.email_ai_draft + TOKEN_COSTS.email_sent));
}
