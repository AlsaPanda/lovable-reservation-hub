import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://jgcncsqbwxrjhveeptej.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnY25jc3Fid3hyamh2ZWVwdGVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM1NzY4MDEsImV4cCI6MjA0OTE1MjgwMX0.jXMnI7wwt3Rycamy_d7KZFxuAjaS51PU5Fe2hJudM1Q";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});