import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter, type Href } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppPreferences } from '../../context/AppPreferencesContext';
import { radius, spacing } from '../../theme/spacing';
import { fonts } from '../../theme/typography';

const TABS = [
  { key: 'goals', label: 'Goals', href: '/goals' as Href, icon: 'flag-outline' as const, iconActive: 'flag' as const },
  {
    key: 'achievements',
    label: 'Achievements',
    href: '/achievements' as Href,
    icon: 'trophy-outline' as const,
    iconActive: 'trophy' as const,
  },
] as const;

export function GoalsAchievementsTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const { colors } = useAppPreferences();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const active = pathname.includes('achievements') ? 'achievements' : 'goals';

  return (
    <View style={styles.track}>
      {TABS.map((tab) => {
        const selected = tab.key === active;
        return (
          <Pressable
            key={tab.key}
            onPress={() => {
              if (!selected) {
                void Haptics.selectionAsync();
                router.push(tab.href);
              }
            }}
            style={[styles.tab, selected && styles.tabActive]}
          >
            <Ionicons
              name={selected ? tab.iconActive : tab.icon}
              size={16}
              color={selected ? colors.primary : colors.textMuted}
            />
            <Text style={[styles.label, selected && styles.labelActive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useAppPreferences>['colors']) {
  return StyleSheet.create({
    track: {
      flexDirection: 'row',
      backgroundColor: colors.surfaceElevated,
      borderRadius: radius.lg,
      padding: spacing.xs,
      borderWidth: 1,
      borderColor: colors.border,
      gap: spacing.xs,
    },
    tab: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      minHeight: 44,
      borderRadius: radius.md,
      paddingHorizontal: spacing.md,
    },
    tabActive: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.primary,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
    },
    label: {
      fontFamily: fonts.bodyMedium,
      fontSize: 14,
      color: colors.textMuted,
    },
    labelActive: {
      fontFamily: fonts.bodyBold,
      color: colors.primary,
    },
  });
}
