import { Ionicons } from '@expo/vector-icons';
import { ReactNode } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { colors } from '../../theme/colors';
import { layout } from '../../theme/layout';
import { radius, spacing } from '../../theme/spacing';
import { fonts } from '../../theme/typography';

type AppTopBarProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
};

export function AppTopBar({ title, subtitle, actions }: AppTopBarProps) {
  const { width } = useWindowDimensions();
  const compact = width < layout.sidebarBreakpoint;

  return (
    <View style={[styles.wrap, compact && styles.wrapCompact]}>
      <View style={styles.copy}>
        <Text style={[styles.title, compact && styles.titleCompact]}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <View style={[styles.actions, compact && styles.actionsCompact]}>
        {actions}
        {!compact ? (
          <>
            <View style={styles.iconBtn}>
              <Ionicons name="sunny-outline" size={18} color={colors.textSecondary} />
            </View>
            <View style={styles.userChip}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>AV</Text>
              </View>
              <Text style={styles.userName}>Akhil Vydyula</Text>
              <Ionicons name="chevron-down" size={14} color={colors.textMuted} />
            </View>
          </>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    justifyContent: 'flex-start',
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
  },
});
