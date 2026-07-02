import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Users, Gauge, TrendingUp, ShieldAlert, Clock, Trophy, Medal, Award, Sparkles } from "lucide-react";
import type { Employee, Period } from "../../types";
import { PROCESSES } from "../../types";
import {
  aggregateByProcess,
  kpiPct,
  riskFlags,
  riskReasonText,
  riskSeverityScore,
  topOptimizationPriority,
  topWeeklyRanking,
  weeklyScore,
  workloadPct,
  workloadStatus,
} from "../../lib/calculations";
import { weeklyHistory } from "../../data/mockHistory";
import { aggregateHistory } from "../../lib/history";
import { StatCard } from "../ui/StatCard";
import { SectionCard } from "../ui/SectionCard";

const PERIOD_LABEL: Record<Period, string> = { week: "Неделя", month: "Месяц", quarter: "Квартал" };

const PROCESS_BAR_COLOR = (pct: number) => {
  const status = workloadStatus(pct);
  return { "Перегрузка": "#c0392b", "На пределе": "#b7862b", "Норма": "#2e7d5b", "Недогрузка": "#2a5aa8" }[status];
};

export function Overview({ employees }: { employees: Employee[] }) {
  const [period, setPeriod] = useState<Period>("week");

  const avgLoad = useMemo(
    () => (employees.length ? employees.reduce((s, e) => s + workloadPct(e), 0) / employees.length : 0),
    [employees]
  );
  const avgKpi = useMemo(
    () => (employees.length ? employees.reduce((s, e) => s + kpiPct(e), 0) / employees.length : 0),
    [employees]
  );
  const riskCount = useMemo(() => employees.filter((e) => riskFlags(e).length > 0).length, [employees]);
  const overdueCount = useMemo(() => employees.reduce((s, e) => s + e.tasksOverdue, 0), [employees]);

  const top3 = useMemo(() => topWeeklyRanking(employees, 3), [employees]);

  const chartData = useMemo(() => aggregateHistory(weeklyHistory, period), [period]);

  const priorityRisks = useMemo(
    () =>
      employees
        .filter((e) => riskFlags(e).length > 0)
        .sort((a, b) => riskSeverityScore(b) - riskSeverityScore(a))
        .slice(0, 5),
    [employees]
  );

  const processAggregates = useMemo(() => aggregateByProcess(employees, PROCESSES), [employees]);
  const optimizationPriority = useMemo(() => topOptimizationPriority(processAggregates), [processAggregates]);

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Сотрудников" value={String(employees.length)} icon={<Users size={18} />} />
        <StatCard
          label="Средняя загрузка"
          value={`${avgLoad.toFixed(0)}%`}
          icon={<Gauge size={18} />}
          tone={avgLoad >= 110 || avgLoad <= 65 ? "warning" : "default"}
        />
        <StatCard label="Средний KPI" value={`${avgKpi.toFixed(0)}%`} icon={<TrendingUp size={18} />} />
        <StatCard
          label="В зоне риска"
          value={String(riskCount)}
          icon={<ShieldAlert size={18} />}
          tone={riskCount > 0 ? "danger" : "default"}
        />
        <StatCard
          label="Просроченных задач"
          value={String(overdueCount)}
          icon={<Clock size={18} />}
          tone={overdueCount > 0 ? "warning" : "default"}
        />
      </div>

      <SectionCard title="Топ-3 сотрудника недели" subtitle="Ранжирование по недельному рейтинговому баллу (п. 7.3)">
        {top3.length < 3 ? (
          <p className="text-sm text-navy-400">Недостаточно данных для формирования рейтинга.</p>
        ) : (
          <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-3">
            {top3.map((e, idx) => {
              const place = idx + 1;
              const config = {
                1: { icon: Trophy, color: "text-gold-300", border: "border-gold-500/50", h: "sm:pt-2", order: "sm:order-2" },
                2: { icon: Medal, color: "text-navy-200", border: "border-navy-500/60", h: "sm:pt-6", order: "sm:order-1" },
                3: { icon: Award, color: "text-[#c08a4a]", border: "border-[#c08a4a]/50", h: "sm:pt-6", order: "sm:order-3" },
              }[place]!;
              const Icon = config.icon;
              return (
                <div
                  key={e.id}
                  className={`${config.order} ${config.h} flex flex-col items-center rounded-lg border ${config.border} bg-navy-800 p-4 text-center`}
                >
                  <Icon className={config.color} size={28} />
                  <div className="mt-2 font-mono text-xs text-navy-400">#{place}</div>
                  <div className="font-serif-heading mt-1 text-base font-semibold text-navy-100">{e.name}</div>
                  <div className="text-xs text-navy-400">{e.position}</div>
                  <div className="mt-3 grid w-full grid-cols-3 gap-2 border-t border-navy-700 pt-3 font-mono text-xs">
                    <div>
                      <div className="text-navy-400">KPI</div>
                      <div className="font-semibold text-navy-100">{kpiPct(e).toFixed(0)}%</div>
                    </div>
                    <div>
                      <div className="text-navy-400">Задачи</div>
                      <div className="font-semibold text-navy-100">{e.tasksCompleted}</div>
                    </div>
                    <div>
                      <div className="text-navy-400">Качество</div>
                      <div className="font-semibold text-navy-100">{e.quality}</div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-[11px] text-gold-300">
                    <Sparkles size={12} /> Балл {weeklyScore(e).toFixed(1)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <SectionCard
          title="Динамика загрузки и продуктивности"
          subtitle="Управление в целом"
          actions={
            <div className="flex gap-1 rounded border border-navy-600 p-0.5">
              {(["week", "month", "quarter"] as Period[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                    period === p ? "bg-navy-600 text-navy-100" : "text-navy-400 hover:text-navy-200"
                  }`}
                >
                  {PERIOD_LABEL[p]}
                </button>
              ))}
            </div>
          }
        >
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#16264d" />
              <XAxis dataKey="label" tick={{ fill: "#7a8fc4", fontSize: 11 }} axisLine={{ stroke: "#16264d" }} tickLine={false} />
              <YAxis tick={{ fill: "#7a8fc4", fontSize: 11 }} axisLine={{ stroke: "#16264d" }} tickLine={false} unit="%" />
              <Tooltip
                contentStyle={{ background: "#101c3a", border: "1px solid #1e3361", borderRadius: 6, fontSize: 12 }}
                labelStyle={{ color: "#dbe3f4" }}
              />
              <Line type="monotone" dataKey="loadPct" name="Загрузка %" stroke="#d4af37" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="prodPct" name="Продуктивность %" stroke="#4a63a0" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-2 flex gap-4 text-xs text-navy-400">
            <span className="flex items-center gap-1.5"><span className="h-0.5 w-3 bg-gold-400" /> Загрузка %</span>
            <span className="flex items-center gap-1.5"><span className="h-0.5 w-3 bg-navy-400" /> Продуктивность %</span>
          </div>
        </SectionCard>

        <SectionCard title="Загрузка по направлениям деятельности" subtitle="Средняя загрузка сотрудников направления">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={processAggregates} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#16264d" />
              <XAxis
                dataKey="process"
                tick={{ fill: "#7a8fc4", fontSize: 10 }}
                axisLine={{ stroke: "#16264d" }}
                tickLine={false}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fill: "#7a8fc4", fontSize: 11 }} axisLine={{ stroke: "#16264d" }} tickLine={false} unit="%" />
              <Tooltip
                contentStyle={{ background: "#101c3a", border: "1px solid #1e3361", borderRadius: 6, fontSize: 12 }}
                labelStyle={{ color: "#dbe3f4" }}
                formatter={(v) => [`${Number(v).toFixed(0)}%`, "Средняя загрузка"]}
              />
              <Bar dataKey="avgLoadPct" radius={[4, 4, 0, 0]}>
                {processAggregates.map((p) => (
                  <Cell key={p.process} fill={PROCESS_BAR_COLOR(p.avgLoadPct)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <SectionCard title="Приоритетные риски" subtitle="До 5 сотрудников с наибольшим риском">
          {priorityRisks.length === 0 ? (
            <p className="text-sm text-navy-400">Сотрудников в зоне риска не выявлено.</p>
          ) : (
            <ul className="flex flex-col gap-2.5">
              {priorityRisks.map((e) => {
                const flags = riskFlags(e);
                return (
                  <li key={e.id} className="rounded border border-status-red/30 bg-status-red/5 p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-navy-100">{e.name}</span>
                      <span className="text-xs text-navy-400">{e.process}</span>
                    </div>
                    <p className="mt-1 text-xs text-navy-300">{flags.map((f) => riskReasonText(f, e)).join(" · ")}</p>
                  </li>
                );
              })}
            </ul>
          )}
        </SectionCard>

        <SectionCard title="Требует оптимизации" subtitle="Направление с максимальной совокупной нагрузкой (п. 7.5)">
          {!optimizationPriority ? (
            <p className="text-sm text-navy-400">Нет данных.</p>
          ) : (
            <div className="rounded border border-gold-500/40 bg-gold-500/5 p-4">
              <div className="font-serif-heading text-lg font-semibold text-gold-300">{optimizationPriority.process}</div>
              <div className="mt-3 grid grid-cols-3 gap-3 font-mono text-sm">
                <div>
                  <div className="text-xs text-navy-400">Сотрудников</div>
                  <div className="text-navy-100">{optimizationPriority.count}</div>
                </div>
                <div>
                  <div className="text-xs text-navy-400">Средняя загрузка</div>
                  <div className="text-navy-100">{optimizationPriority.avgLoadPct.toFixed(0)}%</div>
                </div>
                <div>
                  <div className="text-xs text-navy-400">Просрочек</div>
                  <div className="text-navy-100">{optimizationPriority.overdueCount}</div>
                </div>
              </div>
              <div className="mt-3 text-xs text-navy-400">
                Балл направления: <span className="font-mono text-gold-300">{optimizationPriority.optimizationScore.toFixed(1)}</span>
              </div>
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
