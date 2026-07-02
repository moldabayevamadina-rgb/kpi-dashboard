import type { Employee, Process, RiskFlag, WorkloadStatus } from "../types";

/** 7.1 Статус загрузки сотрудника: Загрузка % = Фактические часы / Норма часов × 100 */
export function workloadPct(e: Employee): number {
  if (e.capacity <= 0) return 0;
  return (e.actualHours / e.capacity) * 100;
}

export function workloadStatus(pct: number): WorkloadStatus {
  if (pct >= 110) return "Перегрузка";
  if (pct >= 95) return "На пределе";
  if (pct >= 66) return "Норма";
  return "Недогрузка";
}

export const WORKLOAD_STATUS_COLOR: Record<WorkloadStatus, string> = {
  "Перегрузка": "red",
  "На пределе": "yellow",
  "Норма": "green",
  "Недогрузка": "blue",
};

/** 7.2 KPI % = (Выполнено / Назначено × 100) × 0.6 + Качество × 0.4 */
export function kpiPct(e: Employee): number {
  const completionRate = e.tasksAssigned > 0 ? (e.tasksCompleted / e.tasksAssigned) * 100 : 0;
  return completionRate * 0.6 + e.quality * 0.4;
}

/** 7.3 Рейтинговый балл недели = KPI% − Просрочки×4 + min(Выполнено,30)×0.3 */
export function weeklyScore(e: Employee): number {
  return kpiPct(e) - e.tasksOverdue * 4 + Math.min(e.tasksCompleted, 30) * 0.3;
}

/** 7.4 Риск-флаги сотрудника */
export function riskFlags(e: Employee): RiskFlag[] {
  const flags: RiskFlag[] = [];
  const pct = workloadPct(e);
  if (pct >= 110) flags.push("Перегрузка");
  if (pct <= 65) flags.push("Недогрузка");
  if (e.quality < 80) flags.push("Качество");
  if (e.tasksOverdue >= 3) flags.push("Просрочки");
  return flags;
}

export function riskReasonText(flag: RiskFlag, e: Employee): string {
  switch (flag) {
    case "Перегрузка":
      return `Загрузка ${workloadPct(e).toFixed(0)}% (норма ${e.capacity} ч, факт ${e.actualHours} ч)`;
    case "Недогрузка":
      return `Загрузка ${workloadPct(e).toFixed(0)}% — ниже порога недогрузки`;
    case "Качество":
      return `Показатель качества ${e.quality} (ниже 80)`;
    case "Просрочки":
      return `Просроченных задач: ${e.tasksOverdue}`;
  }
}

export interface ProcessAggregate {
  process: Process;
  count: number;
  avgLoadPct: number;
  overdueCount: number;
  optimizationScore: number;
}

/** 7.5 Балл направления = Средняя загрузка + Просрочки × 5 */
export function aggregateByProcess(employees: Employee[], processes: readonly Process[]): ProcessAggregate[] {
  return processes.map((process) => {
    const group = employees.filter((e) => e.process === process);
    const count = group.length;
    const avgLoadPct = count > 0 ? group.reduce((sum, e) => sum + workloadPct(e), 0) / count : 0;
    const overdueCount = group.reduce((sum, e) => sum + e.tasksOverdue, 0);
    const optimizationScore = avgLoadPct + overdueCount * 5;
    return { process, count, avgLoadPct, overdueCount, optimizationScore };
  });
}

export function topOptimizationPriority(aggregates: ProcessAggregate[]): ProcessAggregate | null {
  const withEmployees = aggregates.filter((a) => a.count > 0);
  if (withEmployees.length === 0) return null;
  return withEmployees.reduce((max, a) => (a.optimizationScore > max.optimizationScore ? a : max));
}

export function topWeeklyRanking(employees: Employee[], n = 3): Employee[] {
  return [...employees].sort((a, b) => weeklyScore(b) - weeklyScore(a)).slice(0, n);
}

/** Вспомогательный балл серьёзности риска — для ранжирования в блоке «Приоритетные риски» */
export function riskSeverityScore(e: Employee): number {
  const pct = workloadPct(e);
  const overloadPart = Math.max(0, pct - 110);
  const underloadPart = Math.max(0, 65 - pct);
  const qualityPart = Math.max(0, 80 - e.quality);
  const overduePart = e.tasksOverdue * 4;
  return overloadPart + underloadPart + qualityPart + overduePart;
}

export function avg(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((s, n) => s + n, 0) / nums.length;
}
