import _ from "lodash";
import { evaluateAllBranches, evaluateRoute, extractEdges } from "./flowUtils";
import type {
  FlowConfigBase,
  FlowRoutingConfig,
  InferredUserData,
} from "./types";
import type { PageData } from "../pageDataSchema";

export type StatusNode = {
  isDone: boolean;
  isReachable: boolean;
  children?: Record<string, StatusNode>;
};

export const createEdgeTracker = <T>() => {
  const edges = new Map<T, Set<T>>();
  return {
    has: (from: T, to: T): boolean => edges.get(from)?.has(to) ?? false,
    add: (from: T, to: T): void => {
      if (!edges.has(from)) edges.set(from, new Set());
      edges.get(from)!.add(to);
    },
  };
};

export const simulatePath = <C extends FlowConfigBase>(
  router: FlowRoutingConfig<C>,
  initialStep: keyof C,
  currentData: InferredUserData<C> & { pageData: PageData },
  traverseArrays = false,
) => {
  type FlowKey = keyof C;

  // Pass 1: Edge-Tracking Linear Evaluation
  const path: FlowKey[] = [];
  let currentLinear: FlowKey | null = initialStep;

  const visitedEdges = createEdgeTracker<FlowKey>();
  let isTerminatedSuccessfully = false;

  while (currentLinear) {
    path.push(currentLinear);

    const route: FlowRoutingConfig<C>[FlowKey] = router[currentLinear];
    let next = evaluateRoute(route, currentData, traverseArrays);

    if (next && visitedEdges.has(currentLinear, next)) {
      const branches = evaluateAllBranches(route, currentData);
      next = branches.find((b) => !visitedEdges.has(currentLinear!, b)) || null;
    }

    if (!next) {
      if (extractEdges(route as any).length === 0)
        isTerminatedSuccessfully = true;
      break;
    }

    visitedEdges.add(currentLinear, next);
    currentLinear = next;
  }

  // Pass 2: BFS Exhaustive Graph Traversal & Parent Mapping
  const reachableSet = new Set<FlowKey>();
  const parentMap = new Map<FlowKey, FlowKey>();
  const queue: FlowKey[] = [initialStep];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (reachableSet.has(current)) continue;
    reachableSet.add(current);

    const route = router[current];
    const branches = evaluateAllBranches(route, currentData);

    for (const nextBranch of branches) {
      if (!reachableSet.has(nextBranch)) {
        if (!parentMap.has(nextBranch)) {
          parentMap.set(nextBranch, current);
        }
        queue.push(nextBranch);
      }
    }
  }

  return { path, isTerminatedSuccessfully, reachableSet, parentMap };
};

// --- Pure Logic Helpers ---

// 1. Strip leading slashes (empty strings) and array wildcards ("#")
const getCleanSegments = (id: string) =>
  id.split("/").filter((p) => p !== "" && p !== "#");

const getPrefixes = (id: string, includeFlat: boolean = true) => {
  const parts = getCleanSegments(id);
  if (parts.length <= 1) return includeFlat && parts.length ? [parts[0]] : [];

  // Generates cumulative clean prefixes: ["kinder", "kinder/spielzeuge"]
  return parts.slice(0, -1).map((_, i) => parts.slice(0, i + 1).join("/"));
};

const calcStatus = (
  keys: Set<string>,
  path: string[],
  reachableSet: Set<string>,
  isTerminated: boolean,
) => {
  // Reachable if the simulation found ANY valid route into this folder
  const isReachable = Array.from(keys).some((node) => reachableSet.has(node));
  const visited = path.filter((node) => keys.has(node));
  const activeNode = path[path.length - 1];

  return {
    isReachable,
    isDone:
      visited.length > 0 &&
      // If the user's active node is no longer inside this prefix's keys, they've exited the folder
      (!keys.has(activeNode) || isTerminated),
  };
};

export const getFlowStatusTree = <C extends FlowConfigBase>(
  config: C,
  {
    path,
    reachableSet,
    isTerminatedSuccessfully: isTerm,
  }: ReturnType<typeof simulatePath<C>>,
): Record<string, StatusNode> => {
  const prefixPairs = _.flatMap(config, ({ stepId }, key) =>
    getPrefixes(stepId).map((prefix) => ({ prefix, key: key as string })),
  );

  // Results in: { "kinder": Set(["key1", "key2"]), "kinder/spielzeuge": Set(["key3"]) }
  const prefixMap = _.mapValues(
    _.groupBy(prefixPairs, "prefix"),
    (items) => new Set(items.map((i) => i.key)),
  );

  // Calculate status and build tree using Lodash
  const tree: Record<string, StatusNode> = {};

  Object.keys(prefixMap)
    .sort((a, b) => a.length - b.length)
    .forEach((prefix) => {
      const status = calcStatus(
        prefixMap[prefix],
        path as string[],
        reachableSet as Set<string>,
        isTerm,
      );

      const lodashPath = prefix
        .split("/")
        .flatMap((part, index, arr) =>
          index === arr.length - 1 ? [`/${part}`] : [`/${part}`, "children"],
        );

      _.update(tree, lodashPath, (existingNode?: StatusNode) => ({
        children: {},
        ...existingNode,
        ...status,
      }));
    });

  return tree;
};
