import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DevDebugOverlay } from '../../src/components/dev/DevDebugOverlay';
import { AdvancedAnalyticsPanel } from '../../src/components/AdvancedAnalyticsPanel';
import { AgentCoachPanel } from '../../src/components/AgentCoachPanel';
import { CoachingPanel } from '../../src/components/CoachingPanel';
import { LearningPathPanel } from '../../src/components/LearningPathPanel';
import { LiveAgentBanner } from '../../src/components/LiveAgentBanner';
import { MetricCard } from '../../src/components/MetricCard';
import { PitchHistoryChart } from '../../src/components/PitchHistoryChart';
import { PitchMeter } from '../../src/components/PitchMeter';
import { PracticePlanPanel } from '../../src/components/PracticePlanPanel';
import { ScoreRing } from '../../src/components/ScoreRing';
import { SessionSummaryCard } from '../../src/components/SessionSummaryCard';
import { SingerInsightsPanel } from '../../src/components/SingerInsightsPanel';
import { GlassCard } from '../../src/components/ui/GlassCard';
import { MicFAB } from '../../src/components/ui/MicFAB';
import { Screen } from '../../src/components/ui/Screen';
import { SectionHeader } from '../../src/components/ui/SectionHeader';
import { SegmentedTabs } from '../../src/components/ui/SegmentedTabs';
import { useDevMode } from '../../src/context/DevModeContext';
import { useVoiceSession } from '../../src/context/VoiceAnalysisContext';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { typography } from '../../src/theme/typography';

type SessionTab = 'live' | 'stats' | 'coach';

export default function SessionScreen() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<SessionTab>('live');
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
    profile,
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
    <View style={styles.root}>
      <Screen contentContainerStyle={styles.scrollExtra}>
        <View style={styles.topBar}>
          <View>
            <Text style={styles.eyebrow}>PRACTICE STUDIO</Text>
            <Text style={styles.title}>{isActive ? 'Live now' : 'Ready to sing'}</Text>
          </View>
          {profile && profile.practiceStreak > 0 ? (
            <View style={styles.streakPill}>
              <Text style={styles.streakText}>🔥 {profile.practiceStreak}d</Text>
            </View>
          ) : null}
        </View>

        {error ? (
          <GlassCard style={styles.alert} padding={spacing.lg}>
            <Text style={styles.errorText}>{error}</Text>
          </GlassCard>
        ) : null}

        {!isSupported && !error ? (
          <GlassCard padding={spacing.lg}>
            <Text style={styles.errorText}>
              Use Expo Go on your phone or a browser with microphone support.
            </Text>
          </GlassCard>
        ) : null}

        <LiveAgentBanner guidance={liveGuidance} />

        <GlassCard glow padding={spacing.xl} style={styles.stage}>
          {devMode && flags.showLiveOverlay && isActive ? (
            <DevDebugOverlay telemetry={telemetry} pitch={pitch} />
          ) : null}
          <PitchMeter
            noteName={pitch.noteName}
            octave={pitch.octave}
            cents={pitch.cents}
            frequency={pitch.frequency}
            volume={volume}
            isActive={isActive}
          />
          <View style={styles.scoreWrap}>
            <ScoreRing score={metrics.overall} />
          </View>
          <Text style={styles.stageHint}>
            {isActive
              ? 'Sing naturally — the coach responds in real time'
              : 'Tap Sing below to begin your session'}
          </Text>
        </GlassCard>

        <SegmentedTabs
          tabs={[
            { key: 'live', label: 'Live' },
            { key: 'stats', label: 'Analytics' },
            { key: 'coach', label: 'Coach' },
          ]}
          active={tab}
          onChange={setTab}
        />

        {tab === 'live' ? (
          <View style={styles.panel}>
            <SectionHeader title="Pitch trail" subtitle="Last few moments of intonation" />
            <PitchHistoryChart history={pitchHistory} />
            <CoachingPanel coaching={coaching} />
          </View>
        ) : null}

        {tab === 'stats' ? (
          <View style={styles.panel}>
            <View style={styles.metricsGrid}>
              <MetricCard label="Pitch" value={metrics.pitchAccuracy} icon="🎵" />
              <MetricCard label="Stability" value={metrics.stability} icon="🎯" />
              <MetricCard label="Breath" value={metrics.breathControl} icon="💨" />
              <MetricCard label="Tone" value={metrics.toneClarity} icon="✨" />
              <MetricCard label="Vibrato" value={metrics.vibrato} icon="〰️" />
              <MetricCard label="Dynamics" value={metrics.dynamics} icon="📈" />
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
              <GlassCard padding={spacing.lg}>
                <Text style={styles.emptyCoach}>
                  Complete a session to unlock your agent-built practice plan and milestones.
                </Text>
              </GlassCard>
            )}
          </View>
        ) : null}
      </Screen>

      <View style={[styles.fabBar, { paddingBottom: insets.bottom + spacing.tabBar }]}>
        <MicFAB
          isActive={isActive}
          onPress={() => (isActive ? void stop() : void start())}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollExtra: {
    gap: spacing.lg,
    paddingBottom: 160,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  eyebrow: {
    ...typography.caption,
    color: colors.primaryBright,
  },
  title: {
    ...typography.h1,
    marginTop: spacing.xs,
  },
  streakPill: {
    backgroundColor: colors.warningSoft,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  streakText: {
    ...typography.bodyBold,
    color: colors.warning,
    fontSize: 13,
  },
  alert: {
    borderColor: colors.danger,
  },
  errorText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  stage: {
    alignItems: 'center',
    gap: spacing.lg,
    position: 'relative',
  },
  scoreWrap: {
    marginTop: spacing.sm,
  },
  stageHint: {
    ...typography.bodySmall,
    textAlign: 'center',
  },
  panel: {
    gap: spacing.lg,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  emptyCoach: {
    ...typography.body,
    textAlign: 'center',
  },
  fabBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingTop: spacing.md,
    backgroundColor: 'transparent',
  },
});
