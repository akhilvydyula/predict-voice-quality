import { AgentDefinition } from './types';

export const VOCAL_COACH_AGENTS: Record<string, AgentDefinition> = {
  session_analyst: {
    id: 'session_analyst',
    name: 'Session Analyst',
    mission: 'Reads pitch, tone, and stability signals from your latest take.',
    icon: 'analytics-outline',
  },
  profile_curator: {
    id: 'profile_curator',
    name: 'Profile Curator',
    mission: 'Updates your singer profile, streak, and skill averages.',
    icon: 'person-circle-outline',
  },
  practice_planner: {
    id: 'practice_planner',
    name: 'Practice Planner',
    mission: 'Designs warm-ups, drills, and song application steps.',
    icon: 'list-outline',
  },
  goals_strategist: {
    id: 'goals_strategist',
    name: 'Goals Strategist',
    mission: 'Tracks milestones and sets your weekly practice target.',
    icon: 'flag-outline',
  },
  coach_narrator: {
    id: 'coach_narrator',
    name: 'Coach Narrator',
    mission: 'Writes your recap and next-session focus in plain language.',
    icon: 'chatbubble-ellipses-outline',
  },
};

export const POST_SESSION_AGENT_ORDER = [
  VOCAL_COACH_AGENTS.session_analyst,
  VOCAL_COACH_AGENTS.profile_curator,
  VOCAL_COACH_AGENTS.practice_planner,
  VOCAL_COACH_AGENTS.goals_strategist,
  VOCAL_COACH_AGENTS.coach_narrator,
] as const;
