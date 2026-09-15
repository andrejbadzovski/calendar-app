import {
  addDays,
  addMonths,
  combineDateAndTime,
  getDaysInMonth,
  getMonthMatrix,
  getWeekdayIndex,
  isSameDay,
  timeFromISO,
  toDateKey,
  DAYS_IN_WEEK,
  WEEKS_IN_GRID,
} from '../date';

describe('toDateKey', () => {
  it('formats a date as YYYY-MM-DD with zero padding', () => {
    expect(toDateKey(new Date(2026, 0, 5))).toBe('2026-01-05');
  });

  it('uses local date parts rather than UTC', () => {
    const lateEvening = new Date(2026, 8, 14, 23, 30);
    expect(toDateKey(lateEvening)).toBe('2026-09-14');
  });
});

describe('getDaysInMonth', () => {
  it('returns 31 for January', () => {
    expect(getDaysInMonth(2026, 0)).toBe(31);
  });

  it('returns 30 for April', () => {
    expect(getDaysInMonth(2026, 3)).toBe(30);
  });

  it('returns 28 for February in a common year', () => {
    expect(getDaysInMonth(2026, 1)).toBe(28);
  });

  it('returns 29 for February in a leap year', () => {
    expect(getDaysInMonth(2024, 1)).toBe(29);
  });

  it('returns 28 for February in a century non-leap year', () => {
    expect(getDaysInMonth(1900, 1)).toBe(28);
  });
});

describe('getWeekdayIndex', () => {
  it('treats Monday as the first day of the week', () => {
    expect(getWeekdayIndex(new Date(2026, 8, 14))).toBe(0);
  });

  it('treats Sunday as the last day of the week', () => {
    expect(getWeekdayIndex(new Date(2026, 8, 20))).toBe(6);
  });
});

describe('isSameDay', () => {
  it('ignores the time component', () => {
    expect(isSameDay(new Date(2026, 8, 14, 1), new Date(2026, 8, 14, 23))).toBe(true);
  });

  it('distinguishes different days', () => {
    expect(isSameDay(new Date(2026, 8, 14), new Date(2026, 8, 15))).toBe(false);
  });

  it('distinguishes the same day in different years', () => {
    expect(isSameDay(new Date(2026, 8, 14), new Date(2025, 8, 14))).toBe(false);
  });
});

describe('addDays', () => {
  it('rolls over into the next month', () => {
    expect(toDateKey(addDays(new Date(2026, 8, 30), 1))).toBe('2026-10-01');
  });

  it('rolls back into the previous year', () => {
    expect(toDateKey(addDays(new Date(2026, 0, 1), -1))).toBe('2025-12-31');
  });

  it('handles a leap day', () => {
    expect(toDateKey(addDays(new Date(2024, 1, 28), 1))).toBe('2024-02-29');
  });
});

describe('addMonths', () => {
  it('moves forward across a year boundary', () => {
    expect(toDateKey(addMonths(new Date(2026, 11, 15), 1))).toBe('2027-01-01');
  });

  it('moves backward across a year boundary', () => {
    expect(toDateKey(addMonths(new Date(2026, 0, 15), -1))).toBe('2025-12-01');
  });
});

describe('getMonthMatrix', () => {
  it('always returns a six by seven grid', () => {
    const weeks = getMonthMatrix(2026, 8);
    expect(weeks).toHaveLength(WEEKS_IN_GRID);
    weeks.forEach(week => expect(week).toHaveLength(DAYS_IN_WEEK));
  });

  it('starts the grid on a Monday', () => {
    const weeks = getMonthMatrix(2026, 8);
    const firstCell = weeks[0]?.[0];
    expect(firstCell).toBeDefined();
    expect(getWeekdayIndex(firstCell!.date)).toBe(0);
  });

  it('marks leading days from the previous month', () => {
    const weeks = getMonthMatrix(2026, 8);
    const firstCell = weeks[0]?.[0];
    expect(firstCell?.isCurrentMonth).toBe(false);
    expect(firstCell?.dateKey).toBe('2026-08-31');
  });

  it('contains every day of the target month exactly once', () => {
    const weeks = getMonthMatrix(2026, 8);
    const currentMonthDays = weeks
      .flat()
      .filter(day => day.isCurrentMonth)
      .map(day => day.dayOfMonth);

    expect(currentMonthDays).toHaveLength(30);
    expect(new Set(currentMonthDays).size).toBe(30);
  });

  it('handles February in a leap year', () => {
    const weeks = getMonthMatrix(2024, 1);
    const days = weeks.flat().filter(day => day.isCurrentMonth);
    expect(days).toHaveLength(29);
  });

  it('handles a month that begins on a Sunday', () => {
    const weeks = getMonthMatrix(2026, 10);
    const days = weeks.flat().filter(day => day.isCurrentMonth);
    expect(days).toHaveLength(30);
    expect(weeks).toHaveLength(WEEKS_IN_GRID);
  });

  it('produces unique keys for every cell', () => {
    const keys = getMonthMatrix(2026, 8).flat().map(day => day.dateKey);
    expect(new Set(keys).size).toBe(WEEKS_IN_GRID * DAYS_IN_WEEK);
  });

  it('flags weekend cells', () => {
    const weeks = getMonthMatrix(2026, 8);
    const firstWeek = weeks[0];
    expect(firstWeek?.[5]?.isWeekend).toBe(true);
    expect(firstWeek?.[6]?.isWeekend).toBe(true);
    expect(firstWeek?.[0]?.isWeekend).toBe(false);
  });
});

describe('combineDateAndTime', () => {
  it('applies the time to the given date', () => {
    const result = combineDateAndTime(new Date(2026, 8, 14), '14:30');
    expect(result.getHours()).toBe(14);
    expect(result.getMinutes()).toBe(30);
    expect(toDateKey(result)).toBe('2026-09-14');
  });

  it('handles midnight', () => {
    const result = combineDateAndTime(new Date(2026, 8, 14), '00:00');
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
  });
});

describe('timeFromISO', () => {
  it('formats an ISO string as zero padded local time', () => {
    const iso = new Date(2026, 8, 14, 9, 5).toISOString();
    expect(timeFromISO(iso)).toBe('09:05');
  });

  it('round trips with combineDateAndTime', () => {
    const date = new Date(2026, 8, 14);
    const combined = combineDateAndTime(date, '16:45');
    expect(timeFromISO(combined.toISOString())).toBe('16:45');
  });
});
