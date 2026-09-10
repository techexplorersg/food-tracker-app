import { createClient } from '@supabase/supabase-js';

// Create a free project at https://supabase.com, then paste your values
// here (or better: load from environment via expo-constants + app.config.js
// so you don't commit real keys to git).
const SUPABASE_URL = 'https://YOUR-PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR-ANON-KEY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
