export type DateKey = string;

export type CalendarDay = {
  date: Date;
  dateKey: DateKey;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
};

export const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export const WEEKS_IN_GRID = 6;
export const DAYS_IN_WEEK = 7;

function pad(value: number): string {
  return value < 10 ? `0${value}` : `${value}`;
}

export function toDateKey(date: Date): DateKey {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

export function addDays(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

export function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

export function getWeekdayIndex(date: Date): number {
  return (date.getDay() + 6) % 7;
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getMonthMatrix(year: number, month: number): CalendarDay[][] {
  const firstOfMonth = new Date(year, month, 1);
  const leadingDays = getWeekdayIndex(firstOfMonth);
  const gridStart = addDays(firstOfMonth, -leadingDays);

  const weeks: CalendarDay[][] = [];

  for (let week = 0; week < WEEKS_IN_GRID; week += 1) {
    const days: CalendarDay[] = [];

    for (let day = 0; day < DAYS_IN_WEEK; day += 1) {
      const date = addDays(gridStart, week * DAYS_IN_WEEK + day);
      days.push({
        date,
        dateKey: toDateKey(date),
        dayOfMonth: date.getDate(),
        isCurrentMonth: date.getMonth() === month,
        isToday: isToday(date),
        isWeekend: day >= 5,
      });
    }

    weeks.push(days);
  }

  return weeks;
}

export function formatMonthYear(date: Date): string {
  return `${MONTH_NAMES[date.getMonth()] ?? ''} ${date.getFullYear()}`;
}

export function formatTime(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function formatFullDate(date: Date): string {
  const weekday = WEEKDAY_LABELS[getWeekdayIndex(date)] ?? '';
  return `${weekday}, ${date.getDate()} ${MONTH_NAMES[date.getMonth()] ?? ''}`;
}