"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  BookOpenCheck,
  Crosshair,
  DatabaseZap,
  Gauge,
  Settings,
  Shield,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const navItems: Array<{ href: string; label: string; icon: LucideIcon }> = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/dashboard#matches", label: "Matches", icon: Crosshair },
  { href: "/journal", label: "Bet Journal", icon: BookOpenCheck },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen data-grid">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-slate-800/80 bg-[#080b11]/90 px-4 py-5 lg:block">
          <Link href="/dashboard" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-teal-400/35 bg-teal-400/10 text-teal-200">
              <Activity size={20} />
            </span>
            <span>
              <span className="block text-sm font-semibold uppercase tracking-[0.18em] text-slate-100">
                CS2 Edge
              </span>
              <span className="text-xs text-slate-500">Private research desk</span>
            </span>
          </Link>

          <nav className="mt-8 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href.split("#")[0]);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition ${
                    active
                      ? "border border-teal-400/20 bg-teal-400/10 text-teal-100"
                      : "text-slate-400 hover:bg-slate-900/80 hover:text-slate-100"
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 rounded-lg border border-slate-800 bg-slate-950/70 p-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-amber-200">
              <Shield size={14} />
              Research Only
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Probability estimates are private notes, not guaranteed betting advice.
            </p>
          </div>
        </aside>

        <main className="flex w-full min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-[#07090d]/90 backdrop-blur">
            <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-700 bg-slate-950 text-teal-200 lg:hidden">
                  <Activity size={17} />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-100">
                    CS2 Prediction Research Dashboard
                  </p>
                  <p className="hidden text-xs text-slate-500 sm:block">
                    Approved APIs plus manual stats. HLTV scraping is not used.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden items-center gap-2 rounded-md border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs text-slate-400 sm:flex">
                  <DatabaseZap size={14} className="text-teal-300" />
                  Private workspace
                </div>
              </div>
            </div>
            <nav className="thin-scrollbar flex w-full max-w-full gap-2 overflow-x-auto border-t border-slate-900 px-4 py-2 lg:hidden">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.href.split("#")[0]);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex h-9 shrink-0 items-center gap-2 rounded-md border px-3 text-xs font-medium transition ${
                      active
                        ? "border-teal-400/30 bg-teal-400/10 text-teal-100"
                        : "border-slate-800 bg-slate-950/70 text-slate-400"
                    }`}
                  >
                    <Icon size={14} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </header>
          <div className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
