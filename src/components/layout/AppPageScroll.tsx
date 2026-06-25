import { ReactNode, useMemo } from 'react';
import { Platform, ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppShellLayout } from './AppShell';
import { useAppPreferences } from '../../context/AppPreferencesContext';
import { layout } from '../../theme/layout';
import { spacing } from '../../theme/spacing';

type AppPageScrollProps = {
  children: ReactNode;
  contentContainerStyle?: ViewStyle;
};

/** Scrollable page shell aligned with dashboard / practice layouts. */
export function AppPageScroll({ children, contentContainerStyle }: AppPageScrollProps) {
  const insets = useSafeAreaInsets();
  const { showSidebar } = useAppShellLayout();
  const { colors } = useAppPreferences();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.scrollContent,
        {
          paddingTop: (showSidebar ? spacing.xxl : insets.top) + spacing.lg,
          paddingBottom: showSidebar ? spacing.xxxl : spacing.tabBar + spacing.xxxl,
        },
        contentContainerStyle,
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.inner}>{children}</View>
    </ScrollView>
  );
}

function createStyles(colors: ReturnType<typeof useAppPreferences>['colors']) {
  return StyleSheet.create({
    scroll: {
      flex: 1,
      backgroundColor: colors.backgroundElevated,
    },
    scrollContent: {
      alignItems: 'center',
      paddingHorizontal: Platform.OS === 'web' ? spacing.xxl : spacing.screen,
    },
    inner: {
      width: '100%',
      maxWidth: layout.maxAppContentWidth,
      gap: spacing.lg,
    },
  });
}
