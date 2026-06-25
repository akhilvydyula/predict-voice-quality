import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Platform, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getMilestonesForProfile } from '../../src/agent/vocalCoachAgent';
import { AchievementCard } from '../../src/components/goals/AchievementCard';
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

export default function AchievementsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { showSidebar } = useAppShellLayout();
  const { colors } = useAppPreferences();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { profile } = useVoiceSession();
  const milestones = getMilestonesForProfile(profile);
  const unlocked = milestones.filter((m) => m.unlocked);
  const inProgress = milestones.filter((m) => !m.unlocked);
  const unlockPct =
    milestones.length > 0 ? Math.round((unlocked.length / milestones.length) * 100) : 0;
  const allUnlocked = unlocked.length === milestones.length && milestones.length > 0;
  const isWide = width >= 720;
  const isWideKpi = width >= (showSidebar ? layout.sidebarBreakpoint : 720);
  const hasSessions = Boolean(profile && profile.sessions.length > 0);

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
          title="Achievements"
          subtitle="Milestones earned through practice — pitch, streaks, and dedication."
        />

        <GoalsAchievementsTabs />

        <ProgressHeroBanner
          percent={unlockPct}
          ringLabel={`${unlocked.length}/${milestones.length}`}
          ringSublabel="unlocked"
          title={allUnlocked ? 'Trophy case complete!' : 'Build your trophy case'}
          subtitle={
            allUnlocked
              ? 'Every milestone unlocked. You are officially dedicated.'
              : `${inProgress.length} badge${inProgress.length === 1 ? '' : 's'} within reach — keep singing to unlock them.`
          }
          accentColor={allUnlocked ? colors.accent : colors.primary}
        />

        <View style={[styles.kpiRow, isWideKpi ? styles.kpiRowWide : styles.kpiRowGrid]}>
          <DashboardKpiCard
            label="Unlocked"
            value={`${unlocked.length}`}
            suffix={`/${milestones.length}`}
            trend={allUnlocked ? 'Complete set' : `${inProgress.length} to go`}
            trendTone={unlocked.length > 0 ? 'up' : 'neutral'}
            icon="trophy-outline"
            style={isWideKpi ? styles.kpiItem : [styles.kpiItem, styles.kpiItemHalf]}
          />
          <DashboardKpiCard
            label="Sessions"
            value={String(profile?.sessions.length ?? 0)}
            trend={hasSessions ? 'Logged on device' : 'None yet'}
            trendTone={hasSessions ? 'neutral' : 'down'}
            icon="mic-outline"
            style={isWideKpi ? styles.kpiItem : [styles.kpiItem, styles.kpiItemHalf]}
          />
          <DashboardKpiCard
            label="Best streak"
            value={String(profile?.practiceStreak ?? 0)}
            suffix={(profile?.practiceStreak ?? 0) > 0 ? 'days' : undefined}
            trend={(profile?.practiceStreak ?? 0) >= 3 ? 'Streak badge nearby' : 'Practice daily'}
            trendTone={(profile?.practiceStreak ?? 0) >= 3 ? 'accent' : 'neutral'}
            icon="flame-outline"
            style={isWideKpi ? styles.kpiItem : [styles.kpiItem, styles.kpiItemHalf]}
          />
        </View>

        {!hasSessions ? (
          <Panel variant="elevated">
            <EmptyState
              icon="trophy-outline"
              title="Your first badge awaits"
              description="Sing one session to unlock First Steps and start filling your trophy case."
              actionLabel="Start practicing"
              onAction={() => router.push('/session')}
            />
          </Panel>
        ) : null}

        {unlocked.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Unlocked</Text>
            <Text style={styles.sectionSub}>
              {unlocked.length} achievement{unlocked.length === 1 ? '' : 's'} earned
            </Text>
            <View style={[styles.grid, isWide && styles.gridWide]}>
              {unlocked.map((milestone) => (
                <AchievementCard key={milestone.id} milestone={milestone} compact={isWide} />
              ))}
            </View>
          </View>
        ) : null}

        {inProgress.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>In progress</Text>
            <Text style={styles.sectionSub}>Your next milestones to chase</Text>
            <View style={styles.list}>
              {inProgress.map((milestone) => (
                <AchievementCard key={milestone.id} milestone={milestone} />
              ))}
            </View>
          </View>
        ) : null}

        {allUnlocked ? (
          <View style={styles.celebration}>
            <Text style={styles.celebrationEmoji}>🏆</Text>
            <Text style={styles.celebrationTitle}>Legend status</Text>
            <Text style={styles.celebrationBody}>
              You unlocked every milestone. Maintain your edge with regular practice and new personal
              bests.
            </Text>
          </View>
        ) : null}

        <PrimaryButton
          label="Practice to earn more"
          subtitle="Open vocal assessment studio"
          onPress={() => router.push('/session')}
        />
      </View>
    </ScrollView>
  );
}

function createStyles(colors: ReturnType<typeof useAppPreferences>['colors']) {
  const webShadow = Platform.OS === 'web' ? ({ boxShadow: colors.shadow } as object) : {};

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
    grid: {
      gap: spacing.md,
      marginTop: spacing.xs,
    },
    gridWide: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    list: {
      gap: spacing.md,
      marginTop: spacing.xs,
    },
    celebration: {
      alignItems: 'center',
      padding: spacing.xxl,
      borderRadius: radius.xl,
      borderWidth: 1,
      borderColor: colors.accent,
      backgroundColor: colors.accentSoft,
      gap: spacing.sm,
      ...webShadow,
    },
    celebrationEmoji: {
      fontSize: 40,
    },
    celebrationTitle: {
      fontFamily: fonts.display,
      fontSize: 22,
      color: colors.text,
      textAlign: 'center',
    },
    celebrationBody: {
      fontFamily: fonts.body,
      fontSize: 14,
      lineHeight: 21,
      color: colors.textSecondary,
      textAlign: 'center',
      maxWidth: 360,
    },
  });
}
