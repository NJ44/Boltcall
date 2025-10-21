import { supabase } from './supabase';
import type { RetellLLM, RetellLLMConfig } from '../types/retell';
import { createRetellLLM } from '../types/retell';

export class RetellLLMService {
  /**
   * Get all Retell LLMs for a user
   */
  static async getUserLLMs(userId: string): Promise<RetellLLM[]> {
    const { data, error } = await supabase
      .from('retell_llms')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user LLMs:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get all Retell LLMs for a workspace
   */
  static async getWorkspaceLLMs(workspaceId: string): Promise<RetellLLM[]> {
    const { data, error } = await supabase
      .from('retell_llms')
      .select('*')
      .eq('workspace_id', workspaceId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching workspace LLMs:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get public Retell LLMs by industry
   */
  static async getPublicLLMsByIndustry(industry: string): Promise<RetellLLM[]> {
    const { data, error } = await supabase
      .from('retell_llms')
      .select('*')
      .eq('industry', industry)
      .eq('is_public', true)
      .eq('is_active', true)
      .order('usage_count', { ascending: false });

    if (error) {
      console.error('Error fetching public LLMs:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get a specific Retell LLM by ID
   */
  static async getLLMById(id: string): Promise<RetellLLM | null> {
    const { data, error } = await supabase
      .from('retell_llms')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching LLM:', error);
      return null;
    }

    return data;
  }

  /**
   * Create a new Retell LLM
   */
  static async createLLM(
    name: string,
    industry: string,
    workspaceId: string,
    userId: string,
    customConfig?: Partial<RetellLLMConfig>,
    voiceId?: string
  ): Promise<RetellLLM> {
    const llmData = createRetellLLM(name, industry, workspaceId, userId, customConfig);
    
    if (voiceId) {
      llmData.voice_id = voiceId;
    }

    const { data, error } = await supabase
      .from('retell_llms')
      .insert(llmData)
      .select()
      .single();

    if (error) {
      console.error('Error creating LLM:', error);
      throw error;
    }

    return data;
  }

  /**
   * Update a Retell LLM
   */
  static async updateLLM(
    id: string,
    updates: Partial<RetellLLM>
  ): Promise<RetellLLM> {
    const { data, error } = await supabase
      .from('retell_llms')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating LLM:', error);
      throw error;
    }

    return data;
  }

  /**
   * Delete a Retell LLM (soft delete by setting is_active to false)
   */
  static async deleteLLM(id: string): Promise<void> {
    const { error } = await supabase
      .from('retell_llms')
      .update({ is_active: false })
      .eq('id', id);

    if (error) {
      console.error('Error deleting LLM:', error);
      throw error;
    }
  }

  /**
   * Increment usage count for an LLM
   */
  static async incrementUsage(id: string): Promise<void> {
    // First get the current usage count
    const { data: currentLLM, error: fetchError } = await supabase
      .from('retell_llms')
      .select('usage_count')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching LLM for usage increment:', fetchError);
      throw fetchError;
    }

    // Then update with incremented count
    const { error } = await supabase
      .from('retell_llms')
      .update({ usage_count: (currentLLM?.usage_count || 0) + 1 })
      .eq('id', id);

    if (error) {
      console.error('Error incrementing usage:', error);
      throw error;
    }
  }

  /**
   * Get available industries
   */
  static async getIndustries(): Promise<string[]> {
    const { data, error } = await supabase
      .from('retell_llms')
      .select('industry')
      .eq('is_active', true)
      .not('industry', 'is', null);

    if (error) {
      console.error('Error fetching industries:', error);
      return [];
    }

    // Get unique industries
    const industries = [...new Set(data.map(item => item.industry))];
    return industries.sort();
  }

  /**
   * Search LLMs by name or industry
   */
  static async searchLLMs(
    query: string,
    userId?: string,
    industry?: string
  ): Promise<RetellLLM[]> {
    let supabaseQuery = supabase
      .from('retell_llms')
      .select('*')
      .eq('is_active', true);

    // Add user filter if provided
    if (userId) {
      supabaseQuery = supabaseQuery.or(`user_id.eq.${userId},is_public.eq.true`);
    } else {
      supabaseQuery = supabaseQuery.eq('is_public', true);
    }

    // Add industry filter if provided
    if (industry) {
      supabaseQuery = supabaseQuery.eq('industry', industry);
    }

    // Add search query
    if (query) {
      supabaseQuery = supabaseQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
    }

    const { data, error } = await supabaseQuery.order('usage_count', { ascending: false });

    if (error) {
      console.error('Error searching LLMs:', error);
      throw error;
    }

    return data || [];
  }
}
