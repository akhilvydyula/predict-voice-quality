export type VoiceMetrics = {
  pitchAccuracy: number;
  stability: number;
  breathControl: number;
  toneClarity: number;
  vibrato: number;
  dynamics: number;
  overall: number;
};

export type SingerInsights = {
  inTunePercent: number;
  intonationBias: 'sharp' | 'flat' | 'balanced';
  averageCents: number;
  vocalRangeLow: string | null;
  vocalRangeHigh: string | null;
  rangeSemitones: number;
  longestHoldSeconds: number;
  vibratoRateHz: number | null;
  vibratoDepthCents: number | null;
  dynamicsRange: number;
  sessionSeconds: number;
  notesDetected: number;
  onPitchStreak: number;
  singerLevel: string;
};

export type CoachingInsight = {
  primaryTip: string;
  exercise: string;
  strength: string;
  focusArea: string;
};

export type SessionSummary = {
  metrics: VoiceMetrics;
  insights: SingerInsights;
  coaching: CoachingInsight;
  highlights: string[];
};

export type AdvancedInsights = {
  voiceRegister: string;
  pitchDrift: string;
  phraseConsistency: number;
  fatigueIndex: number;
  warmupReadiness: number;
  expressiveRange: number;
  chestMixEstimate: string;
};

export type StoredSession = {
  id: string;
  date: string;
  overall: number;
  pitchAccuracy: number;
  stability: number;
  breathControl: number;
  toneClarity: number;
  vibrato: number;
  dynamics: number;
  inTunePercent: number;
  sessionSeconds: number;
  focusArea: string;
  voiceRegister: string;
};

export type SingerProfile = {
  sessions: StoredSession[];
  skillAverages: {
    pitchAccuracy: number;
    stability: number;
    breathControl: number;
    toneClarity: number;
    vibrato: number;
    dynamics: number;
  };
  totalPracticeMinutes: number;
  practiceStreak: number;
  lastSessionDate: string | null;
  persistentWeakness: string;
  persistentStrength: string;
  learningGoal: string;
  milestonesUnlocked: string[];
};

export type SyncSessionRequest = {
  deviceId: string;
  summary: SessionSummary;
  advanced: AdvancedInsights;
  profile?: SingerProfile;
};
