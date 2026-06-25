import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

type JsonPanelProps = {
  title: string;
  data: unknown;
};

export function JsonPanel({ title, data }: JsonPanelProps) {
  return (
    <View style={styles.panel}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.json} selectable>
        {JSON.stringify(data, null, 2)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  title: {
    ...typography.caption,
    color: colors.warning,
  },
  json: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 11,
    lineHeight: 16,
    color: colors.textSecondary,
  },
});
