import { getShortestPaths } from "@xstate/graph";
import {
  type Actor,
  type AnyActorLogic,
  createActor,
  initialTransition,
  pathToStateValue,
  transition,
} from "xstate";
import type { Guards } from "~/domains/guards.server";
import type { UserData } from "~/domains/userData";
import { stateValueToStepIds } from "~/services/flow/stepIdConverter";
import { progressLookupForMachine, vorabcheckProgresses } from "./progress";
import type { Config, FlowStateMachine, Meta, NavigationEvent } from "./types";
import { type ArrayConfigServer } from "~/services/array";
import { isStepDone } from "~/services/flow/server/isStepDone";
import { type FlowId } from "~/domains/flowIds";
import { getRelevantPageSchemasForStepId } from "~/domains/pageSchemas";
import { machines } from "~/domains/flows.server";

function getInitialSubState(machine: FlowStateMachine, stepId: string): string {
  const startNode = machine.getStateNodeById(stepId);

  function dive(node: typeof startNode): typeof startNode {
    if (Object.keys(node.states).length === 0) return node;
    return dive(Object.values(node.states)[0]);
  }

  const leaf = dive(startNode);

  return "/" + leaf.path.join("/");
}

const getSteps = (_machine: ReturnType<typeof createActor>, config: Config) => {
  // The machine passed here relies on the context it was initialized with.
  // https://www.jsdocs.io/package/xstate#FlowStateMachine.provide is supposed to allow this but context isn't applied
  // idea: machine.provide() with action that assigns the new context

  // Technically, arrayEvents are never triggered. They are only added here to make the subflows reachable to xstate
  const arrayConfig = config.meta?.arrays ?? {};
  const arrayEvents = Object.values(arrayConfig).map(({ event }) => ({
    type: event as NavigationEvent,
  }));

  const possiblePaths = getShortestPaths(
    machines[config.id as keyof typeof machines],
    {
      events: [{ type: "SUBMIT" }, ...arrayEvents],
    },
  );

  return possiblePaths.flatMap(({ state }) => stateValueToStepIds(state.value));
};

export const nextStepId = (
  actor: Actor<AnyActorLogic>,
  stepId: string,
  type: NavigationEvent,
) => {
  // Get snapshot of next machine state using the given event
  const [destinationState] = transition(
    actor.getSnapshot().machine,
    actor.getSnapshot(),
    { type },
  );
  const destinationStepIds = stateValueToStepIds(destinationState.value);

  // Return undefined if the stepId in the new state matches the previous one
  if (destinationStepIds.length === 1 && destinationStepIds[0] === stepId)
    return undefined;
  return destinationStepIds.at(0);
};

function getInitial(machine: FlowStateMachine) {
  // The initial state might be nested and needs to be resolved
  const [initialSnapshot] = initialTransition(machine);
  return stateValueToStepIds(initialSnapshot.value).pop();
}

export type StepState = {
  stepId: string;
  isDone: boolean;
  isReachable: boolean;
  url: string;
  excludedFromValidation?: boolean;
  subStates?: StepState[];
};

/**
 * Recurse a statenode until encountering a state with no meta shouldAppearAsMenuNavigation value as true or no more substates are left
  For each encountered statenode a StepState object is returned, containing whether the state is reachable, done and its URL

 @param stateNode state nodes 
 @param reachableSteps array of the reachable substates
 @param addUnreachableSubSteps workaround for stepper component, to always add values to reachableSteps
 @param flowId flow id value 
 * */
