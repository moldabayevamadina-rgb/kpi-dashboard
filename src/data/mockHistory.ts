import type { WeekPoint } from "../types";

/**
 * Реальная динамика по неделям (1 мая — 28 июня 2026), рассчитана из дат обработки
 * заявок. Загрузка % = объём заявок за неделю / средненедельный объём × 100.
 * Продуктивность % = доля заявок со статусом «Одобрить» за неделю.
 * Последняя неполная неделя (29 июня — 1 июля) исключена, чтобы не занижать динамику.
 */
export const weeklyHistory: WeekPoint[] = [
  { label: "4–10 мая", loadPct: 93.4, prodPct: 94.3 },
  { label: "11–17 мая", loadPct: 134.9, prodPct: 97.6 },
  { label: "18–24 мая", loadPct: 110.9, prodPct: 96.0 },
  { label: "25–31 мая", loadPct: 65.0, prodPct: 94.5 },
  { label: "1–7 июня", loadPct: 102.7, prodPct: 91.9 },
  { label: "8–14 июня", loadPct: 94.3, prodPct: 94.0 },
  { label: "15–21 июня", loadPct: 116.9, prodPct: 92.8 },
  { label: "22–28 июня", loadPct: 81.9, prodPct: 93.7 },
];
