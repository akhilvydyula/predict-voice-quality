import { StyleSheet, Text, View } from 'react-native';

import { AdvancedInsights } from '../audio/advancedAnalytics';
import { colors } from '../theme/colors';

type AdvancedAnalyticsPanelProps = {
  advanced: AdvancedInsights;
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

export function AdvancedAnalyticsPanel({ advanced }: AdvancedAnalyticsPanelProps) {
  const driftLabel =
    advanced.pitchDrift === 'stable'
      ? 'Stable'
      : advanced.pitchDrift === 'sharpening'
        ? 'Sharpening over time'
        : 'Flattening over time';

  return (
    <View style={styles.panel}>
      <Text style={styles.title}>Deep analytics</Text>
      <Row label="Voice register" value={advanced.voiceRegister} />
      <Row label="Comfort zone" value={advanced.chestMixEstimate} />
      <Row label="Pitch drift" value={driftLabel} />
      <Row
        label="Phrase consistency"
        value={advanced.phraseConsistency > 0 ? `${advanced.phraseConsistency}%` : '—'}
      />
      <Row
        label="Warm-up readiness"
        value={advanced.warmupReadiness > 0 ? `${advanced.warmupReadiness}%` : '—'}
      />
      <Row
        label="Expressive range"
        value={advanced.expressiveRange > 0 ? `${advanced.expressiveRange}%` : '—'}
      />
      <Row
        label="Fatigue signal"
        value={advanced.fatigueIndex > 0 ? `${advanced.fatigueIndex}%` : 'Low'}
      />
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
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  label: {
    color: colors.textDim,
    fontSize: 13,
    flex: 1,
  },
  value: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'right',
    flex: 1,
  },
});
