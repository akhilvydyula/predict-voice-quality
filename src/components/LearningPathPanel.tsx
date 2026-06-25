import { StyleSheet, Text, View } from 'react-native';

import { LearningMilestone } from '../agent/vocalCoachAgent';
import { colors } from '../theme/colors';

type LearningPathPanelProps = {
  milestones: LearningMilestone[];
};

export function LearningPathPanel({ milestones }: LearningPathPanelProps) {
  return (
    <View style={styles.panel}>
      <Text style={styles.title}>Learning path</Text>
      {milestones.map((m) => (
        <View key={m.id} style={styles.item}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle}>
              {m.unlocked ? '✓ ' : '○ '}
              {m.title}
            </Text>
            <Text style={styles.progress}>
              {m.progress}/{m.target}
            </Text>
          </View>
          <Text style={styles.desc}>{m.description}</Text>
          <View style={styles.track}>
            <View
              style={[
                styles.fill,
                {
                  width: `${Math.min(100, (m.progress / m.target) * 100)}%`,
                  backgroundColor: m.unlocked ? colors.success : colors.primary,
                },
              ]}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 14,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  item: {
    gap: 6,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  progress: {
    color: colors.textDim,
    fontSize: 12,
    fontWeight: '600',
  },
  desc: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 17,
  },
  track: {
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.surfaceElevated,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
});
