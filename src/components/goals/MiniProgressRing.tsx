import { useMemo } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { useAppPreferences } from '../../context/AppPreferencesContext';
import { fonts } from '../../theme/typography';

type MiniProgressRingProps = {
  /** 0–100 */
  percent: number;
  size?: number;
  centerLabel: string;
  centerSublabel?: string;
  accentColor?: string;
};

export function MiniProgressRing({
  percent,
  size = 108,
  centerLabel,
  centerSublabel,
  accentColor,
}: MiniProgressRingProps) {
  const { colors } = useAppPreferences();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const stroke = 8;
  const ringRadius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * ringRadius;
  const clamped = Math.max(0, Math.min(100, percent));
  const offset = circumference * (1 - clamped / 100);
  const ringColor = accentColor ?? colors.primary;
  const center = size / 2;

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Svg width={size} height={size} style={Platform.OS === 'web' ? styles.svgWeb : undefined}>
        <Circle
          cx={center}
          cy={center}
          r={ringRadius}
          stroke={colors.backgroundElevated}
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={ringRadius}
          stroke={ringColor}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>
      <View style={styles.center} pointerEvents="none">
        <Text style={styles.label}>{centerLabel}</Text>
        {centerSublabel ? <Text style={styles.sublabel}>{centerSublabel}</Text> : null}
      </View>
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useAppPreferences>['colors']) {
  return StyleSheet.create({
    wrap: {
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
    label: {
      fontFamily: fonts.display,
      fontSize: 22,
      lineHeight: 26,
      letterSpacing: -0.5,
      color: colors.text,
    },
    sublabel: {
      fontFamily: fonts.body,
      fontSize: 11,
      color: colors.textMuted,
      marginTop: 1,
    },
  });
}
