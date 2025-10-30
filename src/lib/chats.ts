import { supabase } from './supabase';
import type { 
  Chat, 
  CreateChatRequest, 
  UpdateChatRequest, 
  AddMessageRequest, 
  ChatFilters, 
  ChatStats, 
  ChatSearchResult, 
  ChatAnalytics,
  ChatMessage 
} from '../types/chats';

export class ChatService {
  /**
   * Create a new chat session
   */
  static async createChat(chatData: CreateChatRequest): Promise<Chat> {
    const { data, error } = await supabase
      .from('chats')
      .insert([{
        ...chatData,
        chat_history: [],
        message_count: 0,
        duration_seconds: 0,
        follow_up_required: false
      }])
      .select(`
        *,
        leads:lead_id (
          id,
          name,
          email,
          company,
          phone
        ),
        assigned_agent:agent_id (
          id,
          email,
          name
        )
      `)
      .single();

    if (error) {
      throw new Error(`Failed to create chat: ${error.message}`);
    }

    return data;
  }

  /**
   * Get all chats with optional filtering
   */
  static async getChats(filters?: ChatFilters): Promise<Chat[]> {
    let query = supabase
      .from('chats')
      .select(`
        *,
        leads:lead_id (
          id,
          name,
          email,
          company,
          phone
        ),
        assigned_agent:agent_id (
          id,
          email,
          name
        )
      `)
      .order('last_activity_at', { ascending: false });

    // Apply filters
    if (filters) {
      if (filters.status && filters.status.length > 0) {
        query = query.in('status', filters.status);
      }
      if (filters.priority && filters.priority.length > 0) {
        query = query.in('priority', filters.priority);
      }
      if (filters.chat_type && filters.chat_type.length > 0) {
        query = query.in('chat_type', filters.chat_type);
      }
      if (filters.agent_id) {
        query = query.eq('agent_id', filters.agent_id);
      }
      if (filters.source && filters.source.length > 0) {
        query = query.in('source', filters.source);
      }
      if (filters.customer_sentiment && filters.customer_sentiment.length > 0) {
        query = query.in('customer_sentiment', filters.customer_sentiment);
      }
      if (filters.customer_intent && filters.customer_intent.length > 0) {
        query = query.in('customer_intent', filters.customer_intent);
      }
      if (filters.resolution_status && filters.resolution_status.length > 0) {
        query = query.in('resolution_status', filters.resolution_status);
      }
      if (filters.started_after) {
        query = query.gte('started_at', filters.started_after);
      }
      if (filters.started_before) {
        query = query.lte('started_at', filters.started_before);
      }
      if (filters.last_activity_after) {
        query = query.gte('last_activity_at', filters.last_activity_after);
      }
      if (filters.last_activity_before) {
        query = query.lte('last_activity_at', filters.last_activity_before);
      }
      if (filters.tags && filters.tags.length > 0) {
        query = query.overlaps('tags', filters.tags);
      }
      if (filters.follow_up_required !== undefined) {
        query = query.eq('follow_up_required', filters.follow_up_required);
      }
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch chats: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Get a single chat by ID
   */
  static async getChatById(id: string): Promise<Chat | null> {
    const { data, error } = await supabase
      .from('chats')
      .select(`
        *,
        leads:lead_id (
          id,
          name,
          email,
          company,
          phone
        ),
        assigned_agent:agent_id (
          id,
          email,
          name
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(`Failed to fetch chat: ${error.message}`);
    }

    return data;
  }

  /**
   * Get chat by session ID
   */
  static async getChatBySessionId(sessionId: string): Promise<Chat | null> {
    const { data, error } = await supabase
      .from('chats')
      .select(`
        *,
        leads:lead_id (
          id,
          name,
          email,
          company,
          phone
        ),
        assigned_agent:agent_id (
          id,
          email,
          name
        )
      `)
      .eq('chat_session_id', sessionId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(`Failed to fetch chat by session ID: ${error.message}`);
    }

    return data;
  }

  /**
   * Update a chat
   */
  static async updateChat(id: string, updates: UpdateChatRequest): Promise<Chat> {
    const { data, error } = await supabase
      .from('chats')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        leads:lead_id (
          id,
          name,
          email,
          company,
          phone
        ),
        assigned_agent:agent_id (
          id,
          email,
          name
        )
      `)
      .single();

    if (error) {
      throw new Error(`Failed to update chat: ${error.message}`);
    }

    return data;
  }

  /**
   * Delete a chat
   */
  static async deleteChat(id: string): Promise<void> {
    const { error } = await supabase
      .from('chats')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete chat: ${error.message}`);
    }
  }

  /**
   * Add a message to chat history
   */
  static async addMessage(messageData: AddMessageRequest): Promise<Chat> {
    const chat = await this.getChatById(messageData.chat_id);
    if (!chat) {
      throw new Error('Chat not found');
    }

    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      sender: messageData.sender,
      sender_id: messageData.sender_id,
      message_type: messageData.message_type,
      content: messageData.content,
      metadata: messageData.metadata,
      is_read: false,
      is_edited: false,
      reply_to: messageData.reply_to
    };

    const updatedHistory = [...chat.chat_history, newMessage];
    const messageCount = updatedHistory.length;
    const lastMessage = messageData.content;
    const lastMessageAt = newMessage.timestamp;

    const { data, error } = await supabase
      .from('chats')
      .update({
        chat_history: updatedHistory,
        message_count: messageCount,
        last_message: lastMessage,
        last_message_at: lastMessageAt,
        last_activity_at: lastMessageAt
      })
      .eq('id', messageData.chat_id)
      .select(`
        *,
        leads:lead_id (
          id,
          name,
          email,
          company,
          phone
        ),
        assigned_agent:agent_id (
          id,
          email,
          name
        )
      `)
      .single();

    if (error) {
      throw new Error(`Failed to add message: ${error.message}`);
    }

    return data;
  }

  /**
   * Mark messages as read
   */
  static async markMessagesAsRead(chatId: string, messageIds: string[]): Promise<void> {
    const chat = await this.getChatById(chatId);
    if (!chat) {
      throw new Error('Chat not found');
    }

    const updatedHistory = chat.chat_history.map(msg => 
      messageIds.includes(msg.id) ? { ...msg, is_read: true } : msg
    );

    const { error } = await supabase
      .from('chats')
      .update({ chat_history: updatedHistory })
      .eq('id', chatId);

    if (error) {
      throw new Error(`Failed to mark messages as read: ${error.message}`);
    }
  }

  /**
   * Get chats by lead ID
   */
  static async getChatsByLeadId(leadId: string): Promise<Chat[]> {
    const { data, error } = await supabase
      .from('chats')
      .select(`
        *,
        assigned_agent:agent_id (
          id,
          email,
          name
        )
      `)
      .eq('lead_id', leadId)
      .order('started_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch chats for lead: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Get chats assigned to a specific agent
   */
  static async getChatsByAgent(agentId: string): Promise<Chat[]> {
    const { data, error } = await supabase
      .from('chats')
      .select(`
        *,
        leads:lead_id (
          id,
          name,
          email,
          company,
          phone
        )
      `)
      .eq('agent_id', agentId)
      .order('priority', { ascending: true })
      .order('last_activity_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch chats for agent: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Get active chats
   */
  static async getActiveChats(): Promise<Chat[]> {
    const { data, error } = await supabase
      .from('chats')
      .select(`
        *,
        leads:lead_id (
          id,
          name,
          email,
          company,
          phone
        ),
        assigned_agent:agent_id (
          id,
          email,
          name
        )
      `)
      .eq('status', 'active')
      .order('priority', { ascending: true })
      .order('last_activity_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch active chats: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Close a chat
   */
  static async closeChat(id: string, resolutionStatus?: string, resolutionNotes?: string): Promise<Chat> {
    const updates: UpdateChatRequest = {
      status: 'closed',
      ended_at: new Date().toISOString(),
      resolution_status: resolutionStatus as any,
      resolution_notes: resolutionNotes
    };

    return this.updateChat(id, updates);
  }

  /**
   * Transfer a chat to another agent
   */
  static async transferChat(id: string, newAgentId: string, transferNotes?: string): Promise<Chat> {
    const updates: UpdateChatRequest = {
      status: 'transferred',
      agent_id: newAgentId,
      internal_notes: transferNotes
    };

    return this.updateChat(id, updates);
  }

  /**
   * Pause a chat
   */
  static async pauseChat(id: string, pauseReason?: string): Promise<Chat> {
    const updates: UpdateChatRequest = {
      status: 'paused',
      internal_notes: pauseReason
    };

    return this.updateChat(id, updates);
  }

  /**
   * Resume a paused chat
   */
  static async resumeChat(id: string): Promise<Chat> {
    const updates: UpdateChatRequest = {
      status: 'active'
    };

    return this.updateChat(id, updates);
  }

  /**
   * Search chats by content
   */
  static async searchChats(searchTerm: string, filters?: ChatFilters): Promise<ChatSearchResult[]> {
    let query = supabase
      .from('chats')
      .select(`
        *,
        leads:lead_id (
          id,
          name,
          email,
          company,
          phone
        ),
        assigned_agent:agent_id (
          id,
          email,
          name
        )
      `);

    // Apply text search
    query = query.or(`customer_name.ilike.%${searchTerm}%,customer_email.ilike.%${searchTerm}%,primary_phone.ilike.%${searchTerm}%,last_message.ilike.%${searchTerm}%`);

    // Apply additional filters
    if (filters) {
      if (filters.status && filters.status.length > 0) {
        query = query.in('status', filters.status);
      }
      if (filters.agent_id) {
        query = query.eq('agent_id', filters.agent_id);
      }
      // Add other filters as needed
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to search chats: ${error.message}`);
    }

    // Simple relevance scoring (can be enhanced)
    const results: ChatSearchResult[] = (data || []).map(chat => ({
      chat,
      relevance_score: 1.0, // Placeholder - implement proper scoring
      matched_fields: ['customer_name', 'last_message'] // Placeholder
    }));

    return results.sort((a, b) => b.relevance_score - a.relevance_score);
  }

