import { midiToNoteLabel, pitchAccuracyFromCents } from './musicTheory';

export type VoiceMetrics = {
  pitchAccuracy: number;
  stability: number;
  breathControl: number;
  toneClarity: number;
  vibrato: number;
  dynamics: number;
  overall: number;
};

export type IntonationBias = 'sharp' | 'flat' | 'balanced';

export type SingerInsights = {
  inTunePercent: number;
  intonationBias: IntonationBias;
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

export type PitchHistoryPoint = {
  cents: number;
  inTune: boolean;
};

export type SessionSummary = {
  metrics: VoiceMetrics;
  insights: SingerInsights;
  coaching: CoachingInsight;
  highlights: string[];
};

export type FrameSample = {
  frequency: number;
  cents: number;
  confidence: number;
  rms: number;
  timestamp: number;
  midi: number;
  noteLabel: string;
};

const WINDOW_MS = 12000;
const MIN_SAMPLES_FOR_SCORE = 12;
const HISTORY_LENGTH = 48;
const HOLD_GAP_SECONDS = 0.12;
const MIN_HOLD_SECONDS = 0.45;

export class VoiceQualityTracker {
  private samples: FrameSample[] = [];
  private allTimeSamples: FrameSample[] = [];
  private pitchHistory: PitchHistoryPoint[] = [];
  private sessionStart: number | null = null;
  private onPitchStreak = 0;
  private maxOnPitchStreak = 0;

  addSample(sample: Omit<FrameSample, 'midi' | 'noteLabel'> & { midi: number; noteLabel: string }): void {
    if (this.sessionStart === null) {
      this.sessionStart = sample.timestamp;
    }

    const frame: FrameSample = { ...sample };
    this.samples.push(frame);
    this.allTimeSamples.push(frame);

    const cutoff = sample.timestamp - WINDOW_MS / 1000;
    this.samples = this.samples.filter((s) => s.timestamp >= cutoff);

    const inTune = Math.abs(frame.cents) <= 15;
    if (inTune) {
      this.onPitchStreak += 1;
      this.maxOnPitchStreak = Math.max(this.maxOnPitchStreak, this.onPitchStreak);
    } else {
      this.onPitchStreak = 0;
    }

    this.pitchHistory.push({ cents: frame.cents, inTune });
    if (this.pitchHistory.length > HISTORY_LENGTH) {
      this.pitchHistory.shift();
    }
  }

  reset(): void {
    this.samples = [];
    this.allTimeSamples = [];
    this.pitchHistory = [];
    this.sessionStart = null;
    this.onPitchStreak = 0;
    this.maxOnPitchStreak = 0;
  }

  getPitchHistory(): PitchHistoryPoint[] {
    return [...this.pitchHistory];
  }

  getSessionSamples(): FrameSample[] {
    return [...this.allTimeSamples];
  }

  getMetrics(): VoiceMetrics {
    const confident = this.getConfidentSamples();
    if (confident.length < MIN_SAMPLES_FOR_SCORE) {
      return emptyMetrics();
    }

    const pitchScores = confident.map((s) => pitchAccuracyFromCents(s.cents));
    const pitchAccuracy = average(pitchScores);

    const frequencies = confident.map((s) => s.frequency);
    const meanFreq = average(frequencies);
    const freqVariance =
      frequencies.reduce((sum, f) => sum + (f - meanFreq) ** 2, 0) / frequencies.length;
    const centsVariance = 1200 * Math.log2(1 + Math.sqrt(freqVariance) / meanFreq);
    const stability = clamp(100 - centsVariance * 2.5, 0, 100);

    const rmsValues = confident.map((s) => s.rms);
    const meanRms = average(rmsValues);
    const rmsVariance =
      rmsValues.reduce((sum, v) => sum + (v - meanRms) ** 2, 0) / rmsValues.length;
    const breathControl = clamp(100 - rmsVariance * 800, 0, 100);

    const confidences = confident.map((s) => s.confidence);
    const toneClarity = clamp(average(confidences) * 100, 0, 100);

    const vibrato = this.computeVibratoScore(confident);
    const dynamics = this.computeDynamicsScore(confident);

    const overall = Math.round(
      pitchAccuracy * 0.3 +
        stability * 0.18 +
        breathControl * 0.16 +
        toneClarity * 0.16 +
        vibrato * 0.1 +
        dynamics * 0.1
    );

    return {
      pitchAccuracy: Math.round(pitchAccuracy),
      stability: Math.round(stability),
      breathControl: Math.round(breathControl),
      toneClarity: Math.round(toneClarity),
      vibrato: Math.round(vibrato),
      dynamics: Math.round(dynamics),
      overall,
    };
  }

  getInsights(): SingerInsights {
    const confident = this.getConfidentSamples(this.allTimeSamples);
    const sessionSeconds =
      confident.length > 0
        ? confident[confident.length - 1].timestamp - (this.sessionStart ?? confident[0].timestamp)
        : 0;

    if (confident.length < MIN_SAMPLES_FOR_SCORE) {
      return emptyInsights(sessionSeconds);
    }

    const avgCents = average(confident.map((s) => s.cents));
    const intonationBias: IntonationBias =
      avgCents > 10 ? 'sharp' : avgCents < -10 ? 'flat' : 'balanced';

    const inTuneCount = confident.filter((s) => Math.abs(s.cents) <= 15).length;
    const inTunePercent = Math.round((inTuneCount / confident.length) * 100);

    const midis = confident.map((s) => s.midi);
    const lowMidi = Math.min(...midis);
    const highMidi = Math.max(...midis);

    const holds = this.detectHolds(confident);
    const longestHoldSeconds = holds.length > 0 ? Math.max(...holds.map((h) => h.duration)) : 0;
    const vibratoStats = this.analyzeVibrato(holds);
    const rmsValues = confident.map((s) => s.rms);
    const dynamicsRange = Math.max(...rmsValues) - Math.min(...rmsValues);

    const metrics = this.getMetrics();
    const singerLevel = getSingerLevel(metrics.overall);

    return {
      inTunePercent,
      intonationBias,
      averageCents: Math.round(avgCents),
      vocalRangeLow: midiToNoteLabel(lowMidi),
      vocalRangeHigh: midiToNoteLabel(highMidi),
      rangeSemitones: Math.round(highMidi - lowMidi),
      longestHoldSeconds: round1(longestHoldSeconds),
      vibratoRateHz: vibratoStats.rateHz,
      vibratoDepthCents: vibratoStats.depthCents,
      dynamicsRange: round2(dynamicsRange),
      sessionSeconds: round1(sessionSeconds),
      notesDetected: new Set(confident.map((s) => s.noteLabel)).size,
      onPitchStreak: this.maxOnPitchStreak,
      singerLevel,
    };
  }

  getCoaching(metrics?: VoiceMetrics): CoachingInsight {
    const m = metrics ?? this.getMetrics();
    const insights = this.getInsights();

    const ranked = [
      { key: 'Pitch accuracy', score: m.pitchAccuracy },
      { key: 'Note stability', score: m.stability },
      { key: 'Breath support', score: m.breathControl },
      { key: 'Tone clarity', score: m.toneClarity },
      { key: 'Vibrato control', score: m.vibrato },
      { key: 'Dynamics', score: m.dynamics },
    ].sort((a, b) => a.score - b.score);

    const weakest = ranked[0];
    const strongest = ranked[ranked.length - 1];

    const primaryTip = buildPrimaryTip(weakest.key, insights, m);
    const exercise = buildExercise(weakest.key, insights);
    const strength =
      strongest.score > 0
        ? `Your ${strongest.key.toLowerCase()} is your strongest area right now (${strongest.score}/100).`
        : 'Keep singing — we are still learning your voice.';

    return {
      primaryTip,
      exercise,
      strength,
      focusArea: weakest.key,
    };
  }

  getCoachingTip(metrics?: VoiceMetrics): string {
    return this.getCoaching(metrics).primaryTip;
  }

  getSessionSummary(): SessionSummary {
    const metrics = this.getMetrics();
    const insights = this.getInsights();
    const coaching = this.getCoaching(metrics);
    const highlights = buildHighlights(metrics, insights);

    return { metrics, insights, coaching, highlights };
  }

  private getConfidentSamples(source = this.samples): FrameSample[] {
    return source.filter((s) => s.confidence >= 0.35);
  }

  private computeVibratoScore(confident: FrameSample[]): number {
    const holds = this.detectHolds(confident);
    if (holds.length === 0) {
      return clamp(average(confident.map((s) => pitchAccuracyFromCents(s.cents))), 40, 75);
    }

    const scores = holds.map((hold) => {
      const cents = hold.samples.map((s) => s.cents);
      const depth = stdDev(cents);
      if (depth < 6) return 55;
      if (depth >= 6 && depth <= 35) return 90;
      if (depth <= 50) return 70;
      return 45;
    });

    return clamp(average(scores), 0, 100);
  }

  private computeDynamicsScore(confident: FrameSample[]): number {
    const rmsValues = confident.map((s) => s.rms);
    const mean = average(rmsValues);
    if (mean <= 0) return 0;

    const range = (Math.max(...rmsValues) - Math.min(...rmsValues)) / mean;
    if (range < 0.08) return 45;
    if (range <= 0.45) return 90;
    if (range <= 0.7) return 70;
    return 50;
  }

  private detectHolds(confident: FrameSample[]): HoldSegment[] {
    if (confident.length < 4) return [];

    const holds: HoldSegment[] = [];
    let current: FrameSample[] = [confident[0]];

    for (let i = 1; i < confident.length; i++) {
      const prev = confident[i - 1];
      const cur = confident[i];
      const gap = cur.timestamp - prev.timestamp;
      const sameNote = Math.abs(cur.midi - prev.midi) < 0.6;

      if (gap <= HOLD_GAP_SECONDS && sameNote) {
        current.push(cur);
      } else {
        this.pushHoldIfValid(current, holds);
        current = [cur];
      }
    }

    this.pushHoldIfValid(current, holds);
    return holds;
  }

  private pushHoldIfValid(samples: FrameSample[], holds: HoldSegment[]): void {
    if (samples.length < 3) return;
    const duration = samples[samples.length - 1].timestamp - samples[0].timestamp;
    if (duration >= MIN_HOLD_SECONDS) {
      holds.push({ samples, duration });
    }
  }

  private analyzeVibrato(holds: HoldSegment[]): { rateHz: number | null; depthCents: number | null } {
    const longHolds = holds.filter((h) => h.duration >= 0.8);
    if (longHolds.length === 0) {
      return { rateHz: null, depthCents: null };
    }

    const best = longHolds.reduce((a, b) => (a.duration > b.duration ? a : b));
    const cents = best.samples.map((s) => s.cents);
    const depthCents = round1(stdDev(cents));

    const mean = average(cents);
    const detrended = cents.map((c) => c - mean);
    let crossings = 0;
    for (let i = 1; i < detrended.length; i++) {
      if ((detrended[i - 1] <= 0 && detrended[i] > 0) || (detrended[i - 1] >= 0 && detrended[i] < 0)) {
        crossings += 1;
      }
    }

    const rateHz = round1((crossings / 2) / best.duration);
    return {
      rateHz: rateHz > 0 ? rateHz : null,
      depthCents: depthCents > 0 ? depthCents : null,
    };
  }
}

type HoldSegment = {
  samples: FrameSample[];
  duration: number;
};

function buildPrimaryTip(
  weakest: string,
  insights: SingerInsights,
  metrics: VoiceMetrics
): string {
  if (insights.intonationBias === 'sharp' && metrics.pitchAccuracy < 75) {
    return `You lean sharp by ~${Math.abs(insights.averageCents)}¢. Relax your jaw and aim slightly below the note.`;
  }
  if (insights.intonationBias === 'flat' && metrics.pitchAccuracy < 75) {
    return `You lean flat by ~${Math.abs(insights.averageCents)}¢. Engage core support and brighten your vowels.`;
  }

  const tips: Record<string, string> = {
    'Pitch accuracy': 'Slow down tricky lines — hum the melody first, then sing each note on a vowel.',
    'Note stability': 'Practice holding one note for 4 counts without wobbling. Keep your jaw loose.',
    'Breath support': 'Breathe low into your diaphragm and keep volume steady through each phrase.',
    'Tone clarity': 'Open your mouth more and project forward — avoid breathy or swallowed tone.',
    'Vibrato control': 'Let vibrato arrive naturally on held notes; avoid pushing or wobbling.',
    Dynamics: 'Add soft-to-loud shape within phrases — whisper the start, bloom on the peak.',
  };

  return tips[weakest] ?? 'Keep singing with focus — your voice profile is building.';
}

function buildExercise(weakest: string, insights: SingerInsights): string {
  const exercises: Record<string, string> = {
    'Pitch accuracy': '5-note scale up and down: la-la-la-la-la. Pause on each note 2 seconds.',
    'Note stability': 'Hold a comfortable note for 8 seconds. Repeat 5 times on different vowels.',
    'Breath support': 'Hiss for 12 seconds on one breath. Rest 10s. Repeat 4 times.',
    'Tone clarity': 'Sing "nee-nay-nah-noh-noo" bright and forward, medium volume.',
    'Vibrato control': 'Hold a mid-range note 6 seconds; let a gentle pulse appear without forcing.',
    Dynamics: 'Sing "ah" from pp to mf to pp on one breath across 8 counts.',
  };

  if (insights.rangeSemitones < 5) {
    return 'Try a 5-tone siren (nggg) from low to high and back — expands range safely.';
  }

  return exercises[weakest] ?? 'Repeat your song phrase-by-phrase until each line feels comfortable.';
}

function buildHighlights(metrics: VoiceMetrics, insights: SingerInsights): string[] {
  const items: string[] = [];

  if (insights.inTunePercent >= 70) {
    items.push(`${insights.inTunePercent}% of notes were in tune — solid intonation.`);
  } else if (insights.inTunePercent > 0) {
    items.push(`${insights.inTunePercent}% in tune — room to sharpen pitch focus.`);
  }

  if (insights.vocalRangeLow && insights.vocalRangeHigh && insights.rangeSemitones > 0) {
    items.push(`Vocal range this session: ${insights.vocalRangeLow} → ${insights.vocalRangeHigh}.`);
  }

  if (insights.longestHoldSeconds >= 2) {
    items.push(`Best sustained note: ${insights.longestHoldSeconds}s — good breath control.`);
  }

  if (insights.vibratoRateHz && insights.vibratoDepthCents) {
    items.push(
      `Vibrato ~${insights.vibratoRateHz} Hz, ${insights.vibratoDepthCents}¢ depth on held notes.`
    );
  }

  if (insights.onPitchStreak >= 8) {
    items.push(`Longest in-tune streak: ${insights.onPitchStreak} frames in a row.`);
  }

  if (metrics.overall >= 80) {
    items.push(`Strong session overall (${metrics.overall}/100) — ${insights.singerLevel}.`);
  } else if (metrics.overall > 0) {
    items.push(`Session level: ${insights.singerLevel} (${metrics.overall}/100).`);
  }

  return items.slice(0, 4);
}

function getSingerLevel(overall: number): string {
  if (overall >= 85) return 'Performance ready';
  if (overall >= 70) return 'Confident singer';
  if (overall >= 55) return 'Developing vocalist';
  if (overall > 0) return 'Building foundations';
  return 'Warming up';
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function stdDev(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = average(values);
  const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function emptyMetrics(): VoiceMetrics {
  return {
    pitchAccuracy: 0,
    stability: 0,
    breathControl: 0,
    toneClarity: 0,
    vibrato: 0,
    dynamics: 0,
    overall: 0,
  };
}

function emptyInsights(sessionSeconds: number): SingerInsights {
  return {
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
    sessionSeconds: round1(sessionSeconds),
    notesDetected: 0,
    onPitchStreak: 0,
    singerLevel: 'Warming up',
  };
}
