import { type DirectedGraphNode, toDirectedGraph } from "@xstate/graph";
import { pathToStateValue } from "xstate";
import { type FlowStateMachine } from "~/services/flow/server/types";
import { stateValueToStepIds } from "~/services/flow/stepIdConverter";

const statePathsFromGraph = (children: DirectedGraphNode[]): string[][] =>
  children.flatMap((child) =>
    child.children.length > 0
      ? statePathsFromGraph(child.children)
      : [child.stateNode.path],
  );

export const allStepsFromMachine = (machine: FlowStateMachine) =>
  statePathsFromGraph(toDirectedGraph(machine).children).map(
    (statePath) => stateValueToStepIds(pathToStateValue(statePath))[0],
  );
