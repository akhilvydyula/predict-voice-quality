import { Ionicons } from '@expo/vector-icons';

export type AgentRole =
  | 'session_analyst'
  | 'profile_curator'
  | 'practice_planner'
  | 'goals_strategist'
  | 'coach_narrator';

export type WorkflowStepStatus = 'pending' | 'running' | 'complete' | 'error';

export type AgentDefinition = {
  id: AgentRole;
  name: string;
  mission: string;
  icon: keyof typeof Ionicons.glyphMap;
};

export type WorkflowStep = {
  id: AgentRole;
  agent: AgentDefinition;
  status: WorkflowStepStatus;
  output?: string;
  durationMs?: number;
  error?: string;
};

export type WorkflowRun = {
  id: string;
  name: string;
  startedAt: string;
  completedAt?: string;
  steps: WorkflowStep[];
};

export type WorkflowStepHandler<TContext> = {
  agent: AgentDefinition;
  run: (context: TContext) => Promise<string>;
};
