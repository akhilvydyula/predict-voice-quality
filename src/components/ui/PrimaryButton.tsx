import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { colors, gradients } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

type PrimaryButtonProps = {
  label: string;
  subtitle?: string;
  onPress: () => void;
  variant?: 'primary' | 'danger' | 'ghost';
  style?: ViewStyle;
  disabled?: boolean;
};

export function PrimaryButton({
  label,
  subtitle,
  onPress,
  variant = 'primary',
  style,
  disabled,
}: PrimaryButtonProps) {
  const handlePress = () => {
    if (disabled) return;
    void Haptics.impactAsync(
      variant === 'danger' ? Haptics.ImpactFeedbackStyle.Heavy : Haptics.ImpactFeedbackStyle.Medium
    );
    onPress();
  };

  if (variant === 'ghost') {
    return (
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        style={({ pressed }) => [styles.ghost, pressed && styles.pressed, style]}
      >
        <Text style={styles.ghostLabel}>{label}</Text>
      </Pressable>
    );
  }

  const gradientColors =
    variant === 'danger' ? (['#ff5c6a', '#e11d48'] as const) : ([...gradients.cta] as const);

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [styles.wrap, pressed && styles.pressed, style]}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Text style={styles.label}>{label}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    minHeight: 56,
  },
  gradient: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...typography.h3,
    color: colors.text,
    fontSize: 17,
  },
  subtitle: {
    ...typography.bodySmall,
    color: 'rgba(255,255,255,0.82)',
    marginTop: 4,
  },
  ghost: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    minHeight: 44,
    justifyContent: 'center',
  },
  ghostLabel: {
    ...typography.bodyMedium,
    color: colors.primaryBright,
    fontSize: 15,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },
});
