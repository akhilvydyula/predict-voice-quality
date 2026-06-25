import * as Haptics from 'expo-haptics';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { layout } from '../../theme/layout';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

type SegmentedTabsProps<T extends string> = {
  tabs: { key: T; label: string }[];
  active: T;
  onChange: (key: T) => void;
  /** Force horizontal scroll (e.g. many tabs on a narrow strip). */
  scrollable?: boolean;
};

export function SegmentedTabs<T extends string>({
  tabs,
  active,
  onChange,
  scrollable = false,
}: SegmentedTabsProps<T>) {
  const wide = tabs.length > 3;

  const renderTabs = () =>
    tabs.map((tab) => {
      const selected = tab.key === active;
      return (
        <Pressable
          key={tab.key}
          onPress={() => {
            void Haptics.selectionAsync();
            onChange(tab.key);
          }}
          style={[
            styles.tab,
            wide ? styles.tabWide : scrollable ? styles.tabScrollable : styles.tabCompact,
            selected && styles.tabActive,
          ]}
        >
          <Text
            style={[styles.label, wide && styles.labelWide, selected && styles.labelActive]}
            numberOfLines={1}
          >
            {tab.label}
          </Text>
        </Pressable>
      );
    });

  if (scrollable && !wide) {
    return (
      <View style={styles.scrollOuter}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {renderTabs()}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.track, wide ? styles.trackWide : styles.trackCompact]}>
      {renderTabs()}
    </View>
  );
}

const trackShell = {
  flexDirection: 'row' as const,
  backgroundColor: colors.surfaceElevated,
  borderRadius: radius.md,
  padding: spacing.xs,
  borderWidth: 1,
  borderColor: colors.border,
};

const styles = StyleSheet.create({
  track: trackShell,
  trackCompact: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: layout.maxSegmentedWidth,
  },
  trackWide: {
    width: '100%',
    alignSelf: 'stretch',
  },
  scrollOuter: {
    width: '100%',
    alignSelf: 'stretch',
    ...trackShell,
    padding: 0,
  },
  scrollContent: {
    flexDirection: 'row',
    gap: spacing.xs,
    padding: spacing.xs,
  },
  tab: {
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
  },
  tabCompact: {
    flex: 1,
    paddingHorizontal: spacing.sm,
  },
  tabWide: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: spacing.xs,
  },
  tabScrollable: {
    flexGrow: 0,
    flexShrink: 0,
    minWidth: 72,
    paddingHorizontal: spacing.md,
  },
  tabActive: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  label: {
    ...typography.tabLabel,
    fontSize: 13,
    color: colors.textMuted,
    fontFamily: typography.bodyMedium.fontFamily,
    textAlign: 'center',
  },
  labelWide: {
    fontSize: 12,
  },
  labelActive: {
    color: colors.text,
    fontFamily: typography.bodyBold.fontFamily,
  },
});
