import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BreathCoachPanel } from '../../src/components/tools/BreathCoachPanel';
import { MetronomePanel } from '../../src/components/tools/MetronomePanel';
import { RangeMapPanel } from '../../src/components/tools/RangeMapPanel';
import { ScaleGuidePanel } from '../../src/components/tools/ScaleGuidePanel';
import { TunerPanel } from '../../src/components/tools/TunerPanel';
import { GlassCard } from '../../src/components/ui/GlassCard';
import { Screen } from '../../src/components/ui/Screen';
import { SectionHeader } from '../../src/components/ui/SectionHeader';
import { SegmentedTabs } from '../../src/components/ui/SegmentedTabs';
import { useVoiceSession } from '../../src/context/VoiceAnalysisContext';
import { frequencyToNote } from '../../src/audio/musicTheory';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { typography } from '../../src/theme/typography';

type ToolTab = 'tuner' | 'metronome' | 'scales' | 'breath' | 'range';

export default function ToolsScreen() {
  const [tab, setTab] = useState<ToolTab>('tuner');
  const {
    isActive,
    isSupported,
    pitch,
    volume,
    error,
    insights,
    profile,
    start,
    stop,
  } = useVoiceSession();

  const needsMic = tab === 'tuner' || tab === 'scales';

  useEffect(() => {
    if (!needsMic && isActive) {
      void stop();
    }
  }, [needsMic, isActive, stop]);

  const toggleMic = () => {
    if (isActive) void stop();
    else void start();
  };

  const pitchMidi =
    pitch.frequency !== null ? (frequencyToNote(pitch.frequency)?.midi ?? null) : null;

  return (
    <Screen contentContainerStyle={styles.scroll}>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>SINGER TOOLKIT</Text>
        <Text style={styles.title}>Practice tools</Text>
        <Text style={styles.subtitle}>
          Tuner, metronome, scales, breath work, and your vocal range — everything in one studio.
        </Text>
      </View>

      <SegmentedTabs
        tabs={[
          { key: 'tuner', label: 'Tuner' },
          { key: 'metronome', label: 'Tempo' },
          { key: 'scales', label: 'Scales' },
          { key: 'breath', label: 'Breath' },
          { key: 'range', label: 'Range' },
        ]}
        active={tab}
        onChange={setTab}
        scrollable
      />

      <GlassCard glow padding={spacing.xl}>
        {tab === 'tuner' ? (
          <TunerPanel
            isActive={isActive}
            isSupported={isSupported}
            error={error}
            pitch={pitch}
            volume={volume}
            onToggle={toggleMic}
          />
        ) : null}

        {tab === 'metronome' ? <MetronomePanel /> : null}

        {tab === 'scales' ? (
          <ScaleGuidePanel isActive={isActive} pitchMidi={pitchMidi} onToggleMic={toggleMic} />
        ) : null}

        {tab === 'breath' ? <BreathCoachPanel /> : null}

        {tab === 'range' ? <RangeMapPanel insights={insights} profile={profile} /> : null}
      </GlassCard>

      {tab !== 'range' ? (
        <SectionHeader
          title="Pro tip"
          subtitle={
            tab === 'metronome'
              ? 'Pair the metronome with Scales for even rhythm up and down the ladder.'
              : tab === 'breath'
                ? 'Do 3 breath cycles before your first note of the day.'
                : 'Run a full Practice session after tools to log progress with your coach.'
          }
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    gap: spacing.lg,
    paddingBottom: 120,
  },
  hero: {
    gap: spacing.sm,
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
});
