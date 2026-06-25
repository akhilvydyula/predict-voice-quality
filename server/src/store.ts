import type { SingerProfile, SessionSummary, AdvancedInsights } from './types.js';
import { EMPTY_PROFILE, mergeSessionIntoProfile } from './profileLogic.js';

export type StoredSessionRecord = {
  id: string;
  deviceId: string;
  storedAt: string;
  summary: SessionSummary;
  advanced: AdvancedInsights;
};

const sessions = new Map<string, StoredSessionRecord>();
const profiles = new Map<string, { profile: SingerProfile; updatedAt: string }>();

export function getStoreStats() {
  return {
    sessionsStored: sessions.size,
    profilesStored: profiles.size,
  };
}

export function getProfile(deviceId: string): SingerProfile {
  return profiles.get(deviceId)?.profile ?? { ...EMPTY_PROFILE };
}

export function saveProfile(deviceId: string, profile: SingerProfile): void {
  profiles.set(deviceId, {
    profile: { ...profile, sessions: profile.sessions.slice(-30) },
    updatedAt: new Date().toISOString(),
  });
}

export function syncSession(
  deviceId: string,
  summary: SessionSummary,
  advanced: AdvancedInsights,
  incomingProfile?: SingerProfile
): { sessionId: string; storedAt: string; profile: SingerProfile } {
  const sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const storedAt = new Date().toISOString();

  sessions.set(sessionId, {
    id: sessionId,
    deviceId,
    storedAt,
    summary,
    advanced,
  });

  const base = incomingProfile ?? getProfile(deviceId);
  const profile = mergeSessionIntoProfile(base, summary, advanced);
  saveProfile(deviceId, profile);

  return { sessionId, storedAt, profile };
}

export function listSessions(deviceId: string, limit = 20) {
  return [...sessions.values()]
    .filter((s) => s.deviceId === deviceId)
    .sort((a, b) => b.storedAt.localeCompare(a.storedAt))
    .slice(0, limit)
    .map((s) => ({
      id: s.id,
      deviceId: s.deviceId,
      storedAt: s.storedAt,
      overall: s.summary.metrics.overall,
      sessionSeconds: s.summary.insights.sessionSeconds,
      focusArea: s.summary.coaching.focusArea,
    }));
}

export function getProfileMeta(deviceId: string) {
  return profiles.get(deviceId) ?? null;
}
