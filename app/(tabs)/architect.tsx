import Constants from 'expo-constants';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { useApiSync } from '../../src/api/useApiSync';
import { getApiBaseUrl, isApiConfigured } from '../../src/api/config';
import { useDevMode } from '../../src/context/DevModeContext';
import { useVoiceSession } from '../../src/context/VoiceAnalysisContext';
import { AgentWorkflowPanel } from '../../src/components/agent/AgentWorkflowPanel';
import { JsonPanel } from '../../src/components/dev/JsonPanel';
import { GlassCard } from '../../src/components/ui/GlassCard';
import { PrimaryButton } from '../../src/components/ui/PrimaryButton';
import { Screen } from '../../src/components/ui/Screen';
import { SectionHeader } from '../../src/components/ui/SectionHeader';
import { PIPELINE_LAYERS } from '../../src/dev/devModeStore';
import { clearSingerProfile } from '../../src/storage/sessionStore';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { typography } from '../../src/theme/typography';

export default function ArchitectScreen() {
  const { enabled, setEnabled, flags, setFlag } = useDevMode();
  const session = useVoiceSession();
  const { deviceId, state: apiState, ping, loadStatus, loadHistory } = useApiSync();
  const [remoteStatus, setRemoteStatus] = useState<object | null>(null);
  const [remoteHistory, setRemoteHistory] = useState<object | null>(null);

  const systemInfo = {
    platform: Platform.OS,
    osVersion: String(Platform.Version),
    expoSdk: Constants.expoConfig?.sdkVersion ?? '—',
    appVersion: Constants.expoConfig?.version ?? '1.0.0',
    newArch: Boolean((Constants.expoConfig as { newArchEnabled?: boolean } | null)?.newArchEnabled),
    isDevice: Constants.isDevice,
    executionEnvironment: Constants.executionEnvironment,
  };

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>ARCHITECT DEV MODE</Text>
        <Text style={styles.title}>System console</Text>
        <Text style={styles.subtitle}>
          Pipeline telemetry, live analysis state, and developer flags. On-device only.
        </Text>
      </View>

      <GlassCard glow padding={spacing.lg}>
        <View style={styles.switchRow}>
          <View style={styles.switchCopy}>
            <Text style={styles.switchTitle}>Architect mode</Text>
            <Text style={styles.switchDesc}>Shows this tab, overlays, and verbose tooling</Text>
          </View>
          <Switch
            value={enabled}
            onValueChange={(value) => void setEnabled(value)}
            trackColor={{ false: colors.surface, true: colors.primaryMuted }}
            thumbColor={enabled ? colors.primaryBright : colors.textDim}
          />
        </View>
      </GlassCard>

      <SectionHeader title="Dev flags" subtitle="Runtime behavior toggles" />
      <GlassCard padding={spacing.lg}>
        <FlagRow
          label="Live debug overlay"
          desc="Hz, cents, buffer timing on Practice screen"
          value={flags.showLiveOverlay}
          onChange={(v) => void setFlag('showLiveOverlay', v)}
        />
        <FlagRow
          label="Verbose logging"
          desc="Extra console output from analysis pipeline"
          value={flags.verboseLogging}
          onChange={(v) => void setFlag('verboseLogging', v)}
        />
        <FlagRow
          label="API session sync"
          desc="POST session summary to cloud API after each practice"
          value={flags.apiSyncEnabled}
          onChange={(v) => void setFlag('apiSyncEnabled', v)}
          isLast
        />
      </GlassCard>

      <SectionHeader
        title="Cloud API"
        subtitle={isApiConfigured() ? getApiBaseUrl() : 'Set EXPO_PUBLIC_API_URL to enable sync'}
      />
      <GlassCard padding={spacing.lg}>
        <View style={styles.apiMeta}>
          <Text style={styles.apiLine}>Device ID: {deviceId ?? '…'}</Text>
          <Text style={styles.apiLine}>
            Ping: {apiState.lastPingOk === null ? '—' : apiState.lastPingOk ? 'OK' : 'FAIL'}
          </Text>
          <Text style={styles.apiLine}>
            Last sync: {apiState.lastSyncOk === null ? '—' : apiState.lastSyncOk ? 'OK' : 'FAIL'}
          </Text>
          {apiState.lastError ? <Text style={styles.apiError}>{apiState.lastError}</Text> : null}
        </View>
        <View style={styles.apiActions}>
          <PrimaryButton label="Ping /health" variant="ghost" onPress={() => void ping()} />
          <PrimaryButton
            label="Load /v1/status"
            variant="ghost"
            onPress={() => void loadStatus().then(setRemoteStatus)}
          />
          <PrimaryButton
            label="Load session history"
            variant="ghost"
            onPress={() => void loadHistory().then(setRemoteHistory)}
          />
        </View>
      </GlassCard>
      <JsonPanel title="api_state" data={apiState} />
      {remoteStatus ? <JsonPanel title="remote_status" data={remoteStatus} /> : null}
      {remoteHistory ? <JsonPanel title="remote_sessions" data={remoteHistory} /> : null}

      <SectionHeader title="Agent workflow" subtitle="Last post-session orchestration run" />
      <GlassCard padding={spacing.lg}>
        <AgentWorkflowPanel workflow={session.agentWorkflow} compact />
        {!session.agentWorkflow ? (
          <Text style={styles.hint}>
            Complete a practice session to watch specialist agents analyze, plan, and narrate your
            coaching report.
          </Text>
        ) : null}
        {session.agentWorkflow ? (
          <JsonPanel title="workflow_run" data={session.agentWorkflow} />
        ) : null}
      </GlassCard>

      <SectionHeader title="Audio pipeline" subtitle="Signal → metrics → agent" />
      <View style={styles.pipeline}>
        {PIPELINE_LAYERS.map((layer, index) => (
          <View key={layer.id} style={styles.pipelineRow}>
            <View style={styles.pipelineIndex}>
              <Text style={styles.pipelineIndexText}>{index + 1}</Text>
            </View>
            <View style={styles.pipelineBody}>
              <Text style={styles.pipelineLabel}>{layer.label}</Text>
              <Text style={styles.pipelineDetail}>{layer.detail}</Text>
            </View>
          </View>
        ))}
      </View>

      <SectionHeader
        title="Live telemetry"
        subtitle={session.isActive ? 'Streaming now' : 'Idle — start Practice to stream'}
        action={session.isActive ? 'LIVE' : undefined}
      />
      <JsonPanel title="telemetry" data={session.telemetry} />
      <JsonPanel title="pitch" data={session.pitch} />
      <JsonPanel title="metrics" data={session.metrics} />
      <JsonPanel title="advanced" data={session.advanced} />
      <JsonPanel title="system" data={systemInfo} />
      <JsonPanel title="profile" data={session.profile} />

      <PrimaryButton
        label="Clear saved singer profile"
        variant="danger"
        onPress={() => void clearSingerProfile()}
      />
    </Screen>
  );
}

