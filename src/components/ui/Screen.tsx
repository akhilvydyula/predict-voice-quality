import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, gradients } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
};

export function Screen({
  children,
  scroll = true,
  padded = true,
  style,
  contentContainerStyle,
  edges = ['top'],
}: ScreenProps) {
  const content = (
    <View style={[padded && styles.padded, contentContainerStyle]}>{children}</View>
  );

  return (
    <View style={[styles.root, style]}>
      <LinearGradient colors={[...gradients.screen]} style={StyleSheet.absoluteFill} />
      <View style={styles.glowOrb} />
      <SafeAreaView style={styles.safe} edges={edges}>
        {scroll ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {content}
          </ScrollView>
        ) : (
          content
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  glowOrb: {
    position: 'absolute',
    top: -80,
    right: -40,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.glowPrimary,
    opacity: 0.22,
  },
  safe: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.tabBar + spacing.xl,
  },
  padded: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.lg,
    gap: spacing.lg,
  },
});
