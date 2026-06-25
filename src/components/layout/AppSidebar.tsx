import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter, type Href } from 'expo-router';
import * as Linking from 'expo-linking';
import { useMemo } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppPreferences } from '../../context/AppPreferencesContext';
import { layout } from '../../theme/layout';
import { radius, spacing } from '../../theme/spacing';
import { fonts } from '../../theme/typography';

type NavItem = {
  key: string;
  label: string;
  href: Href;
  icon: keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
};

const NAV_ITEMS: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: 'grid-outline', iconActive: 'grid' },
  { key: 'session', label: 'Sessions', href: '/session', icon: 'mic-outline', iconActive: 'mic' },
  { key: 'analytics', label: 'Analytics', href: '/analytics', icon: 'bar-chart-outline', iconActive: 'bar-chart' },
  { key: 'tools', label: 'Toolkit', href: '/tools', icon: 'construct-outline', iconActive: 'construct' },
  { key: 'coach', label: 'Coach', href: '/coach', icon: 'school-outline', iconActive: 'school' },
  { key: 'goals', label: 'Goals', href: '/goals' as Href, icon: 'flag-outline', iconActive: 'flag' },
  { key: 'achievements', label: 'Achievements', href: '/achievements' as Href, icon: 'trophy-outline', iconActive: 'trophy' },
];

const FOOTER_LINKS = [
  { label: 'GitHub', url: 'https://github.com/akhilvydyula/predict-voice-quality' },
  { label: 'Docs', url: 'https://github.com/akhilvydyula/predict-voice-quality#readme' },
  { label: 'Contributing', url: 'https://github.com/akhilvydyula/predict-voice-quality/blob/main/CONTRIBUTING.md' },
];

function isActiveRoute(pathname: string, item: NavItem): boolean {
  const path = (item.href as string).replace(/^\//, '');
  if (path === 'dashboard') {
    return pathname === '/' || pathname === '/dashboard' || pathname.endsWith('/dashboard');
  }
  return pathname.includes(path);
}

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { colors } = useAppPreferences();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const openLink = (url: string) => {
    void Linking.openURL(url);
  };

  return (
    <View style={[styles.shell, { paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + spacing.md }]}>
      <View style={styles.brandRow}>
        <View style={styles.logoMark}>
          <Ionicons name="pulse" size={18} color={colors.textOnPrimary} />
        </View>
        <Text style={styles.brandText}>VocalIQ</Text>
      </View>

      <ScrollView style={styles.navScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.navList}>
          {NAV_ITEMS.map((item) => {
            const active = isActiveRoute(pathname, item);
            return (
              <Pressable
                key={item.key}
                onPress={() => router.push(item.href)}
                style={({ pressed }) => [
                  styles.navItem,
                  active && styles.navItemActive,
                  pressed && styles.navItemPressed,
                ]}
              >
                <Ionicons
                  name={active ? item.iconActive : item.icon}
                  size={18}
                  color={active ? colors.primary : colors.textSecondary}
                />
                <Text style={[styles.navLabel, active && styles.navLabelActive]}>{item.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.ossCard}>
          <View style={styles.ossIcon}>
            <Ionicons name="code-slash" size={16} color={colors.primary} />
          </View>
          <View style={styles.ossCopy}>
            <Text style={styles.ossTitle}>Open Source</Text>
            <Text style={styles.ossSub}>Built with ❤️ by the community</Text>
          </View>
        </View>

        {FOOTER_LINKS.map((link) => (
          <Pressable key={link.label} onPress={() => openLink(link.url)} style={styles.footerLink}>
            <Text style={styles.footerLinkText}>{link.label}</Text>
            <Ionicons name="open-outline" size={14} color={colors.textMuted} />
          </Pressable>
        ))}

        <Text style={styles.version}>v1.0.0</Text>
      </View>
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useAppPreferences>['colors']) {
  const webShadow = Platform.OS === 'web' ? ({ boxShadow: colors.shadow } as object) : {};

  return StyleSheet.create({
  shell: {
    width: layout.sidebarWidth,
    backgroundColor: colors.surface,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    paddingHorizontal: spacing.lg,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xxl,
    paddingHorizontal: spacing.xs,
  },
  logoMark: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    fontFamily: fonts.display,
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  navScroll: {
    flex: 1,
  },
  navList: {
    gap: spacing.xs,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
  },
  navItemActive: {
    backgroundColor: colors.primarySoft,
  },
  navItemPressed: {
    opacity: 0.85,
  },
  navLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.textSecondary,
  },
  navLabelActive: {
    fontFamily: fonts.bodyBold,
    color: colors.primary,
  },
  footer: {
    gap: spacing.sm,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  ossCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
    ...webShadow,
  },
  ossIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ossCopy: {
    flex: 1,
    gap: 2,
  },
  ossTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    color: colors.text,
  },
  ossSub: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.textMuted,
  },
  footerLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  footerLinkText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.textSecondary,
  },
  version: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.textDim,
    paddingHorizontal: spacing.xs,
    marginTop: spacing.xs,
  },
  });
}
