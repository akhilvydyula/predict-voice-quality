import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { buildDashboardMetrics } from '../../src/analytics/sessionAnalytics';
import { PerformanceTrendChart } from '../../src/components/analytics/PerformanceTrendChart';
import { SessionHistoryList } from '../../src/components/analytics/SessionHistoryList';
import { SkillBreakdownChart } from '../../src/components/analytics/SkillBreakdownChart';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { KpiCard } from '../../src/components/ui/KpiCard';
import { PageHeader } from '../../src/components/ui/PageHeader';
import { Panel } from '../../src/components/ui/Panel';
import { PrimaryButton } from '../../src/components/ui/PrimaryButton';
import { Screen } from '../../src/components/ui/Screen';
import { useVoiceSession } from '../../src/context/VoiceAnalysisContext';
import { spacing } from '../../src/theme/spacing';
import { typography } from '../../src/theme/typography';
import { colors } from '../../src/theme/colors';

export default function AnalyticsScreen() {
  const router = useRouter();
  const { profile } = useVoiceSession();
  const metrics = buildDashboardMetrics(profile);

  return (
    <Screen>
      <PageHeader
        eyebrow="Analytics workspace"
        title="Vocal performance intelligence"
        subtitle="Session-level metrics, longitudinal trends, and skill decomposition for vocalists, coaches, and program administrators."
      />

      <View style={styles.kpiGrid}>
        <KpiCard label="Avg overall" value={metrics.averageOverall || '—'} />
        <KpiCard label="Avg pitch" value={metrics.averagePitch || '—'} />
        <KpiCard label="This week" value={metrics.weekSessions} hint="Sessions logged" />
        <KpiCard
          label="Pitch delta"
          value={
            metrics.pitchDelta === null
              ? '—'
              : `${metrics.pitchDelta >= 0 ? '+' : ''}${metrics.pitchDelta}`
          }
          deltaTone={
            metrics.pitchDelta === null
              ? 'neutral'
              : metrics.pitchDelta >= 0
                ? 'up'
                : 'down'
          }
        />
      </View>

      {metrics.totalSessions > 0 ? (
        <>
          <Panel title="Longitudinal performance" subtitle="Overall score trajectory" variant="elevated">
            <PerformanceTrendChart points={metrics.trendPoints} height={220} />
          </Panel>

          <Panel title="Capability model" subtitle="Six-dimension vocal quality index">
            <SkillBreakdownChart items={metrics.skillBreakdown} />
          </Panel>

          <Panel title="Session registry" subtitle={`${metrics.totalSessions} records on device`}>
            <SessionHistoryList sessions={metrics.recentSessions} />
          </Panel>

          {profile ? (
            <Panel title="Program insights" variant="inset">
              <View style={styles.insightList}>
                <Text style={styles.insightLine}>
                  Primary development area: {profile.persistentWeakness}
                </Text>
                <Text style={styles.insightLine}>
                  Demonstrated strength: {profile.persistentStrength}
                </Text>
                <Text style={styles.insightLine}>Active learning goal: {profile.learningGoal}</Text>
                <Text style={styles.insightLine}>
                  Milestones unlocked: {profile.milestonesUnlocked.length}
                </Text>
              </View>
            </Panel>
          ) : null}
        </>
      ) : (
        <Panel variant="elevated">
          <EmptyState
            icon="stats-chart-outline"
            title="Analytics awaiting data"
            description="Your performance workspace will populate automatically after live assessments. Export-ready session history and trend charts appear here."
            actionLabel="Run live assessment"
            onAction={() => router.push('/session')}
          />
        </Panel>
      )}

      <PrimaryButton
        label="Export via coach review"
        subtitle="Open adaptive coaching workspace"
        variant="secondary"
        onPress={() => router.push('/coach')}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  insightList: {
    gap: spacing.sm,
  },
  insightLine: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
