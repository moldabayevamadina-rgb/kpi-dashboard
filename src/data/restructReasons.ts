export interface RestructReason {
  reason: string;
  pct: number;
}

/** Источник: RESTRUCT_REASON из выгрузки заявок, 1 мая — 2 июля 2026 (8629 заявок). */
export const restructReasons: RestructReason[] = [
  { reason: "Банкротство ФЛ", pct: 35.5 },
  { reason: "Прочие (по решению УО/ПЗЗП и пр.)", pct: 22.6 },
  { reason: "Военнослужащие", pct: 13.6 },
  { reason: "Смерть заёмщика", pct: 12.3 },
  { reason: "Финансовые затруднения заёмщика", pct: 9.9 },
  { reason: "Другое", pct: 6.1 },
];
