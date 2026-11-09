import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseKey || !supabaseUrl) {
  throw new Error("Missing Supabase environmental variables")
}

export const supabase = createClient(
  supabaseUrl,
  supabaseKey,
)