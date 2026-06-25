import { midiToNoteLabel } from './musicTheory';
import { FrameSample, SingerInsights, VoiceMetrics } from './voiceQuality';

export type PitchDrift = 'stable' | 'sharpening' | 'flattening';
export type VoiceRegister =
  | 'Bass'
  | 'Baritone'
  | 'Tenor'
  | 'Alto'
  | 'Mezzo'
  | 'Soprano'
  | 'Unknown';

export type AdvancedInsights = {
  voiceRegister: VoiceRegister;
  pitchDrift: PitchDrift;
  phraseConsistency: number;
  fatigueIndex: number;
  warmupReadiness: number;
  expressiveRange: number;
  chestMixEstimate: string;
};

export function analyzeAdvanced(
  samples: FrameSample[],
  insights: SingerInsights,
  metrics: VoiceMetrics
): AdvancedInsights {
  const confident = samples.filter((s) => s.confidence >= 0.35);

  if (confident.length < 12) {
    return emptyAdvanced();
  }

  const midis = confident.map((s) => s.midi);
  const avgMidi = average(midis);
  const voiceRegister = classifyRegister(avgMidi);

  const pitchDrift = detectPitchDrift(confident);
  const phraseConsistency = computePhraseConsistency(confident);
  const fatigueIndex = computeFatigueIndex(confident, metrics);
  const warmupReadiness = computeWarmupReadiness(metrics, insights);
  const expressiveRange = clamp(Math.round(insights.dynamicsRange * 200), 0, 100);
  const chestMixEstimate = estimateRegisterUsage(midis);

  return {
    voiceRegister,
    pitchDrift,
    phraseConsistency,
    fatigueIndex,
    warmupReadiness,
    expressiveRange,
    chestMixEstimate,
  };
}

function classifyRegister(avgMidi: number): VoiceRegister {
  if (avgMidi < 48) return 'Bass';
  if (avgMidi < 53) return 'Baritone';
  if (avgMidi < 58) return 'Tenor';
  if (avgMidi < 63) return 'Alto';
  if (avgMidi < 67) return 'Mezzo';
  if (avgMidi < 72) return 'Soprano';
  return 'Unknown';
}

function detectPitchDrift(samples: FrameSample[]): PitchDrift {
  const third = Math.floor(samples.length / 3);
  if (third < 4) return 'stable';

  const early = samples.slice(0, third);
  const late = samples.slice(-third);
  const earlyCents = average(early.map((s) => s.cents));
  const lateCents = average(late.map((s) => s.cents));
  const delta = lateCents - earlyCents;

  if (delta > 8) return 'sharpening';
  if (delta < -8) return 'flattening';
  return 'stable';
}

function computePhraseConsistency(samples: FrameSample[]): number {
  const chunks: number[] = [];
  const chunkSize = Math.max(6, Math.floor(samples.length / 5));

  for (let i = 0; i < samples.length; i += chunkSize) {
    const chunk = samples.slice(i, i + chunkSize);
    if (chunk.length < 4) continue;
    const inTune = chunk.filter((s) => Math.abs(s.cents) <= 15).length / chunk.length;
    chunks.push(inTune);
  }

  if (chunks.length === 0) return 0;
  const mean = average(chunks);
  const variance = chunks.reduce((sum, c) => sum + (c - mean) ** 2, 0) / chunks.length;
  return clamp(Math.round((mean * 0.7 + (1 - variance) * 0.3) * 100), 0, 100);
}

function computeFatigueIndex(samples: FrameSample[], metrics: VoiceMetrics): number {
  const third = Math.floor(samples.length / 3);
  if (third < 4) return 0;

  const early = samples.slice(0, third);
  const late = samples.slice(-third);
  const earlyAccuracy =
    early.filter((s) => Math.abs(s.cents) <= 15).length / early.length;
  const lateAccuracy = late.filter((s) => Math.abs(s.cents) <= 15).length / late.length;
  const drop = Math.max(0, earlyAccuracy - lateAccuracy);
  const stabilityDrop = metrics.stability < 55 ? 0.15 : 0;

  return clamp(Math.round((drop + stabilityDrop) * 100), 0, 100);
}

function computeWarmupReadiness(metrics: VoiceMetrics, insights: SingerInsights): number {
  if (metrics.overall <= 0) return 0;
  const base = metrics.pitchAccuracy * 0.4 + metrics.stability * 0.35 + metrics.toneClarity * 0.25;
  const rangeBonus = insights.rangeSemitones >= 8 ? 8 : insights.rangeSemitones >= 4 ? 4 : 0;
  return clamp(Math.round(base + rangeBonus), 0, 100);
}

function estimateRegisterUsage(midis: number[]): string {
  const low = midiToNoteLabel(Math.min(...midis));
  const high = midiToNoteLabel(Math.max(...midis));
  const span = Math.max(...midis) - Math.min(...midis);

  if (span >= 14) return `${low}–${high} (wide range)`;
  if (span >= 8) return `${low}–${high} (comfort zone)`;
  return `${low}–${high} (focused)`;
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function emptyAdvanced(): AdvancedInsights {
  return {
    voiceRegister: 'Unknown',
    pitchDrift: 'stable',
    phraseConsistency: 0,
    fatigueIndex: 0,
    warmupReadiness: 0,
    expressiveRange: 0,
    chestMixEstimate: '—',
  };
}

export function emptyAdvancedInsights(): AdvancedInsights {
  return emptyAdvanced();
}
