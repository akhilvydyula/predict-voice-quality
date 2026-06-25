import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BREATH_PATTERNS, useBreathCoach } from '../../hooks/useBreathCoach';
import { PrimaryButton } from '../ui/PrimaryButton';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

type PatternKey = keyof typeof BREATH_PATTERNS;

const PATTERN_LABELS: Record<PatternKey, { title: string; desc: string }> = {
  warmup: { title: 'Warm-up', desc: '4 · 2 · 6 · 2 — gentle before singing' },
  support: { title: 'Support', desc: '4 · 4 · 8 · 2 — build breath control' },
  recovery: { title: 'Recovery', desc: '3 · 0 · 6 · 3 — reset after long sets' },
};

export function BreathCoachPanel() {
  const [patternKey, setPatternKey] = useState<PatternKey>('support');
  const pattern = BREATH_PATTERNS[patternKey];
  const { running, phaseLabel, phaseHint, secondsLeft, progress, cycles, start, stop } =
    useBreathCoach(pattern);

  const phaseColor =
    phaseLabel === 'Inhale'
      ? colors.primaryBright
      : phaseLabel === 'Hold'
        ? colors.warning
        : phaseLabel === 'Exhale'
          ? colors.accent
          : colors.textMuted;

  return (
    <View style={styles.wrap}>
      <Text style={styles.desc}>
        Guided breathing cycles for support, stamina, and calm before performances.
      </Text>

      <View style={styles.patternRow}>
        {(Object.keys(BREATH_PATTERNS) as PatternKey[]).map((key) => (
          <Pressable
            key={key}
            style={[styles.patternBtn, patternKey === key && styles.patternBtnActive]}
            onPress={() => {
              if (!running) setPatternKey(key);
            }}
          >
            <Text style={[styles.patternTitle, patternKey === key && styles.patternTitleActive]}>
              {PATTERN_LABELS[key].title}
            </Text>
            <Text style={styles.patternDesc}>{PATTERN_LABELS[key].desc}</Text>
          </Pressable>
        ))}
      </View>

      <View style={[styles.phaseCard, { borderColor: phaseColor }]}>
        <Text style={[styles.phaseLabel, { color: phaseColor }]}>{phaseLabel}</Text>
        <Text style={styles.countdown}>{running ? secondsLeft : '—'}</Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%`, backgroundColor: phaseColor }]} />
        </View>
        <Text style={styles.hint}>{phaseHint}</Text>
        {running ? <Text style={styles.cycles}>Cycle {cycles + 1}</Text> : null}
      </View>

      <PrimaryButton
        label={running ? 'Stop breathing coach' : 'Start breathing coach'}
        variant={running ? 'danger' : 'primary'}
        onPress={running ? stop : start}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.lg,
  },
  desc: {
    ...typography.body,
    textAlign: 'center',
  },
  patternRow: {
    gap: spacing.sm,
  },
  patternBtn: {
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    gap: 4,
  },
  patternBtnActive: {
    borderColor: colors.primaryBright,
    backgroundColor: colors.primaryMuted,
  },
  patternTitle: {
    ...typography.bodyBold,
    color: colors.textMuted,
  },
  patternTitleActive: {
    color: colors.primaryBright,
  },
  patternDesc: {
    ...typography.bodySmall,
  },
  phaseCard: {
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.xl,
    borderRadius: radius.lg,
    borderWidth: 2,
    backgroundColor: colors.surface,
  },
  phaseLabel: {
    ...typography.caption,
    letterSpacing: 2,
  },
  countdown: {
    ...typography.hero,
    fontSize: 56,
    lineHeight: 60,
  },
  progressTrack: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.surfaceElevated,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  hint: {
    ...typography.bodySmall,
    textAlign: 'center',
  },
  cycles: {
    ...typography.caption,
    color: colors.textDim,
  },
});
