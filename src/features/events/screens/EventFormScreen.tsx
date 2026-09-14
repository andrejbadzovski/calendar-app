import React, { useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/features/auth/AuthContext';
import { eventRepository } from '@/repositories';
import { EventError } from '@/repositories/eventRepository';
import { combineDateAndTime, formatFullDate, timeFromISO } from '@/utils/date';
import {
  validateEventTitle,
  validateTime,
  validateTimeRange,
} from '@/utils/validation';
import type { AppStackParamList } from '@/navigation/types';
import { spacing } from '@/theme';

type NavigationProp = NativeStackNavigationProp<AppStackParamList, 'EventForm'>;
type ScreenRoute = RouteProp<AppStackParamList, 'EventForm'>;

type FormErrors = {
  title?: string;
  startTime?: string;
  endTime?: string;
  form?: string;
};

export function EventFormScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ScreenRoute>();
  const { user } = useAuth();

  const existingEvent = route.params?.event;
  const isEditing = existingEvent !== undefined;

  const eventDate = useMemo(() => {
    if (existingEvent) {
      return new Date(existingEvent.startsAt);
    }
    return route.params?.dateISO ? new Date(route.params.dateISO) : new Date();
  }, [existingEvent, route.params?.dateISO]);

  const [title, setTitle] = useState(existingEvent?.title ?? '');
  const [description, setDescription] = useState(existingEvent?.description ?? '');
  const [startTime, setStartTime] = useState(
    existingEvent ? timeFromISO(existingEvent.startsAt) : '09:00',
  );
  const [endTime, setEndTime] = useState(
    existingEvent ? timeFromISO(existingEvent.endsAt) : '10:00',
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async () => {
    if (!user) {
      return;
    }

    const titleResult = validateEventTitle(title);
    const startResult = validateTime(startTime);
    const endResult = validateTime(endTime);
    const rangeResult = validateTimeRange(startTime, endTime);

    if (
      !titleResult.isValid ||
      !startResult.isValid ||
      !endResult.isValid ||
      !rangeResult.isValid
    ) {
      setErrors({
        title: titleResult.error,
        startTime: startResult.error,
        endTime: endResult.error ?? rangeResult.error,
      });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const draft = {
      title: title.trim(),
      description: description.trim(),
      startsAt: combineDateAndTime(eventDate, startTime).toISOString(),
      endsAt: combineDateAndTime(eventDate, endTime).toISOString(),
    };

    try {
      if (isEditing) {
        await eventRepository.update(existingEvent.id, draft);
      } else {
        await eventRepository.create(user.id, draft);
      }
      navigation.goBack();
    } catch (caught) {
      setErrors({
        form: caught instanceof EventError ? caught.message : 'Could not save the event',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!existingEvent) {
      return;
    }

    setIsDeleting(true);
    try {
      await eventRepository.remove(existingEvent.id);
      navigation.goBack();
    } catch (caught) {
      setErrors({
        form: caught instanceof EventError ? caught.message : 'Could not delete the event',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Screen keyboardAvoiding scrollable edges={['bottom']}>
      <View style={styles.container}>
        <Text variant="label" color="textSecondary">
          {formatFullDate(eventDate).toUpperCase()}
        </Text>

        <Input
          label="Title"
          value={title}
          onChangeText={setTitle}
          error={errors.title}
          placeholder="Team standup"
          autoCapitalize="sentences"
        />

        <Input
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Optional details"
          multiline
          numberOfLines={3}
          style={styles.multiline}
        />

        <View style={styles.timeRow}>
          <View style={styles.timeField}>
            <Input
              label="Start"
              value={startTime}
              onChangeText={setStartTime}
              error={errors.startTime}
              placeholder="09:00"
              keyboardType="numbers-and-punctuation"
              maxLength={5}
            />
          </View>
          <View style={styles.timeField}>
            <Input
              label="End"
              value={endTime}
              onChangeText={setEndTime}
              error={errors.endTime}
              placeholder="10:00"
              keyboardType="numbers-and-punctuation"
              maxLength={5}
            />
          </View>
        </View>

        {errors.form !== undefined && (
          <Text variant="caption" color="error" style={styles.formError}>
            {errors.form}
          </Text>
        )}

        <Button
          label={isEditing ? 'Save changes' : 'Create event'}
          onPress={handleSubmit}
          loading={isSubmitting}
        />

        {isEditing && (
          <Button
            label="Delete event"
            variant="ghost"
            onPress={handleDelete}
            loading={isDeleting}
          />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
    paddingVertical: spacing.lg,
  },
  multiline: {
    height: 96,
    paddingTop: spacing.md,
    textAlignVertical: 'top',
  },
  timeRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  timeField: {
    flex: 1,
  },
  formError: {
    marginBottom: spacing.sm,
  },
});