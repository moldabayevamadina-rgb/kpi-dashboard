import type { Employee, Process, RiskFlag, WorkloadStatus } from "../types";

/**
 * Порог и вес штрафа за возвраты на доработку откалиброваны под реальный масштаб
 * объёмов (десятки–сотни заявок за период), а не под демо-данные (единицы задач
 * в неделю) — п. 13 PRD допускает пересмотр весов формул при согласовании.
 */
const REWORK_RISK_THRESHOLD = 40;
const REWORK_PENALTY_WEIGHT = 0.4;

/** 7.1 Статус загрузки сотрудника: Загрузка % = Фактический объём заявок / Норма заявок × 100 */
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

/** 7.4 Риск-флаги сотрудника */
export function riskFlags(e: Employee): RiskFlag[] {
  const flags: RiskFlag[] = [];
  const pct = workloadPct(e);
  if (pct >= 110) flags.push("Перегрузка");
  if (pct <= 65) flags.push("Недогрузка");
  if (e.quality < 80) flags.push("Качество");
  if (e.tasksOverdue >= REWORK_RISK_THRESHOLD) flags.push("Возвраты");
  return flags;
}

export function riskReasonText(flag: RiskFlag, e: Employee): string {
  switch (flag) {
    case "Перегрузка":
      return `Загрузка ${workloadPct(e).toFixed(0)}% (норма ${e.capacity}, факт ${e.actualHours} заявок)`;
    case "Недогрузка":
      return `Загрузка ${workloadPct(e).toFixed(0)}% — ниже порога недогрузки`;
    case "Качество":
      return `Показатель качества ${e.quality} (ниже 80)`;
    case "Возвраты":
      return `Возвратов на доработку: ${e.tasksOverdue}`;
  }
}

export interface ProcessAggregate {
  process: Process;
  count: number;
  avgLoadPct: number;
  overdueCount: number;
  optimizationScore: number;
}

/** 7.5 Балл направления = Средняя загрузка + Возвраты × 0.5 (вес пересчитан под реальный масштаб объёмов) */
export function aggregateByProcess(employees: Employee[], processes: readonly Process[]): ProcessAggregate[] {
  return processes.map((process) => {
    const group = employees.filter((e) => e.process === process);
    const count = group.length;
    const avgLoadPct = count > 0 ? group.reduce((sum, e) => sum + workloadPct(e), 0) / count : 0;
    const overdueCount = group.reduce((sum, e) => sum + e.tasksOverdue, 0);
    const optimizationScore = avgLoadPct + overdueCount * 0.5;
    return { process, count, avgLoadPct, overdueCount, optimizationScore };
  });
}

export function topOptimizationPriority(aggregates: ProcessAggregate[]): ProcessAggregate | null {
  const withEmployees = aggregates.filter((a) => a.count > 0);
  if (withEmployees.length === 0) return null;
  return withEmployees.reduce((max, a) => (a.optimizationScore > max.optimizationScore ? a : max));
}

/** Топ-N по количеству обработанных (выполненных) заявок внутри роли (санкционер/исполнитель) */
export function topByProcessed(employees: Employee[], process: Process, n = 3): Employee[] {
  return employees
    .filter((e) => e.process === process)
    .sort((a, b) => b.tasksCompleted - a.tasksCompleted)
    .slice(0, n);
}

/** Вспомогательный балл серьёзности риска — для ранжирования в блоке «Приоритетные риски» */
export function riskSeverityScore(e: Employee): number {
  const pct = workloadPct(e);
  const overloadPart = Math.max(0, pct - 110);
  const underloadPart = Math.max(0, 65 - pct);
  const qualityPart = Math.max(0, 80 - e.quality);
  const overduePart = e.tasksOverdue * REWORK_PENALTY_WEIGHT;
  return overloadPart + underloadPart + qualityPart + overduePart;
}

export function avg(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((s, n) => s + n, 0) / nums.length;
}
