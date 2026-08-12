import { extractEdges } from "./routing";
import type {
  NodeKey,
  PageConfigMap,
  TransitionConfigMap,
  TransitionConfig,
} from "./types";

const getTransitions = <FlowKey, UserData>(
  route?: TransitionConfig<FlowKey, UserData>,
) => {
  if (!route) return [];
  if (Array.isArray(route)) {
    return route.flatMap((t) =>
      t.target === null
        ? []
        : [{ target: t.target, isArray: t.type === "addArrayItem" }],
    );
  }
  return [{ target: route, isArray: false }];
};

type ProgressWalkItem<FlowKey> = {
  node: FlowKey;
  depth: number;
  history: Set<FlowKey>;
  isLocked: boolean;
};

// The queue items reached from `item`: each unvisited neighbour, with its depth
// (frozen while inside an array sub-flow) and extended history. Kept separate so
// the BFS body in precomputeProgress stays flat.
const nextWalkItems = <C extends PageConfigMap>(
  item: ProgressWalkItem<NodeKey<C>>,
  router: TransitionConfigMap<C>,
): Array<ProgressWalkItem<NodeKey<C>>> =>
  getTransitions(router[item.node])
    .filter((t) => !item.history.has(t.target))
    .map((t) => {
      const isLocked = item.isLocked || t.isArray;
      return {
        node: t.target,
        depth: isLocked ? item.depth : item.depth + 1,
        history: new Set(item.history).add(t.target),
        isLocked,
      };
    });

export const precomputeProgress = <C extends PageConfigMap>(
  router: TransitionConfigMap<C>,
  initialStep: NodeKey<C>,
) => {
  type FlowKey = NodeKey<C>;

  const nodeDepths = new Map<FlowKey, number>();
  let maxOverallProgress = 0;

  const queue: Array<ProgressWalkItem<FlowKey>> = [
    {
      node: initialStep,
      depth: 0,
      history: new Set([initialStep]),
      isLocked: false,
    },
  ];

  while (queue.length > 0) {
    const item = queue.shift()!;
    const existingDepth = nodeDepths.get(item.node) ?? -1;
    if (item.depth <= existingDepth) continue;

    nodeDepths.set(item.node, item.depth);
    maxOverallProgress = Math.max(maxOverallProgress, item.depth);
    queue.push(...nextWalkItems(item, router));
  }

  const isFinal = (key: FlowKey): boolean =>
    extractEdges(router[key]).length === 0;
  const max = 100;

  return {
    getProgress: (key: FlowKey) => {
      if (maxOverallProgress === 0 || isFinal(key))
        return { max, progress: max };
      const depth = nodeDepths.get(key) ?? 0;
      const progress = Math.min((depth / maxOverallProgress) * max, 99);
      return { max, progress };
    },
    isFinal,
  };
};
