import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, View } from 'react-native';

import { DevModeProvider, useDevMode } from '../../src/context/DevModeContext';
import { VoiceAnalysisProvider } from '../../src/context/VoiceAnalysisContext';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { typography } from '../../src/theme/typography';

function TabNavigator() {
  const { enabled } = useDevMode();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primaryBright,
        tabBarInactiveTintColor: colors.textDim,
        tabBarLabelStyle: typography.tabLabel,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () =>
          Platform.OS === 'ios' ? (
            <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
          ) : (
            <View style={[StyleSheet.absoluteFill, styles.tabBarAndroid]} />
          ),
      }}
    >
      <Tabs.Screen
        name="index"
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
            <Ionicons name={focused ? 'mic' : 'mic-outline'} size={size + 2} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tools"
        options={{
          title: 'Tools',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'options' : 'options-outline'}
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
            <Ionicons
              name={focused ? 'sparkles' : 'sparkles-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="architect"
        options={{
          title: 'Architect',
          href: enabled ? '/architect' : null,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'code-slash' : 'code-slash-outline'}
              size={size}
              color={enabled ? color : colors.textDim}
            />
          ),
          tabBarItemStyle: enabled ? undefined : { display: 'none', width: 0, height: 0 },
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
    backgroundColor: Platform.OS === 'ios' ? 'transparent' : colors.tabBar,
    height: spacing.tabBar,
    paddingTop: spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? spacing.lg : spacing.md,
  },
  tabBarAndroid: {
    backgroundColor: colors.tabBar,
  },
});
