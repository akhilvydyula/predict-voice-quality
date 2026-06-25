import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

type MetricCardProps = {
  label: string;
  value: number;
  icon: string;
};

export function MetricCard({ label, value, icon }: MetricCardProps) {
  const barColor =
    value >= 75 ? colors.success : value >= 50 ? colors.warning : colors.danger;
  const hasValue = value > 0;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.iconWrap}>
          <Text style={styles.icon}>{icon}</Text>
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
    borderRadius: radius.lg,
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
    borderRadius: 17,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  icon: {
    fontSize: 16,
  },
  value: {
    ...typography.h1,
    fontSize: 28,
  },
  label: {
    ...typography.bodySmall,
  },
  track: {
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
});
