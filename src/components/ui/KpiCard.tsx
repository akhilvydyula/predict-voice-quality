import { StyleSheet, Text, View, ViewStyle } from 'react-native';

import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

type KpiCardProps = {
  label: string;
  value: string | number;
  delta?: string;
  deltaTone?: 'up' | 'down' | 'neutral';
  hint?: string;
  style?: ViewStyle;
};

export function KpiCard({ label, value, delta, deltaTone = 'neutral', hint, style }: KpiCardProps) {
  const deltaColor =
    deltaTone === 'up' ? colors.success : deltaTone === 'down' ? colors.danger : colors.textMuted;

  return (
    <View style={[styles.card, style]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      {delta ? <Text style={[styles.delta, { color: deltaColor }]}>{delta}</Text> : null}
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 140,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  label: {
    ...typography.overline,
    color: colors.textMuted,
  },
  value: {
    ...typography.metric,
    fontSize: 32,
    lineHeight: 36,
  },
  delta: {
    ...typography.bodySmall,
    fontFamily: typography.bodyMedium.fontFamily,
  },
  hint: {
    ...typography.bodySmall,
    color: colors.textDim,
  },
});
