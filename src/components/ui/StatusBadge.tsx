import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

type StatusBadgeProps = {
  label: string;
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'info';
};

const TONE_STYLES = {
  default: { bg: colors.surfaceHover, text: colors.textSecondary, border: colors.border, dot: null },
  success: { bg: colors.successSoft, text: colors.success, border: 'rgba(0, 200, 83, 0.25)', dot: colors.success },
  warning: { bg: colors.warningSoft, text: colors.warning, border: 'rgba(255, 165, 0, 0.25)', dot: colors.warning },
  danger: { bg: colors.dangerSoft, text: colors.danger, border: 'rgba(255, 68, 68, 0.25)', dot: colors.danger },
  info: { bg: colors.primarySoft, text: colors.primaryBright, border: 'rgba(0, 102, 255, 0.25)', dot: colors.primaryBright },
} as const;

export function StatusBadge({ label, tone = 'default' }: StatusBadgeProps) {
  const toneStyle = TONE_STYLES[tone];
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (toneStyle.dot && tone === 'success') {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 0.3, duration: 800, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      );
      animation.start();
      return () => animation.stop();
    }
  }, [tone, toneStyle.dot, pulse]);

  return (
    <View style={[styles.badge, { backgroundColor: toneStyle.bg, borderColor: toneStyle.border }]}>
      {toneStyle.dot ? (
        <Animated.View
          style={[styles.dot, { backgroundColor: toneStyle.dot, opacity: tone === 'success' ? pulse : 1 }]}
        />
      ) : null}
      <Text style={[styles.label, { color: toneStyle.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  label: {
    ...typography.caption,
    fontSize: 10,
    letterSpacing: 0.8,
  },
});
