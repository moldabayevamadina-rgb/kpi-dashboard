import type { Period, WeekPoint } from "../types";

const CHUNK_SIZE: Record<Period, number> = { week: 1, month: 4, quarter: 12 };
const CHUNK_LABEL: Record<Period, (idx: number) => string> = {
  week: (i) => `Нед ${i + 1}`,
  month: (i) => `Месяц ${i + 1}`,
  quarter: (i) => `Квартал ${i + 1}`,
};

export function aggregateHistory(history: WeekPoint[], period: Period): WeekPoint[] {
  const size = CHUNK_SIZE[period];
  if (size === 1) return history;

  const chunks: WeekPoint[] = [];
  for (let i = 0; i < history.length; i += size) {
    const slice = history.slice(i, i + size);
    const loadPct = slice.reduce((s, p) => s + p.loadPct, 0) / slice.length;
    const prodPct = slice.reduce((s, p) => s + p.prodPct, 0) / slice.length;
    chunks.push({
      label: CHUNK_LABEL[period](chunks.length),
      loadPct: Math.round(loadPct * 10) / 10,
      prodPct: Math.round(prodPct * 10) / 10,
    });
  }
  return chunks;
}
