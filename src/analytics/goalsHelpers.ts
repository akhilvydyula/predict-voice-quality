import { Ionicons } from '@expo/vector-icons';

import { SingerProfile } from '../agent/singerProfile';

const GOAL_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  weekly_sessions: 'calendar-outline',
  streak_7: 'flame-outline',
  score_80: 'pulse-outline',
};

export type TrainingGoal = {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  met: boolean;
  icon: keyof typeof Ionicons.glyphMap;
};

function isThisWeek(isoDate: string): boolean {
  const date = new Date(isoDate);
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(now.getDate() - 7);
  return date >= weekAgo;
}

export function buildTrainingGoals(profile: SingerProfile | null): TrainingGoal[] {
  const sessions = profile?.sessions ?? [];
  const sessionsThisWeek = sessions.filter((s) => isThisWeek(s.date)).length;
  const streak = profile?.practiceStreak ?? 0;
  const bestOverall =
    sessions.length > 0 ? Math.max(...sessions.map((s) => s.overall)) : 0;

  return [
    {
      id: 'weekly_sessions',
      title: 'Weekly practice',
      description: 'Complete 3 sessions this week to build consistency.',
      progress: sessionsThisWeek,
      target: 3,
      met: sessionsThisWeek >= 3,
      icon: GOAL_ICONS.weekly_sessions,
    },
    {
      id: 'streak_7',
      title: '7-day streak',
      description: 'Practice on consecutive days to lock in the habit.',
      progress: streak,
      target: 7,
      met: streak >= 7,
      icon: GOAL_ICONS.streak_7,
    },
    {
      id: 'score_80',
      title: 'Break 80 overall',
      description: 'Hit 80+ overall in a single session.',
      progress: bestOverall,
      target: 80,
      met: bestOverall >= 80,
      icon: GOAL_ICONS.score_80,
    },
  ];
}

export function countSessionsThisWeek(profile: SingerProfile | null): number {
  return (profile?.sessions ?? []).filter((s) => isThisWeek(s.date)).length;
}
