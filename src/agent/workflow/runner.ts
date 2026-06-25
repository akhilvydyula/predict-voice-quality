import { WorkflowRun, WorkflowStep, WorkflowStepHandler, WorkflowStepStatus } from './types';

function createInitialSteps<TContext>(
  handlers: WorkflowStepHandler<TContext>[]
): WorkflowStep[] {
  return handlers.map((handler) => ({
    id: handler.agent.id,
    agent: handler.agent,
    status: 'pending' as WorkflowStepStatus,
  }));
}

function cloneRun(run: WorkflowRun): WorkflowRun {
  return {
    ...run,
    steps: run.steps.map((step) => ({ ...step })),
  };
}

export async function runAgentWorkflow<TContext>(options: {
  name: string;
  context: TContext;
  handlers: WorkflowStepHandler<TContext>[];
  onUpdate?: (run: WorkflowRun) => void;
  stepDelayMs?: number;
}): Promise<WorkflowRun> {
  const { name, context, handlers, onUpdate, stepDelayMs = 280 } = options;
  const run: WorkflowRun = {
    id: `${Date.now()}`,
    name,
    startedAt: new Date().toISOString(),
    steps: createInitialSteps(handlers),
  };

  const emit = () => onUpdate?.(cloneRun(run));

  emit();

  for (let index = 0; index < handlers.length; index += 1) {
    const handler = handlers[index];
    const step = run.steps[index];
    const started = Date.now();

    step.status = 'running';
    emit();

    try {
      if (stepDelayMs > 0 && index > 0) {
        await delay(stepDelayMs);
      }

      step.output = await handler.run(context);
      step.status = 'complete';
      step.durationMs = Date.now() - started;
    } catch (error) {
      step.status = 'error';
      step.error = error instanceof Error ? error.message : 'Agent step failed';
      step.durationMs = Date.now() - started;
      emit();
      break;
    }

    emit();
  }

  if (run.steps.every((step) => step.status === 'complete')) {
    run.completedAt = new Date().toISOString();
    emit();
  }

  return run;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
