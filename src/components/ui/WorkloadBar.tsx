import { workloadStatus } from "../../lib/calculations";

const BAR_COLOR: Record<string, string> = {
  "Перегрузка": "bg-status-red",
  "На пределе": "bg-status-yellow",
  "Норма": "bg-status-green",
  "Недогрузка": "bg-status-blue",
};

export function WorkloadBar({ pct }: { pct: number }) {
  const status = workloadStatus(pct);
  const width = Math.min(100, (pct / 130) * 100);
  return (
    <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-navy-700">
      <div
        className={`h-full rounded-full ${BAR_COLOR[status]} transition-all`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
