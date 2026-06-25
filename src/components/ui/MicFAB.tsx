import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';

import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

type MicFABProps = {
  isActive: boolean;
  onPress: () => void;
};

export function MicFAB({ isActive, onPress }: MicFABProps) {
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (isActive) {
      pulse.value = withRepeat(
        withSequence(withTiming(1.06, { duration: 900 }), withTiming(1, { duration: 900 })),
        -1,
        false
      );
    } else {
      pulse.value = withTiming(1, { duration: 200 });
    }
  }, [isActive, pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const handlePress = () => {
    void Haptics.impactAsync(
      isActive ? Haptics.ImpactFeedbackStyle.Heavy : Haptics.ImpactFeedbackStyle.Medium
    );
    onPress();
  };

  return (
    <View style={styles.wrap}>
      {isActive ? <Animated.View style={[styles.pulseRing, pulseStyle]} /> : null}
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.button,
          isActive ? styles.buttonActive : styles.buttonIdle,
          pressed && styles.pressed,
        ]}
      >
        <Ionicons
          name={isActive ? 'stop' : 'mic'}
          size={22}
          color={colors.text}
          style={styles.icon}
        />
        <Text style={styles.label}>{isActive ? 'Stop' : 'Record'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.dangerSoft,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  button: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    paddingTop: spacing.xs,
  },
  buttonIdle: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryBright,
  },
  buttonActive: {
    backgroundColor: colors.danger,
    borderColor: '#F87171',
  },
  icon: {
    marginBottom: 2,
  },
  label: {
    ...typography.overline,
    color: colors.text,
    fontSize: 10,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
});
