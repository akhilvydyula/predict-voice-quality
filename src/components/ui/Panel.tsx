import { ReactNode } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

type PanelProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  headerRight?: ReactNode;
  padding?: number;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'inset';
};

export function Panel({
  children,
  title,
  subtitle,
  headerRight,
  padding = spacing.lg,
  style,
  variant = 'default',
}: PanelProps) {
  const hasHeader = Boolean(title || subtitle || headerRight);

  return (
    <View style={[styles.base, variant === 'elevated' && styles.elevated, variant === 'inset' && styles.inset, style]}>
      {hasHeader ? (
        <View style={[styles.header, { paddingHorizontal: padding, paddingTop: padding }]}>
          <View style={styles.headerCopy}>
            {title ? <Text style={styles.title}>{title}</Text> : null}
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
          {headerRight}
        </View>
      ) : null}
      <View style={{ padding, paddingTop: hasHeader ? spacing.md : padding }}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  elevated: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.borderStrong,
  },
  inset: {
    backgroundColor: colors.backgroundElevated,
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
    gap: 2,
  },
  title: {
    ...typography.h3,
    fontSize: 15,
  },
  subtitle: {
    ...typography.bodySmall,
  },
});
