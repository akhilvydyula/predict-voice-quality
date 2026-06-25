import { AdvancedInsights } from '../audio/advancedAnalytics';
import { SingerInsights, SessionSummary, VoiceMetrics } from '../audio/voiceQuality';
import {
  EMPTY_PROFILE,
  SingerProfile,
  sessionFromSummary,
  updateSkillAverages,
  updateStreak,
} from './singerProfile';
import { loadSingerProfile, saveSingerProfile } from '../storage/sessionStore';

export type PracticeStep = {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  skill: string;
};

export type LearningMilestone = {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  unlocked: boolean;
};

export type AgentLiveGuidance = {
  message: string;
  urgency: 'info' | 'tip' | 'alert';
  action: string;
};

export type AgentReport = {
  narrative: string;
  practicePlan: PracticeStep[];
  milestones: LearningMilestone[];
  weeklyGoal: string;
  nextSessionFocus: string;
  trendSummary: string;
  improvementDelta: number | null;
};

const MILESTONE_DEFS = [
  { id: 'first_session', title: 'First steps', description: 'Complete your first practice session', target: 1 },
  { id: 'pitch_70', title: 'Pitch pioneer', description: 'Reach 70+ pitch accuracy in a session', target: 70 },
  { id: 'streak_3', title: '3-day streak', description: 'Practice 3 days in a row', target: 3 },
  { id: 'hold_3s', title: 'Steady holder', description: 'Hold a note for 3+ seconds in tune', target: 3 },
  { id: 'overall_75', title: 'Rising star', description: 'Score 75+ overall in a session', target: 75 },
  { id: 'sessions_10', title: 'Dedicated vocalist', description: 'Complete 10 practice sessions', target: 10 },
];

export class VocalCoachAgent {
  private profile: SingerProfile = { ...EMPTY_PROFILE };
  private loaded = false;
  private lastLiveMessage = '';
  private lastLiveAt = 0;

  async initialize(): Promise<SingerProfile> {
    this.profile = await loadSingerProfile();
    this.loaded = true;
    return this.profile;
  }

  getProfile(): SingerProfile {
    return this.profile;
  }

  observeLive(
    pitch: { cents: number; noteName: string | null },
    metrics: VoiceMetrics,
    insights: SingerInsights,
    advanced: AdvancedInsights
  ): AgentLiveGuidance | null {
    if (metrics.overall <= 0) return null;

    const now = Date.now();
    if (now - this.lastLiveAt < 2500 && this.lastLiveMessage) {
      return null;
    }

    let guidance: AgentLiveGuidance | null = null;

    if (Math.abs(pitch.cents) > 35 && pitch.noteName) {
      guidance = {
        message:
          pitch.cents > 0
            ? `You're ${Math.abs(pitch.cents)}¢ sharp on ${pitch.noteName} — relax and aim lower.`
            : `You're ${Math.abs(pitch.cents)}¢ flat — add support and brighten the vowel.`,
        urgency: 'alert',
        action: 'Adjust pitch now',
      };
    } else if (advanced.fatigueIndex > 40 && insights.sessionSeconds > 60) {
      guidance = {
        message: 'Pitch is dropping as you sing — take a breath and reset posture.',
        urgency: 'tip',
        action: 'Rest 10 seconds',
      };
    } else if (insights.inTunePercent >= 75 && metrics.overall >= 70) {
      guidance = {
        message: 'Great intonation! Try adding dynamics on the next phrase.',
        urgency: 'info',
        action: 'Sing softer → louder',
      };
    } else if (advanced.phraseConsistency < 50 && insights.sessionSeconds > 30) {
      guidance = {
        message: 'Phrases are uneven — slow down and finish each line at the same volume.',
        urgency: 'tip',
        action: 'Phrase-by-phrase',
      };
    } else if (metrics.stability < 55) {
      guidance = {
        message: 'Hold the current note steady — loose jaw, steady airflow.',
        urgency: 'tip',
        action: 'Sustain 4 counts',
      };
    }

    if (guidance) {
      this.lastLiveAt = now;
      this.lastLiveMessage = guidance.message;
    }

    return guidance;
  }

  async processSessionEnd(
    summary: SessionSummary,
    advanced: AdvancedInsights
  ): Promise<AgentReport> {
    if (!this.loaded) {
      await this.initialize();
    }

    await this.applySessionToProfile(summary, advanced);
    return this.finalizeReport(summary, advanced);
  }

  async applySessionToProfile(
    summary: SessionSummary,
    advanced: AdvancedInsights
  ): Promise<SingerProfile> {
    if (!this.loaded) {
      await this.initialize();
    }

    const stored = sessionFromSummary(summary, advanced);

    this.profile = {
      ...this.profile,
      sessions: [stored, ...this.profile.sessions],
    };
    this.profile = updateSkillAverages(this.profile);
    this.profile = updateStreak(this.profile, stored.date);
    this.profile.persistentWeakness = summary.coaching.focusArea;
    this.profile.persistentStrength = pickStrength(summary.metrics);
    this.profile.learningGoal = buildLearningGoal(summary, advanced, this.profile);
    this.profile.milestonesUnlocked = computeUnlockedMilestones(this.profile, summary, advanced);

    await saveSingerProfile(this.profile);
    return this.profile;
  }

