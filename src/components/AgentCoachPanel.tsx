import { StyleSheet, Text, View } from 'react-native';

import { AgentReport } from '../agent/vocalCoachAgent';
import { colors } from '../theme/colors';

type AgentCoachPanelProps = {
  report: AgentReport;
};

export function AgentCoachPanel({ report }: AgentCoachPanelProps) {
  return (
    <View style={styles.panel}>
      <Text style={styles.title}>🤖 Vocal Coach Agent</Text>
      <Text style={styles.narrative}>{report.narrative}</Text>

      {report.improvementDelta !== null ? (
        <View style={styles.deltaBox}>
          <Text style={styles.deltaText}>
            {report.improvementDelta >= 0 ? '▲' : '▼'} {Math.abs(report.improvementDelta)} pts vs
            last session
          </Text>
        </View>
      ) : null}

      <Text style={styles.trend}>{report.trendSummary}</Text>
      <Text style={styles.goal}>Weekly goal: {report.weeklyGoal}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.primary,
    gap: 10,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  narrative: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
  },
  deltaBox: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  deltaText: {
    color: colors.success,
    fontSize: 13,
    fontWeight: '700',
  },
  trend: {
    color: colors.textDim,
    fontSize: 12,
    lineHeight: 18,
  },
  goal: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '600',
  },
});
