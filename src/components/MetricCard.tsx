import { Ionicons } from '@expo/vector-icons';
import { Platform, StyleSheet, Text, View } from 'react-native';

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

const ACCENT_COLORS: Record<string, string> = {
  pitch: colors.primary,
  stability: colors.success,
  breath: colors.accent,
  tone: '#A78BFA',
  vibrato: colors.warning,
  dynamics: '#06B6D4',
};

type MetricCardProps = {
  label: string;
  value: number;
  icon?: string;
};

export function MetricCard({ label, value, icon }: MetricCardProps) {
  const key = label.toLowerCase();
  const iconName = ICONS[key] ?? 'analytics-outline';
  const accent = ACCENT_COLORS[key] ?? colors.primaryBright;
  const barColor = value >= 75 ? colors.success : value >= 50 ? colors.warning : colors.danger;
  const hasValue = value > 0;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={[styles.iconWrap, { backgroundColor: `${accent}1A`, borderColor: `${accent}33` }]}>
          <Ionicons
            name={icon ? (icon as keyof typeof Ionicons.glyphMap) : iconName}
            size={20}
            color={accent}
          />
        </View>
        <Text style={[styles.value, hasValue && { color: colors.text }]}>
          {hasValue ? value : '—'}
        </Text>
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
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    flex: 1,
    minWidth: '46%',
    gap: spacing.sm,
    ...(Platform.OS === 'web' ? ({ boxShadow: colors.shadow } as object) : {}),
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontFamily: typography.metric.fontFamily,
    fontSize: 26,
    lineHeight: 30,
    color: colors.textMuted,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    letterSpacing: 0.8,
  },
  track: {
    height: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.backgroundElevated,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.pill,
  },
});