  previewPracticePlan(
    summary: SessionSummary,
    advanced: AdvancedInsights,
    profile: SingerProfile
  ): PracticeStep[] {
    return buildPracticePlan(summary, advanced, profile);
  }

  previewMilestones(
    summary: SessionSummary,
    advanced: AdvancedInsights,
    profile: SingerProfile
  ): LearningMilestone[] {
    return buildMilestones(profile, summary, advanced);
  }

  previewWeeklyGoal(profile: SingerProfile): string {
    return buildWeeklyGoal(profile);
  }

  finalizeReport(summary: SessionSummary, advanced: AdvancedInsights): AgentReport {
    const previousOverall = this.profile.sessions[1]?.overall ?? null;
    return this.buildReport(summary, advanced, previousOverall);
  }

  buildReport(
    summary: SessionSummary,
    advanced: AdvancedInsights,
    previousOverall: number | null
  ): AgentReport {
    const improvementDelta =
      previousOverall !== null ? summary.metrics.overall - previousOverall : null;

    return {
      narrative: buildNarrative(summary, advanced, this.profile, improvementDelta),
      practicePlan: buildPracticePlan(summary, advanced, this.profile),
      milestones: buildMilestones(this.profile, summary, advanced),
      weeklyGoal: buildWeeklyGoal(this.profile),
      nextSessionFocus: summary.coaching.focusArea,
      trendSummary: buildTrendSummary(this.profile),
      improvementDelta,
    };
  }

  getDefaultReport(): AgentReport {
    return {
      narrative:
        'Your vocal coach agent tracks every session and builds a personalized practice plan. Start singing to begin learning.',
      practicePlan: buildStarterPlan(),
      milestones: buildMilestones(this.profile, null, null),
      weeklyGoal: 'Complete 3 practice sessions this week',
      nextSessionFocus: 'Pitch accuracy',
      trendSummary: 'No sessions yet — your progress chart starts after your first sing.',
      improvementDelta: null,
    };
  }
}

