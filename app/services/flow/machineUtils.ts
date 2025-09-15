import { DirectedGraphNode, toDirectedGraph } from "@xstate/graph";
import { pathToStateValue } from "xstate";
import { FlowStateMachine } from "~/services/flow/server/types";
import { stateValueToStepIds } from "~/services/flow/stepIdConverter";

function statePathsFromMachine(children: DirectedGraphNode[]): string[][] {
  return children.flatMap((child) =>
    child.children.length > 0
      ? statePathsFromMachine(child.children)
      : [child.stateNode.path],
  );
}

export function allStepsFromMachine(machine: FlowStateMachine) {
  const machineState = statePathsFromMachine(toDirectedGraph(machine).children);
  return machineState.map(
    (statePath) => stateValueToStepIds(pathToStateValue(statePath))[0],
  );
}
