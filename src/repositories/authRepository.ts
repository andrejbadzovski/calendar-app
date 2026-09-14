import type { User } from '@/types/user';

export type AuthCredentials = {
  email: string;
  password: string;
};

export type AuthSession = {
  user: User;
  token: string;
};

export type AuthErrorCode =
  | 'email-already-in-use'
  | 'invalid-credentials'
  | 'user-not-found'
  | 'weak-password'
  | 'unknown';

export class AuthError extends Error {
  constructor(
    public readonly code: AuthErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'AuthError';
  }
}


export interface AuthRepository {
  signUp(credentials: AuthCredentials): Promise<AuthSession>;
  signIn(credentials: AuthCredentials): Promise<AuthSession>;
  signOut(): Promise<void>;
  restoreSession(): Promise<AuthSession | null>;
}