import { createBrowserClient } from "@supabase/ssr";

type BrowserClient = ReturnType<typeof createBrowserClient>;

let browserClient: BrowserClient | undefined;

/**
 * Reuse one browser Supabase client so hook dependency arrays stay stable.
 * A new client every render was retriggering effects that listed `supabase`,
 * reloading documents on each keystroke and remounting the editor before saves finished.
 */
export function createClient(): BrowserClient {
  if (!browserClient) {
    browserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    );
  }
  return browserClient;
}
