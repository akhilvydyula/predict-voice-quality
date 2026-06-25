import { Ionicons } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';
import { useMemo } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppPreferences } from '../../context/AppPreferencesContext';
import { radius, spacing } from '../../theme/spacing';
import { fonts } from '../../theme/typography';

type QuickActionRowProps = {
  title: string;
  description: string;
  ctaLabel: string;
  route: Href;
  icon: keyof typeof Ionicons.glyphMap;
};

export function QuickActionRow({ title, description, ctaLabel, route, icon }: QuickActionRowProps) {
  const router = useRouter();
  const { colors } = useAppPreferences();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Pressable
      onPress={() => router.push(route)}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={22} color={colors.primary} />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <View style={styles.cta}>
          <Text style={styles.ctaText}>{ctaLabel}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textDim} />
    </Pressable>
  );
}

function createStyles(colors: ReturnType<typeof useAppPreferences>['colors']) {
  const webShadow = Platform.OS === 'web' ? ({ boxShadow: colors.shadow } as object) : {};

  return StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.lg,
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.xl,
      ...webShadow,
    },
    cardPressed: {
      backgroundColor: colors.surfaceHover,
    },
    iconWrap: {
      width: 52,
      height: 52,
      borderRadius: radius.md,
      backgroundColor: colors.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    copy: {
      flex: 1,
      gap: spacing.xs,
    },
    title: {
      fontFamily: fonts.bodyBold,
      fontSize: 16,
      color: colors.text,
    },
    description: {
      fontFamily: fonts.body,
      fontSize: 14,
      lineHeight: 20,
      color: colors.textSecondary,
      maxWidth: 420,
    },
    cta: {
      alignSelf: 'flex-start',
      marginTop: spacing.sm,
      backgroundColor: colors.primary,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
      borderRadius: radius.pill,
    },
    ctaText: {
      fontFamily: fonts.bodyBold,
      fontSize: 13,
      color: colors.textOnPrimary,
    },
  });
}
