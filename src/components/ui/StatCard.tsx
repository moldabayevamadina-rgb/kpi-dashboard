import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
  tone?: "default" | "warning" | "danger";
}

const TONE_CLASSES: Record<NonNullable<StatCardProps["tone"]>, string> = {
  default: "text-navy-100",
  warning: "text-gold-300",
  danger: "text-status-red",
};

export function StatCard({ label, value, hint, icon, tone = "default" }: StatCardProps) {
  return (
    <div className="rounded-lg border border-navy-700 bg-navy-850 p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-navy-300">{label}</span>
        {icon && <span className="text-navy-400">{icon}</span>}
      </div>
      <div className={`mt-2 font-mono text-3xl font-semibold ${TONE_CLASSES[tone]}`}>{value}</div>
      {hint && <div className="mt-1 text-xs text-navy-400">{hint}</div>}
    </div>
  );
}
