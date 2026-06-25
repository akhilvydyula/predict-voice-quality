import { useMemo } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { useAppPreferences } from '../../context/AppPreferencesContext';
import { MiniProgressRing } from './MiniProgressRing';
import { radius, spacing } from '../../theme/spacing';
import { fonts } from '../../theme/typography';

type ProgressHeroBannerProps = {
  percent: number;
  ringLabel: string;
  ringSublabel?: string;
  title: string;
  subtitle: string;
  accentColor?: string;
  footer?: string;
};

export function ProgressHeroBanner({
  percent,
  ringLabel,
  ringSublabel,
  title,
  subtitle,
  accentColor,
  footer,
}: ProgressHeroBannerProps) {
  const { colors } = useAppPreferences();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.banner}>
      <MiniProgressRing
        percent={percent}
        centerLabel={ringLabel}
        centerSublabel={ringSublabel}
        accentColor={accentColor}
      />
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        {footer ? <Text style={styles.footer}>{footer}</Text> : null}
      </View>
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useAppPreferences>['colors']) {
  const webShadow = Platform.OS === 'web' ? ({ boxShadow: colors.shadow } as object) : {};

  return StyleSheet.create({
    banner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xl,
      padding: spacing.xl,
      borderRadius: radius.xl,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      ...webShadow,
    },
    copy: {
      flex: 1,
      gap: spacing.sm,
    },
    title: {
      fontFamily: fonts.display,
      fontSize: 22,
      lineHeight: 28,
      letterSpacing: -0.4,
      color: colors.text,
    },
    subtitle: {
      fontFamily: fonts.body,
      fontSize: 14,
      lineHeight: 21,
      color: colors.textSecondary,
    },
    footer: {
      fontFamily: fonts.bodyMedium,
      fontSize: 12,
      color: colors.primary,
      marginTop: spacing.xs,
    },
  });
}
