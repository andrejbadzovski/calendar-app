import React, { useMemo, useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { Header } from '@/components/ui/Header';
import { MonthGrid } from '../components/MonthGrid';
import { CalendarHeader, type CalendarViewMode } from '../components/CalendarHeader';
import { EventList } from '@/features/events/components/EventList';
import { useEvents } from '@/features/events/hooks/useEvents';
import { useAuth } from '@/features/auth/AuthContext';
import { addDays, addMonths, formatFullDate, formatMonthYear, toDateKey } from '@/utils/date';
import { sortByStart } from '@/utils/events';
import { spacing } from '@/theme';
import type { CalendarEvent } from '@/types/event';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button } from '@/components/ui/Button';
import type { AppStackParamList } from '@/navigation/types';

export function CalendarScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');
  const [visibleMonth, setVisibleMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const { eventsByDate, eventCountByDate, isLoading, error, refresh } = useEvents(user?.id);
    useFocusEffect(
    React.useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  const selectedEvents = useMemo(() => {
    const key = toDateKey(selectedDate);
    return sortByStart(eventsByDate[key] ?? []);
  }, [eventsByDate, selectedDate]);

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

  const handleSelectEvent = (event: CalendarEvent) => {
    navigation.navigate('EventForm', { event });
  };

  const handleCreateEvent = () => {
    navigation.navigate('EventForm', { dateISO: selectedDate.toISOString() });
  };

  const title =
    viewMode === 'month' ? formatMonthYear(visibleMonth) : formatFullDate(selectedDate);

  return (
    <Screen edges={['top']}>
      <Header
        title="Calendar"
        right={
          <Pressable
            onPress={handleToday}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Jump to today"
          >
            <Text variant="label" color="primary">
              Today
            </Text>
          </Pressable>
        }
      />

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
          eventCountByDate={eventCountByDate}
        />
      )}

      <View style={styles.agenda}>
        <Text variant="label" color="textSecondary" style={styles.agendaTitle}>
          {formatFullDate(selectedDate).toUpperCase()}
        </Text>
        <EventList
          events={selectedEvents}
          isLoading={isLoading}
          error={error}
          onSelectEvent={handleSelectEvent}
          onRefresh={refresh}
        />
      </View>
      <Button label="Add event" onPress={handleCreateEvent} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  agenda: {
    flex: 1,
    paddingTop: spacing.lg,
  },
  agendaTitle: {
    paddingBottom: spacing.sm,
  },
});