import { act, renderHook, waitFor } from '@testing-library/react-native';
import { useEvents } from '../useEvents';
import { eventRepository } from '@/repositories';
import { EventError } from '@/repositories/eventRepository';
import type { CalendarEvent } from '@/types/event';

jest.mock('@/repositories', () => ({
  eventRepository: {
    listByUser: jest.fn(),
  },
}));

const listByUser = eventRepository.listByUser as jest.MockedFunction<
  typeof eventRepository.listByUser
>;

function makeEvent(id: string, start: Date): CalendarEvent {
  return {
    id,
    userId: 'user-1',
    title: `Event ${id}`,
    description: '',
    startsAt: start.toISOString(),
    endsAt: start.toISOString(),
    createdAt: start.toISOString(),
    updatedAt: start.toISOString(),
  };
}

describe('useEvents', () => {
  beforeEach(() => {
    listByUser.mockReset();
  });

  it('loads events for the given user', async () => {
    listByUser.mockResolvedValue([makeEvent('a', new Date(2026, 8, 14, 9))]);

    const { result } = renderHook(() => useEvents('user-1'));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(listByUser).toHaveBeenCalledWith('user-1');
    expect(result.current.events).toHaveLength(1);
    expect(result.current.error).toBeNull();
  });

  it('derives event counts per day', async () => {
    listByUser.mockResolvedValue([
      makeEvent('a', new Date(2026, 8, 14, 9)),
      makeEvent('b', new Date(2026, 8, 14, 15)),
    ]);

    const { result } = renderHook(() => useEvents('user-1'));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.eventCountByDate).toEqual({ '2026-09-14': 2 });
    expect(result.current.eventsByDate['2026-09-14']).toHaveLength(2);
  });

  it('does not query when there is no user', async () => {
    const { result } = renderHook(() => useEvents(undefined));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(listByUser).not.toHaveBeenCalled();
    expect(result.current.events).toEqual([]);
  });

  it('exposes a friendly message when loading fails', async () => {
    listByUser.mockRejectedValue(
      new EventError('permission-denied', 'You do not have access to this event'),
    );

    const { result } = renderHook(() => useEvents('user-1'));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBe('You do not have access to this event');
    expect(result.current.events).toEqual([]);
  });

  it('falls back to a generic message for unknown failures', async () => {
    listByUser.mockRejectedValue(new Error('boom'));

    const { result } = renderHook(() => useEvents('user-1'));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBe('Could not load events');
  });

  it('refetches on demand', async () => {
    listByUser.mockResolvedValue([]);

    const { result } = renderHook(() => useEvents('user-1'));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    listByUser.mockResolvedValue([makeEvent('a', new Date(2026, 8, 14, 9))]);
    await act(async () => {
      await result.current.refresh();
    });

    await waitFor(() => expect(result.current.events).toHaveLength(1));
    expect(listByUser).toHaveBeenCalledTimes(2);
  });
});
