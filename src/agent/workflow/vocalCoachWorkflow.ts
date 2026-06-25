import { AdvancedInsights } from '../../audio/advancedAnalytics';
import { SessionSummary } from '../../audio/voiceQuality';
import { AgentReport, VocalCoachAgent } from '../vocalCoachAgent';
import { POST_SESSION_AGENT_ORDER } from './agents';
import { runAgentWorkflow } from './runner';
import { WorkflowRun, WorkflowStepHandler } from './types';

export type PostSessionWorkflowContext = {
  agent: VocalCoachAgent;
  summary: SessionSummary;
  advanced: AdvancedInsights;
  report?: AgentReport;
};

export async function runPostSessionWorkflow(
  agent: VocalCoachAgent,
  summary: SessionSummary,
  advanced: AdvancedInsights,
  onUpdate?: (run: WorkflowRun) => void
): Promise<{ report: AgentReport; workflow: WorkflowRun }> {
  const context: PostSessionWorkflowContext = { agent, summary, advanced };
  const handlers = buildPostSessionHandlers();

  const workflow = await runAgentWorkflow({
    name: 'Post-session coaching workflow',
    context,
    handlers,
    onUpdate,
    stepDelayMs: 320,
  });

  if (!context.report) {
    throw new Error('Coach workflow finished without a report');
  }

  return { report: context.report, workflow };
}

function buildPostSessionHandlers(): WorkflowStepHandler<PostSessionWorkflowContext>[] {
  return POST_SESSION_AGENT_ORDER.map((agentDef) => {
    switch (agentDef.id) {
      case 'session_analyst':
        return {
          agent: agentDef,
          run: async ({ summary, advanced }) => {
            const { metrics, insights } = summary;
            return [
              `${insights.singerLevel} performance at ${metrics.overall}/100.`,
              `${insights.inTunePercent}% in tune · ${insights.longestHoldSeconds}s longest hold.`,
              `Register ${advanced.voiceRegister} · drift ${advanced.pitchDrift}.`,
              `Fatigue index ${advanced.fatigueIndex} · phrase consistency ${advanced.phraseConsistency}%.`,
            ].join(' ');
          },
        };
      case 'profile_curator':
        return {
          agent: agentDef,
          run: async (ctx) => {
            const profile = await ctx.agent.applySessionToProfile(ctx.summary, ctx.advanced);
            return `Profile updated — ${profile.sessions.length} sessions logged, ${profile.practiceStreak}-day streak, focus on ${profile.persistentWeakness}.`;
          },
        };
      case 'practice_planner':
        return {
          agent: agentDef,
          run: async (ctx) => {
            const profile = ctx.agent.getProfile();
            const preview = ctx.agent.previewPracticePlan(ctx.summary, ctx.advanced, profile);
            const stepTitles = preview.map((step) => step.title).join(' → ');
            return `${preview.length} steps queued: ${stepTitles}.`;
          },
        };
      case 'goals_strategist':
        return {
          agent: agentDef,
          run: async (ctx) => {
            const profile = ctx.agent.getProfile();
            const milestones = ctx.agent.previewMilestones(ctx.summary, ctx.advanced, profile);
            const unlocked = milestones.filter((m) => m.unlocked).length;
            const weeklyGoal = ctx.agent.previewWeeklyGoal(profile);
            return `${unlocked}/${milestones.length} milestones unlocked · ${weeklyGoal}`;
          },
        };
      case 'coach_narrator':
        return {
          agent: agentDef,
          run: async (ctx) => {
            const report = ctx.agent.finalizeReport(ctx.summary, ctx.advanced);
            ctx.report = report;
            return report.narrative;
          },
        };
      default:
        return {
          agent: agentDef,
          run: async () => 'Done.',
        };
    }
  });
}
