import { useRouter } from 'expo-router';
import { Platform, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  buildWeekComparisons,
  formatPracticeDuration,
} from '../../src/analytics/dashboardHelpers';
import { buildDashboardMetrics } from '../../src/analytics/sessionAnalytics';
import { PerformanceTrendChart } from '../../src/components/analytics/PerformanceTrendChart';
import { SessionHistoryList } from '../../src/components/analytics/SessionHistoryList';
import { SkillBreakdownChart } from '../../src/components/analytics/SkillBreakdownChart';
import { DashboardKpiCard } from '../../src/components/dashboard/DashboardKpiCard';
import { QuickActionRow } from '../../src/components/dashboard/QuickActionRow';
import { AppTopBar } from '../../src/components/layout/AppTopBar';
import { useAppShellLayout } from '../../src/components/layout/AppShell';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { Panel } from '../../src/components/ui/Panel';
import { StatusBadge } from '../../src/components/ui/StatusBadge';
import { useDevMode } from '../../src/context/DevModeContext';
import { useVoiceSession } from '../../src/context/VoiceAnalysisContext';
import { colors } from '../../src/theme/colors';
import { layout } from '../../src/theme/layout';
import { spacing } from '../../src/theme/spacing';
import { fonts } from '../../src/theme/typography';

const QUICK_ACTIONS = [
  {
    key: 'practice',
    title: 'Start practice',
    description: 'Record a new session and improve your delivery.',
    ctaLabel: 'Start now',
    route: '/session' as const,
    icon: 'mic' as const,
  },
  {
    key: 'analytics',
    title: 'View analytics',
    description: 'Dive into your performance and track your progress.',
    ctaLabel: 'Open analytics',
    route: '/analytics' as const,
    icon: 'bar-chart' as const,
  },
  {
    key: 'tools',
    title: 'Explore toolkit',
    description: 'Use tools and exercises to refine your speaking skills.',
    ctaLabel: 'Open toolkit',
    route: '/tools' as const,
    icon: 'construct' as const,
  },
  {
    key: 'coach',
    title: 'Connect with coach',
    description: 'Get AI-powered feedback and coaching tips.',
    ctaLabel: 'Open coach',
    route: '/coach' as const,
    icon: 'school' as const,
  },
];

