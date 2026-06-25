import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PitchMeter } from '../PitchMeter';
import { PrimaryButton } from '../ui/PrimaryButton';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

type TunerPanelProps = {
  isActive: boolean;
  isSupported: boolean;
  error: string | null;
  pitch: {
    noteName: string | null;
    octave: number | null;
    cents: number;
    frequency: number | null;
  };
  volume: number;
  onToggle: () => void;
};

export function TunerPanel({
  isActive,
  isSupported,
  error,
  pitch,
  volume,
  onToggle,
}: TunerPanelProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.desc}>
        Chromatic tuner for warm-ups and pitch checks. Sing a note and watch the meter center on
        green.
      </Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!isSupported && !error ? (
        <Text style={styles.error}>Microphone required — use Expo Go on a phone or web.</Text>
      ) : null}
      <PitchMeter
        noteName={pitch.noteName}
        octave={pitch.octave}
        cents={pitch.cents}
        frequency={pitch.frequency}
        volume={volume}
        isActive={isActive}
      />
      <PrimaryButton
        label={isActive ? 'Stop tuner' : 'Start tuner'}
        subtitle={isActive ? 'Listening…' : 'Uses microphone'}
        variant={isActive ? 'danger' : 'primary'}
        onPress={onToggle}
      />
      <View style={styles.tips}>
        <Tip text="Hold each note 3–4 seconds for a stable reading" />
        <Tip text="Stay within ±10¢ of center for “in tune”" />
        <Tip text="Use before practice to calibrate your ear" />
      </View>
    </View>
  );
}

function Tip({ text }: { text: string }) {
  return (
    <View style={styles.tipRow}>
      <Text style={styles.tipDot}>•</Text>
      <Text style={styles.tipText}>{text}</Text>
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
  error: {
    ...typography.bodySmall,
    color: colors.danger,
    textAlign: 'center',
  },
  tips: {
    gap: spacing.sm,
    paddingTop: spacing.sm,
  },
  tipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  tipDot: {
    color: colors.primaryBright,
    fontSize: 14,
  },
  tipText: {
    ...typography.bodySmall,
    flex: 1,
  },
});
