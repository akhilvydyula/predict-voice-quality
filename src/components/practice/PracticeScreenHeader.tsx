import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppShellLayout } from '../layout/AppShell';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { fonts } from '../../theme/typography';

export function PracticeScreenHeader() {
  const router = useRouter();
  const { showSidebar } = useAppShellLayout();

  if (showSidebar) {
    return (
      <Pressable
        onPress={() => router.push('/tools')}
        style={styles.settingsOnly}
        hitSlop={8}
      >
        <Ionicons name="settings-outline" size={22} color={colors.textSecondary} />
      </Pressable>
    );
  }

  return (
    <View style={styles.row}>
      <View style={styles.brand}>
        <View style={styles.logoMark}>
          <Ionicons name="pulse" size={16} color={colors.textOnPrimary} />
        </View>
        <Text style={styles.brandText}>VocalIQ</Text>
      </View>
      <Pressable onPress={() => router.push('/tools')} hitSlop={8}>
        <Ionicons name="settings-outline" size={22} color={colors.textSecondary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  settingsOnly: {
    alignSelf: 'flex-end',
    marginBottom: spacing.md,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logoMark: {
    width: 30,
    height: 30,
    borderRadius: radius.sm,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    fontFamily: fonts.display,
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
});
