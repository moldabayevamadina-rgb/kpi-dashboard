import type { Employee } from "../types";

/**
 * Источники: выгрузка заявок на реструктуризацию (1 мая — 2 июля 2026, робот исключён)
 * и табель трудовой дисциплины (май + июнь-июль, 62 календарных дня).
 *
 * Норма (capacity) больше не плоское среднее — это медианная дневная выработка
 * (заявок / отработанный день) среди рядовых сотрудников (≈16.18/день),
 * умноженная на фактически отработанные дни каждого сотрудника из табеля.
 * Так недогрузка/перегрузка честно учитывает отпуска, больничные и дни отсутствия,
 * а не сравнивает всех по одной и той же норме независимо от отработанного времени.
 *
 * У руководителя (Молдабаева) норма равна её факту — см. isManager.
 * Тюлюгенова отсутствует в табеле дисциплины за весь период (данных нет ни за один
 * день) — похоже, покинула управление; оставлена в реестре с пометкой inactive,
 * норма — по старому плоскому среднему (537), т.к. персональную выработку в день
 * посчитать не из чего.
 */
export const initialEmployees: Employee[] = [
  { id: 1, name: "Мамирова Зухра Махаметжановна", position: "Главный менеджер", process: "Санкционер", capacity: 615, actualHours: 1218, tasksAssigned: 1218, tasksCompleted: 1118, tasksOverdue: 100, quality: 92, daysWorked: 38, lateCount: 9, earlyLeaveCount: 3 },
  { id: 2, name: "Ажгелдина Айсын Әмірқызы", position: "Главный менеджер", process: "Санкционер", capacity: 582, actualHours: 1139, tasksAssigned: 1139, tasksCompleted: 1125, tasksOverdue: 14, quality: 99, daysWorked: 36, lateCount: 0, earlyLeaveCount: 2 },
  { id: 3, name: "Молдабаева Мадина Бакыткелдиевна", position: "Начальник управления", process: "Исполнитель", capacity: 1113, actualHours: 1113, tasksAssigned: 1113, tasksCompleted: 1113, tasksOverdue: 0, quality: 100, isManager: true, daysWorked: 39, lateCount: 2, earlyLeaveCount: 0 },
  { id: 4, name: "Ахунова Аниса Валиевна", position: "Старший менеджер", process: "Санкционер", capacity: 647, actualHours: 1094, tasksAssigned: 1094, tasksCompleted: 1085, tasksOverdue: 9, quality: 99, daysWorked: 40, lateCount: 1, earlyLeaveCount: 1 },
  { id: 5, name: "Нурсеитова Бибигуль Тулегеновна", position: "Старший менеджер", process: "Санкционер", capacity: 485, actualHours: 678, tasksAssigned: 678, tasksCompleted: 628, tasksOverdue: 50, quality: 93, daysWorked: 30, lateCount: 0, earlyLeaveCount: 0 },
  { id: 6, name: "Толендиева Айзат Муратовна", position: "Менеджер", process: "Исполнитель", capacity: 631, actualHours: 632, tasksAssigned: 632, tasksCompleted: 507, tasksOverdue: 125, quality: 80, daysWorked: 39, lateCount: 1, earlyLeaveCount: 0 },
  { id: 7, name: "Султан Венера Надирқызы", position: "Старший менеджер", process: "Санкционер", capacity: 631, actualHours: 631, tasksAssigned: 631, tasksCompleted: 618, tasksOverdue: 13, quality: 98, daysWorked: 39, lateCount: 2, earlyLeaveCount: 4 },
  { id: 8, name: "Сейдеков Ер-Канат Рысбаевич", position: "Менеджер", process: "Исполнитель", capacity: 599, actualHours: 548, tasksAssigned: 548, tasksCompleted: 480, tasksOverdue: 68, quality: 88, daysWorked: 37, lateCount: 0, earlyLeaveCount: 0 },
  { id: 9, name: "Татиева Асель Муратбековна", position: "Старший менеджер", process: "Санкционер", capacity: 453, actualHours: 513, tasksAssigned: 513, tasksCompleted: 493, tasksOverdue: 20, quality: 96, daysWorked: 28, lateCount: 0, earlyLeaveCount: 0 },
  { id: 10, name: "Митанова Айымгул Байгалиевна", position: "Менеджер", process: "Исполнитель", capacity: 469, actualHours: 395, tasksAssigned: 395, tasksCompleted: 345, tasksOverdue: 50, quality: 87, daysWorked: 29, lateCount: 0, earlyLeaveCount: 2 },
  { id: 11, name: "Абдухелилұлы Рахимжан", position: "Главный менеджер", process: "Санкционер", capacity: 421, actualHours: 216, tasksAssigned: 216, tasksCompleted: 213, tasksOverdue: 3, quality: 99, daysWorked: 26, lateCount: 1, earlyLeaveCount: 1 },
  { id: 12, name: "Алдобергенова Гульнара Доктурбаевна", position: "Менеджер", process: "Исполнитель", capacity: 469, actualHours: 144, tasksAssigned: 144, tasksCompleted: 118, tasksOverdue: 26, quality: 82, daysWorked: 29, lateCount: 0, earlyLeaveCount: 0 },
  { id: 13, name: "Тюлюгенова", position: "Специалист по реструктуризации займов", process: "Санкционер", capacity: 537, actualHours: 131, tasksAssigned: 131, tasksCompleted: 124, tasksOverdue: 7, quality: 95, inactive: true },
  { id: 14, name: "Киясова Гульмира Ансагановна", position: "Менеджер", process: "Исполнитель", capacity: 453, actualHours: 93, tasksAssigned: 93, tasksCompleted: 91, tasksOverdue: 2, quality: 98, daysWorked: 28, lateCount: 0, earlyLeaveCount: 1 },
  { id: 15, name: "Дарибаева Раушан Ауелбековна", position: "Старший менеджер", process: "Санкционер", capacity: 550, actualHours: 84, tasksAssigned: 84, tasksCompleted: 84, tasksOverdue: 0, quality: 100, daysWorked: 34, lateCount: 0, earlyLeaveCount: 1 },
];
