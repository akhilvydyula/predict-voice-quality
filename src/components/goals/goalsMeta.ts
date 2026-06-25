import { Ionicons } from '@expo/vector-icons';

export const GOAL_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  weekly_sessions: 'calendar-outline',
  streak_7: 'flame-outline',
  score_80: 'pulse-outline',
};

export const MILESTONE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  first_session: 'footsteps-outline',
  pitch_70: 'musical-notes-outline',
  streak_3: 'flame-outline',
  hold_3s: 'hourglass-outline',
  overall_75: 'star-outline',
  sessions_10: 'ribbon-outline',
};

export const MILESTONE_ICONS_FILLED: Record<string, keyof typeof Ionicons.glyphMap> = {
  first_session: 'footsteps',
  pitch_70: 'musical-notes',
  streak_3: 'flame',
  hold_3s: 'hourglass',
  overall_75: 'star',
  sessions_10: 'ribbon',
};

export const MILESTONE_ACCENTS: Record<string, string> = {
  first_session: '#0066FF',
  pitch_70: '#8B5CF6',
  streak_3: '#F59E0B',
  hold_3s: '#06B6D4',
  overall_75: '#FF6B35',
  sessions_10: '#00C853',
};
