import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useAuth } from '../AuthContext';
import { spacing } from '@/theme';

export function BiometricLockScreen() {
  const { user, unlockWithBiometrics, signOut } = useAuth();
  const [hasFailed, setHasFailed] = useState(false);

  const attemptUnlock = async () => {
    const success = await unlockWithBiometrics();
    setHasFailed(!success);
  };

  useEffect(() => {
    void attemptUnlock();
  }, []);

  return (
    <Screen>
      <View style={styles.container}>
        <Text variant="h1">Welcome back</Text>
        <Text variant="body" color="textSecondary" style={styles.subtitle}>
          {user?.email}
        </Text>

        {hasFailed && (
          <Text variant="caption" color="error" style={styles.error}>
            Authentication failed. Try again or sign out.
          </Text>
        )}

        <Button label="Unlock" onPress={attemptUnlock} />
        <Button label="Sign out" variant="ghost" onPress={signOut} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.sm,
  },
  subtitle: {
    marginBottom: spacing.lg,
  },
  error: {
    marginBottom: spacing.sm,
  },
});