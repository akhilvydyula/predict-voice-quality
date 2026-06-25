import { ReactNode, useMemo } from 'react';
import { Platform, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { useAppPreferences } from '../../context/AppPreferencesContext';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

type PanelProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  headerRight?: ReactNode;
  padding?: number;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  variant?: 'default' | 'elevated' | 'inset';
};

export function Panel({
  children,
  title,
  subtitle,
  headerRight,
  padding = spacing.xl,
  style,
  contentStyle,
  variant = 'default',
}: PanelProps) {
  const { colors } = useAppPreferences();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const hasHeader = Boolean(title || subtitle || headerRight);

  return (
    <View
      style={[
        styles.base,
        variant === 'elevated' && styles.elevated,
        variant === 'inset' && styles.inset,
        style,
      ]}
    >
      {hasHeader ? (
        <View style={[styles.header, { paddingHorizontal: padding, paddingTop: padding }]}>
          <View style={styles.headerCopy}>
            {title ? <Text style={styles.title}>{title}</Text> : null}
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
          {headerRight}
        </View>
      ) : null}
      <View
        style={[
          styles.body,
          { padding, paddingTop: hasHeader ? spacing.md : padding },
          contentStyle,
        ]}
      >
        {children}
      </View>
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useAppPreferences>['colors']) {
  return StyleSheet.create({
    base: {
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      overflow: 'hidden',
      ...(Platform.OS === 'web' ? ({ boxShadow: colors.shadow } as object) : {}),
    },
    elevated: {
      backgroundColor: colors.surfaceElevated,
      borderColor: colors.borderStrong,
    },
    inset: {
      backgroundColor: colors.backgroundElevated,
      borderColor: colors.border,
    },
    body: {
      width: '100%',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      paddingBottom: spacing.md,
    },
    headerCopy: {
      flex: 1,
      gap: 3,
    },
    title: {
      ...typography.h3,
      fontSize: 15,
      color: colors.text,
    },
    subtitle: {
      ...typography.bodySmall,
      color: colors.textSecondary,
    },
  });
}