function FlagRow({
  label,
  desc,
  value,
  onChange,
  isLast,
}: {
  label: string;
  desc: string;
  value: boolean;
  onChange: (value: boolean) => void;
  isLast?: boolean;
}) {
  return (
    <Pressable style={[styles.flagRow, isLast && styles.flagRowLast]}>
      <View style={styles.flagCopy}>
        <Text style={styles.flagLabel}>{label}</Text>
        <Text style={styles.flagDesc}>{desc}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.surface, true: colors.primaryMuted }}
        thumbColor={value ? colors.primaryBright : colors.textDim}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: spacing.sm,
  },
  eyebrow: {
    ...typography.caption,
    color: colors.warning,
  },
  title: {
    ...typography.h1,
  },
  subtitle: {
    ...typography.body,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  switchCopy: {
    flex: 1,
    gap: 4,
  },
  switchTitle: {
    ...typography.h3,
  },
  switchDesc: {
    ...typography.bodySmall,
  },
  pipeline: {
    gap: spacing.sm,
  },
  pipelineRow: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pipelineIndex: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.warningSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pipelineIndexText: {
    ...typography.bodyBold,
    color: colors.warning,
    fontSize: 13,
  },
  pipelineBody: {
    flex: 1,
    gap: 2,
  },
  pipelineLabel: {
    ...typography.h3,
    fontSize: 14,
  },
  pipelineDetail: {
    ...typography.bodySmall,
  },
  flagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  flagCopy: {
    flex: 1,
    gap: 2,
  },
  flagLabel: {
    ...typography.bodyBold,
    fontSize: 14,
  },
  flagDesc: {
    ...typography.bodySmall,
  },
  flagRowLast: {
    borderBottomWidth: 0,
  },
  apiMeta: {
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  apiLine: {
    ...typography.bodySmall,
    fontFamily: 'SpaceGrotesk_600SemiBold',
  },
  apiError: {
    ...typography.bodySmall,
    color: colors.danger,
  },
  apiActions: {
    gap: spacing.sm,
  },
  hint: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
});
