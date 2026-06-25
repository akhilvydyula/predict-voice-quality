import { ReactNode } from 'react';
import { Platform, ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '../../theme/colors';
import { layout } from '../../theme/layout';
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
  safe: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: spacing.tabBar + spacing.xxxl + spacing.xl,
  },
  padded: {
    width: '100%',
    maxWidth: layout.maxContentWidth,
    paddingHorizontal: Platform.OS === 'web' ? spacing.xl : spacing.screen,
    paddingTop: spacing.lg,
    gap: spacing.lg,
  },
});
