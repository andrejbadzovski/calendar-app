import { useCallback, useEffect, useMemo, useState } from 'react';
import { eventRepository } from '@/repositories';
import { EventError } from '@/repositories/eventRepository';
import { countEventsByDate, groupEventsByDate } from '@/utils/events';
import type { CalendarEvent } from '@/types/event';

export function useEvents(userId: string | undefined) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!userId) {
      setEvents([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const result = await eventRepository.listByUser(userId);
      setEvents(result);
    } catch (caught) {
      setError(
        caught instanceof EventError ? caught.message : 'Could not load events',
      );
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const eventsByDate = useMemo(() => groupEventsByDate(events), [events]);
  const eventCountByDate = useMemo(() => countEventsByDate(events), [events]);

  return { events, eventsByDate, eventCountByDate, isLoading, error, refresh };
}