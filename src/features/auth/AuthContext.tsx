import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { authRepository } from '@/repositories';
import type { User } from '@/types/user';
import { promptBiometrics } from '@/services/biometrics';
import { isBiometricsEnabled, setBiometricsEnabled } from '@/services/preferences';

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLocked: boolean;
  biometricsEnabled: boolean;
  unlockWithBiometrics: () => Promise<boolean>;
  toggleBiometrics: (enabled: boolean) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [biometricsEnabled, setBiometricsEnabledState] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const restore = async () => {
      try {
        const [session, enabled] = await Promise.all([
          authRepository.restoreSession(),
          isBiometricsEnabled(),
        ]);

        if (!isMounted) {
          return;
        }

        setUser(session?.user ?? null);
        setBiometricsEnabledState(enabled);
        setIsLocked(session !== null && enabled);
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void restore();

    return () => {
      isMounted = false;
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const session = await authRepository.signIn({ email, password });
    setUser(session.user);
    setIsLocked(false);
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const session = await authRepository.signUp({ email, password });
    setUser(session.user);
    setIsLocked(false);
  }, []);

  const signOut = useCallback(async () => {
    await authRepository.signOut();
    setUser(null);
    setIsLocked(false);
  }, []);

  const unlockWithBiometrics = useCallback(async () => {
    const success = await promptBiometrics('Unlock your calendar');
    if (success) {
      setIsLocked(false);
    }
    return success;
  }, []);

  const toggleBiometrics = useCallback(async (enabled: boolean) => {
    await setBiometricsEnabled(enabled);
    setBiometricsEnabledState(enabled);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: user !== null,
      signIn,
      signUp,
      signOut,
      isLocked,
      biometricsEnabled,
      unlockWithBiometrics,
      toggleBiometrics,
    }),
    [
      user,
      isLoading,
      signIn,
      signUp,
      signOut,
      isLocked,
      biometricsEnabled,
      unlockWithBiometrics,
      toggleBiometrics,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}