import { createMachine, getStateNodes, pathToStateValue } from "xstate";
import { flows } from "~/domains/flows.server";
import { type FlowStateMachine } from "./buildFlowController";
import { stateValueToStepIds } from "../stepIdConverter";

function getStateNodeByPath(machine: FlowStateMachine, statePath: string[]) {
  return getStateNodes(machine.root, pathToStateValue(statePath)).pop()!;
}

function statePathToStepId(statePath: string[]) {
  return stateValueToStepIds(pathToStateValue(statePath))[0];
}

export function progressLookupForMachine(machine: FlowStateMachine) {
  // TODO: add unit tests & reduce tests for .getProgress()
  // Initially, we only need to check the initial node, with a known progress of 1
  const initialState = machine.root.initial.target[0];
  const statePathsToCheck = [initialState.path];
  const progressLookup: Record<string, number> = {
    [statePathToStepId(initialState.path)]: 1,
  };

  while (statePathsToCheck.length > 0) {
    // As long as we have state paths to check: get the last one and get its node and progress
    const currentStatePath = statePathsToCheck.pop();
    if (!currentStatePath) break;
    const currentNode = getStateNodeByPath(machine, currentStatePath);

    const currentProgress =
      progressLookup[statePathToStepId(currentStatePath)] + 1;

    // If the current node is a nested machine we need to search from the initial node instead
    const nodeToSearch =
      Object.keys(currentNode.states).length > 0
        ? getStateNodeByPath(machine, currentNode.initial.target[0].path)
        : currentNode;

    // Loop through SUBMIT transitions,
    // If the target was newly discovered or the previous progress was smaller than the current one:
    // Save the current distance & add the state path to statePathsToCheck
    nodeToSearch.transitions
      .get("SUBMIT")
      ?.flatMap((transition) => transition.target)
      .forEach((targetNode) => {
        if (!targetNode) return;
        const targetKey = statePathToStepId(targetNode.path);
        if (
          !(targetKey in progressLookup) ||
          progressLookup[targetKey] < currentProgress
        ) {
          progressLookup[targetKey] = currentProgress;
          statePathsToCheck.push(targetNode.path);
        }
      });
  }
  return { progressLookup, total: Math.max(...Object.values(progressLookup)) };
}

function computeVorabcheckProgress() {
  const vorabcheckEntries = Object.entries(flows).filter(
    ([, flowConfig]) => flowConfig.flowType === "vorabCheck",
  );
  return Object.fromEntries(
    vorabcheckEntries.map(([flowId, { config, guards }]) => [
      flowId,
      progressLookupForMachine(createMachine(config, { guards })),
    ]),
  );
}

export const vorabcheckProgresses = computeVorabcheckProgress();
