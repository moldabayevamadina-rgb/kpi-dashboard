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
  /** Нет данных табеля дисциплины за период (например, сотрудник покинул управление) */
  inactive?: boolean;
  /** Отработано дней за период по табелю дисциплины */
  daysWorked?: number;
  /** Опозданий за период по табелю дисциплины */
  lateCount?: number;
  /** Ранних уходов за период по табелю дисциплины */
  earlyLeaveCount?: number;
}

export type WorkloadStatus = "Перегрузка" | "На пределе" | "Норма" | "Недогрузка";

export type RiskFlag = "Перегрузка" | "Недогрузка" | "Качество" | "Возвраты";

export interface WeekPoint {
  label: string;
  loadPct: number;
  prodPct: number;
  /** Фактическое количество поступивших заявок за неделю (управление в целом) */
  total: number;
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
  /** Оценка нагрузки в усл. ед. (эквивалент заявки) — учитывается в загрузке и KPI ответственного */
  weight: number;
}

export type ProjectStatus = "Открыт" | "В работе" | "На паузе" | "Завершён";

export interface Project {
  id: number;
  title: string;
  executor: string;
  description: string;
  status: ProjectStatus;
  dueDate: string;
  /** Оценка нагрузки в усл. ед. (эквивалент заявки) — учитывается в загрузке и KPI исполнителя */
  weight: number;
}
