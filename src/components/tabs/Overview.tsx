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
import { Users, Gauge, TrendingUp, ShieldAlert, Clock, Trophy, Medal, Award } from "lucide-react";
import type { Employee, Period } from "../../types";
import { PROCESSES } from "../../types";
import {
  aggregateByProcess,
  kpiPct,
  riskFlags,
  riskReasonText,
  riskSeverityScore,
  topByProcessed,
  topOptimizationPriority,
  workloadPct,
  workloadStatus,
} from "../../lib/calculations";
import { weeklyHistory } from "../../data/mockHistory";
import { restructReasons } from "../../data/restructReasons";
import { aggregateHistory } from "../../lib/history";
import { StatCard } from "../ui/StatCard";
import { SectionCard } from "../ui/SectionCard";

const PERIOD_LABEL: Record<Period, string> = { week: "Неделя", month: "Месяц", quarter: "Квартал" };

const PROCESS_BAR_COLOR = (pct: number) => {
  const status = workloadStatus(pct);
  return { "Перегрузка": "#DC2626", "На пределе": "#D97706", "Норма": "#00A651", "Недогрузка": "#2563EB" }[status];
};

const RANK_STYLE = [
  { icon: Trophy, color: "text-[#B8860B]", bg: "bg-[#FDF3D8]" },
  { icon: Medal, color: "text-navy-400", bg: "bg-navy-800" },
  { icon: Award, color: "text-[#9A5B2E]", bg: "bg-[#F4E6DA]" },
];

function RankedList({ title, subtitle, list }: { title: string; subtitle: string; list: Employee[] }) {
  return (
    <SectionCard title={title} subtitle={subtitle}>
      {list.length === 0 ? (
        <p className="text-sm text-navy-400">Недостаточно данных для формирования рейтинга.</p>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {list.map((e, idx) => {
            const style = RANK_STYLE[idx];
            const Icon = style.icon;
            return (
              <li key={e.id} className="flex items-center gap-3 rounded-lg border border-navy-700 p-3">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${style.bg}`}>
                  <Icon className={style.color} size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium text-navy-100">{e.name}</div>
                  <div className="truncate text-xs text-navy-400">{e.position}</div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="font-mono text-lg font-semibold text-navy-100">{e.tasksCompleted}</div>
                  <div className="text-[11px] text-navy-400">заявок · кач-во {e.quality}</div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </SectionCard>
  );
}

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
  const rankable = useMemo(() => employees.filter((e) => !e.isManager), [employees]);

  const riskCount = useMemo(() => rankable.filter((e) => riskFlags(e).length > 0).length, [rankable]);
  const overdueCount = useMemo(() => employees.reduce((s, e) => s + e.tasksOverdue, 0), [employees]);

  const topSanctioners = useMemo(() => topByProcessed(rankable, "Санкционер", 3), [rankable]);
  const topExecutors = useMemo(() => topByProcessed(rankable, "Исполнитель", 3), [rankable]);

  const chartData = useMemo(() => aggregateHistory(weeklyHistory, period), [period]);

  const priorityRisks = useMemo(
    () =>
      rankable
        .filter((e) => riskFlags(e).length > 0)
        .sort((a, b) => riskSeverityScore(b) - riskSeverityScore(a))
        .slice(0, 5),
    [rankable]
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
          label="Возвраты на доработку"
          value={String(overdueCount)}
          icon={<Clock size={18} />}
          tone={overdueCount > 0 ? "warning" : "default"}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <RankedList
          title="Топ-3 санкционера"
          subtitle="По количеству обработанных заявок за период · без учёта руководителя"
          list={topSanctioners}
        />
        <RankedList
          title="Топ-3 исполнителя"
          subtitle="По количеству обработанных заявок за период · без учёта руководителя"
          list={topExecutors}
        />
      </div>

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
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8e5" />
              <XAxis dataKey="label" tick={{ fill: "#66766d", fontSize: 11 }} axisLine={{ stroke: "#e2e8e5" }} tickLine={false} />
              <YAxis tick={{ fill: "#66766d", fontSize: 11 }} axisLine={{ stroke: "#e2e8e5" }} tickLine={false} unit="%" />
              <Tooltip
                contentStyle={{ background: "#ffffff", border: "1px solid #dbe4de", borderRadius: 6, fontSize: 12 }}
                labelStyle={{ color: "#16211b" }}
              />
              <Line type="monotone" dataKey="loadPct" name="Загрузка %" stroke="#00A651" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="prodPct" name="Продуктивность %" stroke="#2563EB" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-2 flex gap-4 text-xs text-navy-400">
            <span className="flex items-center gap-1.5"><span className="h-0.5 w-3 bg-[#00A651]" /> Загрузка %</span>
            <span className="flex items-center gap-1.5"><span className="h-0.5 w-3 bg-[#2563EB]" /> Продуктивность %</span>
          </div>
        </SectionCard>

        <SectionCard title="Загрузка по направлениям деятельности" subtitle="Средняя загрузка сотрудников направления">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={processAggregates} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8e5" />
              <XAxis
                dataKey="process"
                tick={{ fill: "#66766d", fontSize: 12 }}
                axisLine={{ stroke: "#e2e8e5" }}
                tickLine={false}
                interval={0}
              />
              <YAxis tick={{ fill: "#66766d", fontSize: 11 }} axisLine={{ stroke: "#e2e8e5" }} tickLine={false} unit="%" />
              <Tooltip
                contentStyle={{ background: "#ffffff", border: "1px solid #dbe4de", borderRadius: 6, fontSize: 12 }}
                labelStyle={{ color: "#16211b" }}
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
              <div className="text-lg font-semibold text-gold-300">{optimizationPriority.process}</div>
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
                  <div className="text-xs text-navy-400">Возвратов</div>
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

      <SectionCard title="Причины реструктуризации" subtitle="Доля заявок по типу реструктуризации за период">
        <ul className="flex flex-col gap-3">
          {restructReasons.map((r) => (
            <li key={r.reason} className="flex items-center gap-3">
              <span className="w-56 shrink-0 truncate text-sm text-navy-200" title={r.reason}>
                {r.reason}
              </span>
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-navy-700">
                <div className="h-full rounded-full bg-gold-500" style={{ width: `${r.pct}%` }} />
              </div>
              <span className="w-12 shrink-0 text-right font-mono text-sm text-navy-100">{r.pct.toFixed(1)}%</span>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
