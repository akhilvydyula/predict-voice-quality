import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

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
import { PageHeader } from '../../src/components/ui/PageHeader';
import { PrimaryButton } from '../../src/components/ui/PrimaryButton';
import { Screen } from '../../src/components/ui/Screen';
import { SectionHeader } from '../../src/components/ui/SectionHeader';
import { SegmentedTabs } from '../../src/components/ui/SegmentedTabs';
import { StatusBadge } from '../../src/components/ui/StatusBadge';
import { useDevMode } from '../../src/context/DevModeContext';
import { useVoiceSession } from '../../src/context/VoiceAnalysisContext';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { typography } from '../../src/theme/typography';

type SessionTab = 'live' | 'stats' | 'coach';

export default function SessionScreen() {
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
    <Screen>
        <PageHeader
          eyebrow="Live assessment"
          title={isActive ? 'Session in progress' : 'Vocal assessment studio'}
          subtitle={
            isActive
              ? 'Real-time inference across pitch, dynamics, and coach guidance.'
              : 'Initialize microphone capture to begin enterprise vocal analysis.'
          }
          actions={
            profile && profile.practiceStreak > 0 ? (
              <StatusBadge label={`${profile.practiceStreak}d streak`} tone="info" />
            ) : undefined
          }
        />

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
              ? 'Maintain steady phrasing — coach intelligence updates continuously.'
              : 'Start recording to begin the live vocal assessment pipeline.'}
          </Text>
          <PrimaryButton
            label={isActive ? 'Stop session' : 'Start recording'}
            variant={isActive ? 'danger' : 'primary'}
            onPress={() => (isActive ? void stop() : void start())}
            style={styles.recordButton}
          />
        </GlassCard>

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
            <SectionHeader title="Pitch trail" subtitle="Last few moments of intonation" />
            <PitchHistoryChart history={pitchHistory} />
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
              <GlassCard padding={spacing.lg}>
                <Text style={styles.emptyCoach}>
                  Complete a session to unlock your agent-built practice plan and milestones.
                </Text>
              </GlassCard>
            )}
          </View>
        ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
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
  recordButton: {
    alignSelf: 'stretch',
    marginTop: spacing.sm,
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
});
