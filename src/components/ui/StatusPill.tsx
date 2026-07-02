import type { RiskFlag, WorkloadStatus } from "../../types";

const WORKLOAD_CLASSES: Record<WorkloadStatus, string> = {
  "Перегрузка": "bg-status-red/15 text-status-red border-status-red/40",
  "На пределе": "bg-status-yellow/15 text-status-yellow border-status-yellow/40",
  "Норма": "bg-status-green/15 text-status-green border-status-green/40",
  "Недогрузка": "bg-status-blue/15 text-status-blue border-status-blue/40",
};

export function WorkloadStatusPill({ status }: { status: WorkloadStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-xs font-mono font-medium whitespace-nowrap ${WORKLOAD_CLASSES[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

const RISK_CLASSES: Record<RiskFlag, string> = {
  "Перегрузка": "bg-status-red/15 text-status-red border-status-red/40",
  "Недогрузка": "bg-status-blue/15 text-status-blue border-status-blue/40",
  "Качество": "bg-gold-500/15 text-gold-300 border-gold-500/40",
  "Просрочки": "bg-status-red/15 text-status-red border-status-red/40",
};

export function RiskFlagPill({ flag }: { flag: RiskFlag }) {
  return (
    <span className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-mono font-medium ${RISK_CLASSES[flag]}`}>
      {flag}
    </span>
  );
}
