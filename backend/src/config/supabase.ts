import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from './index';

let supabaseClient: SupabaseClient | null = null;

export const initSupabase = (): SupabaseClient => {
  if (!supabaseClient) {
    supabaseClient = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);
  }
  return supabaseClient;
};

export const getSupabase = (): SupabaseClient => {
  if (!supabaseClient) {
    return initSupabase();
  }
  return supabaseClient;
};

export default getSupabase;
