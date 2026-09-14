import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/Text';
import { colors, spacing, radius } from '@/theme';

export type CalendarViewMode = 'month' | 'day';

type Props = {
  title: string;
  viewMode: CalendarViewMode;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onChangeViewMode: (mode: CalendarViewMode) => void;
};

export function CalendarHeader({
  title,
  viewMode,
  onPrevious,
  onNext,
  onToday,
  onChangeViewMode,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Pressable
          onPress={onPrevious}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Previous"
        >
          <Text variant="h3" color="primary">
            {'‹'}
          </Text>
        </Pressable>

        <Pressable onPress={onToday} accessibilityRole="button">
          <Text variant="h3">{title}</Text>
        </Pressable>

        <Pressable
          onPress={onNext}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Next"
        >
          <Text variant="h3" color="primary">
            {'›'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.toggle}>
        {(['month', 'day'] as const).map(mode => {
          const isActive = viewMode === mode;
          return (
            <Pressable
              key={mode}
              onPress={() => onChangeViewMode(mode)}
              style={[styles.toggleOption, isActive && styles.toggleOptionActive]}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
            >
              <Text
                variant={isActive ? 'bodyBold' : 'body'}
                color={isActive ? 'textInverse' : 'textSecondary'}
              >
                {mode === 'month' ? 'Month' : 'Day'}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  toggle: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    padding: 3,
  },
  toggleOption: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.full,
  },
  toggleOptionActive: {
    backgroundColor: colors.primary,
  },
});