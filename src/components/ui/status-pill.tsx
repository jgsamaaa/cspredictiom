import type { MatchStatus } from "@/lib/types";

const statusClass: Record<MatchStatus, string> = {
  scheduled: "border-slate-600/60 bg-slate-800/50 text-slate-300",
  live: "border-teal-400/50 bg-teal-400/10 text-teal-200",
  finished: "border-slate-700 bg-slate-900 text-slate-500",
};

export function StatusPill({ status }: { status: MatchStatus }) {
  return (
    <span
      className={`inline-flex h-6 items-center rounded-md border px-2 text-[11px] font-semibold uppercase tracking-[0.12em] ${statusClass[status]}`}
    >
      {status}
    </span>
  );
}
