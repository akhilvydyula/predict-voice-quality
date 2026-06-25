import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  pitch: 'musical-notes-outline',
  stability: 'locate-outline',
  breath: 'water-outline',
  tone: 'sparkles-outline',
  vibrato: 'pulse-outline',
  dynamics: 'trending-up-outline',
};

type MetricCardProps = {
  label: string;
  value: number;
  icon?: string;
};

export function MetricCard({ label, value, icon }: MetricCardProps) {
  const iconName = ICONS[label.toLowerCase()] ?? 'analytics-outline';
  const barColor =
    value >= 75 ? colors.success : value >= 50 ? colors.warning : colors.danger;
  const hasValue = value > 0;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.iconWrap}>
          <Ionicons name={icon ? (icon as keyof typeof Ionicons.glyphMap) : iconName} size={16} color={colors.primaryBright} />
        </View>
        <Text style={styles.value}>{hasValue ? value : '—'}</Text>
      </View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            {
              width: `${hasValue ? Math.max(value, 6) : 6}%`,
              backgroundColor: hasValue ? barColor : colors.border,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    flex: 1,
    minWidth: '46%',
    gap: spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  value: {
    ...typography.h1,
    fontSize: 28,
  },
  label: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  track: {
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.backgroundElevated,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.pill,
  },
});
