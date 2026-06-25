import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { LearningMilestone } from '../../agent/vocalCoachAgent';
import { useAppPreferences } from '../../context/AppPreferencesContext';
import { MILESTONE_ACCENTS, MILESTONE_ICONS, MILESTONE_ICONS_FILLED } from './goalsMeta';
import { radius, spacing } from '../../theme/spacing';
import { fonts } from '../../theme/typography';

type AchievementCardProps = {
  milestone: LearningMilestone;
  compact?: boolean;
};

export function AchievementCard({ milestone, compact = false }: AchievementCardProps) {
  const { colors } = useAppPreferences();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const pct =
    milestone.target > 0
      ? Math.min(100, Math.round((milestone.progress / milestone.target) * 100))
      : 0;
  const accent = MILESTONE_ACCENTS[milestone.id] ?? colors.primary;
  const icon = milestone.unlocked
    ? (MILESTONE_ICONS_FILLED[milestone.id] ?? 'trophy')
    : (MILESTONE_ICONS[milestone.id] ?? 'trophy-outline');

  return (
    <View
      style={[
        styles.card,
        compact && styles.cardCompact,
        milestone.unlocked && styles.cardUnlocked,
        !milestone.unlocked && styles.cardLocked,
      ]}
    >
      <View
        style={[
          styles.iconWrap,
          { backgroundColor: milestone.unlocked ? `${accent}22` : colors.backgroundElevated },
        ]}
      >
        <Ionicons
          name={icon}
          size={compact ? 24 : 26}
          color={milestone.unlocked ? accent : colors.textDim}
        />
        {!milestone.unlocked ? (
          <View style={styles.lockBadge}>
            <Ionicons name="lock-closed" size={10} color={colors.textMuted} />
          </View>
        ) : null}
      </View>

      <View style={styles.copy}>
        <View style={styles.header}>
          <Text style={[styles.title, !milestone.unlocked && styles.titleLocked]} numberOfLines={1}>
            {milestone.title}
          </Text>
          <Text style={[styles.status, milestone.unlocked && { color: accent }]}>
            {milestone.unlocked ? 'Unlocked' : `${pct}%`}
          </Text>
        </View>
        <Text style={styles.description} numberOfLines={compact ? 2 : 3}>
          {milestone.description}
        </Text>
        {!milestone.unlocked ? (
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${pct}%`, backgroundColor: accent }]} />
          </View>
        ) : (
          <View style={[styles.unlockedPill, { backgroundColor: `${accent}18` }]}>
            <Ionicons name="checkmark-circle" size={14} color={accent} />
            <Text style={[styles.unlockedText, { color: accent }]}>Earned</Text>
          </View>
        )}
        <Text style={styles.progress}>
          {milestone.progress} / {milestone.target}
        </Text>
      </View>
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useAppPreferences>['colors']) {
  const webShadow = Platform.OS === 'web' ? ({ boxShadow: colors.shadow } as object) : {};

  return StyleSheet.create({
    card: {
      flexDirection: 'row',
      gap: spacing.md,
      padding: spacing.lg,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      ...webShadow,
    },
    cardCompact: {
      flex: 1,
      minWidth: 280,
      maxWidth: '100%',
    },
    cardUnlocked: {
      borderColor: colors.success,
    },
    cardLocked: {
      opacity: 0.92,
    },
    iconWrap: {
      width: 56,
      height: 56,
      borderRadius: radius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      position: 'relative',
    },
    lockBadge: {
      position: 'absolute',
      bottom: -2,
      right: -2,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    copy: {
      flex: 1,
      gap: spacing.xs,
      minWidth: 0,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.sm,
    },
    title: {
      fontFamily: fonts.bodyBold,
      fontSize: 15,
      color: colors.text,
      flex: 1,
    },
    titleLocked: {
      color: colors.textSecondary,
    },
    status: {
      fontFamily: fonts.bodyBold,
      fontSize: 11,
      color: colors.textMuted,
      flexShrink: 0,
    },
    description: {
      fontFamily: fonts.body,
      fontSize: 13,
      lineHeight: 19,
      color: colors.textSecondary,
    },
    track: {
      height: 6,
      borderRadius: radius.pill,
      backgroundColor: colors.backgroundElevated,
      overflow: 'hidden',
      marginTop: 2,
    },
    fill: {
      height: '100%',
      borderRadius: radius.pill,
    },
    unlockedPill: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: 4,
      paddingVertical: 4,
      paddingHorizontal: spacing.sm,
      borderRadius: radius.pill,
      marginTop: 2,
    },
    unlockedText: {
      fontFamily: fonts.bodyBold,
      fontSize: 11,
    },
    progress: {
      fontFamily: fonts.bodyMedium,
      fontSize: 11,
      color: colors.textDim,
    },
  });
}
