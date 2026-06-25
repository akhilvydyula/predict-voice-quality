import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AgentCoachPanel } from '../../src/components/AgentCoachPanel';
import { LearningPathPanel } from '../../src/components/LearningPathPanel';
import { PracticePlanPanel } from '../../src/components/PracticePlanPanel';
import { AppPageScroll } from '../../src/components/layout/AppPageScroll';
import { KpiCard } from '../../src/components/ui/KpiCard';
import { PageHeader } from '../../src/components/ui/PageHeader';
import { Panel } from '../../src/components/ui/Panel';
import { PrimaryButton } from '../../src/components/ui/PrimaryButton';
import { useVoiceSession } from '../../src/context/VoiceAnalysisContext';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { typography } from '../../src/theme/typography';

export default function CoachScreen() {
  const router = useRouter();
  const { profile, agentReport } = useVoiceSession();
  const report = agentReport;

  return (
    <AppPageScroll>
      <PageHeader
        eyebrow="Adaptive coaching"
        title="Vocal development program"
        subtitle="Personalized training plans, milestone tracking, and session memory for structured vocalist development."
      />

      {profile ? (
        <View style={styles.statsRow}>
          <KpiCard label="Sessions" value={profile.sessions.length} />
          <KpiCard label="Minutes" value={profile.totalPracticeMinutes} />
          <KpiCard label="Streak" value={`${profile.practiceStreak}d`} />
        </View>
      ) : null}

      {profile && profile.sessions.length > 0 ? (
        <Panel title="Competency profile" subtitle="Rolling averages across logged sessions" variant="elevated">
          <View style={styles.skillGrid}>
            {[
              ['Pitch', profile.skillAverages.pitchAccuracy],
              ['Stability', profile.skillAverages.stability],
              ['Breath', profile.skillAverages.breathControl],
              ['Tone', profile.skillAverages.toneClarity],
            ].map(([label, value]) => (
              <View key={label} style={styles.skillItem}>
                <Text style={styles.skillValue}>{value}</Text>
                <Text style={styles.skillLabel}>{label}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.focusLine}>Focus · {profile.persistentWeakness}</Text>
          <Text style={styles.strengthLine}>Strength · {profile.persistentStrength}</Text>
          <Text style={styles.goal}>Goal: {profile.learningGoal}</Text>
        </Panel>
      ) : (
        <Panel variant="elevated">
          <Text style={styles.emptyTitle}>Your coach is waiting</Text>
          <Text style={styles.emptyBody}>
            Complete one live session and your agent will build a practice plan, track milestones,
            and remember what to work on next.
          </Text>
        </Panel>
      )}

      {report ? (
        <>
          <AgentCoachPanel report={report} />
          <PracticePlanPanel steps={report.practicePlan} focus={report.nextSessionFocus} />
          <LearningPathPanel milestones={report.milestones} />
        </>
      ) : null}

      <PrimaryButton
        label="Launch live assessment"
        subtitle="Open vocal assessment studio"
        onPress={() => router.push('/session')}
      />
    </AppPageScroll>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  skillGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  skillItem: {
    width: '47%',
    backgroundColor: colors.backgroundElevated,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  skillValue: {
    ...typography.h2,
    fontSize: 22,
  },
  skillLabel: {
    ...typography.bodySmall,
    marginTop: 2,
  },
  focusLine: {
    ...typography.bodyMedium,
    color: colors.primary,
    fontFamily: typography.h3.fontFamily,
  },
  strengthLine: {
    ...typography.bodySmall,
    color: colors.success,
    marginTop: spacing.xs,
  },
  goal: {
    ...typography.bodySmall,
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
  emptyTitle: {
    ...typography.h2,
    marginBottom: spacing.sm,
  },
  emptyBody: {
    ...typography.body,
    textAlign: 'center',
  },
});
