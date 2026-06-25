import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  action?: string;
};

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <View style={styles.textWrap}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {action ? <Text style={styles.action}>{action}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  textWrap: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...typography.h2,
    fontSize: 18,
  },
  subtitle: {
    ...typography.bodySmall,
  },
  action: {
    ...typography.caption,
    color: colors.primaryBright,
    letterSpacing: 0.6,
  },
});
