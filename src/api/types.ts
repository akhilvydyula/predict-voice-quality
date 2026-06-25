import type { AdvancedInsights } from '../audio/advancedAnalytics';
import type { SingerProfile } from '../agent/singerProfile';
import type { SessionSummary } from '../audio/voiceQuality';

export type ApiErrorBody = {
  error: string;
  code?: string;
};

export type HealthResponse = {
  ok: true;
  service: 'voice-quality-api';
  version: string;
  uptimeSeconds: number;
};

export type ApiStatusResponse = HealthResponse & {
  sessionsStored: number;
  profilesStored: number;
};

export type SyncSessionRequest = {
  deviceId: string;
  summary: SessionSummary;
  advanced: AdvancedInsights;
  profile?: SingerProfile;
};

export type SyncSessionResponse = {
  sessionId: string;
  storedAt: string;
  profile: SingerProfile;
};

export type ProfileResponse = {
  deviceId: string;
  profile: SingerProfile;
  updatedAt: string | null;
};

export type SessionListItem = {
  id: string;
  deviceId: string;
  storedAt: string;
  overall: number;
  sessionSeconds: number;
  focusArea: string;
};

export type SessionListResponse = {
  deviceId: string;
  sessions: SessionListItem[];
};

export type ApiSyncState = {
  configured: boolean;
  baseUrl: string;
  lastPingAt: string | null;
  lastPingOk: boolean | null;
  lastSyncAt: string | null;
  lastSyncOk: boolean | null;
  lastError: string | null;
};
