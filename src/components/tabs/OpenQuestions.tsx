import { Plus, Trash2 } from "lucide-react";
import type { Employee, OpenQuestion, OpenQuestionStatus } from "../../types";
import { SectionCard } from "../ui/SectionCard";
import { QuestionStatusPill } from "../ui/StatusPill";

const QUESTION_STATUSES: OpenQuestionStatus[] = ["Открыт", "В работе", "Просрочен", "Закрыт"];

interface OpenQuestionsProps {
  questions: OpenQuestion[];
  employees: Employee[];
  onChange: (questions: OpenQuestion[]) => void;
}

const inputClass =
  "w-full rounded border border-navy-600 bg-navy-900 px-2 py-1 text-sm text-navy-100 focus:border-gold-400 focus:outline-none";

export function OpenQuestions({ questions, employees, onChange }: OpenQuestionsProps) {
  const owners = employees;

  function updateField(id: number, patch: Partial<OpenQuestion>) {
    onChange(questions.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  }

  function updateWeight(id: number, raw: string) {
    const value = raw === "" ? 0 : Number(raw);
    if (Number.isNaN(value)) return;
    updateField(id, { weight: Math.max(0, value) });
  }

  function addQuestion() {
    const nextId = questions.length > 0 ? Math.max(...questions.map((q) => q.id)) + 1 : 1;
    const today = new Date().toISOString().slice(0, 10);
    const newQuestion: OpenQuestion = {
      id: nextId,
      dateRaised: today,
      question: "Новый вопрос",
      raisedBy: "",
      owner: owners[0]?.name ?? "",
      dueDate: "",
      status: "Открыт",
      comment: "",
      closedDate: null,
      weight: 0,
    };
    onChange([...questions, newQuestion]);
  }

  function removeQuestion(id: number) {
    onChange(questions.filter((q) => q.id !== id));
  }

  return (
    <SectionCard
      title="Открытые вопросы управления"
      subtitle="Лог еженедельных планёрок — оценка нагрузки (усл. ед.) учитывается в загрузке и KPI ответственного"
      actions={
        <button
          onClick={addQuestion}
          className="flex items-center gap-1.5 rounded border border-gold-500/50 bg-gold-500/10 px-3 py-1.5 text-sm font-medium text-gold-300 hover:bg-gold-500/20"
        >
          <Plus size={15} /> Добавить вопрос
        </button>
      }
    >
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[1180px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-navy-700 text-left text-xs uppercase tracking-wider text-navy-400">
              <th className="py-2 pr-3 font-medium">Дата</th>
              <th className="py-2 pr-3 font-medium">Вопрос</th>
              <th className="py-2 pr-3 font-medium">Кто поднял</th>
              <th className="py-2 pr-3 font-medium">Ответственный</th>
              <th className="py-2 pr-3 font-medium">Срок</th>
              <th className="py-2 pr-3 font-medium">Статус</th>
              <th className="py-2 pr-3 font-medium text-right">Нагрузка (усл. ед.)</th>
              <th className="py-2 pr-3 font-medium">Комментарий / решение</th>
              <th className="py-2 pr-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => (
              <tr key={q.id} className="border-b border-navy-800 last:border-0 align-top">
                <td className="w-36 py-1.5 pr-3">
                  <input
                    type="date"
                    className={`${inputClass} font-mono`}
                    value={q.dateRaised}
                    onChange={(ev) => updateField(q.id, { dateRaised: ev.target.value })}
                  />
                </td>
                <td className="py-1.5 pr-3">
                  <input
                    className={inputClass}
                    value={q.question}
                    onChange={(ev) => updateField(q.id, { question: ev.target.value })}
                  />
                </td>
                <td className="py-1.5 pr-3">
                  <input
                    className={inputClass}
                    value={q.raisedBy}
                    onChange={(ev) => updateField(q.id, { raisedBy: ev.target.value })}
                  />
                </td>
                <td className="py-1.5 pr-3">
                  <select
                    className={inputClass}
                    value={q.owner}
                    onChange={(ev) => updateField(q.id, { owner: ev.target.value })}
                  >
                    {owners.map((e) => (
                      <option key={e.id} value={e.name}>
                        {e.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="w-36 py-1.5 pr-3">
                  <input
                    type="date"
                    className={`${inputClass} font-mono`}
                    value={q.dueDate}
                    onChange={(ev) => updateField(q.id, { dueDate: ev.target.value })}
                  />
                </td>
                <td className="py-1.5 pr-3">
                  <select
                    className={inputClass}
                    value={q.status}
                    onChange={(ev) =>
                      updateField(q.id, {
                        status: ev.target.value as OpenQuestionStatus,
                        closedDate: ev.target.value === "Закрыт" ? new Date().toISOString().slice(0, 10) : q.closedDate,
                      })
                    }
                  >
                    {QUESTION_STATUSES.map((s) => (
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
                    value={q.weight}
                    onChange={(ev) => updateWeight(q.id, ev.target.value)}
                  />
                </td>
                <td className="py-1.5 pr-3">
                  <input
                    className={inputClass}
                    value={q.comment}
                    onChange={(ev) => updateField(q.id, { comment: ev.target.value })}
                  />
                </td>
                <td className="py-1.5 pr-1 text-right">
                  <button
                    onClick={() => removeQuestion(q.id)}
                    className="rounded p-1.5 text-navy-400 hover:bg-status-red/10 hover:text-status-red"
                    title="Удалить вопрос"
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
        {questions.map((q) => (
          <li key={q.id} className="rounded-lg border border-navy-700 bg-navy-800 p-3">
            <div className="flex items-start justify-between gap-2">
              <input
                className={`${inputClass} flex-1 font-medium`}
                value={q.question}
                onChange={(ev) => updateField(q.id, { question: ev.target.value })}
              />
              <button
                onClick={() => removeQuestion(q.id)}
                className="shrink-0 rounded p-1.5 text-navy-400 hover:bg-status-red/10 hover:text-status-red"
                title="Удалить вопрос"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <label className="block">
                <span className="mb-1 block text-[10px] uppercase tracking-wide text-navy-400">Дата</span>
                <input
                  type="date"
                  className={`${inputClass} font-mono`}
                  value={q.dateRaised}
                  onChange={(ev) => updateField(q.id, { dateRaised: ev.target.value })}
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[10px] uppercase tracking-wide text-navy-400">Кто поднял</span>
                <input
                  className={inputClass}
                  value={q.raisedBy}
                  onChange={(ev) => updateField(q.id, { raisedBy: ev.target.value })}
                />
              </label>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <select
                className={inputClass}
                value={q.owner}
                onChange={(ev) => updateField(q.id, { owner: ev.target.value })}
              >
                {owners.map((e) => (
                  <option key={e.id} value={e.name}>
                    {e.name}
                  </option>
                ))}
              </select>
              <select
                className={inputClass}
                value={q.status}
                onChange={(ev) =>
                  updateField(q.id, {
                    status: ev.target.value as OpenQuestionStatus,
                    closedDate: ev.target.value === "Закрыт" ? new Date().toISOString().slice(0, 10) : q.closedDate,
                  })
                }
              >
                {QUESTION_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <label className="block">
                <span className="mb-1 block text-[10px] uppercase tracking-wide text-navy-400">Срок</span>
                <input
                  type="date"
                  className={`${inputClass} font-mono`}
                  value={q.dueDate}
                  onChange={(ev) => updateField(q.id, { dueDate: ev.target.value })}
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[10px] uppercase tracking-wide text-navy-400">Нагрузка (усл. ед.)</span>
                <input
                  type="number"
                  className={`${inputClass} text-right font-mono`}
                  value={q.weight}
                  onChange={(ev) => updateWeight(q.id, ev.target.value)}
                />
              </label>
            </div>
            <input
              className={`${inputClass} mt-2 text-xs`}
              value={q.comment}
              placeholder="Комментарий / решение"
              onChange={(ev) => updateField(q.id, { comment: ev.target.value })}
            />
            <div className="mt-2">
              <QuestionStatusPill status={q.status} />
            </div>
          </li>
        ))}
      </ul>

      {questions.length === 0 && (
        <p className="py-6 text-center text-sm text-navy-400">Открытых вопросов нет — добавьте первый перед планёркой.</p>
      )}
    </SectionCard>
  );
}
