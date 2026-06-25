import { useEffect } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/typography';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type PracticeScoreRingProps = {
  score: number;
  size?: number;
};

export function PracticeScoreRing({ score, size = 140 }: PracticeScoreRingProps) {
  const stroke = 10;
  const ringRadius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * ringRadius;
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withSpring(score / 100, { damping: 16, stiffness: 90 });
  }, [score, progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  const ringColor =
    score >= 75 ? colors.success : score >= 50 ? colors.warning : colors.primary;
  const hasScore = score > 0;
  const center = size / 2;
  const progressOffset = circumference * (1 - score / 100);

  return (
    <View style={styles.wrap}>
      <View style={[styles.ring, { width: size, height: size }]}>
        <Svg
          width={size}
          height={size}
          style={Platform.OS === 'web' ? styles.svgWeb : undefined}
        >
          <Circle
            cx={center}
            cy={center}
            r={ringRadius}
            stroke={colors.backgroundElevated}
            strokeWidth={stroke}
            fill="none"
          />
          {Platform.OS === 'web' ? (
            <Circle
              cx={center}
              cy={center}
              r={ringRadius}
              stroke={hasScore ? ringColor : colors.border}
              strokeWidth={stroke}
              fill="none"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={progressOffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${center} ${center})`}
            />
          ) : (
            <AnimatedCircle
              cx={center}
              cy={center}
              r={ringRadius}
              stroke={hasScore ? ringColor : colors.border}
              strokeWidth={stroke}
              fill="none"
              strokeDasharray={`${circumference} ${circumference}`}
              animatedProps={animatedProps}
              strokeLinecap="round"
              rotation={-90}
              origin={`${center}, ${center}`}
            />
          )}
        </Svg>
        <View style={styles.center} pointerEvents="none">
          <View style={styles.scoreRow}>
            <Text style={[styles.score, hasScore && { color: colors.text }]}>
              {hasScore ? score : '—'}
            </Text>
            {hasScore ? <Text style={styles.scoreSuffix}>/100</Text> : null}
          </View>
        </View>
      </View>
      <Text style={styles.label}>Score</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  ring: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  svgWeb: {
    overflow: 'visible',
  },
  center: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  score: {
    fontFamily: fonts.display,
    fontSize: 40,
    lineHeight: 44,
    letterSpacing: -1,
    color: colors.textMuted,
  },
  scoreSuffix: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.textMuted,
    marginBottom: 2,
  },
  label: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textMuted,
  },
});
