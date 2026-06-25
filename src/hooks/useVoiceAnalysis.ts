import {
  useAudioStream,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  setIsAudioActiveAsync,
} from 'expo-audio';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform } from 'react-native';

import { syncSessionToApi } from '../api/client';
import { isApiConfigured } from '../api/config';
import { getDeviceId } from '../api/deviceId';
import { AdvancedInsights, analyzeAdvanced, emptyAdvancedInsights } from '../audio/advancedAnalytics';
import { VocalCoachAgent, AgentLiveGuidance, AgentReport } from '../agent/vocalCoachAgent';
import { runPostSessionWorkflow } from '../agent/workflow/vocalCoachWorkflow';
import { WorkflowRun } from '../agent/workflow/types';
import { SingerProfile } from '../agent/singerProfile';
import { frequencyToNote } from '../audio/musicTheory';
import { WebMicrophoneStream } from '../audio/webMicrophoneStream';
import { bufferToMonoSamples, detectPitch } from '../audio/yinPitch';
import {
  CoachingInsight,
  PitchHistoryPoint,
  SessionSummary,
  SingerInsights,
  VoiceMetrics,
  VoiceQualityTracker,
} from '../audio/voiceQuality';

export type LivePitchState = {
  frequency: number | null;
  noteName: string | null;
  octave: number | null;
  cents: number;
  confidence: number;
};

export type DebugTelemetry = {
  bufferCount: number;
  lastSampleRate: number;
  lastBufferSamples: number;
  lastProcessingMs: number;
  sessionSampleCount: number;
  audioSource: 'native' | 'web' | 'none';
  streamActive: boolean;
  lastPitchDetected: boolean;
};

const INITIAL_TELEMETRY: DebugTelemetry = {
  bufferCount: 0,
  lastSampleRate: 0,
  lastBufferSamples: 0,
  lastProcessingMs: 0,
  sessionSampleCount: 0,
  audioSource: 'none',
  streamActive: false,
  lastPitchDetected: false,
};

const INITIAL_PITCH: LivePitchState = {
  frequency: null,
  noteName: null,
  octave: null,
  cents: 0,
  confidence: 0,
};

const EMPTY_METRICS: VoiceMetrics = {
  pitchAccuracy: 0,
  stability: 0,
  breathControl: 0,
  toneClarity: 0,
  vibrato: 0,
  dynamics: 0,
  overall: 0,
};

const EMPTY_INSIGHTS: SingerInsights = {
  inTunePercent: 0,
  intonationBias: 'balanced',
  averageCents: 0,
  vocalRangeLow: null,
  vocalRangeHigh: null,
  rangeSemitones: 0,
  longestHoldSeconds: 0,
  vibratoRateHz: null,
  vibratoDepthCents: null,
  dynamicsRange: 0,
  sessionSeconds: 0,
  notesDetected: 0,
  onPitchStreak: 0,
  singerLevel: 'Warming up',
};

const EMPTY_COACHING: CoachingInsight = {
  primaryTip: 'Tap Start and sing to begin analysis.',
  exercise: 'Sing a comfortable 5-note scale up and down.',
  strength: 'Your voice is ready to be analyzed.',
  focusArea: 'Getting started',
};

function hasWebMicrophone(): boolean {
  return (
    Platform.OS === 'web' &&
    typeof navigator !== 'undefined' &&
    Boolean(navigator.mediaDevices?.getUserMedia)
  );
}

