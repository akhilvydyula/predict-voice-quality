import { Platform, StyleSheet, Text, View } from 'react-native';

import { centsLabel } from '../audio/musicTheory';
import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

type PitchMeterProps = {
  noteName: string | null;
  octave: number | null;
  cents: number;
  frequency: number | null;
  volume: number;
  isActive: boolean;
};

const LANE_WIDTH = 280;
const CENTER = LANE_WIDTH / 2;

export function PitchMeter({
  noteName,
  octave,
  cents,
  frequency,
  volume,
  isActive,
}: PitchMeterProps) {
  const clampedCents = Math.max(-50, Math.min(50, cents));
  const markerLeft = CENTER + (clampedCents / 50) * (LANE_WIDTH / 2 - 20);

  const zoneColor =
    Math.abs(cents) <= 10 ? colors.success : Math.abs(cents) <= 25 ? colors.warning : colors.danger;

  return (
    <View style={styles.wrap}>
      <Text style={styles.note}>
        {noteName ? `${noteName}${octave ?? ''}` : isActive ? '···' : '—'}
      </Text>
      {frequency ? <Text style={styles.freq}>{Math.round(frequency)} Hz</Text> : null}

      <View style={styles.laneOuter}>
        <View style={styles.lane}>
          <View style={styles.greenZone} />
          <View style={styles.centerLine} />
          <View
            style={[
              styles.marker,
              {
                left: markerLeft,
                backgroundColor: isActive && noteName ? zoneColor : colors.textDim,
                transform: [{ scale: 1 + volume * 0.4 }],
                ...(Platform.OS === 'web'
                  ? { boxShadow: `0 0 14px ${zoneColor}` }
                  : {
                      shadowColor: zoneColor,
                      shadowOpacity: 0.8,
                      shadowRadius: 10,
                      elevation: 6,
                    }),
              },
            ]}
          />
        </View>
        <View style={styles.laneLabels}>
          <Text style={styles.laneLabel}>♯</Text>
          <Text style={styles.laneLabel}>✓</Text>
          <Text style={styles.laneLabel}>♭</Text>
        </View>
      </View>

      <Text style={[styles.cents, { color: isActive && noteName ? zoneColor : colors.textMuted }]}>
        {noteName ? centsLabel(cents) : isActive ? 'Listening…' : 'Waiting for voice'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: spacing.md,
    width: '100%',
  },
  note: {
    ...typography.metric,
    fontSize: 40,
    lineHeight: 44,
    textAlign: 'center',
    width: '100%',
  },
  freq: {
    ...typography.bodySmall,
    marginTop: -spacing.sm,
  },
  laneOuter: {
    width: '100%',
    maxWidth: LANE_WIDTH,
    alignSelf: 'center',
    gap: spacing.sm,
  },
  lane: {
    width: LANE_WIDTH,
    maxWidth: '100%',
    alignSelf: 'center',
    height: 52,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  greenZone: {
    position: 'absolute',
    left: '38%',
    width: '24%',
    height: '100%',
    backgroundColor: colors.successSoft,
  },
  centerLine: {
    position: 'absolute',
    left: '50%',
    width: 2,
    height: '55%',
    marginLeft: -1,
    backgroundColor: colors.borderStrong,
  },
  marker: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
    marginLeft: -11,
    top: 15,
    borderWidth: 2,
    borderColor: colors.borderStrong,
  },
  laneLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    width: LANE_WIDTH,
    maxWidth: '100%',
    alignSelf: 'center',
  },
  laneLabel: {
    ...typography.caption,
    fontSize: 10,
    letterSpacing: 0,
  },
  cents: {
    ...typography.bodyMedium,
    fontFamily: typography.h3.fontFamily,
    fontSize: 15,
  },
});
