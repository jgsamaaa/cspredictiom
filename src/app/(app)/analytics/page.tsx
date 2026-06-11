import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard";
import { buildAnalytics } from "@/lib/analytics/journal";
import { getJournalEntries } from "@/lib/journal-store";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const entries = await getJournalEntries();
  const summary = buildAnalytics(entries);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
          Journal Analytics
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
          Track win rate, ROI, team performance, and bet-type performance from saved entries.
        </p>
      </div>
      <AnalyticsDashboard summary={summary} />
    </div>
  );
}
