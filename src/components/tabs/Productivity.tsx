import { useMemo } from "react";
import type { Employee } from "../../types";
import { kpiPct } from "../../lib/calculations";
import { trendSeries } from "../../lib/sparklineSeed";
import { SectionCard } from "../ui/SectionCard";
import { Sparkline } from "../ui/Sparkline";

export function Productivity({ employees }: { employees: Employee[] }) {
  const sorted = useMemo(
    () => [...employees].sort((a, b) => kpiPct(b) - kpiPct(a)),
    [employees]
  );

  return (
    <SectionCard title="Продуктивность сотрудников" subtitle="Сортировка по KPI (убывание)">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-navy-700 text-left text-xs uppercase tracking-wider text-navy-400">
              <th className="py-2 pr-3 font-medium">Сотрудник</th>
              <th className="py-2 pr-3 font-medium text-right">Выполнено / Назначено</th>
              <th className="py-2 pr-3 font-medium text-right">Просрочено</th>
              <th className="py-2 pr-3 font-medium text-right">Качество</th>
              <th className="py-2 pr-3 font-medium text-right">KPI %</th>
              <th className="py-2 pr-3 font-medium">Динамика</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((e, idx) => {
              const kpi = kpiPct(e);
              return (
                <tr key={e.id} className="border-b border-navy-800 last:border-0">
                  <td className="py-2.5 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="w-5 font-mono text-xs text-navy-500">{idx + 1}</span>
                      <div>
                        <div className="text-navy-100">{e.name}</div>
                        <div className="text-xs text-navy-400">{e.process}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 pr-3 text-right font-mono text-navy-200">
                    {e.tasksCompleted} / {e.tasksAssigned}
                  </td>
                  <td className={`py-2.5 pr-3 text-right font-mono ${e.tasksOverdue >= 3 ? "text-status-red font-semibold" : "text-navy-200"}`}>
                    {e.tasksOverdue}
                  </td>
                  <td className={`py-2.5 pr-3 text-right font-mono ${e.quality < 80 ? "text-status-red font-semibold" : "text-navy-200"}`}>
                    {e.quality}
                  </td>
                  <td className="py-2.5 pr-3 text-right font-mono font-semibold text-navy-100">{kpi.toFixed(0)}%</td>
                  <td className="py-2.5 pr-3">
                    <Sparkline values={trendSeries(e.id, kpi)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}
