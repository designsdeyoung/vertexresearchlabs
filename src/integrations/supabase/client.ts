import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Hardcoded to our own Supabase project — Lovable Cloud locks VITE_SUPABASE_* env vars
const SUPABASE_URL = "https://qgritvsluilqptgtvayv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFncml0dnNsdWlscXB0Z3R2YXl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1MjcwODgsImV4cCI6MjA5NjEwMzA4OH0.MWW3mW7AYsL5f1SjWozJwC5EDj9Nn7G362cvduFv-MA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});