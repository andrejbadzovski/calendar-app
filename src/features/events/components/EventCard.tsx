import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/Text';
import { formatTime } from '@/utils/date';
import { colors, spacing, radius } from '@/theme';
import type { CalendarEvent } from '@/types/event';

type Props = {
  event: CalendarEvent;
  onPress: (event: CalendarEvent) => void;
};

export function EventCard({ event, onPress }: Props) {
  const start = new Date(event.startsAt);
  const end = new Date(event.endsAt);

  return (
    <Pressable
      onPress={() => onPress(event)}
      accessibilityRole="button"
      accessibilityLabel={`${event.title} at ${formatTime(start)}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.accent} />
      <View style={styles.content}>
        <Text variant="bodyBold" numberOfLines={1}>
          {event.title}
        </Text>
        <Text variant="caption" color="textSecondary">
          {formatTime(start)} – {formatTime(end)}
        </Text>
        {event.description.length > 0 && (
          <Text variant="caption" color="textSecondary" numberOfLines={2} style={styles.description}>
            {event.description}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.7,
  },
  accent: {
    width: 4,
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  description: {
    marginTop: spacing.xs,
  },
});