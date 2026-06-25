import { StyleSheet, Text, View } from 'react-native';

import { PitchHistoryPoint } from '../audio/voiceQuality';
import { colors } from '../theme/colors';

type PitchHistoryChartProps = {
  history: PitchHistoryPoint[];
};

const CHART_HEIGHT = 72;
const BAR_WIDTH = 5;
const GAP = 2;

export function PitchHistoryChart({ history }: PitchHistoryChartProps) {
  if (history.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Pitch trail appears as you sing</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.labels}>
        <Text style={styles.axisLabel}>sharp</Text>
        <Text style={styles.axisLabel}>in tune</Text>
        <Text style={styles.axisLabel}>flat</Text>
      </View>
      <View style={styles.chart}>
        <View style={styles.centerBand} />
        {history.map((point, index) => {
          const clamped = Math.max(-50, Math.min(50, point.cents));
          const offset = ((50 - clamped) / 100) * CHART_HEIGHT;
          const color = point.inTune ? colors.success : Math.abs(point.cents) <= 25 ? colors.warning : colors.danger;

          return (
            <View
              key={`${index}-${point.cents}`}
              style={[
                styles.bar,
                {
                  left: index * (BAR_WIDTH + GAP),
                  top: offset,
                  backgroundColor: color,
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 8,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  axisLabel: {
    color: colors.textDim,
    fontSize: 11,
    fontWeight: '600',
  },
  chart: {
    height: CHART_HEIGHT,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    position: 'relative',
  },
  centerBand: {
    position: 'absolute',
    top: '42%',
    left: 0,
    right: 0,
    height: '16%',
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
  },
  bar: {
    position: 'absolute',
    width: BAR_WIDTH,
    height: BAR_WIDTH,
    borderRadius: BAR_WIDTH / 2,
  },
  empty: {
    height: CHART_HEIGHT,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: colors.textDim,
    fontSize: 13,
  },
});
