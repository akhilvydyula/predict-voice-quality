import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';

import { colors, gradients } from '../../theme/colors';
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
        withSequence(withTiming(1.08, { duration: 900 }), withTiming(1, { duration: 900 })),
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
      <Pressable onPress={handlePress} style={({ pressed }) => [pressed && styles.pressed]}>
        <LinearGradient
          colors={isActive ? (['#ff5c6a', '#e11d48'] as const) : ([...gradients.cta] as const)}
          style={styles.button}
        >
          <Text style={styles.icon}>{isActive ? '■' : '●'}</Text>
          <Text style={styles.label}>{isActive ? 'Stop' : 'Sing'}</Text>
        </LinearGradient>
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
    width: 92,
    height: 92,
    borderRadius: 46,
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
    shadowColor: colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  icon: {
    color: colors.text,
    fontSize: 14,
    marginBottom: 2,
  },
  label: {
    ...typography.caption,
    color: colors.text,
    letterSpacing: 0.8,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.96 }],
  },
});
