import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { MonthGrid } from '../components/MonthGrid';
import { CalendarHeader, type CalendarViewMode } from '../components/CalendarHeader';
import { addDays, addMonths, formatFullDate, formatMonthYear } from '@/utils/date';
import { spacing } from '@/theme';

export function CalendarScreen() {
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');
  const [visibleMonth, setVisibleMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const handlePrevious = () => {
    if (viewMode === 'month') {
      setVisibleMonth(current => addMonths(current, -1));
    } else {
      setSelectedDate(current => addDays(current, -1));
    }
  };

  const handleNext = () => {
    if (viewMode === 'month') {
      setVisibleMonth(current => addMonths(current, 1));
    } else {
      setSelectedDate(current => addDays(current, 1));
    }
  };

  const handleToday = () => {
    const today = new Date();
    setVisibleMonth(today);
    setSelectedDate(today);
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setVisibleMonth(date);
  };

  const title =
    viewMode === 'month' ? formatMonthYear(visibleMonth) : formatFullDate(selectedDate);

  return (
    <Screen edges={['top']}>
      <CalendarHeader
        title={title}
        viewMode={viewMode}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onToday={handleToday}
        onChangeViewMode={setViewMode}
      />

      {viewMode === 'month' && (
        <MonthGrid
          visibleMonth={visibleMonth}
          selectedDate={selectedDate}
          onSelectDate={handleSelectDate}
          eventCountByDate={{}}
        />
      )}

      <View style={styles.agenda}>
        <Text variant="label" color="textSecondary">
          {formatFullDate(selectedDate).toUpperCase()}
        </Text>
        <Text variant="body" color="textSecondary" style={styles.empty}>
          No events for this day
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  agenda: {
    flex: 1,
    paddingTop: spacing.lg,
  },
  empty: {
    paddingTop: spacing.md,
  },
});