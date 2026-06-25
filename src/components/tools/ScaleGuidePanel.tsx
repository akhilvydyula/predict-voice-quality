import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  buildScale,
  nearestScaleNote,
  ROOT_NOTES,
  RootNote,
  scaleLabel,
  ScaleType,
} from '../../audio/scales';
import { PrimaryButton } from '../ui/PrimaryButton';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

type ScaleGuidePanelProps = {
  isActive: boolean;
  pitchMidi: number | null;
  onToggleMic: () => void;
};

const SCALE_TYPES: { key: ScaleType; label: string }[] = [
  { key: 'major', label: 'Major' },
  { key: 'natural_minor', label: 'Minor' },
  { key: 'chromatic', label: 'Chromatic' },
];

export function ScaleGuidePanel({ isActive, pitchMidi, onToggleMic }: ScaleGuidePanelProps) {
  const [root, setRoot] = useState<RootNote>('C');
  const [octave, setOctave] = useState(4);
  const [scaleType, setScaleType] = useState<ScaleType>('major');

  const scale = useMemo(() => buildScale(root, octave, scaleType), [root, octave, scaleType]);
  const matched = pitchMidi !== null ? nearestScaleNote(pitchMidi, scale) : null;

  return (
    <View style={styles.wrap}>
      <Text style={styles.desc}>
        Sing up and down the scale. Matching notes highlight when the tuner mic is on.
      </Text>

      <Text style={styles.scaleTitle}>{scaleLabel(root, scaleType)} · octave {octave}</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rootRow}>
        {ROOT_NOTES.map((note) => (
          <Pressable
            key={note}
            style={[styles.chip, root === note && styles.chipActive]}
            onPress={() => setRoot(note)}
          >
            <Text style={[styles.chipText, root === note && styles.chipTextActive]}>{note}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.typeRow}>
        {SCALE_TYPES.map((item) => (
          <Pressable
            key={item.key}
            style={[styles.typeBtn, scaleType === item.key && styles.typeBtnActive]}
            onPress={() => setScaleType(item.key)}
          >
            <Text style={[styles.typeText, scaleType === item.key && styles.typeTextActive]}>
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.octaveRow}>
        {[3, 4, 5].map((o) => (
          <Pressable
            key={o}
            style={[styles.octaveBtn, octave === o && styles.octaveBtnActive]}
            onPress={() => setOctave(o)}
          >
            <Text style={[styles.octaveText, octave === o && styles.octaveTextActive]}>Oct {o}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.ladder}>
        {scale.map((note, index) => {
          const label = `${note.name}${note.octave}`;
          const isMatch =
            matched !== null &&
            matched.name === note.name &&
            matched.octave === note.octave &&
            isActive;
          return (
            <View key={`${label}-${index}`} style={[styles.noteRow, isMatch && styles.noteRowMatch]}>
              <Text style={[styles.noteIndex, isMatch && styles.noteIndexMatch]}>{index + 1}</Text>
              <Text style={[styles.noteLabel, isMatch && styles.noteLabelMatch]}>{label}</Text>
              <Text style={styles.noteHz}>{Math.round(note.frequency)} Hz</Text>
            </View>
          );
        })}
      </View>

      <PrimaryButton
        label={isActive ? 'Stop pitch match' : 'Enable pitch match'}
        subtitle="Uses tuner microphone"
        variant={isActive ? 'danger' : 'primary'}
        onPress={onToggleMic}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.md,
  },
  desc: {
    ...typography.body,
    textAlign: 'center',
  },
  scaleTitle: {
    ...typography.h3,
    textAlign: 'center',
    color: colors.primaryBright,
  },
  rootRow: {
    gap: spacing.xs,
    paddingVertical: spacing.xs,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: {
    borderColor: colors.primaryBright,
    backgroundColor: colors.primaryMuted,
  },
  chipText: {
    ...typography.bodyBold,
    fontSize: 13,
    color: colors.textMuted,
  },
  chipTextActive: {
    color: colors.primaryBright,
  },
  typeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  typeBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typeBtnActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
  typeText: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  typeTextActive: {
    color: colors.accent,
    fontFamily: typography.bodyBold.fontFamily,
  },
  octaveRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  octaveBtn: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  octaveBtnActive: {
    borderColor: colors.warning,
    backgroundColor: colors.warningSoft,
  },
  octaveText: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  octaveTextActive: {
    color: colors.warning,
    fontFamily: typography.bodyBold.fontFamily,
  },
  ladder: {
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  noteRowMatch: {
    borderColor: colors.success,
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
  },
  noteIndex: {
    ...typography.caption,
    width: 20,
    color: colors.textDim,
  },
  noteIndexMatch: {
    color: colors.success,
  },
  noteLabel: {
    ...typography.bodyBold,
    flex: 1,
    fontSize: 16,
  },
  noteLabelMatch: {
    color: colors.success,
  },
  noteHz: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
});
