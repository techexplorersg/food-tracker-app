import { createClient } from '@supabase/supabase-js';

// Create a free project at https://supabase.com, then paste your values
// here (or better: load from environment via expo-constants + app.config.js
// so you don't commit real keys to git).
const SUPABASE_URL = 'https://sdpguwcwkmmcbuhhjotk.supabase.co/rest/v1/';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkcGd1d2N3a21tY2J1aGhqb3RrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4ODYxNzIsImV4cCI6MjEwNDQ2MjE3Mn0.F6hieZ9mMvyXXkKT-N7gJ6vso0EExHCx-SFTdy8PZzs';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