export function useVoiceAnalysis(options?: { verboseLogging?: boolean; apiSyncEnabled?: boolean }) {
  const verboseLogging = options?.verboseLogging ?? false;
  const apiSyncEnabled = options?.apiSyncEnabled ?? false;
  const trackerRef = useRef(new VoiceQualityTracker());
  const agentRef = useRef(new VocalCoachAgent());
  const webStreamRef = useRef<WebMicrophoneStream | null>(null);
  const agentReadyRef = useRef(false);

  const [isActive, setIsActive] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [pitch, setPitch] = useState<LivePitchState>(INITIAL_PITCH);
  const [metrics, setMetrics] = useState<VoiceMetrics>(EMPTY_METRICS);
  const [insights, setInsights] = useState<SingerInsights>(EMPTY_INSIGHTS);
  const [advanced, setAdvanced] = useState<AdvancedInsights>(emptyAdvancedInsights());
  const [coaching, setCoaching] = useState<CoachingInsight>(EMPTY_COACHING);
  const [pitchHistory, setPitchHistory] = useState<PitchHistoryPoint[]>([]);
  const [sessionSummary, setSessionSummary] = useState<SessionSummary | null>(null);
  const [agentReport, setAgentReport] = useState<AgentReport | null>(null);
  const [agentWorkflow, setAgentWorkflow] = useState<WorkflowRun | null>(null);
  const [liveGuidance, setLiveGuidance] = useState<AgentLiveGuidance | null>(null);
  const [profile, setProfile] = useState<SingerProfile | null>(null);
  const [volume, setVolume] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [telemetry, setTelemetry] = useState<DebugTelemetry>(INITIAL_TELEMETRY);

  const isSupported = Platform.OS === 'ios' || Platform.OS === 'android' || hasWebMicrophone();

  useEffect(() => {
    agentRef.current.initialize().then((p) => {
      agentReadyRef.current = true;
      setProfile(p);
      setAgentReport(agentRef.current.getDefaultReport());
    });
  }, []);

  const handleBuffer = useCallback(
    (buffer: { data: ArrayBuffer; sampleRate: number; channels: number; timestamp: number }) => {
      const started = performance.now();
      const mono = bufferToMonoSamples(buffer.data, buffer.channels);
      const result = detectPitch(mono, buffer.sampleRate);
      const elapsed = Math.round(performance.now() - started);

      setTelemetry((prev) => {
        const next = {
          ...prev,
          bufferCount: prev.bufferCount + 1,
          lastSampleRate: buffer.sampleRate,
          lastBufferSamples: mono.length,
          lastProcessingMs: elapsed,
          sessionSampleCount: trackerRef.current.getSessionSamples().length,
          lastPitchDetected: Boolean(result),
        };

        if (verboseLogging && next.bufferCount % 30 === 0) {
          console.log('[voice] buffer', {
            sampleRate: buffer.sampleRate,
            samples: mono.length,
            processingMs: elapsed,
            pitch: result?.frequency ?? null,
          });
        }

        return next;
      });

      if (!result) {
        setVolume((prev) => prev * 0.85);
        return;
      }

      setVolume(Math.min(1, result.rms * 8));
      const note = frequencyToNote(result.frequency);

      if (!note) {
        return;
      }

      const nextPitch = {
        frequency: result.frequency,
        noteName: note.name,
        octave: note.octave,
        cents: note.cents,
        confidence: result.confidence,
      };
      setPitch(nextPitch);

      trackerRef.current.addSample({
        frequency: result.frequency,
        cents: note.cents,
        confidence: result.confidence,
        rms: result.rms,
        timestamp: buffer.timestamp,
        midi: note.midi,
        noteLabel: `${note.name}${note.octave}`,
      });

      const nextMetrics = trackerRef.current.getMetrics();
      const nextInsights = trackerRef.current.getInsights();
      const nextAdvanced = analyzeAdvanced(
        trackerRef.current.getSessionSamples(),
        nextInsights,
        nextMetrics
      );
      const nextCoaching = trackerRef.current.getCoaching(nextMetrics);

      setMetrics(nextMetrics);
      setInsights(nextInsights);
      setAdvanced(nextAdvanced);
      setPitchHistory(trackerRef.current.getPitchHistory());

      if (nextMetrics.overall > 0) {
        setCoaching(nextCoaching);
        const guidance = agentRef.current.observeLive(
          { cents: note.cents, noteName: note.name },
          nextMetrics,
          nextInsights,
          nextAdvanced
        );
        if (guidance) {
          setLiveGuidance(guidance);
        }
      }
    },
    [verboseLogging]
  );

  const { stream } = useAudioStream({
    sampleRate: 44100,
    channels: 1,
    encoding: 'float32',
    onBuffer: handleBuffer,
  });

  const resetSession = useCallback(() => {
    trackerRef.current.reset();
    setPitch(INITIAL_PITCH);
    setMetrics(EMPTY_METRICS);
    setInsights(EMPTY_INSIGHTS);
    setAdvanced(emptyAdvancedInsights());
    setCoaching({
      ...EMPTY_COACHING,
      primaryTip: 'Sing steadily — your vocal coach agent is listening.',
    });
    setPitchHistory([]);
    setSessionSummary(null);
    setLiveGuidance(null);
    setTelemetry({ ...INITIAL_TELEMETRY, audioSource: telemetry.audioSource });
  }, [telemetry.audioSource]);

  const start = useCallback(async () => {
    setError(null);

    if (!isSupported) {
      setError('Live voice analysis requires a microphone on iOS, Android, or web.');
      return;
    }

    try {
      resetSession();

      if (hasWebMicrophone()) {
        const webStream = new WebMicrophoneStream(handleBuffer);
        await webStream.start();
        webStreamRef.current = webStream;
        setPermissionGranted(true);
        setIsActive(true);
        setTelemetry((prev) => ({
          ...prev,
          audioSource: 'web',
          streamActive: true,
        }));
        return;
      }

      const { granted } = await requestRecordingPermissionsAsync();
      setPermissionGranted(granted);

      if (!granted) {
        setError('Microphone permission is required to analyze your voice.');
        return;
      }

      await setIsAudioActiveAsync(true);
      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
        interruptionMode: 'doNotMix',
        shouldPlayInBackground: false,
        shouldRouteThroughEarpiece: false,
      });

      if (!stream?.start) {
        throw new Error(
          'Microphone streaming is unavailable. Update Expo Go to the latest version and try again.'
        );
      }

      await stream.start();
      setIsActive(true);
      setTelemetry((prev) => ({
        ...prev,
        audioSource: 'native',
        streamActive: true,
      }));
    } catch (e) {
      const message =
        e instanceof Error
          ? e.message
          : 'Could not start microphone. Close other apps using the mic and try again.';
      setError(message);
      setIsActive(false);
      webStreamRef.current?.stop();
      webStreamRef.current = null;
      stream?.stop?.();
    }
  }, [handleBuffer, isSupported, resetSession, stream]);

  const stop = useCallback(async () => {
    webStreamRef.current?.stop();
    webStreamRef.current = null;
    stream?.stop?.();

    const summary = trackerRef.current.getSessionSummary();
    const finalAdvanced = analyzeAdvanced(
      trackerRef.current.getSessionSamples(),
      summary.insights,
      summary.metrics
    );

    if (summary.metrics.overall > 0) {
      setSessionSummary(summary);
      setCoaching(summary.coaching);
      setInsights(summary.insights);
      setMetrics(summary.metrics);
      setAdvanced(finalAdvanced);

      if (agentReadyRef.current) {
        const { report, workflow } = await runPostSessionWorkflow(
          agentRef.current,
          summary,
          finalAdvanced,
          setAgentWorkflow
        );
        setAgentReport(report);
        setAgentWorkflow(workflow);
        setProfile(agentRef.current.getProfile());

        if (apiSyncEnabled && isApiConfigured() && summary.metrics.overall > 0) {
          try {
            await syncSessionToApi({
              deviceId: await getDeviceId(),
              summary,
              advanced: finalAdvanced,
              profile: agentRef.current.getProfile(),
            });
            if (verboseLogging) {
              console.log('[api] session synced');
            }
          } catch (e) {
            if (verboseLogging) {
              console.warn('[api] session sync failed', e);
            }
          }
        }
      }
    }

    setIsActive(false);
    setVolume(0);
    setLiveGuidance(null);
    setTelemetry((prev) => ({
      ...prev,
      streamActive: false,
      sessionSampleCount: trackerRef.current.getSessionSamples().length,
    }));
  }, [apiSyncEnabled, stream, verboseLogging]);

  useEffect(() => {
    return () => {
      webStreamRef.current?.stop();
      stream?.stop?.();
    };
  }, [stream]);

  return useMemo(
    () => ({
      isActive,
      isSupported,
      permissionGranted,
      pitch,
      metrics,
      insights,
      advanced,
      coaching,
      pitchHistory,
      sessionSummary,
      agentReport,
      agentWorkflow,
      liveGuidance,
      profile,
      volume,
      error,
      telemetry,
      start,
      stop,
    }),
    [
      isActive,
      isSupported,
      permissionGranted,
      pitch,
      metrics,
      insights,
      advanced,
      coaching,
      pitchHistory,
      sessionSummary,
      agentReport,
      agentWorkflow,
      liveGuidance,
      profile,
      volume,
      error,
      telemetry,
      start,
      stop,
    ]
  );
}

export type VoiceAnalysisValue = ReturnType<typeof useVoiceAnalysis>;
