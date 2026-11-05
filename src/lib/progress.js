// Засеянное состояние «пользователь уже на 7-м дне» — для домашнего экрана,
// трекинга и стрика. Всё мок-данные (бэкенда нет).

export const STREAK_DAY = 7;

// Подписи дней недельного окна (день 7 = сегодня).
export const DAY_LABELS = ['1', '2', '3', '4', '5', '6', '7'];

// Смещения Symptom Score по дням относительно текущего: выше = тяжелее.
// День 1 заметно хуже, к дню 7 (сегодня) приходим к текущему значению — тренд вниз.
const OFFSETS = [17, 14, 15, 10, 7, 4, 0];

// 7-дневный ряд Symptom Score. current — текущий overall (0 → дефолт 46).
export function weeklyScores(current) {
  const base = current > 0 ? current : 46;
  return OFFSETS.map((o) => Math.max(3, Math.min(97, Math.round(base + o))));
}
