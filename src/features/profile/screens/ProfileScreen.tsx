import React from 'react';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/features/auth/AuthContext';

export function ProfileScreen() {
  const { user, signOut } = useAuth();

  return (
    <Screen edges={['top']}>
      <Text variant="h1">Profile</Text>
      <Text variant="body" color="textSecondary">{user?.email}</Text>
      <Button label="Sign Out" variant="secondary" onPress={signOut} />
    </Screen>
  );
}