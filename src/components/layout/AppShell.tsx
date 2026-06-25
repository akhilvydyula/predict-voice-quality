import { ReactNode, useMemo } from 'react';
import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';

import { AppSidebar } from './AppSidebar';
import { useAppPreferences } from '../../context/AppPreferencesContext';
import { layout } from '../../theme/layout';

type AppShellProps = {
  children: ReactNode;
};

export function useAppShellLayout() {
  const { width } = useWindowDimensions();
  const showSidebar = Platform.OS === 'web' && width >= layout.sidebarBreakpoint;
  return { showSidebar, contentWidth: width - (showSidebar ? layout.sidebarWidth : 0) };
}

export function AppShell({ children }: AppShellProps) {
  const { showSidebar } = useAppShellLayout();
  const { colors } = useAppPreferences();
  const styles = useMemo(() => createStyles(colors), [colors]);

  if (!showSidebar) {
    return <View style={styles.mobileRoot}>{children}</View>;
  }

  return (
    <View style={styles.desktopRoot}>
      <AppSidebar />
      <View style={styles.main}>{children}</View>
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useAppPreferences>['colors']) {
  return StyleSheet.create({
    mobileRoot: {
      flex: 1,
      backgroundColor: colors.background,
    },
    desktopRoot: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: colors.backgroundElevated,
    },
    main: {
      flex: 1,
      backgroundColor: colors.backgroundElevated,
    },
  });
}
