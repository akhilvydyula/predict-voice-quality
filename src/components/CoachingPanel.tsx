import { StyleSheet, Text, View } from 'react-native';

import { CoachingInsight } from '../audio/voiceQuality';
import { colors } from '../theme/colors';

type CoachingPanelProps = {
  coaching: CoachingInsight;
};

export function CoachingPanel({ coaching }: CoachingPanelProps) {
  return (
    <View style={styles.panel}>
      <Text style={styles.focusLabel}>FOCUS: {coaching.focusArea.toUpperCase()}</Text>
      <Text style={styles.tip}>{coaching.primaryTip}</Text>

      <View style={styles.divider} />

      <Text style={styles.sectionLabel}>TRY THIS EXERCISE</Text>
      <Text style={styles.body}>{coaching.exercise}</Text>

      <View style={styles.strengthBox}>
        <Text style={styles.strengthLabel}>YOUR STRENGTH</Text>
        <Text style={styles.strengthText}>{coaching.strength}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  focusLabel: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  tip: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  sectionLabel: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  body: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
  },
  strengthBox: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 4,
  },
  strengthLabel: {
    color: colors.success,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  strengthText: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
});
