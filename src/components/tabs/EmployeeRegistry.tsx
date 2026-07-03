import { Plus, Trash2 } from "lucide-react";
import type { Employee, Process } from "../../types";
import { PROCESSES } from "../../types";
import { kpiPct, workloadPct, workloadStatus } from "../../lib/calculations";
import { SectionCard } from "../ui/SectionCard";
import { WorkloadStatusPill } from "../ui/StatusPill";

interface EmployeeRegistryProps {
  employees: Employee[];
  onChange: (employees: Employee[]) => void;
}

type NumericField = "capacity" | "actualHours" | "tasksAssigned" | "tasksCompleted" | "tasksOverdue" | "quality";

const inputClass =
  "w-full rounded border border-navy-600 bg-navy-900 px-2 py-1 text-sm text-navy-100 focus:border-gold-400 focus:outline-none";

export function EmployeeRegistry({ employees, onChange }: EmployeeRegistryProps) {
  function updateField(id: number, patch: Partial<Employee>) {
    onChange(employees.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }

  function updateNumeric(id: number, field: NumericField, raw: string) {
    const value = raw === "" ? 0 : Number(raw);
    if (Number.isNaN(value)) return;
    updateField(id, { [field]: field === "quality" ? Math.max(0, Math.min(100, value)) : Math.max(0, value) } as Partial<Employee>);
  }

  function addEmployee() {
    const nextId = employees.length > 0 ? Math.max(...employees.map((e) => e.id)) + 1 : 1;
    const newEmployee: Employee = {
      id: nextId,
      name: "Новый сотрудник",
      position: "Специалист по реструктуризации займов",
      process: PROCESSES[0],
      capacity: 537,
      actualHours: 0,
      tasksAssigned: 0,
      tasksCompleted: 0,
      tasksOverdue: 0,
      quality: 100,
    };
    onChange([...employees, newEmployee]);
  }

  function removeEmployee(id: number) {
    onChange(employees.filter((e) => e.id !== id));
  }

  return (
    <SectionCard
      title="Реестр сотрудников"
      subtitle="Ручной ввод и редактирование — изменения сразу пересчитывают все разделы дашборда"
      actions={
        <button
          onClick={addEmployee}
          className="flex items-center gap-1.5 rounded border border-gold-500/50 bg-gold-500/10 px-3 py-1.5 text-sm font-medium text-gold-300 hover:bg-gold-500/20"
        >
          <Plus size={15} /> Добавить сотрудника
        </button>
      }
    >
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[1180px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-navy-700 text-left text-xs uppercase tracking-wider text-navy-400">
              <th className="py-2 pr-3 font-medium">ФИО</th>
              <th className="py-2 pr-3 font-medium">Должность</th>
              <th className="py-2 pr-3 font-medium">Направление</th>
              <th className="py-2 pr-3 font-medium text-right">Норма</th>
              <th className="py-2 pr-3 font-medium text-right">Факт</th>
              <th className="py-2 pr-3 font-medium text-right">Назначено</th>
              <th className="py-2 pr-3 font-medium text-right">Выполнено</th>
              <th className="py-2 pr-3 font-medium text-right">Возвраты</th>
              <th className="py-2 pr-3 font-medium text-right">Качество</th>
              <th className="py-2 pr-3 font-medium text-right">Загрузка</th>
              <th className="py-2 pr-3 font-medium text-right">KPI</th>
              <th className="py-2 pr-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {employees.map((e) => {
              const pct = workloadPct(e);
              return (
                <tr key={e.id} className="border-b border-navy-800 last:border-0">
                  <td className="py-1.5 pr-3">
                    <input
                      className={inputClass}
                      value={e.name}
                      onChange={(ev) => updateField(e.id, { name: ev.target.value })}
                    />
                  </td>
                  <td className="py-1.5 pr-3">
                    <input
                      className={inputClass}
                      value={e.position}
                      onChange={(ev) => updateField(e.id, { position: ev.target.value })}
                    />
                  </td>
                  <td className="py-1.5 pr-3">
                    <select
                      className={inputClass}
                      value={e.process}
                      onChange={(ev) => updateField(e.id, { process: ev.target.value as Process })}
                    >
                      {PROCESSES.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="w-20 py-1.5 pr-3">
                    <input
                      type="number"
                      className={`${inputClass} text-right font-mono`}
                      value={e.capacity}
                      onChange={(ev) => updateNumeric(e.id, "capacity", ev.target.value)}
                    />
                  </td>
                  <td className="w-20 py-1.5 pr-3">
                    <input
                      type="number"
                      className={`${inputClass} text-right font-mono`}
                      value={e.actualHours}
                      onChange={(ev) => updateNumeric(e.id, "actualHours", ev.target.value)}
                    />
                  </td>
                  <td className="w-20 py-1.5 pr-3">
                    <input
                      type="number"
                      className={`${inputClass} text-right font-mono`}
                      value={e.tasksAssigned}
                      onChange={(ev) => updateNumeric(e.id, "tasksAssigned", ev.target.value)}
                    />
                  </td>
                  <td className="w-20 py-1.5 pr-3">
                    <input
                      type="number"
                      className={`${inputClass} text-right font-mono`}
                      value={e.tasksCompleted}
                      onChange={(ev) => updateNumeric(e.id, "tasksCompleted", ev.target.value)}
                    />
                  </td>
                  <td className="w-20 py-1.5 pr-3">
                    <input
                      type="number"
                      className={`${inputClass} text-right font-mono`}
                      value={e.tasksOverdue}
                      onChange={(ev) => updateNumeric(e.id, "tasksOverdue", ev.target.value)}
                    />
                  </td>
                  <td className="w-20 py-1.5 pr-3">
                    <input
                      type="number"
                      className={`${inputClass} text-right font-mono`}
                      value={e.quality}
                      onChange={(ev) => updateNumeric(e.id, "quality", ev.target.value)}
                    />
                  </td>
                  <td className="py-1.5 pr-3 text-right">
                    <WorkloadStatusPill status={workloadStatus(pct)} />
                  </td>
                  <td className="py-1.5 pr-3 text-right font-mono font-semibold text-navy-100">{kpiPct(e).toFixed(0)}%</td>
                  <td className="py-1.5 pr-1 text-right">
                    <button
                      onClick={() => removeEmployee(e.id)}
                      className="rounded p-1.5 text-navy-400 hover:bg-status-red/10 hover:text-status-red"
                      title="Удалить сотрудника"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ul className="flex flex-col gap-3 md:hidden">
        {employees.map((e) => {
          const pct = workloadPct(e);
          return (
            <li key={e.id} className="rounded-lg border border-navy-700 bg-navy-800 p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 space-y-2">
                  <input
                    className={`${inputClass} font-medium`}
                    value={e.name}
                    onChange={(ev) => updateField(e.id, { name: ev.target.value })}
                    placeholder="ФИО"
                  />
                  <input
                    className={inputClass}
                    value={e.position}
                    onChange={(ev) => updateField(e.id, { position: ev.target.value })}
                    placeholder="Должность"
                  />
                </div>
                <button
                  onClick={() => removeEmployee(e.id)}
                  className="shrink-0 rounded p-1.5 text-navy-400 hover:bg-status-red/10 hover:text-status-red"
                  title="Удалить сотрудника"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <select
                className={`${inputClass} mt-2`}
                value={e.process}
                onChange={(ev) => updateField(e.id, { process: ev.target.value as Process })}
              >
                {PROCESSES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>

              <div className="mt-3 grid grid-cols-3 gap-2">
                <label className="block">
                  <span className="mb-1 block text-[10px] uppercase tracking-wide text-navy-400">Норма</span>
                  <input
                    type="number"
                    className={`${inputClass} text-right font-mono`}
                    value={e.capacity}
                    onChange={(ev) => updateNumeric(e.id, "capacity", ev.target.value)}
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[10px] uppercase tracking-wide text-navy-400">Факт</span>
                  <input
                    type="number"
                    className={`${inputClass} text-right font-mono`}
                    value={e.actualHours}
                    onChange={(ev) => updateNumeric(e.id, "actualHours", ev.target.value)}
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[10px] uppercase tracking-wide text-navy-400">Качество</span>
                  <input
                    type="number"
                    className={`${inputClass} text-right font-mono`}
                    value={e.quality}
                    onChange={(ev) => updateNumeric(e.id, "quality", ev.target.value)}
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[10px] uppercase tracking-wide text-navy-400">Назначено</span>
                  <input
                    type="number"
                    className={`${inputClass} text-right font-mono`}
                    value={e.tasksAssigned}
                    onChange={(ev) => updateNumeric(e.id, "tasksAssigned", ev.target.value)}
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[10px] uppercase tracking-wide text-navy-400">Выполнено</span>
                  <input
                    type="number"
                    className={`${inputClass} text-right font-mono`}
                    value={e.tasksCompleted}
                    onChange={(ev) => updateNumeric(e.id, "tasksCompleted", ev.target.value)}
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[10px] uppercase tracking-wide text-navy-400">Возвраты</span>
                  <input
                    type="number"
                    className={`${inputClass} text-right font-mono`}
                    value={e.tasksOverdue}
                    onChange={(ev) => updateNumeric(e.id, "tasksOverdue", ev.target.value)}
                  />
                </label>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-navy-700 pt-2.5">
                <WorkloadStatusPill status={workloadStatus(pct)} />
                <span className="font-mono text-sm font-semibold text-navy-100">KPI {kpiPct(e).toFixed(0)}%</span>
              </div>
            </li>
          );
        })}
      </ul>

      {employees.length === 0 && (
        <p className="py-6 text-center text-sm text-navy-400">Реестр пуст — добавьте сотрудника.</p>
      )}
    </SectionCard>
  );
}
