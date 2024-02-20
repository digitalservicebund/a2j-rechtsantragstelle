import { createMachine } from "xstate";
import { flows } from "~/models/flows/flows.server";
import { type StateMachine } from "./buildFlowController";

export function allSubmitTransitions({
  transitions,
}: ReturnType<StateMachine["getStateNodeByPath"]>) {
  return transitions.filter(
    (transition) => transition.eventType === "SUBMIT" && transition.target,
  );
}

const serializeNodepath = (nodePath: string[]) => nodePath.join(".");

export function progressLookupForMachine(machine: StateMachine) {
  // Initially, we only need to check the initial node, with a known progress of 1
  const initialState = machine.getStateNode(machine.initial as string);
  const statePathsToCheck = [initialState.path];

  const progressLookup: Record<string, number> = {
    [serializeNodepath(initialState.path)]: 1,
  };

  while (statePathsToCheck.length > 0) {
    // As long as we have state paths to check: get the last one and get its node and progress
    const currentStatePath = statePathsToCheck.pop();
    if (!currentStatePath) break;
    const currentNode = machine.getStateNodeByPath(currentStatePath);
    const currentProgress =
      progressLookup[serializeNodepath(currentStatePath)] + 1;

    // If the current node is a nested machine we need to search from the initial node instead
    const nodeToSearch = currentNode.initial
      ? machine.getStateNodeByPath([
          ...currentNode.path,
          currentNode.initial as string,
        ])
      : currentNode;

    // Loop through SUBMIT transitions,
    // If the target was newly discovered or the previous progress was smaller than the current one:
    // Save the current distance & add the state path to statePathsToCheck
    allSubmitTransitions(nodeToSearch)
      .flatMap((transition) => transition.target)
      .forEach((targetNode) => {
        if (!targetNode) return;
        const targetKey = serializeNodepath(targetNode.path);
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

function preComputeAllProgress() {
  // for each flow: create machine, then call progressLookupForMachine for it
  return Object.fromEntries(
    Object.values(flows).map(({ config, guards }) => [
      config.id,
      progressLookupForMachine(createMachine({ ...config }, { guards })),
    ]),
  );
}

export const allProgress = preComputeAllProgress();
