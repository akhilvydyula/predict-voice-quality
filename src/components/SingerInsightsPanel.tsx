import { StyleSheet, Text, View } from 'react-native';

import { SingerInsights } from '../audio/voiceQuality';
import { centsLabel } from '../audio/musicTheory';
import { colors } from '../theme/colors';

type SingerInsightsPanelProps = {
  insights: SingerInsights;
};

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

export function SingerInsightsPanel({ insights }: SingerInsightsPanelProps) {
  const biasLabel =
    insights.intonationBias === 'balanced'
      ? 'Balanced'
      : insights.intonationBias === 'sharp'
        ? `Sharp (${insights.averageCents}¢)`
        : `Flat (${Math.abs(insights.averageCents)}¢)`;

  const rangeLabel =
    insights.vocalRangeLow && insights.vocalRangeHigh
      ? `${insights.vocalRangeLow} – ${insights.vocalRangeHigh}`
      : '—';

  const vibratoLabel =
    insights.vibratoRateHz && insights.vibratoDepthCents
      ? `${insights.vibratoRateHz} Hz · ${insights.vibratoDepthCents}¢`
      : '—';

  return (
    <View style={styles.panel}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Singer Analytics</Text>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>{insights.singerLevel}</Text>
        </View>
      </View>

      <View style={styles.grid}>
        <Stat label="In tune" value={insights.inTunePercent > 0 ? `${insights.inTunePercent}%` : '—'} />
        <Stat label="Intonation" value={biasLabel} />
        <Stat label="Vocal range" value={rangeLabel} />
        <Stat label="Notes sung" value={insights.notesDetected > 0 ? `${insights.notesDetected}` : '—'} />
        <Stat label="Best hold" value={insights.longestHoldSeconds > 0 ? `${insights.longestHoldSeconds}s` : '—'} />
        <Stat label="Vibrato" value={vibratoLabel} />
        <Stat
          label="Session time"
          value={insights.sessionSeconds > 0 ? `${insights.sessionSeconds}s` : '—'}
        />
        <Stat
          label="In-tune streak"
          value={insights.onPitchStreak > 0 ? `${insights.onPitchStreak}` : '—'}
        />
      </View>

      {insights.averageCents !== 0 && insights.inTunePercent > 0 ? (
        <Text style={styles.footnote}>
          Average tuning: {centsLabel(insights.averageCents)} across this session.
        </Text>
      ) : null}
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
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  levelBadge: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  levelText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  stat: {
    width: '47%',
    backgroundColor: colors.surfaceElevated,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statLabel: {
    color: colors.textDim,
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  statValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  footnote: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
});