function stepStates(
  stateNode: FlowStateMachine["states"][string],
  reachableSteps: string[],
  addUnreachableSubSteps: boolean,
  flowId: FlowId,
): StepState[] {
  const context = (stateNode.machine.config.context ?? {}) as UserData;

  const statesWithMenuNavigationOrSubstates = Object.values(
    stateNode.states ?? {},
  ).filter((state) => {
    return (
      state.meta?.shouldAppearAsMenuNavigation ??
      Object.keys(state.states).length > 0
    );
  });

  return statesWithMenuNavigationOrSubstates.map((state) => {
    const stepId = stateValueToStepIds(pathToStateValue(state.path))[0];
    const meta = state.meta as Meta | undefined;
    const parent = state.parent;
    const shouldHideSubstates =
      meta?.shouldAppearAsMenuNavigation !== undefined;
    const reachableSubStates = stepStates(
      state,
      reachableSteps,
      addUnreachableSubSteps,
      flowId,
    ).filter((state) => state.isReachable || addUnreachableSubSteps);
    const excludedFromValidation =
      meta?.excludedFromValidation ?? parent?.meta?.excludedFromValidation;

    // Ignore subflows if empty, if parent state has hideSubstates flag
    if (shouldHideSubstates || reachableSubStates.length === 0) {
      const initial = state.config.initial as string | undefined;
      const initialStepId = initial ? `${stepId}/${initial}` : stepId;

      // If there is an eventless transition and the target is reachable, use it instead of the initial state
      const eventlessTargetPath = state.initial.target
        .at(0)
        ?.always?.find((val) => {
          // an "always" transition can also be an array, so we need to find the first reachable transition and use it
          const targetPaths = val.target?.at(0)?.path ?? [];
          return reachableSteps.includes(
            stateValueToStepIds(pathToStateValue(targetPaths))[0],
          );
        })
        ?.target?.at(0)?.path;

      const eventlessStepId = eventlessTargetPath
        ? stateValueToStepIds(pathToStateValue(eventlessTargetPath))[0]
        : undefined;

      const targetStepId =
        eventlessStepId && reachableSteps.includes(eventlessStepId)
          ? eventlessStepId
          : initialStepId;

      const isDone = isStepDone(
        getRelevantPageSchemasForStepId(flowId, stepId),
        context,
        reachableSteps,
        state.machine.config.meta?.arrays,
      );

      return {
        url: `${state.machine.id}${targetStepId}`,
        isDone,
        stepId,
        isReachable: reachableSteps.includes(targetStepId),
        excludedFromValidation,
      };
    }

    return {
      url: `${state.machine.id}${stepId}`,
      isDone: reachableSubStates.every((state) => state.isDone),
      stepId,
      isReachable: reachableSubStates.length > 0,
      subStates: reachableSubStates,
      excludedFromValidation,
    };
  });
}

export type FlowController = ReturnType<typeof buildFlowController>;

export const buildFlowController = ({
  config,
  data: context = {},
  guards,
}: {
  config: Config;
  data?: UserData;
  guards?: Guards;
}) => {
  const flowId = config.id ?? "";
  const machine = machines[flowId as keyof typeof machines];
  const actor = createActor<any>(machine, {
    input: context,
  }).start(); // should we start the machine right away?
  const reachableSteps = getSteps(actor, config); // depends on context

  return {
    getMeta: (_stepId: string) =>
      actor.getSnapshot().getMeta() as Meta | undefined,
    getRootMeta: () => config.meta,
    stepStates: (addUnreachableSubSteps = false) =>
      stepStates(
        actor.getSnapshot().machine.root,
        reachableSteps,
        addUnreachableSubSteps,
        flowId as FlowId,
      ),
    getReachableSteps: () => reachableSteps,
    getUserdata: () => context,
    getConfig: () => config,
    getGuards: () => guards,
    isFinal: (_currentStepId: string) =>
      !actor.getSnapshot().can({ type: "SUBMIT" }),
    isReachable: (currentStepId: string) => {
      return reachableSteps.includes(currentStepId);
    },
    getPrevious: (stepId: string) => {
      const destination = nextStepId(actor, stepId, "BACK");
      if (destination) return `${flowId}${destination}`;
    },
    getNext: (stepId: string) => {
      const destination = nextStepId(actor, stepId, "SUBMIT");
      if (destination) return `${flowId}${destination}`;
    },
    getArrayItemStep: (
      stepId: string,
      arrayStep: ArrayConfigServer["event"],
    ) => {
      const destination = nextStepId(actor, stepId, arrayStep);
      if (destination)
        return `${flowId}${destination
          .split("/")
          .slice(1)
          .reduce((prev, curr, idx, arr) => {
            if (idx === arr.length - 1) {
              return `${prev}/0/${curr}`;
            }
            return `${prev}/${curr}`;
          }, "")}`;
    },
    getInitial: () => `${flowId}${getInitial(machine) ?? ""}`,
    getProgress: (currentStepId: string) => {
      const { total, progressLookup } =
        flowId && flowId in vorabcheckProgresses
          ? vorabcheckProgresses[flowId]
          : progressLookupForMachine(machine);
      return { max: total, progress: progressLookup[currentStepId] };
    },
    getInitialSubState: (stepId: string) => {
      return `${flowId}${getInitialSubState(machine, stepId) ?? ""}`;
    },
  };
};
