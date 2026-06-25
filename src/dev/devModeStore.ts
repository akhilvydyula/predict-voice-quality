import kvStorage from '../storage/kvStorage';

const DEV_MODE_KEY = '@voicequality/architect_dev_mode';
const DEV_FLAGS_KEY = '@voicequality/dev_flags';

export type DevFlags = {
  showLiveOverlay: boolean;
  verboseLogging: boolean;
  mockScores: boolean;
  apiSyncEnabled: boolean;
};

const DEFAULT_FLAGS: DevFlags = {
  showLiveOverlay: true,
  verboseLogging: false,
  mockScores: false,
  apiSyncEnabled: false,
};

export async function loadArchitectDevMode(): Promise<boolean> {
  try {
    const value = await kvStorage.getItem(DEV_MODE_KEY);
    return value === '1';
  } catch {
    return false;
  }
}

export async function saveArchitectDevMode(enabled: boolean): Promise<void> {
  await kvStorage.setItem(DEV_MODE_KEY, enabled ? '1' : '0');
}

export async function loadDevFlags(): Promise<DevFlags> {
  try {
    const raw = await kvStorage.getItem(DEV_FLAGS_KEY);
    if (!raw) return { ...DEFAULT_FLAGS };
    return { ...DEFAULT_FLAGS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_FLAGS };
  }
}

export async function saveDevFlags(flags: DevFlags): Promise<void> {
  await kvStorage.setItem(DEV_FLAGS_KEY, JSON.stringify(flags));
}

export const PIPELINE_LAYERS = [
  { id: 'mic', label: 'Microphone', detail: 'expo-audio stream · WebAudio fallback on web' },
  { id: 'yin', label: 'YIN pitch', detail: 'Monophonic F0 · 80–1000 Hz singing range' },
  { id: 'metrics', label: 'Voice metrics', detail: 'Pitch, stability, breath, tone, vibrato, dynamics' },
  { id: 'advanced', label: 'Advanced analytics', detail: 'Register, drift, fatigue, phrase consistency' },
  { id: 'agent', label: 'Vocal coach agent', detail: 'Live guidance · plans · AsyncStorage profile' },
  { id: 'api', label: 'Cloud API', detail: 'Session sync · profile backup · optional x-api-key' },
] as const;
