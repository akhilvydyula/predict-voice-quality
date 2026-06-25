import * as Haptics from 'expo-haptics';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

type SegmentedTabsProps<T extends string> = {
  tabs: { key: T; label: string }[];
  active: T;
  onChange: (key: T) => void;
  scrollable?: boolean;
};

export function SegmentedTabs<T extends string>({
  tabs,
  active,
  onChange,
  scrollable = false,
}: SegmentedTabsProps<T>) {
  const content = tabs.map((tab) => {
    const selected = tab.key === active;
    return (
      <Pressable
        key={tab.key}
        onPress={() => {
          void Haptics.selectionAsync();
          onChange(tab.key);
        }}
        style={[styles.tab, scrollable && styles.tabScrollable, selected && styles.tabActive]}
      >
        <Text style={[styles.label, selected && styles.labelActive]} numberOfLines={1}>
          {tab.label}
        </Text>
      </Pressable>
    );
  });

  if (scrollable) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollTrack}
      >
        {content}
      </ScrollView>
    );
  }

  return <View style={styles.track}>{content}</View>;
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    padding: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tab: {
    flex: 1,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
  },
  tabScrollable: {
    flex: 0,
    minWidth: 72,
    paddingHorizontal: spacing.md,
  },
  scrollTrack: {
    flexDirection: 'row',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    padding: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabActive: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  label: {
    ...typography.tabLabel,
    color: colors.textMuted,
  },
  labelActive: {
    color: colors.text,
    fontFamily: typography.h3.fontFamily,
  },
});
