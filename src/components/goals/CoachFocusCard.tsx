import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { useAppPreferences } from '../../context/AppPreferencesContext';
import { radius, spacing } from '../../theme/spacing';
import { fonts } from '../../theme/typography';

type CoachFocusCardProps = {
  learningGoal: string;
  nextSessionFocus?: string;
  weeklyCopy: string;
};

export function CoachFocusCard({ learningGoal, nextSessionFocus, weeklyCopy }: CoachFocusCardProps) {
  const { colors } = useAppPreferences();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.card}>
      <View style={styles.iconCol}>
        <View style={styles.iconWrap}>
          <Ionicons name="school" size={22} color={colors.primary} />
        </View>
      </View>
      <View style={styles.copy}>
        <Text style={styles.eyebrow}>Coach focus</Text>
        <Text style={styles.goal}>{learningGoal}</Text>
        {nextSessionFocus ? (
          <View style={styles.chip}>
            <Ionicons name="arrow-forward-circle-outline" size={14} color={colors.primary} />
            <Text style={styles.chipText}>Next · {nextSessionFocus}</Text>
          </View>
        ) : null}
        <View style={styles.weeklyRow}>
          <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
          <Text style={styles.weekly}>{weeklyCopy}</Text>
        </View>
      </View>
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useAppPreferences>['colors']) {
  const webShadow = Platform.OS === 'web' ? ({ boxShadow: colors.shadow } as object) : {};

  return StyleSheet.create({
    card: {
      flexDirection: 'row',
      gap: spacing.lg,
      padding: spacing.xl,
      borderRadius: radius.xl,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      ...webShadow,
    },
    iconCol: {
      paddingTop: 2,
    },
    iconWrap: {
      width: 48,
      height: 48,
      borderRadius: radius.md,
      backgroundColor: colors.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    copy: {
      flex: 1,
      gap: spacing.sm,
    },
    eyebrow: {
      fontFamily: fonts.bodyBold,
      fontSize: 11,
      letterSpacing: 0.8,
      textTransform: 'uppercase',
      color: colors.primary,
    },
    goal: {
      fontFamily: fonts.display,
      fontSize: 20,
      lineHeight: 26,
      letterSpacing: -0.3,
      color: colors.text,
    },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: spacing.xs,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.md,
      borderRadius: radius.pill,
      backgroundColor: colors.primarySoft,
    },
    chipText: {
      fontFamily: fonts.bodyMedium,
      fontSize: 12,
      color: colors.primary,
    },
    weeklyRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.sm,
      marginTop: spacing.xs,
    },
    weekly: {
      fontFamily: fonts.body,
      fontSize: 13,
      lineHeight: 19,
      color: colors.textSecondary,
      flex: 1,
    },
  });
}
