import type { OpenQuestionStatus, ProjectStatus, RiskFlag, WorkloadStatus } from "../../types";

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
  "Возвраты": "bg-status-red/15 text-status-red border-status-red/40",
};

export function RiskFlagPill({ flag }: { flag: RiskFlag }) {
  return (
    <span className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-mono font-medium ${RISK_CLASSES[flag]}`}>
      {flag}
    </span>
  );
}

const PROJECT_STATUS_CLASSES: Record<ProjectStatus, string> = {
  "Открыт": "bg-status-blue/15 text-status-blue border-status-blue/40",
  "В работе": "bg-status-yellow/15 text-status-yellow border-status-yellow/40",
  "На паузе": "bg-navy-600/20 text-navy-400 border-navy-600/50",
  "Завершён": "bg-status-green/15 text-status-green border-status-green/40",
};

export function ProjectStatusPill({ status }: { status: ProjectStatus }) {
  return (
    <span className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-mono font-medium whitespace-nowrap ${PROJECT_STATUS_CLASSES[status]}`}>
      {status}
    </span>
  );
}

const QUESTION_STATUS_CLASSES: Record<OpenQuestionStatus, string> = {
  "Открыт": "bg-status-blue/15 text-status-blue border-status-blue/40",
  "В работе": "bg-status-yellow/15 text-status-yellow border-status-yellow/40",
  "Просрочен": "bg-status-red/15 text-status-red border-status-red/40",
  "Закрыт": "bg-status-green/15 text-status-green border-status-green/40",
};

export function QuestionStatusPill({ status }: { status: OpenQuestionStatus }) {
  return (
    <span className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-mono font-medium whitespace-nowrap ${QUESTION_STATUS_CLASSES[status]}`}>
      {status}
    </span>
  );
}
