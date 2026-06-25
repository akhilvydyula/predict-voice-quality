import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, View } from 'react-native';

import { DevModeProvider, useDevMode } from '../../src/context/DevModeContext';
import { VoiceAnalysisProvider } from '../../src/context/VoiceAnalysisContext';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { typography } from '../../src/theme/typography';

const TAB_BAR_HEIGHT = spacing.tabBar; // 62px

function TabNavigator() {
  const { enabled } = useDevMode();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textDim,
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => <View style={[StyleSheet.absoluteFill, styles.tabBarBg]} />,
        tabBarItemStyle: styles.tabItem,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="session"
        options={{
          title: 'Practice',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'mic' : 'mic-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Progress',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'bar-chart' : 'bar-chart-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="coach"
        options={{
          title: 'Coach',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'school' : 'school-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tools"
        options={{
          title: 'Tools',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'construct' : 'construct-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="architect"
        options={{
          title: 'Dev',
          href: enabled ? '/architect' : null,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'terminal' : 'terminal-outline'}
              size={size}
              color={enabled ? color : colors.textDim}
            />
          ),
          tabBarItemStyle: enabled ? styles.tabItem : { display: 'none', width: 0, height: 0 },
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  return (
    <DevModeProvider>
      <VoiceAnalysisProvider>
        <TabNavigator />
      </VoiceAnalysisProvider>
    </DevModeProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: 'transparent',
    height: TAB_BAR_HEIGHT,
    paddingTop: spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? spacing.md : spacing.sm,
  },
  tabBarBg: {
    backgroundColor: colors.tabBar,
  },
  tabItem: {
    paddingTop: 2,
  },
  tabLabel: {
    ...typography.tabLabel,
    fontSize: 10,
    letterSpacing: 0.2,
  },
});
