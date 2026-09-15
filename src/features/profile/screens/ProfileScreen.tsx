import React, { useEffect, useState } from 'react';
import { View, Switch, StyleSheet } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/features/auth/AuthContext';
import {
  checkBiometricAvailability,
  type BiometricAvailability,
} from '@/services/biometrics';
import { colors, spacing, radius } from '@/theme';

export function ProfileScreen() {
  const { user, signOut, biometricsEnabled, toggleBiometrics } = useAuth();
  const [availability, setAvailability] = useState<BiometricAvailability | null>(null);

  useEffect(() => {
    void checkBiometricAvailability().then(setAvailability);
  }, []);

  const canUseBiometrics = availability?.isAvailable === true;
  const biometricLabel = availability?.label ?? 'Biometrics';

  return (
    <Screen edges={['top']}>
      <Text variant="h1" style={styles.title}>
        Profile
      </Text>

      <View style={styles.card}>
        <Text variant="caption" color="textSecondary">
          SIGNED IN AS
        </Text>
        <Text variant="bodyBold" style={styles.email}>
          {user?.email}
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text variant="bodyBold">Unlock with {biometricLabel}</Text>
            <Text variant="caption" color="textSecondary">
              {canUseBiometrics
                ? 'Require authentication when reopening the app'
                : 'Not available on this device'}
            </Text>
          </View>
          <Switch
            value={biometricsEnabled}
            onValueChange={toggleBiometrics}
            disabled={!canUseBiometrics}
            trackColor={{ true: colors.primary, false: colors.border }}
          />
        </View>
      </View>

      <Button label="Sign Out" variant="secondary" onPress={signOut} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  email: {
    marginTop: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  rowText: {
    flex: 1,
  },
});