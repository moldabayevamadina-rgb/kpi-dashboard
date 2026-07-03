import type { Employee } from "../types";

/**
 * Источник: выгрузка «Заявки управления с 1 мая по 2 июля» — реструктуризация займов
 * (робот-процесс исключён). Норма (capacity) = средний объём заявок за период
 * среди рядовых сотрудников (537). У руководителя норма равна её же факту —
 * её 2-недельный всплеск активности в начале периода не сравнивается с рядовыми
 * сотрудниками (см. isManager).
 */
export const initialEmployees: Employee[] = [
  { id: 1, name: "Мамирова", position: "Специалист по реструктуризации займов", process: "Санкционер", capacity: 537, actualHours: 1218, tasksAssigned: 1218, tasksCompleted: 1118, tasksOverdue: 100, quality: 92 },
  { id: 2, name: "Ажгелдина", position: "Специалист по реструктуризации займов", process: "Санкционер", capacity: 537, actualHours: 1139, tasksAssigned: 1139, tasksCompleted: 1125, tasksOverdue: 14, quality: 99 },
  { id: 3, name: "Молдабаева", position: "Начальник управления", process: "Исполнитель", capacity: 1113, actualHours: 1113, tasksAssigned: 1113, tasksCompleted: 1113, tasksOverdue: 0, quality: 100, isManager: true },
  { id: 4, name: "Ахунова", position: "Специалист по реструктуризации займов", process: "Санкционер", capacity: 537, actualHours: 1094, tasksAssigned: 1094, tasksCompleted: 1085, tasksOverdue: 9, quality: 99 },
  { id: 5, name: "Нурсеитова", position: "Специалист по реструктуризации займов", process: "Санкционер", capacity: 537, actualHours: 678, tasksAssigned: 678, tasksCompleted: 628, tasksOverdue: 50, quality: 93 },
  { id: 6, name: "Толендиева", position: "Специалист по реструктуризации займов", process: "Исполнитель", capacity: 537, actualHours: 632, tasksAssigned: 632, tasksCompleted: 507, tasksOverdue: 125, quality: 80 },
  { id: 7, name: "Султан", position: "Специалист по реструктуризации займов", process: "Санкционер", capacity: 537, actualHours: 631, tasksAssigned: 631, tasksCompleted: 618, tasksOverdue: 13, quality: 98 },
  { id: 8, name: "Сейдеков", position: "Специалист по реструктуризации займов", process: "Исполнитель", capacity: 537, actualHours: 548, tasksAssigned: 548, tasksCompleted: 480, tasksOverdue: 68, quality: 88 },
  { id: 9, name: "Татиева", position: "Специалист по реструктуризации займов", process: "Санкционер", capacity: 537, actualHours: 513, tasksAssigned: 513, tasksCompleted: 493, tasksOverdue: 20, quality: 96 },
  { id: 10, name: "Митанова", position: "Специалист по реструктуризации займов", process: "Исполнитель", capacity: 537, actualHours: 395, tasksAssigned: 395, tasksCompleted: 345, tasksOverdue: 50, quality: 87 },
  { id: 11, name: "Абдухелилұлы", position: "Специалист по реструктуризации займов", process: "Санкционер", capacity: 537, actualHours: 216, tasksAssigned: 216, tasksCompleted: 213, tasksOverdue: 3, quality: 99 },
  { id: 12, name: "Алдобергенова", position: "Специалист по реструктуризации займов", process: "Исполнитель", capacity: 537, actualHours: 144, tasksAssigned: 144, tasksCompleted: 118, tasksOverdue: 26, quality: 82 },
  { id: 13, name: "Тюлюгенова", position: "Специалист по реструктуризации займов", process: "Санкционер", capacity: 537, actualHours: 131, tasksAssigned: 131, tasksCompleted: 124, tasksOverdue: 7, quality: 95 },
  { id: 14, name: "Киясова", position: "Специалист по реструктуризации займов", process: "Исполнитель", capacity: 537, actualHours: 93, tasksAssigned: 93, tasksCompleted: 91, tasksOverdue: 2, quality: 98 },
  { id: 15, name: "Дарибаева", position: "Специалист по реструктуризации займов", process: "Санкционер", capacity: 537, actualHours: 84, tasksAssigned: 84, tasksCompleted: 84, tasksOverdue: 0, quality: 100 },
];
