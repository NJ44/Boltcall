export type ChatStatus = 'active' | 'paused' | 'closed' | 'transferred' | 'abandoned';
export type ChatPriority = 'low' | 'normal' | 'high' | 'urgent';
export type ChatType = 'inbound' | 'outbound' | 'transfer' | 'callback';
export type PhoneType = 'mobile' | 'landline' | 'voip' | 'unknown';
export type CustomerSentiment = 'positive' | 'neutral' | 'negative' | 'frustrated';
export type CustomerIntent = 'inquiry' | 'complaint' | 'support' | 'sales' | 'booking' | 'general';
export type CustomerUrgency = 'low' | 'normal' | 'high' | 'urgent';
export type ResolutionStatus = 'resolved' | 'unresolved' | 'escalated' | 'transferred';
export type ChatSource = 'website' | 'phone' | 'email' | 'social' | 'app';

export interface ChatMessage {
  id: string;
  timestamp: string; // ISO timestamp
  sender: 'customer' | 'agent' | 'system';
  sender_id?: string; // Agent ID if sender is agent
  message_type: 'text' | 'image' | 'file' | 'system' | 'typing' | 'read_receipt';
  content: string;
  metadata?: Record<string, any>;
  is_read?: boolean;
  is_edited?: boolean;
  edited_at?: string;
  reply_to?: string; // Message ID this is replying to
}

export interface Chat {
  id: string;
  lead_id?: string; // Optional foreign key to leads table
  
  // Chat identification
  chat_session_id: string; // Unique session identifier
  external_chat_id?: string; // External system chat ID
  
  // Phone information
  primary_phone: string; // Main phone number
  secondary_phone?: string; // Alternative phone number
  phone_type?: PhoneType;
  
  // Chat participants
  customer_name?: string;
  customer_email?: string;
  customer_company?: string;
  agent_id?: string; // Assigned agent
  
  // Chat status and state
  status: ChatStatus;
  priority: ChatPriority;
  chat_type: ChatType;
  
  // Chat timing
  started_at: string; // ISO timestamp
  last_activity_at: string; // ISO timestamp
  ended_at?: string; // ISO timestamp
  duration_seconds: number;
  
  // Chat configuration
  language?: string;
  timezone?: string;
  source?: ChatSource;
  source_details?: string;
  
  // Chat content and history
  chat_history: ChatMessage[]; // Array of chat messages
  message_count: number;
  last_message?: string;
  last_message_at?: string; // ISO timestamp
  
  // Customer context
  customer_sentiment?: CustomerSentiment;
  customer_intent?: CustomerIntent;
  customer_urgency?: CustomerUrgency;
  
  // Agent notes and tags
  agent_notes?: string;
  internal_notes?: string;
  tags?: string[];
  
  // Resolution and outcome
  resolution_status?: ResolutionStatus;
  resolution_notes?: string;
  follow_up_required: boolean;
  follow_up_date?: string; // ISO timestamp
  
  // Quality and satisfaction
  customer_satisfaction?: number; // 1-5 rating
  agent_rating?: number; // 1-5 rating
  quality_score?: number; // 0.00-10.00
  
  // Integration and external data
  integration_data?: Record<string, any>;
  metadata?: Record<string, any>;
  
  // System tracking
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface CreateChatRequest {
  lead_id?: string;
  chat_session_id: string;
  external_chat_id?: string;
  primary_phone: string;
  secondary_phone?: string;
  phone_type?: PhoneType;
  customer_name?: string;
  customer_email?: string;
  customer_company?: string;
  agent_id?: string;
  priority?: ChatPriority;
  chat_type?: ChatType;
  language?: string;
  timezone?: string;
  source?: ChatSource;
  source_details?: string;
  customer_intent?: CustomerIntent;
  customer_urgency?: CustomerUrgency;
  tags?: string[];
  integration_data?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface UpdateChatRequest {
  status?: ChatStatus;
  priority?: ChatPriority;
  agent_id?: string;
  agent_notes?: string;
  internal_notes?: string;
  ended_at?: string;
  customer_sentiment?: CustomerSentiment;
  customer_intent?: CustomerIntent;
  customer_urgency?: CustomerUrgency;
  resolution_status?: ResolutionStatus;
  resolution_notes?: string;
  follow_up_required?: boolean;
  follow_up_date?: string;
  customer_satisfaction?: number;
  agent_rating?: number;
  quality_score?: number;
  tags?: string[];
  integration_data?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface AddMessageRequest {
  chat_id: string;
  sender: 'customer' | 'agent' | 'system';
  sender_id?: string;
  message_type: 'text' | 'image' | 'file' | 'system' | 'typing' | 'read_receipt';
  content: string;
  metadata?: Record<string, any>;
  reply_to?: string;
}

export interface ChatFilters {
  status?: ChatStatus[];
  priority?: ChatPriority[];
  chat_type?: ChatType[];
  agent_id?: string;
  source?: ChatSource[];
  customer_sentiment?: CustomerSentiment[];
  customer_intent?: CustomerIntent[];
  resolution_status?: ResolutionStatus[];
  started_after?: string;
  started_before?: string;
  last_activity_after?: string;
  last_activity_before?: string;
  tags?: string[];
  has_unread_messages?: boolean;
  follow_up_required?: boolean;
}

export interface ChatStats {
  total: number;
  active: number;
  paused: number;
  closed: number;
  transferred: number;
  abandoned: number;
  by_priority: {
    low: number;
    normal: number;
    high: number;
    urgent: number;
  };
  by_type: {
    inbound: number;
    outbound: number;
    transfer: number;
    callback: number;
  };
  by_sentiment: {
    positive: number;
    neutral: number;
    negative: number;
    frustrated: number;
  };
  by_resolution: {
    resolved: number;
    unresolved: number;
    escalated: number;
    transferred: number;
  };
  average_duration: number; // in seconds
  average_messages: number;
  average_satisfaction: number;
  response_time_avg: number; // in seconds
  resolution_rate: number; // percentage
}

export interface ChatSearchResult {
  chat: Chat;
  relevance_score: number;
  matched_fields: string[];
}

export interface ChatAnalytics {
  total_chats: number;
  active_chats: number;
  completed_chats: number;
  average_duration: number;
  average_messages_per_chat: number;
  customer_satisfaction_avg: number;
  resolution_rate: number;
  response_time_avg: number;
  peak_hours: number[];
  busiest_days: string[];
  top_intents: Array<{ intent: CustomerIntent; count: number }>;
  top_sources: Array<{ source: ChatSource; count: number }>;
  agent_performance: Array<{
    agent_id: string;
    agent_name: string;
    chats_handled: number;
    average_rating: number;
    resolution_rate: number;
  }>;
}
