import { Platform, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

type KpiCardProps = {
  label: string;
  value: string | number;
  delta?: string;
  deltaTone?: 'up' | 'down' | 'neutral';
  hint?: string;
  accent?: string;
  style?: ViewStyle;
};

export function KpiCard({ label, value, delta, deltaTone = 'neutral', hint, accent, style }: KpiCardProps) {
  const deltaColor =
    deltaTone === 'up' ? colors.success : deltaTone === 'down' ? colors.danger : colors.textMuted;

  return (
    <View style={[styles.card, style]}>
      {accent ? <View style={[styles.accentBar, { backgroundColor: accent }]} /> : null}
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, accent ? { color: colors.text } : undefined]}>{value}</Text>
      {delta ? <Text style={[styles.delta, { color: deltaColor }]}>{delta}</Text> : null}
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 140,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    gap: spacing.xs,
    overflow: 'hidden',
    ...(Platform.OS === 'web' ? ({ boxShadow: colors.shadow } as object) : {}),
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    borderTopLeftRadius: radius.md,
    borderTopRightRadius: radius.md,
  },
  label: {
    ...typography.caption,
    marginTop: 4,
  },
  value: {
    fontFamily: typography.metric.fontFamily,
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.5,
    color: colors.text,
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
