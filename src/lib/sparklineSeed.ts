/** Детерминированный ряд последних периодов, завершающийся текущим значением KPI. */
export function trendSeries(seed: number, current: number, points = 6): number[] {
  const values: number[] = [];
  for (let i = 0; i < points - 1; i++) {
    const wobble = Math.sin(seed * 12.9898 + i * 4.5) * 8;
    values.push(Math.max(0, Math.min(100, current - (points - 1 - i) * 1.2 + wobble)));
  }
  values.push(current);
  return values;
}
