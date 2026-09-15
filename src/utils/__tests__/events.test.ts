import { countEventsByDate, groupEventsByDate, sortByStart } from '../events';
import type { CalendarEvent } from '@/types/event';

function makeEvent(id: string, start: Date, durationMinutes = 30): CalendarEvent {
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
  return {
    id,
    userId: 'user-1',
    title: `Event ${id}`,
    description: '',
    startsAt: start.toISOString(),
    endsAt: end.toISOString(),
    createdAt: start.toISOString(),
    updatedAt: start.toISOString(),
  };
}

describe('groupEventsByDate', () => {
  it('groups events under their local date key', () => {
    const events = [
      makeEvent('a', new Date(2026, 8, 14, 9)),
      makeEvent('b', new Date(2026, 8, 14, 15)),
      makeEvent('c', new Date(2026, 8, 15, 9)),
    ];

    const grouped = groupEventsByDate(events);

    expect(Object.keys(grouped).sort()).toEqual(['2026-09-14', '2026-09-15']);
    expect(grouped['2026-09-14']).toHaveLength(2);
    expect(grouped['2026-09-15']).toHaveLength(1);
  });

  it('returns an empty object for no events', () => {
    expect(groupEventsByDate([])).toEqual({});
  });

  it('keeps events on the correct day late in the evening', () => {
    const grouped = groupEventsByDate([makeEvent('a', new Date(2026, 8, 14, 23, 45))]);
    expect(Object.keys(grouped)).toEqual(['2026-09-14']);
  });
});

describe('countEventsByDate', () => {
  it('counts events per day', () => {
    const events = [
      makeEvent('a', new Date(2026, 8, 14, 9)),
      makeEvent('b', new Date(2026, 8, 14, 15)),
      makeEvent('c', new Date(2026, 8, 20, 9)),
    ];

    expect(countEventsByDate(events)).toEqual({
      '2026-09-14': 2,
      '2026-09-20': 1,
    });
  });

  it('returns an empty object for no events', () => {
    expect(countEventsByDate([])).toEqual({});
  });
});

describe('sortByStart', () => {
  it('orders events chronologically', () => {
    const later = makeEvent('later', new Date(2026, 8, 14, 16));
    const earlier = makeEvent('earlier', new Date(2026, 8, 14, 8));

    expect(sortByStart([later, earlier]).map(event => event.id)).toEqual([
      'earlier',
      'later',
    ]);
  });

  it('does not mutate the input array', () => {
    const events = [
      makeEvent('later', new Date(2026, 8, 14, 16)),
      makeEvent('earlier', new Date(2026, 8, 14, 8)),
    ];
    const original = [...events];

    sortByStart(events);

    expect(events).toEqual(original);
  });

  it('handles an empty list', () => {
    expect(sortByStart([])).toEqual([]);
  });
});
