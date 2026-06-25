import { Ionicons } from '@expo/vector-icons';
import { Platform, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { fonts } from '../../theme/typography';

type DashboardKpiCardProps = {
  label: string;
  value: string;
  suffix?: string;
  trend?: string;
  trendTone?: 'up' | 'down' | 'neutral' | 'accent';
  icon: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
};

export function DashboardKpiCard({
  label,
  value,
  suffix,
  trend,
  trendTone = 'neutral',
  icon,
  style,
}: DashboardKpiCardProps) {
  const trendColor =
    trendTone === 'up'
      ? colors.success
      : trendTone === 'down'
        ? colors.danger
        : trendTone === 'accent'
          ? colors.accent
          : colors.textMuted;

  return (
    <View style={[styles.card, style]}>
      <View style={styles.topRow}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.iconWrap}>
          <Ionicons name={icon} size={16} color={colors.primary} />
        </View>
      </View>
      <View style={styles.valueRow}>
        <Text style={styles.value}>{value}</Text>
        {suffix ? <Text style={styles.suffix}>{suffix}</Text> : null}
      </View>
      {trend ? <Text style={[styles.trend, { color: trendColor }]}>{trend}</Text> : null}
    </View>
  );
}

const webShadow = Platform.OS === 'web' ? ({ boxShadow: colors.shadow } as object) : {};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 160,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    gap: spacing.sm,
    ...webShadow,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.textSecondary,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xs,
  },
  value: {
    fontFamily: fonts.display,
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.8,
    color: colors.text,
  },
  suffix: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textMuted,
  },
  trend: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 18,
  },
});
