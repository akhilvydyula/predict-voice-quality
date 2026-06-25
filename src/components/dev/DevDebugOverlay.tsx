import { StyleSheet, Text, View } from 'react-native';

import { DebugTelemetry } from '../../hooks/useVoiceAnalysis';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

const PlatformMono = 'SpaceGrotesk_600SemiBold';

type DevDebugOverlayProps = {
  telemetry: DebugTelemetry;
  pitch: {
    frequency: number | null;
    cents: number;
    confidence: number;
    noteName: string | null;
    octave: number | null;
  };
};

export function DevDebugOverlay({ telemetry, pitch }: DevDebugOverlayProps) {
  return (
    <View style={styles.overlay} pointerEvents="none">
      <Text style={styles.line}>DEV · {telemetry.audioSource}</Text>
      <Text style={styles.line}>
        buf #{telemetry.bufferCount} · {telemetry.lastSampleRate}Hz · {telemetry.lastProcessingMs}ms
      </Text>
      <Text style={styles.line}>
        {pitch.noteName}
        {pitch.octave ?? ''} · {pitch.frequency ? `${Math.round(pitch.frequency)}Hz` : '—'} ·{' '}
        {pitch.cents}¢ · conf {(pitch.confidence * 100).toFixed(0)}%
      </Text>
      <Text style={styles.line}>samples {telemetry.sessionSampleCount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.72)',
    borderRadius: radius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.warning,
    zIndex: 20,
    gap: 2,
  },
  line: {
    fontFamily: PlatformMono,
    fontSize: 10,
    color: colors.warning,
    lineHeight: 14,
  },
});
