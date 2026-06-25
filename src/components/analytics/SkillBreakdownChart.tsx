import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

type SkillBreakdownChartProps = {
  items: { key: string; label: string; value: number }[];
};

export function SkillBreakdownChart({ items }: SkillBreakdownChartProps) {
  if (items.length === 0) return null;

  return (
    <View style={styles.wrap}>
      {items.map((item) => {
        const tone =
          item.value >= 75 ? colors.success : item.value >= 55 ? colors.warning : colors.danger;
        return (
          <View key={item.key} style={styles.row}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.value}>{item.value > 0 ? item.value : '—'}</Text>
            </View>
            <View style={styles.track}>
              <View
                style={[
                  styles.fill,
                  {
                    width: `${Math.max(item.value, item.value > 0 ? 4 : 0)}%`,
                    backgroundColor: item.value > 0 ? tone : colors.border,
                  },
                ]}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.md,
  },
  row: {
    gap: spacing.sm,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  value: {
    ...typography.bodyBold,
    fontSize: 13,
    color: colors.text,
  },
  track: {
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.backgroundElevated,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.pill,
  },
});
