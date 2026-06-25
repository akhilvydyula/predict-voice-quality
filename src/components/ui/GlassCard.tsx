import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { Platform, StyleSheet, View, ViewStyle } from 'react-native';

import { colors, gradients } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';

type GlassCardProps = {
  children: ReactNode;
  style?: ViewStyle;
  glow?: boolean;
  padding?: number;
};

export function GlassCard({ children, style, glow = false, padding = spacing.lg }: GlassCardProps) {
  return (
    <View style={[styles.wrap, glow && styles.glow, style]}>
      {Platform.OS === 'ios' ? (
        <BlurView intensity={28} tint="dark" style={StyleSheet.absoluteFill} />
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.androidGlass]} />
      )}
      <LinearGradient
        colors={[...gradients.cardShine]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.content, { padding }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  glow: {
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  androidGlass: {
    backgroundColor: colors.surfaceGlass,
  },
  content: {
    position: 'relative',
  },
});
