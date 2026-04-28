import { extractEdges } from "./flowUtils";
import type {
  FlowConfigBase,
  FlowRoutingConfig,
  RouteDefinition,
} from "./types";

const getTransitions = <FlowKey, UserData>(
  route?: RouteDefinition<FlowKey, UserData>,
) => {
  if (!route) return [];
  if (Array.isArray(route)) {
    return route.flatMap((t) =>
      t.target !== null
        ? [{ target: t.target, isArray: t.type === "addArrayItem" }]
        : [],
    );
  }
  return [{ target: route, isArray: false }];
};

export const precomputeGraph = <C extends FlowConfigBase>(
  router: FlowRoutingConfig<C>,
  initialStep: keyof C,
) => {
  type FlowKey = keyof C;

  const nodeDepths = new Map<FlowKey, number>();
  let maxOverallProgress = 0;

  const queue: Array<{
    node: FlowKey;
    depth: number;
    history: Set<FlowKey>;
    isLocked: boolean;
  }> = [
    {
      node: initialStep,
      depth: 0,
      history: new Set([initialStep]),
      isLocked: false,
    },
  ];

  while (queue.length > 0) {
    const { node, depth, history, isLocked } = queue.shift()!;
    const existingDepth = nodeDepths.get(node) ?? -1;

    if (depth > existingDepth) {
      nodeDepths.set(node, depth);

      if (depth > maxOverallProgress) {
        maxOverallProgress = depth;
      }

      for (const t of getTransitions(router[node])) {
        if (!history.has(t.target)) {
          const nextLocked = isLocked || t.isArray;
          const nextDepth = nextLocked ? depth : depth + 1;

          queue.push({
            node: t.target,
            depth: nextDepth,
            history: new Set(history).add(t.target),
            isLocked: nextLocked,
          });
        }
      }
    }
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
