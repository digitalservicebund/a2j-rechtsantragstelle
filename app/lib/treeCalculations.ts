import createGraph from "ngraph.graph";
import path from "ngraph.path";
import type { Graph } from "ngraph.graph";
import type {
  AllowedIDs,
  ConditionFunction,
  Context,
  FormFlow,
} from "./vorabcheck";

type FormGraph = Graph<Partial<AllowedIDs>, ConditionFunction | undefined>;

export function makeFormGraph(formFlow: FormFlow): FormGraph {
  const formGraph: FormGraph = createGraph();
  Object.entries(formFlow).forEach(([key, val]) => {
    typeof val === "string"
      ? formGraph.addLink(key, val)
      : val.map((element) =>
          typeof element === "string"
            ? formGraph.addLink(key, element)
            : formGraph.addLink(key, element.destination, element.condition)
        );
  });
  return formGraph;
}
export function makePathFinder(formFlow: FormFlow) {
  return path.aStar(makeFormGraph(formFlow));
}

export function isLeaf(nodeID: AllowedIDs, formGraph: FormGraph): boolean {
  // Check whehter node has outbound links. Slightly awkward since foreach has no early return
  let isLeaf = true;
  const setLeaf = () => (isLeaf = false);
  formGraph.forEachLinkedNode(nodeID, setLeaf, true);
  return isLeaf;
}

export function findPreviousStep(
  nodeID: AllowedIDs,
  formGraph: FormGraph,
  context: Context
): AllowedIDs | undefined {
  const links = formGraph.getNode(nodeID)?.links ?? [];
  for (const link of links) {
    if (link.toId === nodeID && (!link.data || link.data(context))) {
      return link.fromId as AllowedIDs;
    }
  }
}
