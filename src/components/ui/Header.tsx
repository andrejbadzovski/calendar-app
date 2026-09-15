import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { colors, spacing } from '@/theme';

type Props = {
  title: string;
  right?: React.ReactNode;
};

export function Header({ title, right }: Props) {
  return (
    <View style={styles.container} accessibilityRole="header">
      <Text variant="h2" numberOfLines={1} style={styles.title}>
        {title}
      </Text>
      {right !== undefined && <View style={styles.right}>{right}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 56,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    marginBottom: spacing.md,
  },
  title: {
    flex: 1,
  },
  right: {
    marginLeft: spacing.md,
  },
});
