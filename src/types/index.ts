export const PROCESSES = ["Исполнитель", "Санкционер"] as const;

export type Process = (typeof PROCESSES)[number];

export interface Employee {
  id: number;
  name: string;
  position: string;
  process: Process;
  capacity: number;
  actualHours: number;
  tasksAssigned: number;
  tasksCompleted: number;
  tasksOverdue: number;
  quality: number;
  /** Руководитель управления — исключается из рейтингов и списков риска, но виден в общих сводках. */
  isManager?: boolean;
}

export type WorkloadStatus = "Перегрузка" | "На пределе" | "Норма" | "Недогрузка";

export type RiskFlag = "Перегрузка" | "Недогрузка" | "Качество" | "Возвраты";

export interface WeekPoint {
  label: string;
  loadPct: number;
  prodPct: number;
}

export type Period = "week" | "month" | "quarter";

export type OpenQuestionStatus = "Открыт" | "В работе" | "Просрочен" | "Закрыт";

export interface OpenQuestion {
  id: number;
  dateRaised: string;
  question: string;
  raisedBy: string;
  owner: string;
  dueDate: string;
  status: OpenQuestionStatus;
  comment: string;
  closedDate: string | null;
}

export type IncomingTaskPriority = "Высокий" | "Средний" | "Низкий";
export type IncomingTaskStatus = "Новая" | "В работе" | "На проверке" | "Выполнено" | "Просрочена";

export interface IncomingTask {
  id: number;
  receivedDate: string;
  task: string;
  source: string;
  process: Process;
  owner: string;
  priority: IncomingTaskPriority;
  dueDate: string;
  status: IncomingTaskStatus;
}