  /**
   * Get chat statistics
   */
  static async getChatStats(): Promise<ChatStats> {
    const { data: chats, error } = await supabase
      .from('chats')
      .select('status, priority, chat_type, customer_sentiment, resolution_status, duration_seconds, message_count, customer_satisfaction');

    if (error) {
      throw new Error(`Failed to fetch chat stats: ${error.message}`);
    }

    const stats: ChatStats = {
      total: chats?.length || 0,
      active: 0,
      paused: 0,
      closed: 0,
      transferred: 0,
      abandoned: 0,
      by_priority: {
        low: 0,
        normal: 0,
        high: 0,
        urgent: 0
      },
      by_type: {
        inbound: 0,
        outbound: 0,
        transfer: 0,
        callback: 0
      },
      by_sentiment: {
        positive: 0,
        neutral: 0,
        negative: 0,
        frustrated: 0
      },
      by_resolution: {
        resolved: 0,
        unresolved: 0,
        escalated: 0,
        transferred: 0
      },
      average_duration: 0,
      average_messages: 0,
      average_satisfaction: 0,
      response_time_avg: 0,
      resolution_rate: 0
    };

    if (!chats) return stats;

    let totalDuration = 0;
    let totalMessages = 0;
    let totalSatisfaction = 0;
    let satisfactionCount = 0;
    let resolvedCount = 0;

    chats.forEach(chat => {
      // Count by status
      switch (chat.status) {
        case 'active':
          stats.active++;
          break;
        case 'paused':
          stats.paused++;
          break;
        case 'closed':
          stats.closed++;
          break;
        case 'transferred':
          stats.transferred++;
          break;
        case 'abandoned':
          stats.abandoned++;
          break;
      }

      // Count by priority
      if (chat.priority) {
        stats.by_priority[chat.priority as keyof typeof stats.by_priority]++;
      }

      // Count by type
      if (chat.chat_type) {
        stats.by_type[chat.chat_type as keyof typeof stats.by_type]++;
      }

      // Count by sentiment
      if (chat.customer_sentiment) {
        stats.by_sentiment[chat.customer_sentiment as keyof typeof stats.by_sentiment]++;
      }

      // Count by resolution
      if (chat.resolution_status) {
        stats.by_resolution[chat.resolution_status as keyof typeof stats.by_resolution]++;
        if (chat.resolution_status === 'resolved') {
          resolvedCount++;
        }
      }

      // Calculate averages
      totalDuration += chat.duration_seconds || 0;
      totalMessages += chat.message_count || 0;
      if (chat.customer_satisfaction) {
        totalSatisfaction += chat.customer_satisfaction;
        satisfactionCount++;
      }
    });

    stats.average_duration = stats.total > 0 ? totalDuration / stats.total : 0;
    stats.average_messages = stats.total > 0 ? totalMessages / stats.total : 0;
    stats.average_satisfaction = satisfactionCount > 0 ? totalSatisfaction / satisfactionCount : 0;
    stats.resolution_rate = stats.total > 0 ? (resolvedCount / stats.total) * 100 : 0;

    return stats;
  }

  /**
   * Get chat analytics
   */
  static async getChatAnalytics(startDate?: string, endDate?: string): Promise<ChatAnalytics> {
    let query = supabase.from('chats').select('*');

    if (startDate) {
      query = query.gte('started_at', startDate);
    }
    if (endDate) {
      query = query.lte('started_at', endDate);
    }

    const { data: chats, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch chat analytics: ${error.message}`);
    }

    // This is a simplified analytics implementation
    // In a real application, you'd want more sophisticated analytics
    const analytics: ChatAnalytics = {
      total_chats: chats?.length || 0,
      active_chats: 0,
      completed_chats: 0,
      average_duration: 0,
      average_messages_per_chat: 0,
      customer_satisfaction_avg: 0,
      resolution_rate: 0,
      response_time_avg: 0,
      peak_hours: [],
      busiest_days: [],
      top_intents: [],
      top_sources: [],
      agent_performance: []
    };

    // Implement analytics calculations here
    // This is a placeholder implementation

    return analytics;
  }
}
