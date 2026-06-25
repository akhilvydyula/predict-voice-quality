const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;

export type NoteInfo = {
  name: string;
  octave: number;
  frequency: number;
  cents: number;
  midi: number;
};

export function frequencyToMidi(frequency: number): number {
  return 12 * Math.log2(frequency / 440) + 69;
}

export function midiToNoteLabel(midi: number): string {
  const rounded = Math.round(midi);
  const noteIndex = ((rounded % 12) + 12) % 12;
  const octave = Math.floor(rounded / 12) - 1;
  return `${NOTE_NAMES[noteIndex]}${octave}`;
}

export function frequencyToNote(frequency: number): NoteInfo | null {
  if (!Number.isFinite(frequency) || frequency < 50) {
    return null;
  }

  const midi = frequencyToMidi(frequency);
  const roundedMidi = Math.round(midi);
  const cents = Math.round((midi - roundedMidi) * 100);
  const noteIndex = ((roundedMidi % 12) + 12) % 12;
  const octave = Math.floor(roundedMidi / 12) - 1;
  const exactFrequency = 440 * Math.pow(2, (roundedMidi - 69) / 12);

  return {
    name: NOTE_NAMES[noteIndex],
    octave,
    frequency: exactFrequency,
    cents,
    midi,
  };
}

export function centsLabel(cents: number): string {
  if (Math.abs(cents) < 8) return 'On pitch';
  return cents > 0 ? `${cents}¢ sharp` : `${Math.abs(cents)}¢ flat`;
}

export function pitchAccuracyFromCents(cents: number): number {
  const deviation = Math.abs(cents);
  if (deviation <= 10) return 100;
  if (deviation >= 50) return 0;
  return Math.round(100 - ((deviation - 10) / 40) * 100);
}
