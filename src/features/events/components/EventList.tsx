import React from 'react';
import { FlatList, View, ActivityIndicator, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/Text';
import { EventCard } from './EventCard';
import { colors, spacing } from '@/theme';
import type { CalendarEvent } from '@/types/event';

type Props = {
  events: CalendarEvent[];
  isLoading: boolean;
  error: string | null;
  onSelectEvent: (event: CalendarEvent) => void;
  onRefresh: () => void;
};

export function EventList({ events, isLoading, error, onSelectEvent, onRefresh }: Props) {
  if (isLoading && events.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (error !== null) {
    return (
      <View style={styles.centered}>
        <Text variant="body" color="error">
          {error}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={events}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <EventCard event={item} onPress={onSelectEvent} />}
      refreshing={isLoading}
      onRefresh={onRefresh}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
      ListEmptyComponent={
        <View style={styles.centered}>
          <Text variant="body" color="textSecondary">
            No events for this day
          </Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    paddingVertical: spacing.xxl,
    alignItems: 'center',
  },
  content: {
    flexGrow: 1,
    paddingBottom: spacing.xxl,
  },
});