import Svg, { Circle, Line, Polyline, Rect, Text as SvgText } from 'react-native-svg';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

type PerformanceTrendChartProps = {
  points: { label: string; overall: number }[];
  height?: number;
};

const WIDTH = 320;
const PADDING = { top: 16, right: 12, bottom: 28, left: 36 };

export function PerformanceTrendChart({ points, height = 180 }: PerformanceTrendChartProps) {
  if (points.length < 2) {
    return (
      <View style={[styles.empty, { height }]}>
        <Text style={styles.emptyText}>Complete more sessions to render performance trends.</Text>
      </View>
    );
  }

  const chartWidth = WIDTH - PADDING.left - PADDING.right;
  const chartHeight = height - PADDING.top - PADDING.bottom;
  const maxY = 100;
  const minY = 0;

  const coords = points.map((point, index) => {
    const x = PADDING.left + (index / Math.max(points.length - 1, 1)) * chartWidth;
    const y =
      PADDING.top + chartHeight - ((point.overall - minY) / (maxY - minY || 1)) * chartHeight;
    return { x, y, ...point };
  });

  const polyline = coords.map((c) => `${c.x},${c.y}`).join(' ');

  return (
    <View style={styles.wrap}>
      <Svg width="100%" height={height} viewBox={`0 0 ${WIDTH} ${height}`}>
        {[0, 25, 50, 75, 100].map((tick) => {
          const y = PADDING.top + chartHeight - (tick / 100) * chartHeight;
          return (
            <Line
              key={tick}
              x1={PADDING.left}
              y1={y}
              x2={WIDTH - PADDING.right}
              y2={y}
              stroke={colors.chartGrid}
              strokeWidth={1}
            />
          );
        })}

        <Polyline
          points={polyline}
          fill="none"
          stroke={colors.chartLine}
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {coords.map((point, index) => (
          <Circle key={`${point.label}-${index}`} cx={point.x} cy={point.y} r={4} fill={colors.chartLine} />
        ))}

        {coords.map((point, index) =>
          index % Math.ceil(points.length / 4) === 0 || index === points.length - 1 ? (
            <SvgText
              key={`label-${index}`}
              x={point.x}
              y={height - 8}
              fill={colors.textDim}
              fontSize="10"
              textAnchor="middle"
            >
              {point.label}
            </SvgText>
          ) : null
        )}

        <Rect x={0} y={0} width={WIDTH} height={height} fill="transparent" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    alignItems: 'center',
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundElevated,
    paddingHorizontal: spacing.lg,
  },
  emptyText: {
    ...typography.bodySmall,
    textAlign: 'center',
  },
});
