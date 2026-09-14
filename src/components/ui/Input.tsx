import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  type TextInputProps,
} from 'react-native';
import { Text } from './Text';
import { colors, spacing, radius, typography } from '@/theme';

type TextInputRef = React.ComponentRef<typeof TextInput>;
type FocusHandler = NonNullable<TextInputProps['onFocus']>;
type BlurHandler = NonNullable<TextInputProps['onBlur']>;

type Props = TextInputProps & {
  label: string;
  error?: string;
  ref?: React.Ref<TextInputRef>;
};

export function Input({ label, error, onFocus, onBlur, style, ref, ...rest }: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const hasError = Boolean(error);

  const handleFocus: FocusHandler = e => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur: BlurHandler = e => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <View style={styles.container}>
      <Text variant="label" color="textSecondary" style={styles.label}>
        {label}
      </Text>

      <TextInput
        ref={ref}
        style={[
          styles.input,
          isFocused && styles.inputFocused,
          hasError && styles.inputError,
          style,
        ]}
        placeholderTextColor={colors.textDisabled}
        onFocus={handleFocus}
        onBlur={handleBlur}
        accessibilityLabel={label}
        {...rest}
      />

      <View style={styles.errorSlot}>
        {hasError && (
          <Text variant="caption" color="error">
            {error}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
  },
  label: {
    marginBottom: spacing.xs,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    ...typography.body,
  },
  inputFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.background,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorSlot: {
    minHeight: 18,
    marginTop: spacing.xs,
  },
});