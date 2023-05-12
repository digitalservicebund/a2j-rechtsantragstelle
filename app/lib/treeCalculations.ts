import type {
  ConditionFunction,
  Context,
  FormFlow,
} from "./vorabcheck/flow.server";
import Graph from "graphology";
import { allSimplePaths } from "graphology-simple-path";

export type FormGraph = Graph<
  { [name: string]: any },
  { condition?: ConditionFunction }
>;

export function makeFormGraph(formFlow: FormFlow) {
  const formGraph: FormGraph = new Graph({
    multi: false,
    allowSelfLoops: false,
    type: "directed",
  });

  for (const [key, transitions] of Object.entries(formFlow)) {
    transitions?.forEach((transition) => {
      typeof transition === "string"
        ? formGraph.mergeEdge(key, transition)
        : formGraph.mergeEdge(key, transition.destination, {
            condition: transition.condition,
          });
    });
  }
  return formGraph;
}

export function longestPath(start: string, stop: string, graph: FormGraph) {
  return allSimplePaths(graph, start, stop).reduce(
    (acc, path) => (acc > path.length ? acc : path.length),
    0
  );
}

export function allLongestPaths(target: string, graph: FormGraph): any {
  return Object.fromEntries(
    graph.mapNodes((nodeID) => [nodeID, longestPath(nodeID, target, graph)])
  );
}

export function isLeaf(nodeID: string, formGraph: FormGraph): boolean {
  return formGraph.outDegree(nodeID) === 0;
}

export function findPreviousStep(
  nodeID: string,
  formGraph: FormGraph,
  context: Context
): string[] {
  const validPredecessors: string[] = [];
  for (const link of formGraph.inEdgeEntries(nodeID)) {
    if (
      !link.attributes["condition"] ||
      link.attributes["condition"](context)
    ) {
      validPredecessors.push(link.source as string);
    }
  }
  return validPredecessors;
}

function isValidPath(nodeID: string, path: string[], context: Context) {
  // Path is valid for a node if context contains all previous nodes
  return path.reduce(
    (acc, node) => acc && (node === nodeID || node in context),
    true
  );
}

export function isValidContext(
  startID: string,
  nodeID: string,
  formGraph: FormGraph,
  context: Context
) {
  // Context is valid if there is any valid path
  if (startID === nodeID) return true;
  const allPaths = allSimplePaths(formGraph, startID, nodeID);
  const pathsValid = allPaths.map((path) => isValidPath(nodeID, path, context));
  return pathsValid.includes(true);
}
