import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

type PrimaryButtonProps = {
  label: string;
  subtitle?: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
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
      variant === 'danger' ? Haptics.ImpactFeedbackStyle.Heavy : Haptics.ImpactFeedbackStyle.Light
    );
    onPress();
  };

  if (variant === 'ghost') {
    return (
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        style={({ pressed }) => [styles.ghost, pressed && styles.ghostPressed, disabled && styles.disabled, style]}
      >
        <Text style={[styles.ghostLabel, disabled && styles.disabledText]}>{label}</Text>
      </Pressable>
    );
  }

  const variantStyle =
    variant === 'danger' ? styles.danger
    : variant === 'secondary' ? styles.secondary
    : styles.primary;

  const labelStyle =
    variant === 'secondary' ? styles.labelSecondary : styles.labelPrimary;

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.wrap,
        variantStyle,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.label, labelStyle, disabled && styles.disabledText]}>
        {label}
      </Text>
      {subtitle ? <Text style={[styles.subtitle, variant === 'secondary' ? styles.subtitleSecondary : {}]}>{subtitle}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.pill,
    minHeight: 52,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxxl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  primary: {
    backgroundColor: colors.primary,
    borderColor: '#0052CC',
  },
  secondary: {
    backgroundColor: colors.surface,
    borderColor: colors.borderStrong,
    borderWidth: 1,
  },
  danger: {
    backgroundColor: colors.danger,
    borderColor: '#DC2626',
  },
  label: {
    fontFamily: typography.bodyBold.fontFamily,
    fontSize: 16,
    lineHeight: 22,
  },
  labelPrimary: {
    color: colors.textOnPrimary,
  },
  labelSecondary: {
    color: colors.primary,
  },
  subtitle: {
    ...typography.bodySmall,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
    textAlign: 'center',
  },
  subtitleSecondary: {
    color: colors.textMuted,
  },
  ghost: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    minHeight: 44,
    justifyContent: 'center',
  },
  ghostPressed: {
    opacity: 0.7,
  },
  ghostLabel: {
    ...typography.bodyMedium,
    color: colors.primary,
    fontSize: 15,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.4,
  },
  disabledText: {
    color: colors.textMuted,
  },
});
