import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from '@firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '@/services/firebase';
import {
  AuthError,
  type AuthCredentials,
  type AuthErrorCode,
  type AuthRepository,
  type AuthSession,
} from './authRepository';
import type { User } from '@/types/user';

function toUser(firebaseUser: FirebaseUser): User {
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email ?? '',
    createdAt: firebaseUser.metadata.creationTime,
  };
}

async function toSession(firebaseUser: FirebaseUser): Promise<AuthSession> {
  return {
    user: toUser(firebaseUser),
    token: await firebaseUser.getIdToken(),
  };
}

function mapError(error: unknown): AuthError {
  if (!(error instanceof FirebaseError)) {
    return new AuthError('unknown', 'Something went wrong. Please try again.');
  }

  const mapping: Record<string, { code: AuthErrorCode; message: string }> = {
    'auth/email-already-in-use': {
      code: 'email-already-in-use',
      message: 'An account with this email already exists',
    },
    'auth/weak-password': {
      code: 'weak-password',
      message: 'Password is too weak',
    },
    'auth/invalid-email': {
      code: 'invalid-credentials',
      message: 'Incorrect email or password',
    },
    'auth/user-not-found': {
      code: 'invalid-credentials',
      message: 'Incorrect email or password',
    },
    'auth/wrong-password': {
      code: 'invalid-credentials',
      message: 'Incorrect email or password',
    },
    'auth/invalid-credential': {
      code: 'invalid-credentials',
      message: 'Incorrect email or password',
    },
    'auth/network-request-failed': {
      code: 'unknown',
      message: 'Network error. Check your connection and try again.',
    },
  };

  const mapped = mapping[error.code];
  return mapped
    ? new AuthError(mapped.code, mapped.message)
    : new AuthError('unknown', 'Something went wrong. Please try again.');
}

export class FirebaseAuthRepository implements AuthRepository {
  async signUp({ email, password }: AuthCredentials): Promise<AuthSession> {
    try {
      const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      return await toSession(credential.user);
    } catch (error) {
      throw mapError(error);
    }
  }

  async signIn({ email, password }: AuthCredentials): Promise<AuthSession> {
    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      return await toSession(credential.user);
    } catch (error) {
      throw mapError(error);
    }
  }

  async signOut(): Promise<void> {
    await firebaseSignOut(auth);
  }

  /**
   * Firebase restores the persisted session asynchronously on startup.
   * We wait for the first auth-state emission, then unsubscribe.
   * The timeout guarantees the app never hangs on a slow or unreachable
   * network — the user lands on the sign-in screen instead of a frozen splash.
   */
  async restoreSession(): Promise<AuthSession | null> {
    const RESTORE_TIMEOUT_MS = 8000;

    const firebaseUser = await new Promise<FirebaseUser | null>(resolve => {
      const timeoutId = setTimeout(() => {
        unsubscribe();
        resolve(null);
      }, RESTORE_TIMEOUT_MS);

      const unsubscribe = onAuthStateChanged(auth, user => {
        clearTimeout(timeoutId);
        unsubscribe();
        resolve(user);
      });
    });

    return firebaseUser ? toSession(firebaseUser) : null;
  }
}