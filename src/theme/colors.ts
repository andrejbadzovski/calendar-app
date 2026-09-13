export const colors = {
  primary: '#4F46E5',
  primaryDark: '#4338CA',
  primaryLight: '#EEF2FF',

  background: '#FFFFFF',
  surface: '#F9FAFB',
  border: '#E5E7EB',

  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textDisabled: '#9CA3AF',
  textInverse: '#FFFFFF',

  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',

  overlay: 'rgba(17, 24, 39, 0.5)',
} as const;

export type ColorToken = keyof typeof colors;