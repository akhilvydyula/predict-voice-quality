import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useMetronome } from '../../hooks/useMetronome';
import { PrimaryButton } from '../ui/PrimaryButton';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export function MetronomePanel() {
  const {
    bpm,
    playing,
    beat,
    beatsPerBar,
    setBeatsPerBar,
    toggle,
    stop,
    adjustBpm,
    setBpm,
  } = useMetronome(84);

  const pulse = useSharedValue(1);

  useEffect(() => {
    if (!playing) {
      pulse.value = withTiming(1, { duration: 120 });
      return;
    }
    pulse.value = withSequence(
      withTiming(1.12, { duration: 60 }),
      withTiming(1, { duration: 140 })
    );
  }, [beat, playing, pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <View style={styles.wrap}>
      <Text style={styles.desc}>
        Keep tempo steady for scales, arpeggios, and song runs. Downbeat pulses stronger.
      </Text>

      <Animated.View style={[styles.beatRing, pulseStyle, beat === 0 && playing && styles.downbeat]}>
        <Text style={styles.bpmValue}>{bpm}</Text>
        <Text style={styles.bpmLabel}>BPM</Text>
      </Animated.View>

      <View style={styles.beatDots}>
        {Array.from({ length: beatsPerBar }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              playing && index === beat && styles.dotActive,
              index === 0 && styles.dotDown,
            ]}
          />
        ))}
      </View>

      <View style={styles.bpmRow}>
        <Pressable style={styles.stepBtn} onPress={() => adjustBpm(-5)}>
          <Text style={styles.stepBtnText}>−5</Text>
        </Pressable>
        <Pressable style={styles.stepBtn} onPress={() => adjustBpm(-1)}>
          <Text style={styles.stepBtnText}>−1</Text>
        </Pressable>
        <Pressable style={styles.stepBtn} onPress={() => adjustBpm(1)}>
          <Text style={styles.stepBtnText}>+1</Text>
        </Pressable>
        <Pressable style={styles.stepBtn} onPress={() => adjustBpm(5)}>
          <Text style={styles.stepBtnText}>+5</Text>
        </Pressable>
      </View>

      <View style={styles.presetRow}>
        {[60, 72, 84, 96, 120].map((preset) => (
          <Pressable
            key={preset}
            style={[styles.preset, bpm === preset && styles.presetActive]}
            onPress={() => setBpm(preset)}
          >
            <Text style={[styles.presetText, bpm === preset && styles.presetTextActive]}>
              {preset}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.meterRow}>
        <Text style={styles.meterLabel}>Time signature</Text>
        <View style={styles.meterBtns}>
          {[3, 4, 6].map((n) => (
            <Pressable
              key={n}
              style={[styles.meterBtn, beatsPerBar === n && styles.meterBtnActive]}
              onPress={() => {
                setBeatsPerBar(n);
                stop();
              }}
            >
              <Text style={[styles.meterBtnText, beatsPerBar === n && styles.meterBtnTextActive]}>
                {n}/4
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <PrimaryButton
        label={playing ? 'Stop metronome' : 'Start metronome'}
        variant={playing ? 'danger' : 'primary'}
        onPress={toggle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.lg,
    alignItems: 'center',
  },
  desc: {
    ...typography.body,
    textAlign: 'center',
  },
  beatRing: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downbeat: {
    borderColor: colors.primaryBright,
    backgroundColor: colors.primaryMuted,
  },
  bpmValue: {
    ...typography.hero,
    fontSize: 48,
    lineHeight: 52,
  },
  bpmLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  beatDots: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dotActive: {
    backgroundColor: colors.primaryBright,
    borderColor: colors.primaryBright,
  },
  dotDown: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  bpmRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  stepBtn: {
    minWidth: 52,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  stepBtnText: {
    ...typography.bodyBold,
    color: colors.text,
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  preset: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  presetActive: {
    borderColor: colors.primaryBright,
    backgroundColor: colors.primaryMuted,
  },
  presetText: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  presetTextActive: {
    color: colors.primaryBright,
    fontFamily: typography.bodyBold.fontFamily,
  },
  meterRow: {
    width: '100%',
    gap: spacing.sm,
  },
  meterLabel: {
    ...typography.bodySmall,
    textAlign: 'center',
  },
  meterBtns: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  meterBtn: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  meterBtnActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
  meterBtnText: {
    ...typography.bodyBold,
    color: colors.textMuted,
  },
  meterBtnTextActive: {
    color: colors.accent,
  },
});
