export type CallbackStatus = 'pending' | 'scheduled' | 'completed' | 'cancelled' | 'no_answer';
export type CallbackUrgency = 'urgent' | 'normal' | 'low';
export type CallbackOutcome = 'successful' | 'no_answer' | 'busy' | 'wrong_number' | 'callback_requested' | 'not_interested' | 'voicemail' | 'callback_scheduled';
export type TimeRange = 'morning' | 'afternoon' | 'evening' | 'anytime';
export type CallbackSource = 'website' | 'phone_call' | 'email' | 'chat' | 'referral';

export interface Callback {
  id: string;
  lead_id?: string; // Optional foreign key to leads table
  
  // Client information
  client_name: string;
  client_phone: string;
  client_email?: string;
  company_name?: string;
  
  // Callback details
  preferred_callback_time?: string; // ISO timestamp
  preferred_time_range?: TimeRange;
  timezone?: string;
  urgency?: CallbackUrgency;
  
  // Callback status
  status: CallbackStatus;
  priority: number; // 1-10 scale, 1 being highest priority
  
  // Callback notes and context
  callback_reason?: string;
  notes?: string;
  special_instructions?: string;
  
  // Callback scheduling
  scheduled_at?: string; // ISO timestamp
  completed_at?: string; // ISO timestamp
  attempted_at?: string; // ISO timestamp
  attempt_count: number;
  
  // Callback outcome
  outcome?: CallbackOutcome;
  outcome_notes?: string;
  follow_up_required: boolean;
  follow_up_date?: string; // ISO timestamp
  
  // Agent information
  assigned_agent_id?: string;
  agent_notes?: string;
  
  // Source tracking
  source?: CallbackSource;
  source_details?: string;
  
  // Metadata
  tags?: string[];
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface CreateCallbackRequest {
  lead_id?: string;
  client_name: string;
  client_phone: string;
  client_email?: string;
  company_name?: string;
  preferred_callback_time?: string;
  preferred_time_range?: TimeRange;
  timezone?: string;
  urgency?: CallbackUrgency;
  callback_reason?: string;
  notes?: string;
  special_instructions?: string;
  source?: CallbackSource;
  source_details?: string;
  tags?: string[];
}

export interface UpdateCallbackRequest {
  status?: CallbackStatus;
  priority?: number;
  scheduled_at?: string;
  completed_at?: string;
  attempted_at?: string;
  attempt_count?: number;
  notes?: string;
  special_instructions?: string;
  assigned_agent_id?: string;
  agent_notes?: string;
  outcome?: CallbackOutcome;
  outcome_notes?: string;
  follow_up_required?: boolean;
  follow_up_date?: string;
  tags?: string[];
}

export interface CallbackFilters {
  status?: CallbackStatus[];
  urgency?: CallbackUrgency[];
  assigned_agent_id?: string;
  source?: CallbackSource[];
  created_after?: string;
  created_before?: string;
  scheduled_after?: string;
  scheduled_before?: string;
  tags?: string[];
}

export interface CallbackStats {
  total: number;
  pending: number;
  scheduled: number;
  completed: number;
  cancelled: number;
  no_answer: number;
  by_urgency: {
    urgent: number;
    normal: number;
    low: number;
  };
  by_outcome: {
    successful: number;
    no_answer: number;
    busy: number;
    wrong_number: number;
    callback_requested: number;
    not_interested: number;
    voicemail: number;
    callback_scheduled: number;
  };
  average_attempts: number;
  completion_rate: number;
}
