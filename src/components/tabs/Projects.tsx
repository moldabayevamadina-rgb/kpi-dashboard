import { Plus, Trash2 } from "lucide-react";
import type { Employee, Project, ProjectStatus } from "../../types";
import { SectionCard } from "../ui/SectionCard";
import { ProjectStatusPill } from "../ui/StatusPill";

const PROJECT_STATUSES: ProjectStatus[] = ["Открыт", "В работе", "На паузе", "Завершён"];

interface ProjectsProps {
  projects: Project[];
  employees: Employee[];
  onChange: (projects: Project[]) => void;
}

const inputClass =
  "w-full rounded border border-navy-600 bg-navy-900 px-2 py-1 text-sm text-navy-100 focus:border-gold-400 focus:outline-none";

export function Projects({ projects, employees, onChange }: ProjectsProps) {
  const executors = employees.filter((e) => !e.isManager);

  function updateField(id: number, patch: Partial<Project>) {
    onChange(projects.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  function updateWeight(id: number, raw: string) {
    const value = raw === "" ? 0 : Number(raw);
    if (Number.isNaN(value)) return;
    updateField(id, { weight: Math.max(0, value) });
  }

  function addProject() {
    const nextId = projects.length > 0 ? Math.max(...projects.map((p) => p.id)) + 1 : 1;
    const newProject: Project = {
      id: nextId,
      title: "Новый проект",
      executor: executors[0]?.name ?? "",
      description: "",
      status: "Открыт",
      dueDate: "",
      weight: 0,
    };
    onChange([...projects, newProject]);
  }

  function removeProject(id: number) {
    onChange(projects.filter((p) => p.id !== id));
  }

  return (
    <SectionCard
      title="Проекты и большие задачи"
      subtitle="В разрезе исполнителей — оценка нагрузки (усл. ед.) учитывается в загрузке и KPI"
      actions={
        <button
          onClick={addProject}
          className="flex items-center gap-1.5 rounded border border-gold-500/50 bg-gold-500/10 px-3 py-1.5 text-sm font-medium text-gold-300 hover:bg-gold-500/20"
        >
          <Plus size={15} /> Добавить проект
        </button>
      }
    >
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[980px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-navy-700 text-left text-xs uppercase tracking-wider text-navy-400">
              <th className="py-2 pr-3 font-medium">Проект / задача</th>
              <th className="py-2 pr-3 font-medium">Исполнитель</th>
              <th className="py-2 pr-3 font-medium">Статус</th>
              <th className="py-2 pr-3 font-medium text-right">Нагрузка (усл. ед.)</th>
              <th className="py-2 pr-3 font-medium">Срок</th>
              <th className="py-2 pr-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} className="border-b border-navy-800 last:border-0 align-top">
                <td className="py-1.5 pr-3">
                  <input
                    className={`${inputClass} font-medium`}
                    value={p.title}
                    onChange={(ev) => updateField(p.id, { title: ev.target.value })}
                  />
                  <input
                    className={`${inputClass} mt-1 text-xs`}
                    value={p.description}
                    placeholder="Краткое описание"
                    onChange={(ev) => updateField(p.id, { description: ev.target.value })}
                  />
                </td>
                <td className="py-1.5 pr-3">
                  <select
                    className={inputClass}
                    value={p.executor}
                    onChange={(ev) => updateField(p.id, { executor: ev.target.value })}
                  >
                    {executors.map((e) => (
                      <option key={e.id} value={e.name}>
                        {e.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-1.5 pr-3">
                  <select
                    className={inputClass}
                    value={p.status}
                    onChange={(ev) => updateField(p.id, { status: ev.target.value as ProjectStatus })}
                  >
                    {PROJECT_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="w-28 py-1.5 pr-3">
                  <input
                    type="number"
                    className={`${inputClass} text-right font-mono`}
                    value={p.weight}
                    onChange={(ev) => updateWeight(p.id, ev.target.value)}
                  />
                </td>
                <td className="w-36 py-1.5 pr-3">
                  <input
                    type="date"
                    className={`${inputClass} font-mono`}
                    value={p.dueDate}
                    onChange={(ev) => updateField(p.id, { dueDate: ev.target.value })}
                  />
                </td>
                <td className="py-1.5 pr-1 text-right">
                  <button
                    onClick={() => removeProject(p.id)}
                    className="rounded p-1.5 text-navy-400 hover:bg-status-red/10 hover:text-status-red"
                    title="Удалить проект"
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="flex flex-col gap-3 md:hidden">
        {projects.map((p) => (
          <li key={p.id} className="rounded-lg border border-navy-700 bg-navy-800 p-3">
            <div className="flex items-start justify-between gap-2">
              <input
                className={`${inputClass} flex-1 font-medium`}
                value={p.title}
                onChange={(ev) => updateField(p.id, { title: ev.target.value })}
              />
              <button
                onClick={() => removeProject(p.id)}
                className="shrink-0 rounded p-1.5 text-navy-400 hover:bg-status-red/10 hover:text-status-red"
                title="Удалить проект"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <input
              className={`${inputClass} mt-2 text-xs`}
              value={p.description}
              placeholder="Краткое описание"
              onChange={(ev) => updateField(p.id, { description: ev.target.value })}
            />
            <div className="mt-2 grid grid-cols-2 gap-2">
              <select
                className={inputClass}
                value={p.executor}
                onChange={(ev) => updateField(p.id, { executor: ev.target.value })}
              >
                {executors.map((e) => (
                  <option key={e.id} value={e.name}>
                    {e.name}
                  </option>
                ))}
              </select>
              <select
                className={inputClass}
                value={p.status}
                onChange={(ev) => updateField(p.id, { status: ev.target.value as ProjectStatus })}
              >
                {PROJECT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <label className="block">
                <span className="mb-1 block text-[10px] uppercase tracking-wide text-navy-400">Нагрузка (усл. ед.)</span>
                <input
                  type="number"
                  className={`${inputClass} text-right font-mono`}
                  value={p.weight}
                  onChange={(ev) => updateWeight(p.id, ev.target.value)}
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[10px] uppercase tracking-wide text-navy-400">Срок</span>
                <input
                  type="date"
                  className={`${inputClass} font-mono`}
                  value={p.dueDate}
                  onChange={(ev) => updateField(p.id, { dueDate: ev.target.value })}
                />
              </label>
            </div>
            <div className="mt-2">
              <ProjectStatusPill status={p.status} />
            </div>
          </li>
        ))}
      </ul>

      {projects.length === 0 && (
        <p className="py-6 text-center text-sm text-navy-400">Проектов пока нет — добавьте первый.</p>
      )}
    </SectionCard>
  );
}
