import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';

import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type ScoreRingProps = {
  score: number;
  size?: number;
};

export function ScoreRing({ score, size = 168 }: ScoreRingProps) {
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withSpring(score / 100, { damping: 16, stiffness: 90 });
  }, [score, progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  const ringColor =
    score >= 75 ? colors.success : score >= 50 ? colors.warning : colors.primaryBright;

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Defs>
          <SvgGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={colors.primaryBright} />
            <Stop offset="100%" stopColor={colors.accent} />
          </SvgGradient>
        </Defs>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.surface}
          strokeWidth={stroke}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={score > 0 ? 'url(#scoreGrad)' : colors.border}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          animatedProps={animatedProps}
          strokeLinecap="round"
          rotation={-90}
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.center}>
        <Text style={[styles.score, score > 0 && { color: ringColor }]}>
          {score > 0 ? score : '—'}
        </Text>
        <Text style={styles.label}>Overall</Text>
      </View>
      {Platform.OS !== 'web' ? (
        <LinearGradient
          colors={['transparent', colors.glowPrimary]}
          style={styles.glow}
          pointerEvents="none"
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    position: 'absolute',
    alignItems: 'center',
  },
  score: {
    ...typography.metric,
    fontSize: 46,
  },
  label: {
    ...typography.caption,
    letterSpacing: 1,
    marginTop: 2,
  },
  glow: {
    position: 'absolute',
    width: '80%',
    height: '80%',
    borderRadius: 999,
    opacity: 0.35,
  },
});
