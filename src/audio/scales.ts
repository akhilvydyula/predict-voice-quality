import { frequencyToNote, NoteInfo } from './musicTheory';

export const ROOT_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;

export type RootNote = (typeof ROOT_NOTES)[number];

export type ScaleType = 'major' | 'natural_minor' | 'chromatic';

const MAJOR_INTERVALS = [0, 2, 4, 5, 7, 9, 11, 12];
const MINOR_INTERVALS = [0, 2, 3, 5, 7, 8, 10, 12];

export function rootToMidi(root: RootNote, octave: number): number {
  const index = ROOT_NOTES.indexOf(root);
  return index + (octave + 1) * 12;
}

export function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export function buildScale(root: RootNote, octave: number, type: ScaleType): NoteInfo[] {
  const rootMidi = rootToMidi(root, octave);
  const intervals =
    type === 'major' ? MAJOR_INTERVALS : type === 'natural_minor' ? MINOR_INTERVALS : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  return intervals
    .map((interval) => {
      const midi = rootMidi + interval;
      const frequency = midiToFrequency(midi);
      return frequencyToNote(frequency);
    })
    .filter((note): note is NoteInfo => note !== null);
}

export function scaleLabel(root: RootNote, type: ScaleType): string {
  const typeLabel =
    type === 'major' ? 'Major' : type === 'natural_minor' ? 'Natural minor' : 'Chromatic';
  return `${root} ${typeLabel}`;
}

export function isNoteInScale(pitchMidi: number, scale: NoteInfo[], toleranceCents = 20): boolean {
  return scale.some((note) => Math.abs((pitchMidi - note.midi) * 100) <= toleranceCents);
}

export function nearestScaleNote(pitchMidi: number, scale: NoteInfo[]): NoteInfo | null {
  if (scale.length === 0) return null;
  let best = scale[0];
  let bestDiff = Math.abs(pitchMidi - best.midi);
  for (const note of scale) {
    const diff = Math.abs(pitchMidi - note.midi);
    if (diff < bestDiff) {
      best = note;
      bestDiff = diff;
    }
  }
  return bestDiff <= 0.5 ? best : null;
}

export function noteRangeSemitones(lowLabel: string | null, highLabel: string | null): number | null {
  if (!lowLabel || !highLabel) return null;
  const parse = (label: string) => {
    const match = label.match(/^([A-G]#?)(\d)$/);
    if (!match) return null;
    const idx = ROOT_NOTES.indexOf(match[1] as RootNote);
    if (idx < 0) return null;
    return idx + (Number(match[2]) + 1) * 12;
  };
  const low = parse(lowLabel);
  const high = parse(highLabel);
  if (low === null || high === null) return null;
  return Math.max(0, high - low);
}
