# Agentic workflow

VocalIQ uses a **multi-agent workflow** to turn a finished practice session into a personalized coaching plan. Each agent has a narrow job; a workflow runner orchestrates them in order and streams progress to the UI.

## Why workflows?

A single monolithic “coach” is hard to debug and extend. Splitting work into specialist agents makes it clear what happened after each session and leaves room to add cloud LLM agents later without rewriting the pipeline.

## Post-session workflow

When you stop recording on the Practice screen, this workflow runs:

| Step | Agent | Responsibility |
|------|--------|----------------|
| 1 | **Session Analyst** | Summarize score, in-tune %, register, drift, fatigue |
| 2 | **Profile Curator** | Persist session, update streak, skill averages, weaknesses |
| 3 | **Practice Planner** | Queue warm-up, focus drill, and application steps |
| 4 | **Goals Strategist** | Check milestones and weekly practice target |
| 5 | **Coach Narrator** | Write the recap narrative and finalize the report |

All processing is **on-device** — no API keys required for the default workflow.

## Architecture

```
Practice stop
    │
    ▼
runPostSessionWorkflow()
    │
    ├─► Session Analyst      (read-only analysis)
    ├─► Profile Curator      (AsyncStorage write)
    ├─► Practice Planner     (plan preview)
    ├─► Goals Strategist     (milestones + weekly goal)
    └─► Coach Narrator       (AgentReport)
            │
            ▼
    Coach / Goals / Architect UI
```

### Source files

| Path | Role |
|------|------|
| `src/agent/workflow/types.ts` | Workflow step and run types |
| `src/agent/workflow/agents.ts` | Agent definitions and order |
| `src/agent/workflow/runner.ts` | Generic sequential orchestrator |
| `src/agent/workflow/vocalCoachWorkflow.ts` | Post-session handlers |
| `src/components/agent/AgentWorkflowPanel.tsx` | Timeline UI |
| `src/agent/vocalCoachAgent.ts` | Profile + report primitives |

## UI surfaces

- **Coach tab** — full workflow timeline after your latest session
- **Architect dev mode** — compact timeline + raw JSON for debugging

## Extending with new agents

1. Add an `AgentRole` and definition in `agents.ts`.
2. Append the agent to `POST_SESSION_AGENT_ORDER`.
3. Implement a handler in `vocalCoachWorkflow.ts`.
4. Optionally extract logic into `VocalCoachAgent` helper methods.

### Future: cloud LLM agents

The workflow runner accepts async handlers. You can add steps that call an optional API (see `server/`) for LLM-generated feedback while keeping on-device pitch analysis as the source of truth.

## Live coaching (separate path)

**Live guidance** during recording still comes from `VocalCoachAgent.observeLive()` — a fast, rule-based loop that does not wait for the post-session workflow.
