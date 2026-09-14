import { FirebaseAuthRepository } from './firebaseAuthRepository';
import { FirestoreEventRepository } from './firestoreEventRepository';
import type { AuthRepository } from './authRepository';
import type { EventRepository } from './eventRepository';

export const authRepository: AuthRepository = new FirebaseAuthRepository();
export const eventRepository: EventRepository = new FirestoreEventRepository();