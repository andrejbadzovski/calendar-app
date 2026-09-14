import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import { db } from '@/services/firebase';
import {
  EventError,
  type EventErrorCode,
  type EventRepository,
} from './eventRepository';
import type { CalendarEvent, CalendarEventDraft } from '@/types/event';

const COLLECTION = 'events';

function toEvent(snapshot: QueryDocumentSnapshot<DocumentData>): CalendarEvent {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    userId: String(data.userId ?? ''),
    title: String(data.title ?? ''),
    description: String(data.description ?? ''),
    startsAt: String(data.startsAt ?? ''),
    endsAt: String(data.endsAt ?? ''),
    createdAt: String(data.createdAt ?? ''),
    updatedAt: String(data.updatedAt ?? ''),
  };
}

function mapError(error: unknown): EventError {
  if (error instanceof FirebaseError) {
    const mapping: Record<string, { code: EventErrorCode; message: string }> = {
      'permission-denied': {
        code: 'permission-denied',
        message: 'You do not have access to this event',
      },
      unavailable: {
        code: 'unknown',
        message: 'Network error. Check your connection and try again.',
      },
    };
    const mapped = mapping[error.code];
    if (mapped) {
      return new EventError(mapped.code, mapped.message);
    }
  }
  return new EventError('unknown', 'Something went wrong. Please try again.');
}

export class FirestoreEventRepository implements EventRepository {
  async listByUser(userId: string): Promise<CalendarEvent[]> {
    try {
      const eventsQuery = query(
        collection(db, COLLECTION),
        where('userId', '==', userId),
        orderBy('startsAt', 'asc'),
      );
      const snapshot = await getDocs(eventsQuery);
      return snapshot.docs.map(toEvent);
    } catch (error) {
      throw mapError(error);
    }
  }

  async create(userId: string, draft: CalendarEventDraft): Promise<CalendarEvent> {
    try {
      const now = new Date().toISOString();
      const payload = {
        userId,
        title: draft.title,
        description: draft.description,
        startsAt: draft.startsAt,
        endsAt: draft.endsAt,
        createdAt: now,
        updatedAt: now,
      };
      const created = await addDoc(collection(db, COLLECTION), payload);
      return { id: created.id, ...payload };
    } catch (error) {
      throw mapError(error);
    }
  }

  async update(eventId: string, draft: CalendarEventDraft): Promise<CalendarEvent> {
    try {
      const reference = doc(db, COLLECTION, eventId);
      const updatedAt = new Date().toISOString();

      await updateDoc(reference, {
        title: draft.title,
        description: draft.description,
        startsAt: draft.startsAt,
        endsAt: draft.endsAt,
        updatedAt,
      });

      const snapshot = await getDoc(reference);
      if (!snapshot.exists()) {
        throw new EventError('not-found', 'Event no longer exists');
      }
      return toEvent(snapshot as QueryDocumentSnapshot<DocumentData>);
    } catch (error) {
      if (error instanceof EventError) {
        throw error;
      }
      throw mapError(error);
    }
  }

  async remove(eventId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTION, eventId));
    } catch (error) {
      throw mapError(error);
    }
  }
}