import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { fonts } from '../../theme/typography';

type PracticeRecordButtonProps = {
  isRecording: boolean;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
};

export function PracticeRecordButton({
  isRecording,
  onPress,
  disabled,
  style,
}: PracticeRecordButtonProps) {
  const handlePress = () => {
    if (disabled) return;
    void Haptics.impactAsync(
      isRecording ? Haptics.ImpactFeedbackStyle.Heavy : Haptics.ImpactFeedbackStyle.Medium
    );
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        isRecording ? styles.btnStop : styles.btnStart,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Ionicons
        name={isRecording ? 'stop' : 'mic'}
        size={20}
        color={colors.textOnPrimary}
      />
      <Text style={styles.label}>{isRecording ? 'Stop recording' : 'Start recording'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    width: '100%',
    minHeight: 52,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
    borderRadius: radius.pill,
  },
  btnStart: {
    backgroundColor: colors.primary,
  },
  btnStop: {
    backgroundColor: colors.danger,
  },
  label: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    color: colors.textOnPrimary,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.45,
  },
});
