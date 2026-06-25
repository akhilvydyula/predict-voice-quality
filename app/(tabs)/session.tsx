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
import { SegmentedTabs } from '../../src/components/ui/SegmentedTabs';
import { StatusBadge } from '../../src/components/ui/StatusBadge';
import { useDevMode } from '../../src/context/DevModeContext';
import { useVoiceSession } from '../../src/context/VoiceAnalysisContext';
import { colors } from '../../src/theme/colors';
import { layout } from '../../src/theme/layout';
import { radius, spacing } from '../../src/theme/spacing';
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
        eyebrow="Practice"
        title={isActive ? 'Listening…' : 'Vocal studio'}
        subtitle={
          isActive
            ? 'Sing freely — your pitch, tone, and score are updating live.'
            : 'Tap the button below to start real-time vocal analysis.'
        }
        actions={
          profile && profile.practiceStreak > 0 ? (
            <StatusBadge label={`${profile.practiceStreak}d streak`} tone="info" />
          ) : isActive ? (
            <StatusBadge label="Recording" tone="success" />
          ) : undefined
        }
      />

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

      <LiveAgentBanner guidance={liveGuidance} />

      {/* Stage card */}
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

        <ScoreRing score={metrics.overall} />

        {/* Status hint */}
        <View style={styles.hintRow}>
          {isActive ? <View style={styles.liveDot} /> : null}
          <Text style={styles.stageHint}>
            {isActive
              ? 'Score updates as you sing'
              : 'Ready to start'}
          </Text>
        </View>

        <PrimaryButton
          label={isActive ? 'Stop session' : 'Start recording'}
          variant={isActive ? 'danger' : 'primary'}
          onPress={() => (isActive ? void stop() : void start())}
          style={styles.recordButton}
        />
      </GlassCard>

      {/* Tab switcher */}
      <SegmentedTabs
        tabs={[
          { key: 'live', label: 'Signal' },
          { key: 'stats', label: 'Metrics' },
          { key: 'coach', label: 'Coach' },
        ]}
        active={tab}
        onChange={setTab}
      />

      {/* Tab content */}
      {tab === 'live' ? (
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Pitch trail</Text>
          <Text style={styles.panelSubtitle}>Last few moments of intonation</Text>
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
            <View style={styles.emptyCoachWrap}>
              <Text style={styles.emptyCoachTitle}>No coach report yet</Text>
              <Text style={styles.emptyCoach}>
                Complete a session to unlock your personalised practice plan and milestones.
              </Text>
            </View>
          )}
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  alertBanner: {
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    padding: spacing.md,
  },
  alertText: {
    ...typography.bodySmall,
    color: colors.danger,
  },
  stage: {
    alignItems: 'center',
    gap: spacing.lg,
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
    paddingVertical: spacing.xxl,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  stageHint: {
    ...typography.bodySmall,
    textAlign: 'center',
    color: colors.textMuted,
  },
  recordButton: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: layout.maxActionWidth,
    marginTop: spacing.xs,
  },
  panel: {
    gap: spacing.lg,
  },
  panelTitle: {
    ...typography.h3,
  },
  panelSubtitle: {
    ...typography.bodySmall,
    marginTop: -spacing.sm,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  emptyCoachWrap: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  emptyCoachTitle: {
    ...typography.h3,
    textAlign: 'center',
  },
  emptyCoach: {
    ...typography.body,
    textAlign: 'center',
  },
});
