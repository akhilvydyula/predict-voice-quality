import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { useAppPreferences } from '../../context/AppPreferencesContext';
import { radius, spacing } from '../../theme/spacing';
import { fonts } from '../../theme/typography';

type GoalProgressCardProps = {
  title: string;
  description: string;
  progress: number;
  target: number;
  met?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
};

export function GoalProgressCard({
  title,
  description,
  progress,
  target,
  met = false,
  icon = 'flag-outline',
}: GoalProgressCardProps) {
  const { colors } = useAppPreferences();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const pct = target > 0 ? Math.min(100, Math.round((progress / target) * 100)) : 0;
  const fillColor = met ? colors.success : colors.primary;

  return (
    <View style={[styles.card, met && styles.cardMet]}>
      <View style={styles.top}>
        <View style={[styles.iconWrap, met && styles.iconWrapMet]}>
          <Ionicons
            name={met ? 'checkmark-circle' : icon}
            size={22}
            color={met ? colors.success : colors.primary}
          />
        </View>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        <View style={[styles.badge, met && styles.badgeMet]}>
          <Text style={[styles.badgeText, met && styles.badgeTextMet]}>
            {met ? 'Done' : `${pct}%`}
          </Text>
        </View>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%`, backgroundColor: fillColor }]} />
      </View>
      <View style={styles.footer}>
        <Text style={styles.progressLabel}>
          {progress} / {target}
        </Text>
        {!met && pct > 0 ? (
          <Text style={styles.remaining}>{target - progress} to go</Text>
        ) : null}
      </View>
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useAppPreferences>['colors']) {
  const webShadow = Platform.OS === 'web' ? ({ boxShadow: colors.shadow } as object) : {};

  return StyleSheet.create({
    card: {
      gap: spacing.md,
      padding: spacing.lg,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      ...webShadow,
    },
    cardMet: {
      borderColor: colors.success,
      backgroundColor: colors.successSoft,
    },
    top: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.md,
    },
    iconWrap: {
      width: 44,
      height: 44,
      borderRadius: radius.md,
      backgroundColor: colors.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    iconWrapMet: {
      backgroundColor: colors.surface,
    },
    header: {
      flex: 1,
      gap: 4,
      paddingTop: 2,
    },
    title: {
      fontFamily: fonts.bodyBold,
      fontSize: 16,
      color: colors.text,
    },
    description: {
      fontFamily: fonts.body,
      fontSize: 13,
      lineHeight: 19,
      color: colors.textSecondary,
    },
    badge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: radius.pill,
      backgroundColor: colors.primarySoft,
      flexShrink: 0,
    },
    badgeMet: {
      backgroundColor: colors.surface,
    },
    badgeText: {
      fontFamily: fonts.bodyBold,
      fontSize: 11,
      color: colors.primary,
    },
    badgeTextMet: {
      color: colors.success,
    },
    track: {
      height: 10,
      borderRadius: radius.pill,
      backgroundColor: colors.backgroundElevated,
      overflow: 'hidden',
    },
    fill: {
      height: '100%',
      borderRadius: radius.pill,
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    progressLabel: {
      fontFamily: fonts.bodyBold,
      fontSize: 12,
      color: colors.textMuted,
    },
    remaining: {
      fontFamily: fonts.body,
      fontSize: 12,
      color: colors.textDim,
    },
  });
}
