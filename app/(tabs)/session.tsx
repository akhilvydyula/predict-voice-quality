import { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DevDebugOverlay } from '../../src/components/dev/DevDebugOverlay';
import { AdvancedAnalyticsPanel } from '../../src/components/AdvancedAnalyticsPanel';
import { AgentCoachPanel } from '../../src/components/AgentCoachPanel';
import { CoachingPanel } from '../../src/components/CoachingPanel';
import { LearningPathPanel } from '../../src/components/LearningPathPanel';
import { LiveAgentBanner } from '../../src/components/LiveAgentBanner';
import { MetricCard } from '../../src/components/MetricCard';
import { PitchHistoryChart } from '../../src/components/PitchHistoryChart';
import { PracticePitchDisplay } from '../../src/components/practice/PracticePitchDisplay';
import { PracticeRecordButton } from '../../src/components/practice/PracticeRecordButton';
import { PracticeScoreRing } from '../../src/components/practice/PracticeScoreRing';
import { PracticeScreenHeader } from '../../src/components/practice/PracticeScreenHeader';
import { PracticePlanPanel } from '../../src/components/PracticePlanPanel';
import { SessionSummaryCard } from '../../src/components/SessionSummaryCard';
import { SingerInsightsPanel } from '../../src/components/SingerInsightsPanel';
import { useAppShellLayout } from '../../src/components/layout/AppShell';
import { Panel } from '../../src/components/ui/Panel';
import { SegmentedTabs } from '../../src/components/ui/SegmentedTabs';
import { useDevMode } from '../../src/context/DevModeContext';
import { useVoiceSession } from '../../src/context/VoiceAnalysisContext';
import { colors } from '../../src/theme/colors';
import { layout } from '../../src/theme/layout';
import { radius, spacing } from '../../src/theme/spacing';
import { fonts } from '../../src/theme/typography';

type SessionTab = 'live' | 'stats' | 'coach';

export default function SessionScreen() {
  const [tab, setTab] = useState<SessionTab>('live');
  const insets = useSafeAreaInsets();
  const { showSidebar } = useAppShellLayout();
  const { enabled: devMode, flags } = useDevMode();
  const {
    isActive,
    isSupported,
    pitch,
    metrics,
    insights,
    advanced,
    coaching,
    pitchHistory,
    sessionSummary,
    agentReport,
    liveGuidance,
    volume,
    error,
    telemetry,
    start,
    stop,
  } = useVoiceSession();

  useEffect(() => {
    return () => {
      void stop();
    };
  }, [stop]);

  useEffect(() => {
    if (isActive) setTab('live');
  }, [isActive]);

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
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.inner}>
        <PracticeScreenHeader />

        <View style={styles.titleBlock}>
          <Text style={styles.title}>Practice</Text>
          <Text style={styles.subtitle}>Warm up your voice and train your pitch.</Text>
        </View>

        {error ? (
          <View style={styles.alertBanner}>
            <Text style={styles.alertText}>{error}</Text>
          </View>
        ) : null}

        {!isSupported && !error ? (
          <View style={styles.alertBanner}>
            <Text style={styles.alertText}>
              Microphone not available. Open this in a browser with mic permissions, or use Expo Go on your phone.
            </Text>
          </View>
        ) : null}

        {liveGuidance ? (
          <View style={styles.bannerWrap}>
            <LiveAgentBanner guidance={liveGuidance} />
          </View>
        ) : null}

        <View style={styles.stageCard}>
          {devMode && flags.showLiveOverlay && isActive ? (
            <DevDebugOverlay telemetry={telemetry} pitch={pitch} />
          ) : null}

          <PracticePitchDisplay
            noteName={pitch.noteName}
            octave={pitch.octave}
            cents={pitch.cents}
            frequency={pitch.frequency}
            volume={volume}
            isActive={isActive}
          />

          <PracticeScoreRing score={metrics.overall} />

          <PracticeRecordButton
            isRecording={isActive}
            onPress={() => (isActive ? void stop() : void start())}
            disabled={!isSupported && Boolean(error)}
            style={styles.recordButton}
          />
        </View>

        <SegmentedTabs
          tabs={[
            { key: 'live', label: 'Signal' },
            { key: 'stats', label: 'Metrics' },
            { key: 'coach', label: 'Coach' },
          ]}
          active={tab}
          onChange={setTab}
        />

        {tab === 'live' ? (
          <View style={styles.panel}>
            <Panel title="Pitch trail" subtitle="Last few moments of intonation">
              <PitchHistoryChart history={pitchHistory} />
            </Panel>
            <CoachingPanel coaching={coaching} />
          </View>
        ) : null}

        {tab === 'stats' ? (
          <View style={styles.panel}>
            <View style={styles.metricsGrid}>
              <MetricCard label="Pitch" value={metrics.pitchAccuracy} />
              <MetricCard label="Stability" value={metrics.stability} />
              <MetricCard label="Breath" value={metrics.breathControl} />
              <MetricCard label="Tone" value={metrics.toneClarity} />
              <MetricCard label="Vibrato" value={metrics.vibrato} />
              <MetricCard label="Dynamics" value={metrics.dynamics} />
            </View>
            <SingerInsightsPanel insights={insights} />
            <AdvancedAnalyticsPanel advanced={advanced} />
          </View>
        ) : null}

        {tab === 'coach' ? (
          <View style={styles.panel}>
            {sessionSummary && !isActive ? <SessionSummaryCard summary={sessionSummary} /> : null}
            {agentReport ? (
              <>
                <AgentCoachPanel report={agentReport} />
                <PracticePlanPanel
                  steps={agentReport.practicePlan}
                  focus={agentReport.nextSessionFocus}
                />
                <LearningPathPanel milestones={agentReport.milestones} />
              </>
            ) : (
              <Panel>
                <View style={styles.emptyCoach}>
                  <Text style={styles.emptyCoachTitle}>No coach report yet</Text>
                  <Text style={styles.emptyCoachText}>
                    Complete a session to unlock your personalised practice plan and milestones.
                  </Text>
                </View>
              </Panel>
            )}
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

const webShadow = Platform.OS === 'web' ? ({ boxShadow: colors.shadow } as object) : {};

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
    gap: spacing.lg,
  },
  titleBlock: {
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.5,
    color: colors.text,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  alertBanner: {
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.25)',
    padding: spacing.md,
  },
  alertText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.danger,
    lineHeight: 19,
  },
  bannerWrap: {
    marginBottom: spacing.xs,
  },
  stageCard: {
    width: '100%',
    alignItems: 'center',
    gap: spacing.lg,
    padding: spacing.xxl,
    paddingVertical: spacing.xxxl,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    position: 'relative',
    overflow: 'hidden',
    ...webShadow,
  },
  recordButton: {
    marginTop: spacing.md,
    maxWidth: layout.maxActionWidth,
  },
  panel: {
    gap: spacing.lg,
    marginTop: spacing.sm,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  emptyCoach: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  emptyCoachTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
  },
  emptyCoachText: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 320,
  },
});
