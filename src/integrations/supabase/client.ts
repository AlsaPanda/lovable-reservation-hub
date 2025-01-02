import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgcncsqbwxrjhveeptej.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnY25jc3Fid3hyamh2ZWVwdGVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM1NzY4MDEsImV4cCI6MjA0OTE1MjgwMX0.jXMnI7wwt3Rycamy_d7KZFxuAjaS51PU5Fe2hJudM1Q';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: window.localStorage,
    storageKey: 'sb-auth-token',
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web',
    },
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Add event listener for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('[Supabase Client] Auth state changed:', event, 'Session:', session ? 'exists' : 'null');
  
  // If the session is invalid, redirect to login
  if (!session && (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED')) {
    console.log('[Supabase Client] Invalid session, redirecting to login');
    window.location.href = '/login';
  }
});