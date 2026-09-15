import React, { useMemo } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/Text';
import {
  formatFullDate,
  getMonthMatrix,
  isSameDay,
  WEEKDAY_LABELS,
  type CalendarDay,
} from '@/utils/date';
import { colors, spacing, radius } from '@/theme';

type Props = {
  visibleMonth: Date;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  eventCountByDate: Record<string, number>;
};

export function MonthGrid({
  visibleMonth,
  selectedDate,
  onSelectDate,
  eventCountByDate,
}: Props) {
  const weeks = useMemo(
    () => getMonthMatrix(visibleMonth.getFullYear(), visibleMonth.getMonth()),
    [visibleMonth],
  );

  return (
    <View>
      <View style={styles.weekdayRow}>
        {WEEKDAY_LABELS.map(label => (
          <View key={label} style={styles.cell}>
            <Text variant="caption" color="textSecondary">
              {label}
            </Text>
          </View>
        ))}
      </View>

      {weeks.map((week, weekIndex) => (
        <View key={weekIndex} style={styles.weekRow}>
          {week.map(day => (
            <DayCell
              key={day.dateKey}
              day={day}
              isSelected={isSameDay(day.date, selectedDate)}
              eventCount={eventCountByDate[day.dateKey] ?? 0}
              onPress={onSelectDate}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

type DayCellProps = {
  day: CalendarDay;
  isSelected: boolean;
  eventCount: number;
  onPress: (date: Date) => void;
};

const DayCell = React.memo(function DayCell({
  day,
  isSelected,
  eventCount,
  onPress,
}: DayCellProps) {
  return (
    <Pressable
      style={styles.cell}
      onPress={() => onPress(day.date)}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={`${formatFullDate(day.date)}, ${eventCount} events`}
    >
      <View
        style={[
          styles.dayCircle,
          day.isToday && !isSelected && styles.today,
          isSelected && styles.selected,
        ]}
      >
        <Text
          variant={isSelected || day.isToday ? 'bodyBold' : 'body'}
          color={
            isSelected
              ? 'textInverse'
              : !day.isCurrentMonth
                ? 'textDisabled'
                : day.isWeekend
                  ? 'textSecondary'
                  : 'textPrimary'
          }
        >
          {day.dayOfMonth}
        </Text>
      </View>

      <View style={styles.dotSlot}>
        {eventCount > 0 && <View style={styles.dot} />}
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  weekdayRow: {
    flexDirection: 'row',
    paddingBottom: spacing.sm,
  },
  weekRow: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  today: {
    backgroundColor: colors.primaryLight,
  },
  selected: {
    backgroundColor: colors.primary,
  },
  dotSlot: {
    height: 6,
    marginTop: 2,
    justifyContent: 'center',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
});