import { StyleSheet, Text, View } from 'react-native';

import { noteRangeSemitones } from '../../audio/scales';
import { SingerInsights } from '../../audio/voiceQuality';
import { SingerProfile } from '../../agent/singerProfile';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

type RangeMapPanelProps = {
  insights: SingerInsights;
  profile: SingerProfile | null;
};

const SKILL_KEYS = [
  { key: 'pitchAccuracy' as const, label: 'Pitch', icon: '🎵' },
  { key: 'stability' as const, label: 'Stability', icon: '🎯' },
  { key: 'breathControl' as const, label: 'Breath', icon: '💨' },
  { key: 'toneClarity' as const, label: 'Tone', icon: '✨' },
  { key: 'vibrato' as const, label: 'Vibrato', icon: '〰️' },
  { key: 'dynamics' as const, label: 'Dynamics', icon: '📈' },
];

export function RangeMapPanel({ insights, profile }: RangeMapPanelProps) {
  const rangeLabel =
    insights.vocalRangeLow && insights.vocalRangeHigh
      ? `${insights.vocalRangeLow} – ${insights.vocalRangeHigh}`
      : null;

  const semitones = noteRangeSemitones(insights.vocalRangeLow, insights.vocalRangeHigh);
  const sessionCount = profile?.sessions.length ?? 0;
  const streak = profile?.practiceStreak ?? 0;

  return (
    <View style={styles.wrap}>
      <Text style={styles.desc}>
        Your vocal map grows with every practice session. Use Practice Studio to log your range.
      </Text>

      <View style={styles.rangeCard}>
        <Text style={styles.rangeEyebrow}>DETECTED RANGE</Text>
        <Text style={styles.rangeValue}>{rangeLabel ?? 'Not mapped yet'}</Text>
        {semitones !== null ? (
          <Text style={styles.rangeMeta}>{semitones} semitones · {insights.singerLevel}</Text>
        ) : (
          <Text style={styles.rangeMeta}>Sing scales from low to high in a live session</Text>
        )}
      </View>

      <View style={styles.statsRow}>
        <StatBox label="Sessions" value={sessionCount > 0 ? `${sessionCount}` : '—'} />
        <StatBox label="Streak" value={streak > 0 ? `${streak}d` : '—'} />
        <StatBox
          label="Practice"
          value={profile && profile.totalPracticeMinutes > 0 ? `${profile.totalPracticeMinutes}m` : '—'}
        />
      </View>

      {profile && sessionCount > 0 ? (
        <View style={styles.skills}>
          <Text style={styles.skillsTitle}>Skill averages</Text>
          {SKILL_KEYS.map((skill) => {
            const score = profile.skillAverages[skill.key];
            return (
              <View key={skill.key} style={styles.skillRow}>
                <Text style={styles.skillIcon}>{skill.icon}</Text>
                <Text style={styles.skillLabel}>{skill.label}</Text>
                <View style={styles.skillTrack}>
                  <View style={[styles.skillFill, { width: `${score}%` }]} />
                </View>
                <Text style={styles.skillScore}>{score > 0 ? score : '—'}</Text>
              </View>
            );
          })}
        </View>
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            Complete your first practice session to unlock skill averages and trend tracking.
          </Text>
        </View>
      )}

      {profile?.learningGoal ? (
        <View style={styles.goalCard}>
          <Text style={styles.goalLabel}>Current learning goal</Text>
          <Text style={styles.goalText}>{profile.learningGoal}</Text>
        </View>
      ) : null}
    </View>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.lg,
  },
  desc: {
    ...typography.body,
    textAlign: 'center',
  },
  rangeCard: {
    padding: spacing.xl,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    gap: spacing.xs,
  },
  rangeEyebrow: {
    ...typography.caption,
    color: colors.accent,
  },
  rangeValue: {
    ...typography.h1,
    fontSize: 28,
    textAlign: 'center',
  },
  rangeMeta: {
    ...typography.bodySmall,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  statValue: {
    ...typography.h3,
    color: colors.primaryBright,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  skills: {
    gap: spacing.sm,
  },
  skillsTitle: {
    ...typography.h3,
    fontSize: 14,
  },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  skillIcon: {
    fontSize: 14,
    width: 22,
  },
  skillLabel: {
    ...typography.bodySmall,
    width: 64,
  },
  skillTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surfaceElevated,
    overflow: 'hidden',
  },
  skillFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: colors.primaryBright,
  },
  skillScore: {
    ...typography.bodyBold,
    width: 28,
    textAlign: 'right',
    fontSize: 13,
  },
  empty: {
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  emptyText: {
    ...typography.bodySmall,
    textAlign: 'center',
  },
  goalCard: {
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  goalLabel: {
    ...typography.caption,
    color: colors.accent,
  },
  goalText: {
    ...typography.body,
  },
});
