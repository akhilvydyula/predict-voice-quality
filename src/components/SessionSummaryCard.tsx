import { StyleSheet, Text, View } from 'react-native';

import { SessionSummary } from '../audio/voiceQuality';
import { colors } from '../theme/colors';

type SessionSummaryCardProps = {
  summary: SessionSummary;
};

export function SessionSummaryCard({ summary }: SessionSummaryCardProps) {
  if (summary.metrics.overall <= 0) {
    return null;
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Session Recap</Text>
      <Text style={styles.score}>
        Overall {summary.metrics.overall}/100 · {summary.insights.singerLevel}
      </Text>

      {summary.highlights.map((line) => (
        <View key={line} style={styles.bulletRow}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.bulletText}>{line}</Text>
        </View>
      ))}

      <Text style={styles.nextStep}>
        Next: {summary.coaching.exercise}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.primary,
    gap: 8,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  score: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  bullet: {
    color: colors.accent,
    fontSize: 16,
    lineHeight: 20,
  },
  bulletText: {
    flex: 1,
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
  },
  nextStep: {
    color: colors.text,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
    fontStyle: 'italic',
  },
});
