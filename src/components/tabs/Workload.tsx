import { useMemo } from "react";
import type { Employee } from "../../types";
import { workloadPct, workloadStatus } from "../../lib/calculations";
import { SectionCard } from "../ui/SectionCard";
import { WorkloadBar } from "../ui/WorkloadBar";
import { WorkloadStatusPill } from "../ui/StatusPill";

const LEGEND = [
  { range: "≥ 110%", status: "Перегрузка", dot: "bg-status-red" },
  { range: "95–109%", status: "На пределе", dot: "bg-status-yellow" },
  { range: "66–94%", status: "Норма", dot: "bg-status-green" },
  { range: "≤ 65%", status: "Недогрузка", dot: "bg-status-blue" },
] as const;

export function Workload({ employees }: { employees: Employee[] }) {
  const sorted = useMemo(
    () => [...employees].sort((a, b) => workloadPct(b) - workloadPct(a)),
    [employees]
  );

  return (
    <div className="flex flex-col gap-5">
      <SectionCard
        title="Легенда пороговых значений"
        subtitle="Загрузка % = Фактические часы / Норма часов × 100 (п. 7.1)"
      >
        <div className="flex flex-wrap gap-4">
          {LEGEND.map((l) => (
            <div key={l.status} className="flex items-center gap-2 text-sm">
              <span className={`h-2.5 w-2.5 rounded-full ${l.dot}`} />
              <span className="font-mono text-navy-300">{l.range}</span>
              <span className="text-navy-100">{l.status}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Реестр загрузки сотрудников" subtitle={`${sorted.length} сотрудников · сортировка по убыванию загрузки`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-navy-700 text-left text-xs uppercase tracking-wider text-navy-400">
                <th className="py-2 pr-3 font-medium">Сотрудник</th>
                <th className="py-2 pr-3 font-medium">Направление</th>
                <th className="py-2 pr-3 font-medium text-right">Факт / Норма</th>
                <th className="py-2 pr-3 font-medium">Шкала</th>
                <th className="py-2 pr-3 font-medium text-right">%</th>
                <th className="py-2 pr-3 font-medium">Статус</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((e) => {
                const pct = workloadPct(e);
                const status = workloadStatus(pct);
                return (
                  <tr key={e.id} className="border-b border-navy-800 last:border-0">
                    <td className="py-2.5 pr-3">
                      <div className="font-sans text-navy-100">{e.name}</div>
                      <div className="text-xs text-navy-400">{e.position}</div>
                    </td>
                    <td className="py-2.5 pr-3 text-navy-300">{e.process}</td>
                    <td className="py-2.5 pr-3 text-right font-mono text-navy-200">
                      {e.actualHours} / {e.capacity} ч
                    </td>
                    <td className="w-40 py-2.5 pr-3">
                      <WorkloadBar pct={pct} />
                    </td>
                    <td className="py-2.5 pr-3 text-right font-mono font-semibold text-navy-100">{pct.toFixed(0)}%</td>
                    <td className="py-2.5 pr-3">
                      <WorkloadStatusPill status={status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
