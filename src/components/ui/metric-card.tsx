import type { ReactNode } from "react";

export function MetricCard({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: string;
  detail?: string;
  icon?: ReactNode;
}) {
  return (
    <section className="panel rounded-lg p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
            {label}
          </p>
          <p className="mt-2 text-2xl font-semibold leading-none text-slate-50">
            {value}
          </p>
        </div>
        {icon ? <div className="text-teal-300">{icon}</div> : null}
      </div>
      {detail ? <p className="mt-3 text-xs leading-5 text-slate-400">{detail}</p> : null}
    </section>
  );
}
