import type { CalendarEvent, CalendarEventDraft } from '@/types/event';

export type EventErrorCode = 'not-found' | 'permission-denied' | 'unknown';

export class EventError extends Error {
  constructor(
    public readonly code: EventErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'EventError';
  }
}

export interface EventRepository {
  listByUser(userId: string): Promise<CalendarEvent[]>;
  create(userId: string, draft: CalendarEventDraft): Promise<CalendarEvent>;
  update(eventId: string, draft: CalendarEventDraft): Promise<CalendarEvent>;
  remove(eventId: string): Promise<void>;
}