export default function DashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { showSidebar } = useAppShellLayout();
  const { enabled: devMode, registerUnlockTap } = useDevMode();
  const { profile, isActive } = useVoiceSession();
  const metrics = buildDashboardMetrics(profile);
  const week = buildWeekComparisons(profile?.sessions ?? []);

  const isWideKpi = width >= (showSidebar ? layout.sidebarBreakpoint : 720);
  const streakTrend =
    metrics.practiceStreak >= 7
      ? '🔥 Best streak!'
      : metrics.practiceStreak > 0
        ? `${metrics.practiceStreak} day streak`
        : 'Start your streak today';

  const sessionsTrendTone =
    week.sessionsThisWeek > week.sessionsLastWeek
      ? 'up'
      : week.sessionsThisWeek < week.sessionsLastWeek
        ? 'down'
        : 'neutral';

  const scoreTrendTone =
    week.scoreThisWeek > week.scoreLastWeek
      ? 'up'
      : week.scoreThisWeek < week.scoreLastWeek
        ? 'down'
        : 'neutral';

  const minutesTrendTone =
    week.minutesThisWeek > week.minutesLastWeek
      ? 'up'
      : week.minutesThisWeek < week.minutesLastWeek
        ? 'down'
        : 'neutral';

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.scrollContent,
        {
          paddingTop: (showSidebar ? spacing.xxl : insets.top) + spacing.lg,
          paddingBottom: showSidebar ? spacing.xxxl : spacing.tabBar + spacing.xxxl,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.inner}>
        <AppTopBar
          title={metrics.totalSessions === 0 ? 'Welcome to VocalIQ 👋' : 'Welcome back 👋'}
          subtitle="Here's an overview of your speaking practice."
          actions={isActive ? <StatusBadge label="Live" tone="success" /> : undefined}
        />

        {devMode ? (
          <Pressable onPress={registerUnlockTap}>
            <Text style={styles.devHint}>Dev mode enabled</Text>
          </Pressable>
        ) : null}

        <View style={[styles.kpiRow, isWideKpi ? styles.kpiRowWide : styles.kpiRowGrid]}>
          <DashboardKpiCard
            label="Sessions"
            value={String(metrics.totalSessions || 0)}
            trend={metrics.totalSessions > 0 ? week.sessionsDelta : `${metrics.weekSessions} this week`}
            trendTone={sessionsTrendTone}
            icon="mic-outline"
            style={[styles.kpiItem, !isWideKpi && styles.kpiItemHalf]}
          />
          <DashboardKpiCard
            label="Avg score"
            value={metrics.averageOverall ? String(metrics.averageOverall) : '—'}
            suffix={metrics.averageOverall ? '/100' : undefined}
            trend={
              metrics.averageOverall
                ? week.scoreDelta
                : metrics.totalSessions === 0
                  ? 'Complete a session'
                  : 'Building average'
            }
            trendTone={scoreTrendTone}
            icon="pulse-outline"
            style={[styles.kpiItem, !isWideKpi && styles.kpiItemHalf]}
          />
          <DashboardKpiCard
            label="Practice time"
            value={formatPracticeDuration(metrics.totalMinutes)}
            trend={
              metrics.totalMinutes > 0
                ? week.minutesDelta
                : 'Track time as you practice'
            }
            trendTone={minutesTrendTone}
            icon="time-outline"
            style={[styles.kpiItem, !isWideKpi && styles.kpiItemHalf]}
          />
          <DashboardKpiCard
            label="Streak"
            value={metrics.practiceStreak ? `${metrics.practiceStreak}` : '0'}
            suffix={metrics.practiceStreak ? 'days' : undefined}
            trend={streakTrend}
            trendTone={metrics.practiceStreak >= 7 ? 'accent' : 'neutral'}
            icon="flame-outline"
            style={[styles.kpiItem, !isWideKpi && styles.kpiItemHalf]}
          />
        </View>

        <Text style={styles.sectionTitle}>Quick actions</Text>
        <View style={styles.actionsList}>
          {QUICK_ACTIONS.map((action) => (
            <QuickActionRow key={action.key} {...action} />
          ))}
        </View>

        {metrics.totalSessions > 0 ? (
          <View style={styles.chartsSection}>
            <Panel title="Score over time" subtitle="How your overall has changed" variant="elevated">
              <PerformanceTrendChart points={metrics.trendPoints} />
            </Panel>

            <Panel title="Skill breakdown" subtitle="Where you're strong and where to improve">
              <SkillBreakdownChart items={metrics.skillBreakdown} />
            </Panel>

            <Panel
              title="Recent sessions"
              subtitle="Your latest practice history"
              headerRight={
                <Pressable onPress={() => router.push('/analytics')}>
                  <Text style={styles.link}>See all</Text>
                </Pressable>
              }
            >
              <SessionHistoryList sessions={metrics.recentSessions.slice(0, 4)} />
            </Panel>
          </View>
        ) : (
          <Panel variant="elevated" style={styles.emptyPanel}>
            <EmptyState
              icon="mic-circle-outline"
              title="No sessions yet"
              description="Start a live practice to see your scores, trends, and personalised coaching."
              actionLabel="Start practicing"
              onAction={() => router.push('/session')}
            />
          </Panel>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.backgroundElevated,
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: Platform.OS === 'web' ? spacing.xxl : spacing.screen,
  },
  inner: {
    width: '100%',
    maxWidth: layout.maxAppContentWidth,
    gap: spacing.xxl,
  },
  devHint: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.warning,
    marginTop: -spacing.lg,
  },
  kpiRow: {
    gap: spacing.md,
  },
  kpiRowGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  kpiRowWide: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  kpiItem: {
    flexGrow: 1,
    minWidth: 150,
  },
  kpiItemHalf: {
    flexBasis: '47%',
    maxWidth: '48%',
  },
  sectionTitle: {
    fontFamily: fonts.displayMedium,
    fontSize: 18,
    color: colors.text,
    marginTop: spacing.sm,
  },
  actionsList: {
    gap: spacing.md,
  },
  chartsSection: {
    gap: spacing.lg,
    marginTop: spacing.sm,
  },
  emptyPanel: {
    marginTop: spacing.sm,
  },
  link: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    color: colors.primary,
  },
});
