import { supabase } from './supabase';

export interface Location {
  id: string;
  business_profile_id: string;
  user_id: string;
  name: string;
  slug?: string | null;
  phone?: string | null;
  email?: string | null;
  address_line1?: string | null;
  address_line2?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  country?: string | null;
  timezone?: string | null;
  is_primary: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export class LocationService {
  static async listByBusinessProfile(businessProfileId: string): Promise<Location[]> {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('business_profile_id', businessProfileId)
      .order('is_primary', { ascending: false })
      .order('created_at', { ascending: true });
    if (error) throw new Error(error.message);
    return data || [];
  }

  static async get(id: string): Promise<Location | null> {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('id', id)
      .single();
    if (error) return null;
    return data as Location;
  }
}


