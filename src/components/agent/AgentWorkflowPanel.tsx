import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, View } from 'react-native';

import { useAppPreferences } from '../../context/AppPreferencesContext';
import { WorkflowRun, WorkflowStepStatus } from '../../agent/workflow/types';
import { radius, spacing } from '../../theme/spacing';
import { fonts } from '../../theme/typography';

type AgentWorkflowPanelProps = {
  workflow: WorkflowRun | null;
  compact?: boolean;
};

const STATUS_ICON: Record<WorkflowStepStatus, keyof typeof Ionicons.glyphMap> = {
  pending: 'ellipse-outline',
  running: 'sync-outline',
  complete: 'checkmark-circle',
  error: 'alert-circle',
};

export function AgentWorkflowPanel({ workflow, compact = false }: AgentWorkflowPanelProps) {
  const { colors } = useAppPreferences();
  const styles = useMemo(() => createStyles(colors), [colors]);

  if (!workflow) return null;

  const completed = workflow.steps.filter((step) => step.status === 'complete').length;
  const isRunning = workflow.steps.some((step) => step.status === 'running');
  const hasError = workflow.steps.some((step) => step.status === 'error');

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons name="git-network-outline" size={18} color={colors.primary} />
        </View>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>Agent workflow</Text>
          <Text style={styles.subtitle}>
            {isRunning
              ? 'Specialist agents are working on your session…'
              : hasError
                ? 'Workflow stopped — coach report may be incomplete.'
                : 'All agents finished — your coaching plan is ready.'}
          </Text>
        </View>
        <View style={styles.progressBadge}>
          <Text style={styles.progressText}>
            {completed}/{workflow.steps.length}
          </Text>
        </View>
      </View>

      <View style={styles.timeline}>
        {workflow.steps.map((step, index) => {
          const isLast = index === workflow.steps.length - 1;
          const statusColor =
            step.status === 'complete'
              ? colors.success
              : step.status === 'running'
                ? colors.primary
                : step.status === 'error'
                  ? colors.danger
                  : colors.textDim;

          return (
            <View key={step.id} style={styles.stepRow}>
              <View style={styles.rail}>
                <View style={[styles.stepDot, { borderColor: statusColor }]}>
                  {step.status === 'running' ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                  ) : (
                    <Ionicons name={STATUS_ICON[step.status]} size={14} color={statusColor} />
                  )}
                </View>
                {!isLast ? <View style={[styles.railLine, { backgroundColor: colors.border }]} /> : null}
              </View>

              <View style={[styles.stepBody, isLast && styles.stepBodyLast]}>
                <View style={styles.stepTop}>
                  <View style={styles.agentIcon}>
                    <Ionicons name={step.agent.icon} size={16} color={colors.primary} />
                  </View>
                  <View style={styles.stepCopy}>
                    <Text style={styles.agentName}>{step.agent.name}</Text>
                    {!compact ? (
                      <Text style={styles.agentMission}>{step.agent.mission}</Text>
                    ) : null}
                  </View>
                  {step.durationMs ? (
                    <Text style={styles.duration}>{step.durationMs}ms</Text>
                  ) : null}
                </View>

                {step.output ? (
                  <Text style={styles.output} numberOfLines={compact ? 2 : 4}>
                    {step.output}
                  </Text>
                ) : null}

                {step.error ? <Text style={styles.errorText}>{step.error}</Text> : null}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useAppPreferences>['colors']) {
  const webShadow = Platform.OS === 'web' ? ({ boxShadow: colors.shadow } as object) : {};

  return StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.xl,
      gap: spacing.lg,
      ...webShadow,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.md,
    },
    headerIcon: {
      width: 36,
      height: 36,
      borderRadius: radius.sm,
      backgroundColor: colors.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerCopy: {
      flex: 1,
      gap: 2,
    },
    title: {
      fontFamily: fonts.bodyBold,
      fontSize: 16,
      color: colors.text,
    },
    subtitle: {
      fontFamily: fonts.body,
      fontSize: 13,
      lineHeight: 18,
      color: colors.textSecondary,
    },
    progressBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: radius.pill,
      backgroundColor: colors.backgroundElevated,
      borderWidth: 1,
      borderColor: colors.border,
    },
    progressText: {
      fontFamily: fonts.bodyBold,
      fontSize: 12,
      color: colors.primary,
    },
    timeline: {
      gap: 0,
    },
    stepRow: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    rail: {
      width: 28,
      alignItems: 'center',
    },
    stepDot: {
      width: 28,
      height: 28,
      borderRadius: 14,
      borderWidth: 2,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    railLine: {
      flex: 1,
      width: 2,
      minHeight: spacing.lg,
      marginVertical: spacing.xs,
    },
    stepBody: {
      flex: 1,
      paddingBottom: spacing.lg,
      gap: spacing.sm,
    },
    stepBodyLast: {
      paddingBottom: 0,
    },
    stepTop: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.sm,
    },
    agentIcon: {
      width: 32,
      height: 32,
      borderRadius: radius.sm,
      backgroundColor: colors.backgroundElevated,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepCopy: {
      flex: 1,
      gap: 2,
    },
    agentName: {
      fontFamily: fonts.bodyBold,
      fontSize: 14,
      color: colors.text,
    },
    agentMission: {
      fontFamily: fonts.body,
      fontSize: 12,
      lineHeight: 17,
      color: colors.textMuted,
    },
    duration: {
      fontFamily: fonts.body,
      fontSize: 11,
      color: colors.textDim,
    },
    output: {
      fontFamily: fonts.body,
      fontSize: 13,
      lineHeight: 19,
      color: colors.textSecondary,
      backgroundColor: colors.backgroundElevated,
      borderRadius: radius.md,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    errorText: {
      fontFamily: fonts.bodyMedium,
      fontSize: 12,
      color: colors.danger,
    },
  });
}
