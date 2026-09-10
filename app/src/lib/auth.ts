import { supabase } from './supabase';

/**
 * Ensures there's a signed-in Supabase user before any database write.
 * Uses anonymous auth (enable it in Supabase dashboard: Authentication →
 * Providers → Anonymous) so each device gets its own private user id
 * without needing a login screen yet. You can add real email/password or
 * social login later — the user_id on every row stays the same as long as
 * you eventually "link" the anonymous account rather than replacing it.
 */
export async function ensureSignedIn() {
  const { data: sessionData } = await supabase.auth.getSession();
  if (sessionData.session) {
    return sessionData.session.user;
  }

  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) {
    console.log('Anonymous sign-in failed:', error.message);
    throw error;
  }
  return data.user;
}
