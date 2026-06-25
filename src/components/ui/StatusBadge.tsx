import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

type StatusBadgeProps = {
  label: string;
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'info';
};

const TONE_STYLES = {
  default: { bg: colors.surfaceHover, text: colors.textSecondary, border: colors.border },
  success: { bg: colors.successSoft, text: colors.success, border: 'rgba(16, 185, 129, 0.25)' },
  warning: { bg: colors.warningSoft, text: colors.warning, border: 'rgba(245, 158, 11, 0.25)' },
  danger: { bg: colors.dangerSoft, text: colors.danger, border: 'rgba(239, 68, 68, 0.25)' },
  info: { bg: colors.primarySoft, text: colors.primaryBright, border: 'rgba(99, 102, 241, 0.25)' },
} as const;

export function StatusBadge({ label, tone = 'default' }: StatusBadgeProps) {
  const toneStyle = TONE_STYLES[tone];
  return (
    <View style={[styles.badge, { backgroundColor: toneStyle.bg, borderColor: toneStyle.border }]}>
      <Text style={[styles.label, { color: toneStyle.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  label: {
    ...typography.overline,
    fontSize: 10,
    letterSpacing: 0.8,
  },
});
