import { supabase } from './supabase';

export interface LogEntry {
  Type: string;
  Message: string;
  user_id?: string;
  business_profile_id?: string;
}

/**
 * Get the current business profile for a user
 */
export const getCurrentBusinessProfile = async (userId: string) => {
  if (!userId) return null;
  
  const { data: businessProfile } = await supabase
    .from('business_profiles')
    .select('id, business_name')
    .eq('user_id', userId)
    .single();
    
  return businessProfile;
};

/**
 * Add a log entry linked to the current client
 */
export const addLogEntry = async (type: string, message: string, userId?: string) => {
  if (!userId) {
    console.warn('No user ID provided for logging');
    return;
  }
  
  // Get the business profile for this user
  const businessProfile = await getCurrentBusinessProfile(userId);
  
  const { error } = await supabase
    .from('Logs')
    .insert({
      Type: type,
      Message: message,
      user_id: userId,
      business_profile_id: businessProfile?.id
    });
    
  if (error) {
    console.error('Error adding log:', error);
  }
};

/**
 * Get logs for a specific business profile
 */
export const getBusinessLogs = async (businessProfileId: string, limit: number = 50) => {
  const { data, error } = await supabase
    .from('Logs')
    .select('*')
    .eq('business_profile_id', businessProfileId)
    .order('created_at', { ascending: false })
    .limit(limit);
    
  if (error) {
    console.error('Error fetching logs:', error);
    return [];
  }
  
  return data || [];
};

/**
 * Get logs for a specific user
 */
export const getUserLogs = async (userId: string, limit: number = 50) => {
  const { data, error } = await supabase
    .from('Logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
    
  if (error) {
    console.error('Error fetching user logs:', error);
    return [];
  }
  
  return data || [];
};

/**
 * Log user actions with consistent formatting
 */
export const logUserAction = async (action: string, details: string, userId?: string) => {
  await addLogEntry(action, details, userId);
};

/**
 * Log system events
 */
export const logSystemEvent = async (event: string, details: string, userId?: string) => {
  await addLogEntry(`System: ${event}`, details, userId);
};

/**
 * Log errors
 */
export const logError = async (error: string, details: string, userId?: string) => {
  await addLogEntry('Error', `${error}: ${details}`, userId);
};
