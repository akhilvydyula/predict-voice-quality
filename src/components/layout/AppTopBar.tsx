import { Ionicons } from '@expo/vector-icons';
import { ReactNode, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { useAppPreferences } from '../../context/AppPreferencesContext';
import { layout } from '../../theme/layout';
import { radius, spacing } from '../../theme/spacing';
import { fonts } from '../../theme/typography';
import { ProfileMenu } from './ProfileMenu';

type AppTopBarProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
};

export function AppTopBar({ title, subtitle, actions }: AppTopBarProps) {
  const { width } = useWindowDimensions();
  const compact = width < layout.sidebarBreakpoint;
  const { colors, theme, toggleTheme, displayName, initials } = useAppPreferences();
  const [profileOpen, setProfileOpen] = useState(false);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const profileLabel = displayName.trim() || 'Set up profile';

  return (
    <>
      <View style={[styles.wrap, compact && styles.wrapCompact]}>
        <View style={styles.copy}>
          <Text style={[styles.title, compact && styles.titleCompact]}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        <View style={[styles.actions, compact && styles.actionsCompact]}>
          {actions}
          <Pressable
            onPress={toggleTheme}
            accessibilityRole="button"
            accessibilityLabel={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            style={({ pressed }) => [styles.iconBtn, pressed && styles.iconBtnPressed]}
          >
            <Ionicons
              name={theme === 'dark' ? 'moon' : 'sunny-outline'}
              size={18}
              color={colors.textSecondary}
            />
          </Pressable>
          <Pressable
            onPress={() => setProfileOpen(true)}
            accessibilityRole="button"
            accessibilityLabel="Open profile"
            style={({ pressed }) => [styles.userChip, pressed && styles.userChipPressed]}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            {!compact ? (
              <>
                <Text style={styles.userName} numberOfLines={1}>
                  {profileLabel}
                </Text>
                <Ionicons name="chevron-down" size={14} color={colors.textMuted} />
              </>
            ) : null}
          </Pressable>
        </View>
      </View>
      <ProfileMenu visible={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
}

function createStyles(colors: ReturnType<typeof useAppPreferences>['colors']) {
  return StyleSheet.create({
    wrap: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: spacing.lg,
      marginBottom: spacing.xxl,
    },
    wrapCompact: {
      flexDirection: 'column',
      alignItems: 'stretch',
    },
    copy: {
      flex: 1,
      gap: spacing.xs,
    },
    title: {
      fontFamily: fonts.display,
      fontSize: 28,
      lineHeight: 34,
      letterSpacing: -0.5,
      color: colors.text,
    },
    titleCompact: {
      fontSize: 24,
      lineHeight: 30,
    },
    subtitle: {
      fontFamily: fonts.body,
      fontSize: 15,
      lineHeight: 22,
      color: colors.textSecondary,
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      flexShrink: 0,
    },
    actionsCompact: {
      justifyContent: 'flex-end',
    },
    iconBtn: {
      width: 40,
      height: 40,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconBtnPressed: {
      backgroundColor: colors.surfaceHover,
    },
    userChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      maxWidth: 220,
    },
    userChipPressed: {
      backgroundColor: colors.surfaceHover,
    },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      fontFamily: fonts.bodyBold,
      fontSize: 12,
      color: colors.textOnPrimary,
    },
    userName: {
      fontFamily: fonts.bodyMedium,
      fontSize: 14,
      color: colors.text,
      flexShrink: 1,
    },
  });
}
