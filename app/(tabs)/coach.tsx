import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { VocalCoachAgent } from '../../src/agent/vocalCoachAgent';
import { SingerProfile } from '../../src/agent/singerProfile';
import { VoiceRegister } from '../../src/audio/advancedAnalytics';
import { AgentCoachPanel } from '../../src/components/AgentCoachPanel';
import { LearningPathPanel } from '../../src/components/LearningPathPanel';
import { PracticePlanPanel } from '../../src/components/PracticePlanPanel';
import { GlassCard } from '../../src/components/ui/GlassCard';
import { PrimaryButton } from '../../src/components/ui/PrimaryButton';
import { Screen } from '../../src/components/ui/Screen';
import { SectionHeader } from '../../src/components/ui/SectionHeader';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { typography } from '../../src/theme/typography';

export default function CoachScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<SingerProfile | null>(null);
  const [report, setReport] = useState(() => new VocalCoachAgent().getDefaultReport());

  useEffect(() => {
    const agent = new VocalCoachAgent();
    agent.initialize().then((p) => {
      setProfile(p);
      setReport(agent.getDefaultReport());
      if (p.sessions.length > 0) {
        const last = p.sessions[0];
        setReport(
          agent.buildReport(
            {
              metrics: {
                pitchAccuracy: last.pitchAccuracy,
                stability: last.stability,
                breathControl: last.breathControl,
                toneClarity: last.toneClarity,
                vibrato: last.vibrato,
                dynamics: last.dynamics,
                overall: last.overall,
              },
              insights: {
                inTunePercent: last.inTunePercent,
                intonationBias: 'balanced',
                averageCents: 0,
                vocalRangeLow: null,
                vocalRangeHigh: null,
                rangeSemitones: 0,
                longestHoldSeconds: 0,
                vibratoRateHz: null,
                vibratoDepthCents: null,
                dynamicsRange: 0,
                sessionSeconds: last.sessionSeconds,
                notesDetected: 0,
                onPitchStreak: 0,
                singerLevel: last.overall >= 75 ? 'Confident singer' : 'Developing vocalist',
              },
              coaching: {
                primaryTip: '',
                exercise: '',
                strength: p.persistentStrength,
                focusArea: last.focusArea,
              },
              highlights: [],
            },
            {
              voiceRegister: (last.voiceRegister || 'Unknown') as VoiceRegister,
              pitchDrift: 'stable',
              phraseConsistency: 0,
              fatigueIndex: 0,
              warmupReadiness: 0,
              expressiveRange: 0,
              chestMixEstimate: '—',
            },
            p.sessions[1]?.overall ?? null
          )
        );
      }
    });
  }, []);

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>AGENTIC COACH</Text>
        <Text style={styles.title}>Your learning hub</Text>
        <Text style={styles.subtitle}>
          Personalized plans, progress memory, and milestones — tuned to how you actually sing.
        </Text>
      </View>

      {profile ? (
        <View style={styles.statsRow}>
          {[
            { label: 'Sessions', value: profile.sessions.length },
            { label: 'Minutes', value: profile.totalPracticeMinutes },
            { label: 'Streak', value: profile.practiceStreak },
          ].map((stat) => (
            <GlassCard key={stat.label} padding={spacing.lg} style={styles.statCard}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </GlassCard>
          ))}
        </View>
      ) : null}

      {profile && profile.sessions.length > 0 ? (
        <GlassCard glow padding={spacing.lg}>
          <SectionHeader title="Skill profile" subtitle="Rolling averages across sessions" />
          <View style={styles.skillGrid}>
            {[
              ['Pitch', profile.skillAverages.pitchAccuracy],
              ['Stability', profile.skillAverages.stability],
              ['Breath', profile.skillAverages.breathControl],
              ['Tone', profile.skillAverages.toneClarity],
            ].map(([label, value]) => (
              <View key={label} style={styles.skillItem}>
                <Text style={styles.skillValue}>{value}</Text>
                <Text style={styles.skillLabel}>{label}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.focusLine}>
            Focus · {profile.persistentWeakness}
          </Text>
          <Text style={styles.strengthLine}>Strength · {profile.persistentStrength}</Text>
          <Text style={styles.goal}>Goal: {profile.learningGoal}</Text>
        </GlassCard>
      ) : (
        <GlassCard padding={spacing.xl}>
          <Text style={styles.emptyTitle}>Your coach is waiting</Text>
          <Text style={styles.emptyBody}>
            Complete one live session and your agent will build a practice plan, track milestones,
            and remember what to work on next.
          </Text>
        </GlassCard>
      )}

      <AgentCoachPanel report={report} />
      <PracticePlanPanel steps={report.practicePlan} focus={report.nextSessionFocus} />
      <LearningPathPanel milestones={report.milestones} />

      <PrimaryButton
        label="Start practice session"
        subtitle="Open the live studio"
        onPress={() => router.push('/session')}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  eyebrow: {
    ...typography.caption,
    color: colors.accent,
  },
  title: {
    ...typography.h1,
  },
  subtitle: {
    ...typography.body,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...typography.h1,
    fontSize: 26,
  },
  statLabel: {
    ...typography.caption,
    marginTop: spacing.xs,
    letterSpacing: 0.8,
  },
  skillGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  skillItem: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  skillValue: {
    ...typography.h2,
    fontSize: 22,
  },
  skillLabel: {
    ...typography.bodySmall,
    marginTop: 2,
  },
  focusLine: {
    ...typography.bodyMedium,
    color: colors.primaryBright,
    fontFamily: typography.h3.fontFamily,
  },
  strengthLine: {
    ...typography.bodySmall,
    color: colors.success,
    marginTop: spacing.xs,
  },
  goal: {
    ...typography.bodySmall,
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
  emptyTitle: {
    ...typography.h2,
    marginBottom: spacing.sm,
  },
  emptyBody: {
    ...typography.body,
    textAlign: 'center',
  },
});
