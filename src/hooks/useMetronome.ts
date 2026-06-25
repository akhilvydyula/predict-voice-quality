import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useRef, useState } from 'react';

export function useMetronome(initialBpm = 80) {
  const [bpm, setBpm] = useState(initialBpm);
  const [playing, setPlaying] = useState(false);
  const [beat, setBeat] = useState(0);
  const [beatsPerBar, setBeatsPerBar] = useState(4);
  const beatRef = useRef(0);

  useEffect(() => {
    if (!playing) return;

    const intervalMs = 60000 / bpm;
    const id = setInterval(() => {
      const nextBeat = (beatRef.current + 1) % beatsPerBar;
      beatRef.current = nextBeat;
      setBeat(nextBeat);
      void Haptics.impactAsync(
        nextBeat === 0
          ? Haptics.ImpactFeedbackStyle.Heavy
          : Haptics.ImpactFeedbackStyle.Light
      );
    }, intervalMs);

    return () => clearInterval(id);
  }, [playing, bpm, beatsPerBar]);

  const toggle = useCallback(() => {
    setPlaying((value) => {
      if (value) {
        beatRef.current = 0;
        setBeat(0);
      }
      return !value;
    });
  }, []);

  const stop = useCallback(() => {
    setPlaying(false);
    beatRef.current = 0;
    setBeat(0);
  }, []);

  const adjustBpm = useCallback((delta: number) => {
    setBpm((value) => Math.min(220, Math.max(40, value + delta)));
  }, []);

  return {
    bpm,
    setBpm,
    playing,
    beat,
    beatsPerBar,
    setBeatsPerBar,
    toggle,
    stop,
    adjustBpm,
  };
}
