import type { ReactNode } from "react";
import { LayoutDashboard, Gauge, TrendingUp, ShieldAlert, Users, Landmark, Briefcase, MessagesSquare } from "lucide-react";

export const TABS = [
  { id: "overview", label: "Обзор", icon: LayoutDashboard },
  { id: "workload", label: "Нагрузка", icon: Gauge },
  { id: "productivity", label: "Продуктивность", icon: TrendingUp },
  { id: "risks", label: "Риски и процессы", icon: ShieldAlert },
  { id: "projects", label: "Проекты", icon: Briefcase },
  { id: "questions", label: "Открытые вопросы", icon: MessagesSquare },
  { id: "registry", label: "Реестр сотрудников", icon: Users },
] as const;

export type TabId = (typeof TABS)[number]["id"];

interface LayoutProps {
  activeTab: TabId;
  onTabChange: (id: TabId) => void;
  children: ReactNode;
}

export function Layout({ activeTab, onTabChange, children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-navy-950">
      <header className="border-b border-navy-700 bg-navy-900">
        <div className="mx-auto max-w-[1400px] px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-gold-400 sm:text-xs">
                Управление · Бэк-офис
              </p>
              <h1 className="font-serif-heading mt-1 text-lg font-semibold text-navy-100 sm:text-2xl">
                Дашборд мониторинга KPI и нагрузки
              </h1>
            </div>
            <div className="flex shrink-0 items-center gap-3 sm:gap-4">
              <div className="hidden rounded border border-navy-600 bg-navy-800 px-3 py-2 text-right md:block">
                <div className="text-[10px] uppercase tracking-wider text-navy-400">Период данных</div>
                <div className="font-mono text-sm text-navy-100">1 мая – 2 июля 2026</div>
              </div>
              <div className="hidden h-9 w-px bg-navy-700 md:block" />
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold-500 text-white">
                  <Landmark size={20} />
                </div>
                <div className="leading-tight">
                  <div className="text-base font-extrabold tracking-tight text-navy-100 sm:text-lg">
                    Halyk<span className="text-gold-500">Bank</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <nav className="scrollbar-none -mx-4 mt-4 flex flex-nowrap gap-1 overflow-x-auto border-b border-navy-700 px-4 sm:mx-0 sm:mt-5 sm:flex-wrap sm:overflow-visible sm:px-0">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors sm:px-4 ${
                    isActive
                      ? "border-gold-400 text-gold-300"
                      : "border-transparent text-navy-300 hover:text-navy-100"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-4 py-4 sm:px-6 sm:py-6">{children}</main>

      <footer className="mx-auto max-w-[1400px] px-4 py-6 text-center text-xs text-navy-500 sm:px-6">
        Данные: выгрузка заявок на реструктуризацию займов, 1 мая – 2 июля 2026 · Реестр сотрудников — ручное редактирование · v1.0
      </footer>
    </div>
  );
}
