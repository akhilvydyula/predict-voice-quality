import { StyleSheet, Text, View } from 'react-native';

import { AgentLiveGuidance } from '../agent/vocalCoachAgent';
import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

type LiveAgentBannerProps = {
  guidance: AgentLiveGuidance | null;
};

export function LiveAgentBanner({ guidance }: LiveAgentBannerProps) {
  if (!guidance) return null;

  const palette =
    guidance.urgency === 'alert'
      ? { bg: colors.dangerSoft, border: colors.danger, label: 'Correct now' }
      : guidance.urgency === 'tip'
        ? { bg: colors.warningSoft, border: colors.warning, label: 'Coach tip' }
        : { bg: colors.accentSoft, border: colors.primaryBright, label: 'Nice work' };

  return (
    <View style={[styles.banner, { backgroundColor: palette.bg, borderColor: palette.border }]}>
      <Text style={styles.label}>{palette.label.toUpperCase()}</Text>
      <Text style={styles.message}>{guidance.message}</Text>
      <Text style={styles.action}>{guidance.action}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    gap: spacing.xs,
  },
  label: {
    ...typography.caption,
    color: colors.text,
    letterSpacing: 1,
  },
  message: {
    ...typography.h3,
    fontSize: 15,
    lineHeight: 22,
  },
  action: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});
