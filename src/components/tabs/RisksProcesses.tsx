import { useMemo } from "react";
import { AlertTriangle, Star } from "lucide-react";
import type { Employee } from "../../types";
import { PROCESSES } from "../../types";
import { aggregateByProcess, riskFlags, riskReasonText, topOptimizationPriority } from "../../lib/calculations";
import { SectionCard } from "../ui/SectionCard";
import { RiskFlagPill } from "../ui/StatusPill";
import { WorkloadBar } from "../ui/WorkloadBar";

export function RisksProcesses({ employees }: { employees: Employee[] }) {
  const atRisk = useMemo(() => employees.filter((e) => riskFlags(e).length > 0), [employees]);
  const processAggregates = useMemo(() => aggregateByProcess(employees, PROCESSES), [employees]);
  const optimizationPriority = useMemo(() => topOptimizationPriority(processAggregates), [processAggregates]);

  return (
    <div className="flex flex-col gap-5">
      <SectionCard
        title="Сотрудники в зоне риска"
        subtitle={`${atRisk.length} из ${employees.length} — сработал хотя бы один риск-флаг (п. 7.4)`}
      >
        {atRisk.length === 0 ? (
          <p className="text-sm text-navy-400">Сотрудников в зоне риска не выявлено.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {atRisk.map((e) => {
              const flags = riskFlags(e);
              return (
                <div key={e.id} className="rounded-lg border border-navy-700 bg-navy-800 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-medium text-navy-100">{e.name}</div>
                      <div className="text-xs text-navy-400">
                        {e.position} · {e.process}
                      </div>
                    </div>
                    <AlertTriangle size={16} className="mt-0.5 shrink-0 text-status-red" />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {flags.map((f) => (
                      <RiskFlagPill key={f} flag={f} />
                    ))}
                  </div>
                  <ul className="mt-3 space-y-1 text-xs text-navy-300">
                    {flags.map((f) => (
                      <li key={f}>· {riskReasonText(f, e)}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>

      <SectionCard title="Анализ направлений деятельности" subtitle="Балл направления = Средняя загрузка + Просрочки × 5 (п. 7.5)">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-navy-700 text-left text-xs uppercase tracking-wider text-navy-400">
                <th className="py-2 pr-3 font-medium">Направление</th>
                <th className="py-2 pr-3 font-medium text-right">Сотрудников</th>
                <th className="py-2 pr-3 font-medium text-right">Средняя загрузка</th>
                <th className="py-2 pr-3 font-medium">Шкала</th>
                <th className="py-2 pr-3 font-medium text-right">Просрочек</th>
                <th className="py-2 pr-3 font-medium text-right">Балл</th>
              </tr>
            </thead>
            <tbody>
              {processAggregates.map((p) => {
                const isPriority = optimizationPriority?.process === p.process && p.count > 0;
                return (
                  <tr key={p.process} className="border-b border-navy-800 last:border-0">
                    <td className="py-2.5 pr-3">
                      <div className="flex items-center gap-2 text-navy-100">
                        {p.process}
                        {isPriority && (
                          <span className="inline-flex items-center gap-1 rounded border border-gold-500/40 bg-gold-500/10 px-1.5 py-0.5 text-[10px] font-medium text-gold-300">
                            <Star size={10} /> приоритет оптимизации
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 pr-3 text-right font-mono text-navy-200">{p.count}</td>
                    <td className="py-2.5 pr-3 text-right font-mono text-navy-200">{p.avgLoadPct.toFixed(0)}%</td>
                    <td className="w-40 py-2.5 pr-3">
                      <WorkloadBar pct={p.avgLoadPct} />
                    </td>
                    <td className={`py-2.5 pr-3 text-right font-mono ${p.overdueCount > 0 ? "text-status-red" : "text-navy-200"}`}>
                      {p.overdueCount}
                    </td>
                    <td className="py-2.5 pr-3 text-right font-mono font-semibold text-navy-100">{p.optimizationScore.toFixed(1)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <ul className="flex flex-col gap-3 md:hidden">
          {processAggregates.map((p) => {
            const isPriority = optimizationPriority?.process === p.process && p.count > 0;
            return (
              <li key={p.process} className="rounded-lg border border-navy-700 bg-navy-800 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-navy-100">{p.process}</span>
                  {isPriority && (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded border border-gold-500/40 bg-gold-500/10 px-1.5 py-0.5 text-[10px] font-medium text-gold-300">
                      <Star size={10} /> приоритет
                    </span>
                  )}
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <WorkloadBar pct={p.avgLoadPct} />
                  <span className="shrink-0 font-mono text-sm font-semibold text-navy-100">{p.avgLoadPct.toFixed(0)}%</span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 font-mono text-xs">
                  <div>
                    <div className="text-navy-400">Сотрудников</div>
                    <div className="text-navy-200">{p.count}</div>
                  </div>
                  <div>
                    <div className="text-navy-400">Просрочек</div>
                    <div className={p.overdueCount > 0 ? "text-status-red" : "text-navy-200"}>{p.overdueCount}</div>
                  </div>
                  <div>
                    <div className="text-navy-400">Балл</div>
                    <div className="font-semibold text-navy-100">{p.optimizationScore.toFixed(1)}</div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </SectionCard>
    </div>
  );
}
