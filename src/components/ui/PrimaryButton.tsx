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
        style={({ pressed }) => [styles.ghost, pressed && styles.pressed, style]}
      >
        <Text style={[styles.ghostLabel, disabled && styles.disabledText]}>{label}</Text>
      </Pressable>
    );
  }

  const variantStyle =
    variant === 'danger'
      ? styles.danger
      : variant === 'secondary'
        ? styles.secondary
        : styles.primary;

  const labelColor =
    variant === 'secondary' ? colors.textSecondary : colors.text;

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.wrap,
        variantStyle,
        pressed && styles.pressed,
        disabled && styles.disabledBg,
        style,
      ]}
    >
      <Text style={[styles.label, { color: labelColor }, disabled && styles.disabledText]}>
        {label}
      </Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.lg,
    minHeight: 52,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  primary: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryBright,
  },
  secondary: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.borderStrong,
  },
  danger: {
    backgroundColor: colors.danger,
    borderColor: '#F87171',
  },
  label: {
    ...typography.bodyBold,
    fontSize: 16,
    color: colors.text,
  },
  subtitle: {
    ...typography.bodySmall,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 2,
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
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  disabledBg: {
    opacity: 0.45,
  },
  disabledText: {
    color: colors.textDim,
  },
});