function pickStrength(metrics: VoiceMetrics): string {
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

function buildLearningGoal(
  summary: SessionSummary,
  advanced: AdvancedInsights,
  profile: SingerProfile
): string {
  if (profile.sessions.length < 2) {
    return 'Establish baseline pitch accuracy and comfortable range';
  }
  if (summary.metrics.pitchAccuracy < 65) {
    return 'Lock in reliable intonation on scales and simple melodies';
  }
  if (advanced.phraseConsistency < 60) {
    return 'Sing full phrases with even tone and steady pitch';
  }
  if (summary.metrics.dynamics < 60) {
    return 'Add expressive dynamics without losing pitch control';
  }
  return 'Polish performance-ready tone, vibrato, and song delivery';
}

function buildNarrative(
  summary: SessionSummary,
  advanced: AdvancedInsights,
  profile: SingerProfile,
  delta: number | null
): string {
  const parts: string[] = [];

  parts.push(
    `Session complete — ${summary.insights.singerLevel} at ${summary.metrics.overall}/100.`
  );

  if (delta !== null) {
    parts.push(
      delta >= 0
        ? `Up ${delta} points from your last session. Keep this momentum.`
        : `Down ${Math.abs(delta)} points — fatigue or tougher material may be a factor.`
    );
  }

  if (advanced.pitchDrift === 'flattening') {
    parts.push('Your pitch drifted flat over time — schedule breaks on long songs.');
  } else if (advanced.pitchDrift === 'sharpening') {
    parts.push('You sharpened as you sang — check tension in neck and jaw.');
  }

  if (profile.practiceStreak >= 2) {
    parts.push(`You're on a ${profile.practiceStreak}-day practice streak. Consistency builds muscle memory.`);
  }

  parts.push(
    `As a ${advanced.voiceRegister} voice, focus next on ${summary.coaching.focusArea.toLowerCase()}.`
  );

  return parts.join(' ');
}

function buildPracticePlan(
  summary: SessionSummary,
  advanced: AdvancedInsights,
  profile: SingerProfile
): PracticeStep[] {
  const focus = summary.coaching.focusArea;
  const steps: PracticeStep[] = [
    {
      id: 'warmup',
      title: 'Warm-up (lip trills & hums)',
      description: '2 min gentle sirens from low to high. Keep jaw loose.',
      durationMinutes: 2,
      skill: 'Warm-up',
    },
    {
      id: 'focus_drill',
      title: `Focus drill: ${focus}`,
      description: summary.coaching.exercise,
      durationMinutes: 5,
      skill: focus,
    },
    {
      id: 'application',
      title: 'Apply to a song phrase',
      description: `Sing one verse slowly. Target ${advanced.chestMixEstimate} with ${summary.insights.inTunePercent}% in-tune goal.`,
      durationMinutes: 5,
      skill: 'Application',
    },
  ];

  if (advanced.fatigueIndex > 35) {
    steps.push({
      id: 'recovery',
      title: 'Recovery breathing',
      description: '4-count inhale, 8-count hiss. Reset before another run.',
      durationMinutes: 3,
      skill: 'Breath support',
    });
  }

  if (profile.sessions.length >= 3 && summary.metrics.dynamics < 70) {
    steps.push({
      id: 'dynamics',
      title: 'Dynamics ladder',
      description: 'Sing "ah" pp → mf → pp on one breath. 4 reps.',
      durationMinutes: 4,
      skill: 'Dynamics',
    });
  }

  return steps;
}

function buildStarterPlan(): PracticeStep[] {
  return [
    {
      id: 'warmup',
      title: 'Warm-up hums',
      description: 'Hum a comfortable 5-note scale up and down.',
      durationMinutes: 2,
      skill: 'Warm-up',
    },
    {
      id: 'pitch',
      title: 'Pitch matching',
      description: 'Hold each note 3 seconds. Watch the pitch meter stay green.',
      durationMinutes: 5,
      skill: 'Pitch accuracy',
    },
    {
      id: 'review',
      title: 'Review with coach',
      description: 'Stop session and read your agent recap + practice plan.',
      durationMinutes: 2,
      skill: 'Reflection',
    },
  ];
}

function buildWeeklyGoal(profile: SingerProfile): string {
  const sessionsThisWeek = profile.sessions.filter((s) => isThisWeek(s.date)).length;
  const remaining = Math.max(0, 3 - sessionsThisWeek);

  if (remaining === 0) {
    return 'Weekly goal met! Push for 5 sessions or aim for 80+ overall.';
  }
  return `Complete ${remaining} more session${remaining === 1 ? '' : 's'} this week (${sessionsThisWeek}/3 done)`;
}

function buildTrendSummary(profile: SingerProfile): string {
  if (profile.sessions.length < 2) {
    return profile.sessions.length === 1
      ? 'First session logged. One more to unlock trend analysis.'
      : 'No sessions yet.';
  }

  const recent = profile.sessions.slice(0, 5);
  const avgOverall = Math.round(
    recent.reduce((sum, s) => sum + s.overall, 0) / recent.length
  );
  const avgPitch = profile.skillAverages.pitchAccuracy;
  const trend =
    recent[0].overall > recent[recent.length - 1].overall ? 'improving' : 'variable';

  return `${profile.sessions.length} sessions · avg ${avgOverall}/100 overall · pitch ${avgPitch}/100 · trend: ${trend}`;
}

function buildMilestones(
  profile: SingerProfile,
  summary: SessionSummary | null,
  advanced: AdvancedInsights | null
): LearningMilestone[] {
  const unlocked = new Set(profile.milestonesUnlocked);

  return MILESTONE_DEFS.map((def) => {
    let progress = 0;

    switch (def.id) {
      case 'first_session':
        progress = profile.sessions.length;
        break;
      case 'overall_75':
        progress =
          summary?.metrics.overall ??
          (profile.sessions.length > 0
            ? Math.max(...profile.sessions.map((s) => s.overall))
            : 0);
        break;
      case 'pitch_70':
        progress =
          summary?.metrics.pitchAccuracy ??
          (profile.sessions.length > 0
            ? Math.max(...profile.sessions.map((s) => s.pitchAccuracy))
            : profile.skillAverages.pitchAccuracy);
        break;
      case 'streak_3':
        progress = profile.practiceStreak;
        break;
      case 'hold_3s':
        progress = unlocked.has(def.id)
          ? def.target
          : (summary?.insights.longestHoldSeconds ?? 0);
        break;
      case 'sessions_10':
        progress = profile.sessions.length;
        break;
    }

    const isUnlocked = unlocked.has(def.id) || progress >= def.target;

    return {
      id: def.id,
      title: def.title,
      description: def.description,
      progress: Math.min(progress, def.target),
      target: def.target,
      unlocked: isUnlocked,
    };
  });
}

function computeUnlockedMilestones(
  profile: SingerProfile,
  summary: SessionSummary,
  advanced: AdvancedInsights
): string[] {
  const milestones = buildMilestones(profile, summary, advanced);
  return milestones.filter((m) => m.unlocked).map((m) => m.id);
}

function isThisWeek(isoDate: string): boolean {
  const date = new Date(isoDate);
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(now.getDate() - 7);
  return date >= weekAgo;
}

/** Milestones for profile-backed goals & achievements screens. */
export function getMilestonesForProfile(profile: SingerProfile | null): LearningMilestone[] {
  return buildMilestones(profile ?? EMPTY_PROFILE, null, null);
}

/** Weekly goal copy for goals screen. */
export function getWeeklyGoalForProfile(profile: SingerProfile | null): string {
  return buildWeeklyGoal(profile ?? EMPTY_PROFILE);
}
