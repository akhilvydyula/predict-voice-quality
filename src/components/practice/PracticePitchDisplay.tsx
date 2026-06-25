import { Platform, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { fonts } from '../../theme/typography';

type PracticePitchDisplayProps = {
  noteName: string | null;
  octave: number | null;
  cents: number;
  frequency: number | null;
  volume: number;
  isActive: boolean;
};

const LANE_WIDTH = 320;
const CENTER = LANE_WIDTH / 2;
const TICKS = [-50, -25, 0, 25, 50];

function formatPitchCents(cents: number): string {
  if (Math.abs(cents) < 1) return '0 cents';
  const sign = cents > 0 ? '+' : '';
  return `${sign}${Math.round(cents)} cents`;
}

export function PracticePitchDisplay({
  noteName,
  octave,
  cents,
  frequency,
  volume,
  isActive,
}: PracticePitchDisplayProps) {
  const clampedCents = Math.max(-50, Math.min(50, cents));
  const markerLeft = CENTER + (clampedCents / 50) * (LANE_WIDTH / 2 - 24);
  const hasNote = Boolean(noteName);
  const inTune = hasNote && Math.abs(cents) <= 25;
  const zoneColor =
    Math.abs(cents) <= 10 ? colors.success : Math.abs(cents) <= 25 ? colors.success : colors.warning;
  const displayFreq =
    frequency && hasNote
      ? `${frequency.toFixed(1)} Hz`
      : isActive
        ? '···'
        : '—';

  return (
    <View style={styles.wrap}>
      <Text style={styles.targetLabel}>Target note</Text>
      <Text style={styles.note}>{hasNote ? `${noteName}${octave ?? ''}` : isActive ? '···' : '—'}</Text>
      <Text style={styles.freq}>{displayFreq}</Text>

      {inTune ? <Text style={styles.inTune}>In tune!</Text> : <View style={styles.inTuneSpacer} />}

      <View style={styles.laneOuter}>
        <View style={styles.lane}>
          <View style={styles.greenZone} />
          {TICKS.map((tick) => {
            const left = CENTER + (tick / 50) * (LANE_WIDTH / 2 - 24);
            return (
              <View
                key={tick}
                style={[
                  styles.tick,
                  { left },
                  tick === 0 && styles.tickCenter,
                ]}
              />
            );
          })}
          <View
            style={[
              styles.markerCol,
              { left: markerLeft },
              { transform: [{ scale: 1 + volume * 0.25 }] },
            ]}
          >
            <View
              style={[
                styles.markerDot,
                {
                  backgroundColor: isActive && hasNote ? zoneColor : colors.textDim,
                  ...(Platform.OS === 'web' && isActive && hasNote
                    ? { boxShadow: `0 0 12px ${zoneColor}` }
                    : {}),
                },
              ]}
            />
            <View
              style={[
                styles.markerStem,
                { backgroundColor: isActive && hasNote ? zoneColor : colors.textDim },
              ]}
            />
          </View>
        </View>
        <View style={styles.tickLabels}>
          {TICKS.map((tick) => (
            <Text key={tick} style={styles.tickLabel}>
              {tick > 0 ? `+${tick}` : tick}
            </Text>
          ))}
        </View>
        <Text style={styles.centsAxis}>cents</Text>
      </View>

      <View style={styles.diffBlock}>
        <Text style={styles.diffLabel}>Pitch difference</Text>
        <Text
          style={[
            styles.diffValue,
            {
              color:
                isActive && hasNote
                  ? zoneColor
                  : colors.textMuted,
            },
          ]}
        >
          {hasNote ? formatPitchCents(cents) : isActive ? 'Listening…' : 'Waiting for voice'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    width: '100%',
    gap: spacing.sm,
  },
  targetLabel: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: -spacing.xs,
  },
  note: {
    fontFamily: fonts.display,
    fontSize: 48,
    lineHeight: 52,
    letterSpacing: -1,
    color: colors.text,
    textAlign: 'center',
  },
  freq: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  inTune: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    color: colors.success,
    marginBottom: spacing.xs,
  },
  inTuneSpacer: {
    height: 22,
    marginBottom: spacing.xs,
  },
  laneOuter: {
    width: '100%',
    maxWidth: LANE_WIDTH,
    alignSelf: 'center',
    marginTop: spacing.xs,
  },
  lane: {
    width: LANE_WIDTH,
    maxWidth: '100%',
    alignSelf: 'center',
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    position: 'relative',
  },
  greenZone: {
    position: 'absolute',
    left: '25%',
    width: '50%',
    height: '100%',
    backgroundColor: colors.successSoft,
  },
  tick: {
    position: 'absolute',
    top: 10,
    width: 1,
    height: 36,
    marginLeft: -0.5,
    backgroundColor: colors.borderStrong,
    opacity: 0.6,
  },
  tickCenter: {
    opacity: 1,
    backgroundColor: colors.textMuted,
  },
  markerCol: {
    position: 'absolute',
    top: 8,
    alignItems: 'center',
    marginLeft: -8,
    zIndex: 2,
  },
  markerDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  markerStem: {
    width: 2,
    height: 28,
    borderRadius: 1,
    marginTop: -2,
  },
  tickLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginTop: spacing.sm,
    width: LANE_WIDTH,
    maxWidth: '100%',
    alignSelf: 'center',
  },
  tickLabel: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.textMuted,
    width: 32,
    textAlign: 'center',
  },
  centsAxis: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.textDim,
    textAlign: 'center',
    marginTop: 2,
  },
  diffBlock: {
    alignItems: 'center',
    marginTop: spacing.lg,
    gap: spacing.xs,
  },
  diffLabel: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textMuted,
  },
  diffValue: {
    fontFamily: fonts.bodyBold,
    fontSize: 18,
  },
});
