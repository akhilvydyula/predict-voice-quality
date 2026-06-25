import { useRouter, type Href } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
import { StatusBadge } from '../../src/components/ui/StatusBadge';
import { useDevMode } from '../../src/context/DevModeContext';
import { useVoiceSession } from '../../src/context/VoiceAnalysisContext';
import { colors } from '../../src/theme/colors';
import { radius, spacing } from '../../src/theme/spacing';
import { typography } from '../../src/theme/typography';

const QUICK_ACTIONS = [
  { key: 'practice', label: 'Live session', icon: 'mic-outline' as const, route: '/session' },
  { key: 'analytics', label: 'Analytics', icon: 'bar-chart-outline' as const, route: '/analytics' },
  { key: 'tools', label: 'Toolkit', icon: 'construct-outline' as const, route: '/tools' },
  { key: 'coach', label: 'Coach plan', icon: 'school-outline' as const, route: '/coach' },
];

export default function DashboardScreen() {
  const router = useRouter();
  const { enabled: devMode, registerUnlockTap } = useDevMode();
  const { profile, isActive } = useVoiceSession();
  const metrics = buildDashboardMetrics(profile);

  const overallDeltaLabel =
    metrics.overallDelta === null
      ? 'No prior session'
      : `${metrics.overallDelta >= 0 ? '+' : ''}${metrics.overallDelta} vs last`;

  return (
    <Screen>
      <PageHeader
        eyebrow={`VocalIQ Platform${devMode ? ' · Dev' : ''}`}
        title="Performance command center"
        subtitle="Enterprise-grade vocal analytics, session intelligence, and adaptive coaching — processed on-device for privacy and scale."
        meta="On-device inference · HIPAA-ready architecture · Real-time pipeline"
        actions={
          <StatusBadge
            label={isActive ? 'Live session' : 'Idle'}
            tone={isActive ? 'success' : 'default'}
          />
        }
      />

      <Pressable onPress={registerUnlockTap}>
        <View style={styles.kpiGrid}>
          <KpiCard
            label="Sessions"
            value={metrics.totalSessions || '—'}
            hint={`${metrics.weekSessions} this week`}
          />
          <KpiCard
            label="Avg score"
            value={metrics.averageOverall || '—'}
            delta={overallDeltaLabel}
            deltaTone={
              metrics.overallDelta === null
                ? 'neutral'
                : metrics.overallDelta >= 0
                  ? 'up'
                  : 'down'
            }
          />
          <KpiCard
            label="Practice time"
            value={metrics.totalMinutes ? `${metrics.totalMinutes}m` : '—'}
            hint="Lifetime minutes"
          />
          <KpiCard
            label="Streak"
            value={metrics.practiceStreak ? `${metrics.practiceStreak}d` : '—'}
            hint="Consecutive days"
          />
        </View>
      </Pressable>

      <Panel title="Operational actions" subtitle="Launch high-value workflows">
        <View style={styles.actionGrid}>
          {QUICK_ACTIONS.map((action) => (
            <Pressable
              key={action.key}
              style={styles.actionCard}
              onPress={() => router.push(action.route as Href)}
            >
              <View style={styles.actionIcon}>
                <Ionicons name={action.icon} size={20} color={colors.primaryBright} />
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </Pressable>
          ))}
        </View>
        <PrimaryButton
          label="Start live vocal assessment"
          subtitle="Real-time pitch, dynamics, and coach feedback"
          onPress={() => router.push('/session')}
          style={styles.primaryCta}
        />
      </Panel>

      {metrics.totalSessions > 0 ? (
        <>
          <Panel
            title="Performance trend"
            subtitle="Rolling overall score across recent sessions"
            variant="elevated"
          >
            <PerformanceTrendChart points={metrics.trendPoints} />
          </Panel>

          <Panel title="Skill distribution" subtitle="Population averages across logged sessions">
            <SkillBreakdownChart items={metrics.skillBreakdown} />
          </Panel>

          <Panel
            title="Recent sessions"
            subtitle="Audit trail for coaching and progress reviews"
            headerRight={
              <Pressable onPress={() => router.push('/analytics')}>
                <Text style={styles.link}>View all</Text>
              </Pressable>
            }
          >
            <SessionHistoryList sessions={metrics.recentSessions.slice(0, 4)} />
          </Panel>
        </>
      ) : (
        <Panel variant="elevated">
          <EmptyState
            icon="pulse-outline"
            title="No session data yet"
            description="Run your first live assessment to populate executive dashboards, trend analysis, and coach recommendations."
            actionLabel="Begin assessment"
            onAction={() => router.push('/session')}
          />
        </Panel>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  actionCard: {
    width: '47%',
    minHeight: 88,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
    padding: spacing.lg,
    gap: spacing.md,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    ...typography.bodyBold,
    fontSize: 14,
  },
  primaryCta: {
    marginTop: spacing.xs,
  },
  link: {
    ...typography.bodySmall,
    color: colors.accent,
    fontFamily: typography.bodyBold.fontFamily,
  },
});
