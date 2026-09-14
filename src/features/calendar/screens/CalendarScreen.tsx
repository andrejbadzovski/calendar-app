import React from 'react';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';

export function CalendarScreen() {
  return (
    <Screen edges={['top']}>
      <Text variant="h1">Calendar</Text>
    </Screen>
  );
}