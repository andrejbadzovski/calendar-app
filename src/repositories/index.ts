import { FirebaseAuthRepository } from './firebaseAuthRepository';
import type { AuthRepository } from './authRepository';

export const authRepository: AuthRepository = new FirebaseAuthRepository();