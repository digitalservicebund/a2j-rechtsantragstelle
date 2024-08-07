import { createMachine } from "xstate";
import type { FlowId } from "~/flows/flowIds";
import { flows } from "~/flows/flows.server";
import { type FlowStateMachine } from "./buildFlowController";

export function progressLookupForMachine(machine: FlowStateMachine) {
  // TODO: add unit tests & reduce tests for .getProgress()
  // Initially, we only need to check the initial node, with a known progress of 1
  const initialState = machine.root.initial.target[0];
  const stateIdsToCheck = [initialState.id];
  const progressLookup: Record<string, number> = { [initialState.id]: 1 };

  while (stateIdsToCheck.length > 0) {
    // As long as we have state paths to check: get the last one and get its node and progress
    const currentStateId = stateIdsToCheck.pop();
    if (!currentStateId) break;
    const currentNode = machine.getStateNodeById(currentStateId);
    const currentProgress = progressLookup[currentStateId] + 1;

    // If the current node is a nested machine we need to search from the initial node instead
    const nodeToSearch =
      Object.keys(currentNode.states).length > 0
        ? machine.getStateNodeById(currentNode.initial.target[0].id)
        : currentNode;

    // Loop through SUBMIT transitions,
    // If the target was newly discovered or the previous progress was smaller than the current one:
    // Save the current distance & add the state path to statePathsToCheck
    nodeToSearch.transitions
      .get("SUBMIT")
      ?.flatMap((transition) => transition.target)
      .forEach((targetNode) => {
        if (!targetNode) return;
        const targetKey = targetNode.id;
        if (
          !(targetKey in progressLookup) ||
          progressLookup[targetKey] < currentProgress
        ) {
          progressLookup[targetKey] = currentProgress;
          stateIdsToCheck.push(targetNode.id);
        }
      });
  }
  return { progressLookup, total: Math.max(...Object.values(progressLookup)) };
}

function progressForFlowId(flowId: FlowId) {
  return progressLookupForMachine(
    createMachine(
      { ...flows[flowId].config },
      { guards: flows[flowId].guards },
    ),
  );
}

function computeVorabcheckProgress() {
  const vorabchecks = [
    "/fluggastrechte/vorabcheck",
    "/geld-einklagen/vorabcheck",
    "/beratungshilfe/vorabcheck",
  ] as const satisfies FlowId[];
  return Object.fromEntries(
    vorabchecks.map((id) => [id, progressForFlowId(id)]),
  );
}

export const vorabcheckProgresses = computeVorabcheckProgress();
