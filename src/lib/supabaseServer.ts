import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export async function createSupabaseServer(reqHeaders?: Headers) {
  const cookieStore = await cookies();
  const headersObj =
    reqHeaders instanceof Headers
      ? Object.fromEntries(reqHeaders.entries())
      : (reqHeaders as Record<string, string> | undefined) ?? {};

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: headersObj,
    },
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value ?? null;
      },
      set(name, value, options) {
        cookieStore.set({ name, value, ...options });
      },
      remove(name, options) {
        cookieStore.set({ name, value: "", ...options, maxAge: 0 });
      },
    },
  });
}