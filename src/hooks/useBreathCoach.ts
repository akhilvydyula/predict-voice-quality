import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useRef, useState } from 'react';

export type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

export type BreathPattern = Record<BreathPhase, number>;

export const BREATH_PATTERNS = {
  warmup: { inhale: 4, hold: 2, exhale: 6, rest: 2 },
  support: { inhale: 4, hold: 4, exhale: 8, rest: 2 },
  recovery: { inhale: 3, hold: 0, exhale: 6, rest: 3 },
} as const satisfies Record<string, BreathPattern>;

const PHASE_ORDER: BreathPhase[] = ['inhale', 'hold', 'exhale', 'rest'];

export const PHASE_LABELS: Record<BreathPhase, string> = {
  inhale: 'Inhale',
  hold: 'Hold',
  exhale: 'Exhale',
  rest: 'Rest',
};

export const PHASE_HINTS: Record<BreathPhase, string> = {
  inhale: 'Breathe in through the nose — ribs expand sideways',
  hold: 'Keep support without locking the throat',
  exhale: 'Hiss or sing on a steady “sss” — control the airflow',
  rest: 'Relax shoulders and jaw before the next cycle',
};

function nextPhaseIndex(pattern: BreathPattern, from: number): number {
  let next = (from + 1) % PHASE_ORDER.length;
  let guard = 0;
  while (pattern[PHASE_ORDER[next]] <= 0 && guard < PHASE_ORDER.length) {
    next = (next + 1) % PHASE_ORDER.length;
    guard += 1;
  }
  return next;
}

export function useBreathCoach(pattern: BreathPattern = BREATH_PATTERNS.support) {
  const [running, setRunning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(pattern.inhale);
  const [cycles, setCycles] = useState(0);
  const patternRef = useRef(pattern);
  const phaseIndexRef = useRef(0);

  useEffect(() => {
    patternRef.current = pattern;
  }, [pattern]);

  const currentPhase = PHASE_ORDER[phaseIndex];
  const phaseDuration = pattern[currentPhase];

  useEffect(() => {
    if (!running) return;

    const id = setInterval(() => {
      setSecondsLeft((left) => {
        if (left > 1) return left - 1;

        const nextIndex = nextPhaseIndex(patternRef.current, phaseIndexRef.current);
        phaseIndexRef.current = nextIndex;
        setPhaseIndex(nextIndex);
        if (nextIndex === 0) {
          setCycles((count) => count + 1);
        }
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        return Math.max(1, patternRef.current[PHASE_ORDER[nextIndex]]);
      });
    }, 1000);

    return () => clearInterval(id);
  }, [running]);

  const start = useCallback(() => {
    phaseIndexRef.current = 0;
    setPhaseIndex(0);
    setCycles(0);
    setSecondsLeft(Math.max(1, pattern.inhale));
    setRunning(true);
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, [pattern.inhale]);

  const stop = useCallback(() => {
    setRunning(false);
    phaseIndexRef.current = 0;
    setPhaseIndex(0);
    setSecondsLeft(Math.max(1, pattern.inhale));
    setCycles(0);
  }, [pattern.inhale]);

  const progress = phaseDuration > 0 ? 1 - (secondsLeft - 1) / phaseDuration : 1;

  return {
    running,
    currentPhase,
    phaseLabel: PHASE_LABELS[currentPhase],
    phaseHint: PHASE_HINTS[currentPhase],
    secondsLeft,
    phaseDuration,
    progress,
    cycles,
    start,
    stop,
  };
}
