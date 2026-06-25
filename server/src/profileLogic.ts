import type { AdvancedInsights, SessionSummary, SingerProfile, StoredSession } from './types.js';

export const EMPTY_PROFILE: SingerProfile = {
  sessions: [],
  skillAverages: {
    pitchAccuracy: 0,
    stability: 0,
    breathControl: 0,
    toneClarity: 0,
    vibrato: 0,
    dynamics: 0,
  },
  totalPracticeMinutes: 0,
  practiceStreak: 0,
  lastSessionDate: null,
  persistentWeakness: 'Pitch accuracy',
  persistentStrength: 'Getting started',
  learningGoal: 'Build consistent pitch and breath support',
  milestonesUnlocked: [],
};

export function sessionFromSummary(
  summary: SessionSummary,
  advanced: AdvancedInsights
): StoredSession {
  return {
    id: `${Date.now()}`,
    date: new Date().toISOString(),
    overall: summary.metrics.overall,
    pitchAccuracy: summary.metrics.pitchAccuracy,
    stability: summary.metrics.stability,
    breathControl: summary.metrics.breathControl,
    toneClarity: summary.metrics.toneClarity,
    vibrato: summary.metrics.vibrato,
    dynamics: summary.metrics.dynamics,
    inTunePercent: summary.insights.inTunePercent,
    sessionSeconds: summary.insights.sessionSeconds,
    focusArea: summary.coaching.focusArea,
    voiceRegister: advanced.voiceRegister,
  };
}

export function updateSkillAverages(profile: SingerProfile): SingerProfile {
  const { sessions } = profile;
  if (sessions.length === 0) return profile;

  const avg = (key: keyof StoredSession) => {
    const values = sessions.map((s) => s[key] as number);
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  };

  return {
    ...profile,
    skillAverages: {
      pitchAccuracy: avg('pitchAccuracy'),
      stability: avg('stability'),
      breathControl: avg('breathControl'),
      toneClarity: avg('toneClarity'),
      vibrato: avg('vibrato'),
      dynamics: avg('dynamics'),
    },
    totalPracticeMinutes: Math.round(
      sessions.reduce((sum, s) => sum + s.sessionSeconds, 0) / 60
    ),
  };
}

export function updateStreak(profile: SingerProfile, sessionDate: string): SingerProfile {
  const today = sessionDate.slice(0, 10);
  const last = profile.lastSessionDate?.slice(0, 10) ?? null;

  if (!last) {
    return { ...profile, practiceStreak: 1, lastSessionDate: sessionDate };
  }

  const lastTime = new Date(last).getTime();
  const todayTime = new Date(today).getTime();
  const dayDiff = Math.round((todayTime - lastTime) / (1000 * 60 * 60 * 24));

  if (dayDiff === 0) {
    return { ...profile, lastSessionDate: sessionDate };
  }
  if (dayDiff === 1) {
    return {
      ...profile,
      practiceStreak: profile.practiceStreak + 1,
      lastSessionDate: sessionDate,
    };
  }

  return { ...profile, practiceStreak: 1, lastSessionDate: sessionDate };
}

function pickStrength(metrics: SessionSummary['metrics']): string {
  const ranked = [
    { key: 'Pitch accuracy', score: metrics.pitchAccuracy },
    { key: 'Stability', score: metrics.stability },
    { key: 'Breath support', score: metrics.breathControl },
    { key: 'Tone clarity', score: metrics.toneClarity },
    { key: 'Vibrato', score: metrics.vibrato },
    { key: 'Dynamics', score: metrics.dynamics },
  ].sort((a, b) => b.score - a.score);

  return ranked[0]?.key ?? 'Potential';
}

export function mergeSessionIntoProfile(
  existing: SingerProfile,
  summary: SessionSummary,
  advanced: AdvancedInsights
): SingerProfile {
  const stored = sessionFromSummary(summary, advanced);
  let profile: SingerProfile = {
    ...existing,
    sessions: [stored, ...existing.sessions].slice(0, 30),
  };
  profile = updateSkillAverages(profile);
  profile = updateStreak(profile, stored.date);
  profile.persistentWeakness = summary.coaching.focusArea;
  profile.persistentStrength = pickStrength(summary.metrics);
  return profile;
}
