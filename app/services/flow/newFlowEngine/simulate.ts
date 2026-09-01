import { evaluateAllBranches, evaluateRoute, extractEdges } from "./routing";
import type {
  NodeKey,
  PageConfigMap,
  TransitionConfigMap,
  InferredUserData,
} from "./types";
import type { PageData } from "../pageData";
import {
  ARRAY_WILDCARD,
  inferArrayNameFromStepId,
  type CompiledFlow,
} from "~/services/flow/newFlowEngine/compileFlow";

export type SimulationResult = {
  keys: string[];
  reachableSet: Set<string>;
  isComplete: boolean;
};

// A page visit at a specific array nesting level. Doubles as the BFS queue item.
type VisitedContext<C extends PageConfigMap> = {
  key: NodeKey<C>;
  pageData: PageData;
  scopeData: Record<string, unknown>;
  arrayPath: string[];
};

// Mutable BFS accumulators shared by the pass-2 helpers.
type BfsState<C extends PageConfigMap> = {
  queue: Array<VisitedContext<C>>;
  parentMap: Map<NodeKey<C>, NodeKey<C>>;
  reachableSet: Set<NodeKey<C>>;
};

// Given a page and one of its addArrayItem targets, returns that array's name
// and item count. Passing the target lets one page add to several arrays.
type ArrayFanOut<C extends PageConfigMap> = (
  sourceKey: NodeKey<C>,
  targetKey: NodeKey<C>,
  scopeData: Record<string, unknown>,
) => { name: string; count: number } | undefined;

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

export const runSimulation = <C extends PageConfigMap>(
  data: InferredUserData<C>,
  compiledFlow: CompiledFlow<C>,
) =>
  simulate(
    compiledFlow.transitions,
    compiledFlow.initialStep,
    data,
    true,
    (sourceKey, targetKey, scopeData) => {
      // Which array does this fan-out add to?
      // Summary pages name it directly; others read it from the target's stepId.
      // Reading the target lets one page add to several arrays.
      const name =
        compiledFlow.pages[sourceKey]?.arraySummary?.name ??
        inferArrayNameFromStepId(compiledFlow.pages[targetKey]?.stepId ?? "");
      if (!name) return undefined;
      // scopeData is already the current item, so the key is the last "#" segment.
      const leafName = name.split("#").at(-1)!;
      const items = scopeData[leafName];
      // Treat a missing array the same as an empty one so that the add-target
      // remains reachable even before the first item has been submitted.
      return {
        name,
        count: Array.isArray(items) ? items.length : 0,
      };
    },
    (key) => {
      const stepId = compiledFlow.pages[key]?.stepId ?? "";
      return stepId.split(ARRAY_WILDCARD).length - 1;
    },
  );

// Pass 1: follow first-match transitions from the initial step, tracking visited
// edges so a re-entered node takes an unvisited branch. Yields the linear key
// order and whether the walk ended on a terminal node.
const runLinearPass = <C extends PageConfigMap>(
  router: TransitionConfigMap<C>,
  initialStep: NodeKey<C>,
  currentData: InferredUserData<C>,
  traverseArrays: boolean,
): { keys: Array<NodeKey<C>>; isComplete: boolean } => {
  const keys: Array<NodeKey<C>> = [];
  let current: NodeKey<C> | null = initialStep;
  const visitedEdges = createEdgeTracker<NodeKey<C>>();
  let isComplete = false;

  while (current) {
    keys.push(current);
    const route: TransitionConfigMap<C>[NodeKey<C>] = router[current];
    let next = evaluateRoute(route, currentData, traverseArrays);
    if (next && visitedEdges.has(current, next)) {
      const branches = evaluateAllBranches(route, currentData);
      next = branches.find((b) => !visitedEdges.has(current!, b)) ?? null;
    }
    if (!next) {
      if (extractEdges(route).length === 0) isComplete = true;
      break;
    }
    visitedEdges.add(current, next);
    current = next;
  }

  return { keys, isComplete };
};

// Enqueues the regular (non-array) branch out of the current node. When the
// target sits at a shallower array level than the current page, the transition
// steps back out of the item's sub-flow, so the scope pointer (arrayPath /
// arrayIndexes / scopeData) is rewound to the target's level — otherwise a
// shallower page would re-fan-out the current item's own children.
const enqueueRegularBranch = <C extends PageConfigMap>(
  state: BfsState<C>,
  ctx: VisitedContext<C>,
  nextBranch: NodeKey<C>,
  currentData: InferredUserData<C>,
  getNodeArrayDepth?: (nodeKey: NodeKey<C>) => number,
): void => {
  const { key: current, pageData, scopeData, arrayPath } = ctx;
  if (!state.parentMap.has(nextBranch))
    state.parentMap.set(nextBranch, current);

  const targetDepth = getNodeArrayDepth?.(nextBranch) ?? arrayPath.length;
  if (targetDepth >= arrayPath.length) {
    state.queue.push({ key: nextBranch, pageData, scopeData, arrayPath });
    return;
  }

  const rewoundPath = arrayPath.slice(0, targetDepth);
  const rewoundIndexes = (pageData.arrayIndexes ?? []).slice(0, targetDepth);
  let rewoundScope = currentData as Record<string, unknown>;
  for (let level = 0; level < targetDepth; level++) {
    const arr = rewoundScope[rewoundPath[level]] as
      Array<Record<string, unknown>> | undefined;
    rewoundScope = arr?.[rewoundIndexes[level]] ?? {};
  }
  state.queue.push({
    key: nextBranch,
    pageData: { ...pageData, arrayIndexes: rewoundIndexes },
    scopeData: rewoundScope,
    arrayPath: rewoundPath,
  });
};

