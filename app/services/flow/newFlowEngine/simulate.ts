import { evaluateAllBranches, evaluateRoute, extractEdges } from "./routing";
import type {
  NodeKey,
  PageConfigMap,
  TransitionConfigMap,
  InferredUserData,
} from "./types";
import type { PageData } from "../pageDataSchema";

type SimulationResult = {
  path: string[];
  reachableSet: Set<string>;
  isComplete: boolean;
};

const createEdgeTracker = <T>() => {
  const edges = new Map<T, Set<T>>();
  return {
    has: (from: T, to: T): boolean => edges.get(from)?.has(to) ?? false,
    add: (from: T, to: T): void => {
      if (!edges.has(from)) edges.set(from, new Set());
      edges.get(from)!.add(to);
    },
  };
};

export const simulate = <C extends PageConfigMap>(
  router: TransitionConfigMap<C>,
  initialStep: NodeKey<C>,
  currentData: InferredUserData<C> & { pageData: PageData },
  traverseArrays = false,
  getArrayFanOut?: (
    nodeKey: NodeKey<C>,
    scopeData: Record<string, unknown>,
  ) => { name: string; count: number } | undefined,
): SimulationResult & {
  parentMap: Map<NodeKey<C>, NodeKey<C>>;
  visitedContexts: Array<{
    key: NodeKey<C>;
    pageData: PageData;
    scopeData: Record<string, unknown>;
    arrayPath: string[];
  }>;
} => {
  type FlowKey = NodeKey<C>;

  // Pass 1: Edge-Tracking Linear Evaluation
  const path: FlowKey[] = [];
  let currentLinear: FlowKey | null = initialStep;

  const visitedEdges = createEdgeTracker<FlowKey>();
  let isComplete = false;

  while (currentLinear) {
    path.push(currentLinear);

    const route: TransitionConfigMap<C>[FlowKey] = router[currentLinear];
    let next = evaluateRoute(route, currentData, traverseArrays);

    if (next && visitedEdges.has(currentLinear, next)) {
      const branches = evaluateAllBranches(route, currentData);
      next = branches.find((b) => !visitedEdges.has(currentLinear!, b)) || null;
    }

    if (!next) {
      if (extractEdges(route).length === 0) isComplete = true;
      break;
    }

    visitedEdges.add(currentLinear, next);
    currentLinear = next;
  }

  // Pass 2: BFS with per-item context.
  // Each queue item carries:
  //   pageData   – passed to guards so they can navigate userData by index
  //   scopeData  – the data object at the current array nesting level, used
  //                to count sub-array items without needing global navigation
  //   arrayPath  – names of ancestor arrays (e.g. ["children", "toys"]),
  //                used by pruneUserData to reconstruct the nested output path
  // De-duplication is by (nodeKey, arrayIndexes) so the same page can be
  // visited once per array entry while the same top-level page is visited once.
  type BfsItem = {
    key: FlowKey;
    pageData: PageData;
    scopeData: Record<string, unknown>;
    arrayPath: string[];
  };
  const reachableSet = new Set<FlowKey>();
  const parentMap = new Map<FlowKey, FlowKey>();
  const visitedSet = new Set<string>(); // "${key}:${arrayIndexes}"
  const visitedContexts: Array<{
    key: FlowKey;
    pageData: PageData;
    scopeData: Record<string, unknown>;
    arrayPath: string[];
  }> = [];
  const queue: BfsItem[] = [
    {
      key: initialStep,
      // Reset arrayIndexes so the BFS builds the correct index path through
      // fan-outs from scratch. Using the current request's arrayIndexes would
      // contaminate every fan-out path (e.g. starting at [2,0] causes
      // childrenArraySummary to produce [2,0,0],[2,0,1],[2,0,2], making all
      // guards read children[2] instead of children[0], children[1], etc.).
      pageData: { ...currentData.pageData, arrayIndexes: [] },
      scopeData: currentData as unknown as Record<string, unknown>,
      arrayPath: [],
    },
  ];

  while (queue.length > 0) {
    const { key: current, pageData, scopeData, arrayPath } = queue.shift()!;
    const visitId = `${current}:${(pageData.arrayIndexes ?? []).join(",")}`;
    if (visitedSet.has(visitId)) continue;
    visitedSet.add(visitId);

    reachableSet.add(current);
    visitedContexts.push({ key: current, pageData, scopeData, arrayPath });

    const route = router[current];
    const itemData = { ...currentData, pageData };

    // Regular (non-array) branches — propagate the current scope unchanged.
    for (const branch of evaluateAllBranches(route, itemData, {
      excludeArrayTransitions: true,
    })) {
      if (!parentMap.has(branch)) parentMap.set(branch, current);
      queue.push({ key: branch, pageData, scopeData, arrayPath });
    }

    // Array branches: fan out once per item. scopeData is narrowed to the
    // specific array item so nested arrays can be counted and pruned correctly.
    if (getArrayFanOut && Array.isArray(route)) {
      const addTransition = route.find((t) => t?.type === "addArrayItem");
      if (addTransition?.target != null) {
        const fanOut = getArrayFanOut(current, scopeData);
        if (fanOut) {
          const { name, count } = fanOut;
          // name uses "#" notation (e.g. "elternteile#kinder") but scopeData is
          // already scoped to the current item, so the real property key and the
          // arrayPath segment are both the last "#"-segment ("kinder").
          const leafName = name.split("#").at(-1)!;
          const items = scopeData[leafName];
          if (count === 0) {
            // Empty array: mark the add-target reachable without enqueueing it.
            // Enqueueing with phantom scopeData would cause infinite BFS expansion
            // (phantom childInfo → childrenArraySummary:0 → childInfo:0,0 → ...).
            if (!parentMap.has(addTransition.target))
              parentMap.set(addTransition.target, current);
            reachableSet.add(addTransition.target);
          } else {
            for (let i = 0; i < count; i++) {
              const itemScopeData = (
                Array.isArray(items) ? items[i] : {}
              ) as Record<string, unknown>;
              const itemPageData: PageData = {
                arrayIndexes: [...(pageData.arrayIndexes ?? []), i],
              };
              if (!parentMap.has(addTransition.target))
                parentMap.set(addTransition.target, current);
              queue.push({
                key: addTransition.target,
                pageData: itemPageData,
                scopeData: itemScopeData,
                arrayPath: [...arrayPath, leafName],
              });
            }
          }
        }
      }
    }
  }

  return { path, isComplete, reachableSet, parentMap, visitedContexts };
};
