import type { WeekPoint } from "../types";

// 24 недели демонстрационной истории (для агрегации в недели/месяцы/кварталы)
function seeded(base: number, amplitude: number, i: number, noiseSeed: number): number {
  const wave = Math.sin(i / 3.1 + noiseSeed) * amplitude;
  const drift = (i / 24) * amplitude * 0.6;
  return Math.round((base + wave + drift) * 10) / 10;
}

export const weeklyHistory: WeekPoint[] = Array.from({ length: 24 }, (_, i) => ({
  label: `Нед ${i + 1}`,
  loadPct: Math.max(50, Math.min(130, seeded(92, 12, i, 0.5))),
  prodPct: Math.max(50, Math.min(120, seeded(84, 10, i, 2.1))),
}));
