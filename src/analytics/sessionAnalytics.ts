import { StoredSession, SingerProfile } from '../agent/singerProfile';

export type DashboardMetrics = {
  totalSessions: number;
  totalMinutes: number;
  practiceStreak: number;
  averageOverall: number;
  averagePitch: number;
  weekSessions: number;
  overallDelta: number | null;
  pitchDelta: number | null;
  lastSession: StoredSession | null;
  recentSessions: StoredSession[];
  trendPoints: { label: string; overall: number }[];
  skillBreakdown: { key: string; label: string; value: number }[];
};

export function buildDashboardMetrics(profile: SingerProfile | null): DashboardMetrics {
  const sessions = profile?.sessions ?? [];
  const recentSessions = sessions.slice(0, 8);
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const weekSessions = sessions.filter((s) => new Date(s.date).getTime() >= weekAgo).length;

  const averageOverall =
    sessions.length > 0
      ? Math.round(sessions.reduce((sum, s) => sum + s.overall, 0) / sessions.length)
      : 0;

  const averagePitch = profile?.skillAverages.pitchAccuracy ?? 0;

  const overallDelta =
    sessions.length >= 2 ? sessions[0].overall - sessions[1].overall : null;
  const pitchDelta =
    sessions.length >= 2 ? sessions[0].pitchAccuracy - sessions[1].pitchAccuracy : null;

  const trendPoints = [...sessions]
    .reverse()
    .slice(-10)
    .map((session) => ({
      label: formatShortDate(session.date),
      overall: session.overall,
    }));

  const skillBreakdown = profile
    ? [
        { key: 'pitch', label: 'Pitch accuracy', value: profile.skillAverages.pitchAccuracy },
        { key: 'stability', label: 'Stability', value: profile.skillAverages.stability },
        { key: 'breath', label: 'Breath support', value: profile.skillAverages.breathControl },
        { key: 'tone', label: 'Tone clarity', value: profile.skillAverages.toneClarity },
        { key: 'vibrato', label: 'Vibrato control', value: profile.skillAverages.vibrato },
        { key: 'dynamics', label: 'Dynamics', value: profile.skillAverages.dynamics },
      ]
    : [];

  return {
    totalSessions: sessions.length,
    totalMinutes: profile?.totalPracticeMinutes ?? 0,
    practiceStreak: profile?.practiceStreak ?? 0,
    averageOverall,
    averagePitch,
    weekSessions,
    overallDelta,
    pitchDelta,
    lastSession: sessions[0] ?? null,
    recentSessions,
    trendPoints,
    skillBreakdown,
  };
}

function formatShortDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function formatSessionDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const rem = seconds % 60;
  return rem > 0 ? `${minutes}m ${rem}s` : `${minutes}m`;
}

export function formatFullDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
