"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function LoginForm({ nextPath }: { nextPath: string }) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (supabase) {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) {
          setError(authError.message);
          return;
        }
      } else {
        const demoPassword = process.env.NEXT_PUBLIC_DEMO_PASSWORD ?? "research-only";
        if (password !== demoPassword) {
          setError("Invalid private workspace password.");
          return;
        }
        document.cookie =
          "research_demo_auth=1; path=/; max-age=604800; samesite=lax";
      }

      router.replace(nextPath || "/dashboard");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="panel w-full max-w-md rounded-lg p-6">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-teal-400/30 bg-teal-400/10 text-teal-200">
          <LockKeyhole size={20} />
        </span>
        <div>
          <h1 className="text-lg font-semibold text-slate-50">Private Login</h1>
          <p className="text-sm text-slate-500">CS2 Edge research desk</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
            Email
          </span>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="focus-ring mt-2 h-11 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100 placeholder:text-slate-600"
          />
        </label>

        <label className="block">
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
            Password
          </span>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            autoComplete="current-password"
            required
            className="focus-ring mt-2 h-11 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100"
          />
        </label>
      </div>

      {error ? (
        <p className="mt-4 rounded-md border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-sm text-rose-200">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="focus-ring mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-teal-300 px-4 text-sm font-semibold text-slate-950 transition hover:bg-teal-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <ShieldCheck size={16} />
        {loading ? "Checking access" : "Enter workspace"}
      </button>

      <p className="mt-4 text-xs leading-5 text-slate-500">
        {supabase
          ? "Authentication uses Supabase email and password sessions."
          : "Local preview auth is active until Supabase credentials are configured."}
      </p>
    </form>
  );
}