// Enqueues one queue item per element of the fanned-out array.
const enqueueFanOutItems = <C extends PageConfigMap>(
  state: BfsState<C>,
  ctx: VisitedContext<C>,
  target: NodeKey<C>,
  leafName: string,
  count: number,
): void => {
  const items = ctx.scopeData[leafName];
  for (let i = 0; i < count; i++) {
    const itemScopeData = (Array.isArray(items) ? items[i] : {}) as Record<
      string,
      unknown
    >;
    state.queue.push({
      key: target,
      pageData: { arrayIndexes: [...(ctx.pageData.arrayIndexes ?? []), i] },
      scopeData: itemScopeData,
      arrayPath: [...ctx.arrayPath, leafName],
    });
  }
};

// Fans out every addArrayItem branch of the current node. Reading each branch's
// own target array lets a single page add to several sibling arrays. scopeData
// is already the current item, so the property is the array name's last segment.
const enqueueArrayFanOuts = <C extends PageConfigMap>(
  state: BfsState<C>,
  ctx: VisitedContext<C>,
  route: TransitionConfigMap<C>[NodeKey<C>],
  getArrayFanOut: ArrayFanOut<C>,
): void => {
  if (!Array.isArray(route)) return;

  for (const transition of route) {
    const target = transition?.target;
    if (transition?.type !== "addArrayItem" || target == null) continue;

    const fanOut = getArrayFanOut(ctx.key, target, ctx.scopeData);
    if (!fanOut) continue;

    if (!state.parentMap.has(target)) state.parentMap.set(target, ctx.key);

    const leafName = fanOut.name.split("#").at(-1)!;
    if (fanOut.count === 0) {
      // Empty array: mark the add-target reachable without enqueueing it.
      // A phantom item would cause infinite BFS expansion.
      state.reachableSet.add(target);
      continue;
    }
    enqueueFanOutItems(state, ctx, target, leafName, fanOut.count);
  }
};

const simulate = <C extends PageConfigMap>(
  router: TransitionConfigMap<C>,
  initialStep: NodeKey<C>,
  currentData: InferredUserData<C>,
  traverseArrays = false,
  getArrayFanOut?: ArrayFanOut<C>,
  // A page's array-nesting depth ("/list" = 0, "/items/#/daten" = 1, …).
  // Lets the BFS rewind its scope pointer when a transition steps back out
  // to a shallower page.
  getNodeArrayDepth?: (nodeKey: NodeKey<C>) => number,
): SimulationResult & {
  parentMap: Map<NodeKey<C>, NodeKey<C>>;
  visitedContexts: Array<{
    key: NodeKey<C>;
    pageData: PageData;
    scopeData: Record<string, unknown>;
    arrayPath: string[];
  }>;
} => {
  // Pass 1: Edge-Tracking Linear Evaluation.
  const { keys, isComplete } = runLinearPass(
    router,
    initialStep,
    currentData,
    traverseArrays,
  );

  // Pass 2: BFS with per-item context. Each queue item carries:
  //   pageData   – passed to guards so they can navigate userData by index
  //   scopeData  – the data object at the current array nesting level, used
  //                to count sub-array items without needing global navigation
  //   arrayPath  – names of ancestor arrays (e.g. ["children", "toys"]),
  //                used by pruneUserData to reconstruct the nested output path
  // De-duplication is by (nodeKey, arrayIndexes) so the same page can be
  // visited once per array entry while the same top-level page is visited once.
  const state: BfsState<C> = {
    // Reset arrayIndexes so the BFS builds the correct index path through
    // fan-outs from scratch. Using the current request's arrayIndexes would
    // contaminate every fan-out path (e.g. starting at [2,0] causes
    // childrenArraySummary to produce [2,0,0],[2,0,1],[2,0,2], making all
    // guards read children[2] instead of children[0], children[1], etc.).
    queue: [
      {
        key: initialStep,
        pageData: { ...currentData.pageData, arrayIndexes: [] },
        scopeData: currentData as Record<string, unknown>,
        arrayPath: [],
      },
    ],
    parentMap: new Map<NodeKey<C>, NodeKey<C>>(),
    reachableSet: new Set<NodeKey<C>>(),
  };
  const visitedSet = new Set<string>(); // "${key}:${arrayIndexes}"
  const visitedContexts: Array<VisitedContext<C>> = [];

  while (state.queue.length > 0) {
    const ctx = state.queue.shift()!;
    const visitId = `${ctx.key}:${(ctx.pageData.arrayIndexes ?? []).join(",")}`;
    if (visitedSet.has(visitId)) continue;
    visitedSet.add(visitId);

    state.reachableSet.add(ctx.key);
    visitedContexts.push(ctx);

    const route = router[ctx.key];

    // Regular (non-array) branch — first-match-wins.
    const nextBranch = evaluateRoute(route, {
      ...currentData,
      pageData: ctx.pageData,
    });
    if (nextBranch != null) {
      enqueueRegularBranch(
        state,
        ctx,
        nextBranch,
        currentData,
        getNodeArrayDepth,
      );
    }

    // Array branches: fan out once per item, narrowing scopeData to each item.
    if (getArrayFanOut) {
      enqueueArrayFanOuts(state, ctx, route, getArrayFanOut);
    }
  }

  return {
    keys,
    isComplete,
    reachableSet: state.reachableSet,
    parentMap: state.parentMap,
    visitedContexts,
  };
};
