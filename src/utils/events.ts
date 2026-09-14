import { toDateKey } from './date';
import type { CalendarEvent } from '@/types/event';

export function groupEventsByDate(
  events: CalendarEvent[],
): Record<string, CalendarEvent[]> {
  const grouped: Record<string, CalendarEvent[]> = {};

  for (const event of events) {
    const key = toDateKey(new Date(event.startsAt));
    const bucket = grouped[key];
    if (bucket) {
      bucket.push(event);
    } else {
      grouped[key] = [event];
    }
  }

  return grouped;
}

export function countEventsByDate(
  events: CalendarEvent[],
): Record<string, number> {
  const counts: Record<string, number> = {};

  for (const event of events) {
    const key = toDateKey(new Date(event.startsAt));
    counts[key] = (counts[key] ?? 0) + 1;
  }

  return counts;
}

export function sortByStart(events: CalendarEvent[]): CalendarEvent[] {
  return [...events].sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}