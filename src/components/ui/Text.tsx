import React from 'react';
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';
import { colors, typography, type ColorToken, type TypographyVariant } from '@/theme';

type Props = RNTextProps & {
  variant?: TypographyVariant;
  color?: ColorToken;
};

export function Text({
  variant = 'body',
  color = 'textPrimary',
  style,
  ...rest
}: Props) {
  return <RNText style={[typography[variant], { color: colors[color] }, style]} {...rest} />;
}