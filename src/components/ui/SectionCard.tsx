import type { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function SectionCard({ title, subtitle, children, actions, className = "" }: SectionCardProps) {
  return (
    <div className={`rounded-lg border border-navy-700 bg-navy-850 p-4 sm:p-5 ${className}`}>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-serif-heading text-lg font-semibold text-navy-100">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs text-navy-400">{subtitle}</p>}
        </div>
        {actions}
      </div>
      {children}
    </div>
  );
}
