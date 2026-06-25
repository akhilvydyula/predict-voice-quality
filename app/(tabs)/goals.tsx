import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Platform, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { buildTrainingGoals } from '../../src/analytics/goalsHelpers';
import { getWeeklyGoalForProfile } from '../../src/agent/vocalCoachAgent';
import { CoachFocusCard } from '../../src/components/goals/CoachFocusCard';
import { GoalProgressCard } from '../../src/components/goals/GoalProgressCard';
import { GoalsAchievementsTabs } from '../../src/components/goals/GoalsAchievementsTabs';
import { ProgressHeroBanner } from '../../src/components/goals/ProgressHeroBanner';
import { DashboardKpiCard } from '../../src/components/dashboard/DashboardKpiCard';
import { AppTopBar } from '../../src/components/layout/AppTopBar';
import { useAppShellLayout } from '../../src/components/layout/AppShell';
import { useAppPreferences } from '../../src/context/AppPreferencesContext';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { Panel } from '../../src/components/ui/Panel';
import { PrimaryButton } from '../../src/components/ui/PrimaryButton';
import { useVoiceSession } from '../../src/context/VoiceAnalysisContext';
import { layout } from '../../src/theme/layout';
import { radius, spacing } from '../../src/theme/spacing';
import { fonts } from '../../src/theme/typography';

export default function GoalsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { showSidebar } = useAppShellLayout();
  const { colors } = useAppPreferences();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { profile, agentReport } = useVoiceSession();
  const goals = buildTrainingGoals(profile);
  const weeklyCopy = getWeeklyGoalForProfile(profile);
  const metCount = goals.filter((g) => g.met).length;
  const overallPct = goals.length > 0 ? Math.round((metCount / goals.length) * 100) : 0;
  const hasSessions = Boolean(profile && profile.sessions.length > 0);
  const isWideKpi = width >= (showSidebar ? layout.sidebarBreakpoint : 720);

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
          title="Your vocal goals"
          subtitle="Weekly targets, streaks, and coach-guided focus."
        />

        <GoalsAchievementsTabs />

        <ProgressHeroBanner
          percent={overallPct}
          ringLabel={`${metCount}/${goals.length}`}
          ringSublabel="goals met"
          title={metCount === goals.length ? 'All goals complete!' : 'Keep the momentum going'}
          subtitle={
            metCount === goals.length
              ? 'You hit every active target. Set your sights on the next level.'
              : `${goals.length - metCount} goal${goals.length - metCount === 1 ? '' : 's'} still in progress — one practice session can move the needle.`
          }
          footer={hasSessions ? weeklyCopy : undefined}
          accentColor={metCount === goals.length ? colors.success : colors.primary}
        />

        <View style={[styles.kpiRow, isWideKpi ? styles.kpiRowWide : styles.kpiRowGrid]}>
          <DashboardKpiCard
            label="Goals met"
            value={`${metCount}`}
            suffix={`/${goals.length}`}
            trend={metCount === goals.length ? 'All complete' : `${goals.length - metCount} remaining`}
            trendTone={metCount === goals.length ? 'up' : 'neutral'}
            icon="flag-outline"
            style={isWideKpi ? styles.kpiItem : [styles.kpiItem, styles.kpiItemHalf]}
          />
          <DashboardKpiCard
            label="Streak"
            value={String(profile?.practiceStreak ?? 0)}
            suffix={(profile?.practiceStreak ?? 0) > 0 ? 'days' : undefined}
            trend={
              (profile?.practiceStreak ?? 0) >= 7
                ? 'On fire'
                : (profile?.practiceStreak ?? 0) > 0
                  ? 'Keep it up'
                  : 'Start today'
            }
            trendTone={(profile?.practiceStreak ?? 0) >= 3 ? 'accent' : 'neutral'}
            icon="flame-outline"
            style={isWideKpi ? styles.kpiItem : [styles.kpiItem, styles.kpiItemHalf]}
          />
          <DashboardKpiCard
            label="This week"
            value={String(goals[0]?.progress ?? 0)}
            suffix="/3"
            trend="Weekly sessions"
            trendTone={
              (goals[0]?.progress ?? 0) >= 3 ? 'up' : (goals[0]?.progress ?? 0) > 0 ? 'neutral' : 'down'
            }
            icon="calendar-outline"
            style={isWideKpi ? styles.kpiItem : [styles.kpiItem, styles.kpiItemHalf]}
          />
        </View>

        <CoachFocusCard
          learningGoal={profile?.learningGoal ?? 'Build consistent pitch and breath support'}
          nextSessionFocus={agentReport?.nextSessionFocus}
          weeklyCopy={weeklyCopy}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active goals</Text>
          <Text style={styles.sectionSub}>Updates automatically after each practice session</Text>
          <View style={styles.goalList}>
            {goals.map((goal) => (
              <GoalProgressCard
                key={goal.id}
                title={goal.title}
                description={goal.description}
                progress={goal.progress}
                target={goal.target}
                met={goal.met}
                icon={goal.icon}
              />
            ))}
          </View>
        </View>

        {hasSessions ? (
          <Panel title="Development insights" subtitle="From your coach agent" variant="inset">
            <View style={styles.insightGrid}>
              <View style={styles.insightCard}>
                <Text style={styles.insightLabel}>Working on</Text>
                <Text style={styles.insightValue}>{profile!.persistentWeakness}</Text>
              </View>
              <View style={[styles.insightCard, styles.insightCardAccent]}>
                <Text style={styles.insightLabel}>Strength</Text>
                <Text style={[styles.insightValue, styles.insightValueAccent]}>
                  {profile!.persistentStrength}
                </Text>
              </View>
            </View>
          </Panel>
        ) : (
          <Panel variant="elevated">
            <EmptyState
              icon="flag-outline"
              title="Goals unlock with practice"
              description="Complete a live session and your weekly targets, streak goals, and coach focus will populate here."
              actionLabel="Start practicing"
              onAction={() => router.push('/session')}
            />
          </Panel>
        )}

        <PrimaryButton
          label="Practice now"
          subtitle="Log a session to advance your goals"
          onPress={() => router.push('/session')}
        />
      </View>
    </ScrollView>
  );
}

function createStyles(colors: ReturnType<typeof useAppPreferences>['colors']) {
  return StyleSheet.create({
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
    kpiRow: {
      gap: spacing.md,
      marginTop: -spacing.sm,
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
    section: {
      gap: spacing.md,
    },
    sectionTitle: {
      fontFamily: fonts.displayMedium,
      fontSize: 18,
      color: colors.text,
    },
    sectionSub: {
      fontFamily: fonts.body,
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: -spacing.sm,
    },
    goalList: {
      gap: spacing.md,
      marginTop: spacing.xs,
    },
    insightGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.md,
    },
    insightCard: {
      flex: 1,
      minWidth: 140,
      padding: spacing.lg,
      borderRadius: radius.md,
      backgroundColor: colors.backgroundElevated,
      borderWidth: 1,
      borderColor: colors.border,
      gap: spacing.xs,
    },
    insightCardAccent: {
      backgroundColor: colors.successSoft,
      borderColor: colors.success,
    },
    insightLabel: {
      fontFamily: fonts.body,
      fontSize: 12,
      color: colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    insightValue: {
      fontFamily: fonts.bodyBold,
      fontSize: 15,
      color: colors.primary,
      lineHeight: 21,
    },
    insightValueAccent: {
      color: colors.success,
    },
  });
}
