import { ReactNode, useMemo } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

import { useAppPreferences } from '../../context/AppPreferencesContext';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  meta?: string;
  actions?: ReactNode;
  style?: ViewStyle;
};

export function PageHeader({ eyebrow, title, subtitle, meta, actions, style }: PageHeaderProps) {
  const { colors } = useAppPreferences();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={[styles.wrap, style]}>
      <View style={styles.copy}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        {meta ? <Text style={styles.meta}>{meta}</Text> : null}
      </View>
      {actions ? <View style={styles.actions}>{actions}</View> : null}
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useAppPreferences>['colors']) {
  return StyleSheet.create({
    wrap: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: spacing.lg,
    },
    copy: {
      flex: 1,
      gap: spacing.xs,
    },
    eyebrow: {
      ...typography.overline,
      color: colors.primary,
      fontSize: 10,
    },
    title: {
      ...typography.h1,
      color: colors.text,
    },
    subtitle: {
      ...typography.body,
      color: colors.textSecondary,
      maxWidth: 560,
    },
    meta: {
      ...typography.bodySmall,
      color: colors.textDim,
      marginTop: spacing.xs,
    },
    actions: {
      alignItems: 'flex-end',
      justifyContent: 'center',
      paddingTop: 2,
    },
  });
}
