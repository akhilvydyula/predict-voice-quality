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
import { Screen } from '../../src/components/ui/Screen';
import { StatusBadge } from '../../src/components/ui/StatusBadge';
import { useDevMode } from '../../src/context/DevModeContext';
import { useVoiceSession } from '../../src/context/VoiceAnalysisContext';
import { colors } from '../../src/theme/colors';
import { radius, spacing } from '../../src/theme/spacing';
import { typography } from '../../src/theme/typography';

type QuickAction = {
  key: string;
  label: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  accent: string;
};

const QUICK_ACTIONS: QuickAction[] = [
  {
    key: 'practice',
    label: 'Start Practice',
    subtitle: 'Live pitch & coaching',
    icon: 'mic',
    route: '/session',
    accent: colors.primaryBright,
  },
  {
    key: 'analytics',
    label: 'My Progress',
    subtitle: 'Charts & history',
    icon: 'bar-chart',
    route: '/analytics',
    accent: colors.accent,
  },
  {
    key: 'tools',
    label: 'Toolkit',
    subtitle: 'Tuner, metronome…',
    icon: 'musical-notes',
    route: '/tools',
    accent: colors.success,
  },
  {
    key: 'coach',
    label: 'Coach',
    subtitle: 'Plans & milestones',
    icon: 'school',
    route: '/coach',
    accent: colors.warning,
  },
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

  const greeting =
    metrics.totalSessions === 0
      ? 'Welcome to VocalIQ'
      : metrics.totalSessions === 1
        ? 'Welcome back'
        : `${metrics.totalSessions} sessions logged`;

  return (
    <Screen>
      <PageHeader
        eyebrow={devMode ? 'VocalIQ · Dev mode' : 'VocalIQ'}
        title={greeting}
        subtitle={
          metrics.totalSessions === 0
            ? 'Analyze your singing with real-time pitch, tone, and coaching feedback.'
            : 'Keep up the momentum — your voice data is ready.'
        }
        actions={
          isActive ? (
            <StatusBadge label="Live" tone="success" />
          ) : undefined
        }
      />

      {/* Big start button when no session yet */}
      {metrics.totalSessions === 0 ? (
        <Pressable
          onPress={() => router.push('/session')}
          style={({ pressed }) => [styles.heroCta, pressed && styles.heroCtaPressed]}
        >
          <View style={styles.heroCtaIcon}>
            <Ionicons name="mic" size={28} color={colors.text} />
          </View>
          <View style={styles.heroCtaCopy}>
            <Text style={styles.heroCtaTitle}>Start your first session</Text>
            <Text style={styles.heroCtaSubtitle}>Tap to sing and get instant feedback</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </Pressable>
      ) : null}

      {/* KPI row — only show when data exists */}
      {metrics.totalSessions > 0 ? (
        <Pressable onPress={registerUnlockTap}>
          <View style={styles.kpiGrid}>
            <KpiCard
              label="Sessions"
              value={metrics.totalSessions}
              hint={`${metrics.weekSessions} this week`}
              accent={colors.primaryBright}
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
              accent={colors.success}
            />
            <KpiCard
              label="Practice time"
              value={metrics.totalMinutes ? `${metrics.totalMinutes}m` : '—'}
              hint="Total lifetime"
              accent={colors.accent}
            />
            <KpiCard
              label="Streak"
              value={metrics.practiceStreak ? `${metrics.practiceStreak}d` : '—'}
              hint="Consecutive days"
              accent={colors.warning}
            />
          </View>
        </Pressable>
      ) : null}

      {/* Quick actions grid */}
      <View style={styles.actionsWrap}>
        <Text style={styles.sectionLabel}>Quick actions</Text>
        <View style={styles.actionGrid}>
          {QUICK_ACTIONS.map((action) => (
            <Pressable
              key={action.key}
              style={({ pressed }) => [styles.actionCard, pressed && styles.actionCardPressed]}
              onPress={() => router.push(action.route as Href)}
            >
              <View style={[styles.actionIcon, { backgroundColor: `${action.accent}1A`, borderColor: `${action.accent}33` }]}>
                <Ionicons name={action.icon} size={22} color={action.accent} />
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
              <Text style={styles.actionSub}>{action.subtitle}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Charts / history when data exists */}
      {metrics.totalSessions > 0 ? (
        <>
          <Panel
            title="Score over time"
            subtitle="How your overall has changed"
            variant="elevated"
          >
            <PerformanceTrendChart points={metrics.trendPoints} />
          </Panel>

          <Panel title="Skill breakdown" subtitle="Where you're strong and where to improve">
            <SkillBreakdownChart items={metrics.skillBreakdown} />
          </Panel>

          <Panel
            title="Recent sessions"
            subtitle="Tap a session for details"
            headerRight={
              <Pressable onPress={() => router.push('/analytics')}>
                <Text style={styles.link}>See all</Text>
              </Pressable>
            }
          >
            <SessionHistoryList sessions={metrics.recentSessions.slice(0, 4)} />
          </Panel>
        </>
      ) : (
        <Panel variant="elevated">
          <EmptyState
            icon="mic-circle-outline"
            title="No sessions yet"
            description="Start a live practice to see your scores, trends, and personalised coaching."
            actionLabel="Start practicing"
            onAction={() => router.push('/session')}
          />
        </Panel>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroCta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.primaryBright,
  },
  heroCtaPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  heroCtaIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCtaCopy: {
    flex: 1,
    gap: 3,
  },
  heroCtaTitle: {
    ...typography.bodyBold,
    fontSize: 16,
    color: colors.text,
  },
  heroCtaSubtitle: {
    ...typography.bodySmall,
    color: 'rgba(255,255,255,0.7)',
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  actionsWrap: {
    gap: spacing.sm,
  },
  sectionLabel: {
    ...typography.overline,
    color: colors.textDim,
    marginBottom: 2,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  actionCard: {
    width: '47%',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  actionCardPressed: {
    backgroundColor: colors.surfaceHover,
    transform: [{ scale: 0.97 }],
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  actionLabel: {
    ...typography.bodyBold,
    fontSize: 15,
  },
  actionSub: {
    ...typography.bodySmall,
    color: colors.textDim,
  },
  link: {
    ...typography.bodySmall,
    color: colors.accent,
    fontFamily: typography.bodyBold.fontFamily,
  },
});
