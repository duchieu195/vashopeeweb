import { createClient } from '@supabase/supabase-js';

// Data client — service_role key, bypasses RLS, never stores user session
export const supabaseClient = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY as string,
  { auth: { persistSession: false, autoRefreshToken: false } },
);

// Auth client — anon key, used only for signIn/signOut/getSession
export const supabaseAuthClient = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string,
);
