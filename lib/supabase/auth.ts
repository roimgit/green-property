import { createClient } from "@/lib/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";

export type AuthClient =
  | SupabaseClient
  | Awaited<ReturnType<typeof createClient>>
  | Awaited<ReturnType<typeof import("@/lib/supabase/server").createClient>>;

/**
 * Signs in an admin with email + password via Supabase Auth.
 * Enable Email/Password in Supabase Dashboard > Authentication > Providers.
 */
export async function signInWithEmail(
  supabase: AuthClient,
  email: string,
  password: string,
) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

/** Signs out the current session. */
export async function signOut(supabase: AuthClient) {
  const { error } = await supabase.auth.signOut();
  return { error };
}

/** Returns the currently authenticated user, or null. */
export async function getCurrentUser(supabase: AuthClient) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
