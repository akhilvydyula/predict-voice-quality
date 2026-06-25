import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useAppPreferences } from '../../context/AppPreferencesContext';
import { radius, spacing } from '../../theme/spacing';
import { fonts } from '../../theme/typography';

type ProfileMenuProps = {
  visible: boolean;
  onClose: () => void;
};

export function ProfileMenu({ visible, onClose }: ProfileMenuProps) {
  const { colors, displayName, initials, setDisplayName, theme, toggleTheme } = useAppPreferences();
  const [draftName, setDraftName] = useState(displayName);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) setDraftName(displayName);
  }, [visible, displayName]);

  const styles = useMemo(() => createStyles(colors), [colors]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDisplayName(draftName);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View style={styles.headerCopy}>
              <Text style={styles.title}>Your profile</Text>
              <Text style={styles.subtitle}>Name appears in the dashboard header.</Text>
            </View>
            <Pressable onPress={onClose} hitSlop={8} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={colors.textMuted} />
            </Pressable>
          </View>

          <Text style={styles.label}>Display name</Text>
          <TextInput
            value={draftName}
            onChangeText={setDraftName}
            placeholder="e.g. Akhil Vydyula"
            placeholderTextColor={colors.textDim}
            style={styles.input}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={() => void handleSave()}
          />

          <View style={styles.themeRow}>
            <View style={styles.themeCopy}>
              <Text style={styles.themeTitle}>Appearance</Text>
              <Text style={styles.themeSub}>
                {theme === 'dark' ? 'Dark mode' : 'Light mode'}
              </Text>
            </View>
            <Pressable onPress={toggleTheme} style={styles.themeToggle}>
              <Ionicons
                name={theme === 'dark' ? 'moon' : 'sunny-outline'}
                size={18}
                color={colors.primary}
              />
            </Pressable>
          </View>

          <Pressable
            onPress={() => void handleSave()}
            disabled={saving}
            style={({ pressed }) => [
              styles.saveBtn,
              pressed && styles.saveBtnPressed,
              saving && styles.saveBtnDisabled,
            ]}
          >
            <Text style={styles.saveBtnText}>{saving ? 'Saving…' : 'Save profile'}</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function createStyles(colors: ReturnType<typeof useAppPreferences>['colors']) {
  const webShadow = Platform.OS === 'web' ? ({ boxShadow: colors.shadowLg } as object) : {};

  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.45)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xl,
    },
    card: {
      width: '100%',
      maxWidth: 420,
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.xl,
      gap: spacing.md,
      ...webShadow,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.md,
      marginBottom: spacing.sm,
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      fontFamily: fonts.bodyBold,
      fontSize: 14,
      color: colors.textOnPrimary,
    },
    headerCopy: {
      flex: 1,
      gap: 2,
    },
    title: {
      fontFamily: fonts.bodyBold,
      fontSize: 18,
      color: colors.text,
    },
    subtitle: {
      fontFamily: fonts.body,
      fontSize: 13,
      lineHeight: 18,
      color: colors.textSecondary,
    },
    closeBtn: {
      padding: spacing.xs,
    },
    label: {
      fontFamily: fonts.bodyMedium,
      fontSize: 13,
      color: colors.textSecondary,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
      backgroundColor: colors.backgroundElevated,
      paddingHorizontal: spacing.md,
      paddingVertical: Platform.OS === 'web' ? spacing.md : spacing.sm,
      fontFamily: fonts.body,
      fontSize: 15,
      color: colors.text,
    },
    themeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: spacing.md,
      borderRadius: radius.md,
      backgroundColor: colors.backgroundElevated,
      borderWidth: 1,
      borderColor: colors.border,
      marginTop: spacing.xs,
    },
    themeCopy: {
      gap: 2,
    },
    themeTitle: {
      fontFamily: fonts.bodyBold,
      fontSize: 14,
      color: colors.text,
    },
    themeSub: {
      fontFamily: fonts.body,
      fontSize: 12,
      color: colors.textMuted,
    },
    themeToggle: {
      width: 40,
      height: 40,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    saveBtn: {
      marginTop: spacing.sm,
      backgroundColor: colors.primary,
      borderRadius: radius.pill,
      paddingVertical: spacing.md,
      alignItems: 'center',
    },
    saveBtnPressed: {
      opacity: 0.9,
    },
    saveBtnDisabled: {
      opacity: 0.6,
    },
    saveBtnText: {
      fontFamily: fonts.bodyBold,
      fontSize: 15,
      color: colors.textOnPrimary,
    },
  });
}
