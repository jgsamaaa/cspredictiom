"use client";

import { LogOut } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function LogoutButton() {
  async function handleLogout() {
    const supabase = createSupabaseBrowserClient();
    if (supabase) {
      await supabase.auth.signOut();
    }

    document.cookie =
      "research_demo_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax";
    window.location.assign("/login");
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-700/80 bg-slate-950/70 text-slate-400 transition hover:border-rose-400/50 hover:text-rose-200"
      aria-label="Log out"
      title="Log out"
    >
      <LogOut size={16} />
    </button>
  );
}
