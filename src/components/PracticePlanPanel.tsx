import { StyleSheet, Text, View } from 'react-native';

import { PracticeStep } from '../agent/vocalCoachAgent';
import { colors } from '../theme/colors';

type PracticePlanPanelProps = {
  steps: PracticeStep[];
  focus: string;
};

export function PracticePlanPanel({ steps, focus }: PracticePlanPanelProps) {
  const totalMinutes = steps.reduce((sum, s) => sum + s.durationMinutes, 0);

  return (
    <View style={styles.panel}>
      <View style={styles.header}>
        <Text style={styles.title}>Your practice plan</Text>
        <Text style={styles.duration}>{totalMinutes} min</Text>
      </View>
      <Text style={styles.subtitle}>Agent-built for: {focus}</Text>

      {steps.map((step, index) => (
        <View key={step.id} style={styles.step}>
          <View style={styles.stepNum}>
            <Text style={styles.stepNumText}>{index + 1}</Text>
          </View>
          <View style={styles.stepBody}>
            <Text style={styles.stepTitle}>{step.title}</Text>
            <Text style={styles.stepDesc}>{step.description}</Text>
            <Text style={styles.stepMeta}>
              {step.durationMinutes} min · {step.skill}
            </Text>
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
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  duration: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textDim,
    fontSize: 13,
    marginTop: -6,
  },
  step: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '800',
  },
  stepBody: {
    flex: 1,
    gap: 2,
  },
  stepTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  stepDesc: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  stepMeta: {
    color: colors.textDim,
    fontSize: 11,
    marginTop: 2,
  },
});
