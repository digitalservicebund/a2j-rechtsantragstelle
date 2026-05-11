import _ from "lodash";

export type StatusNode = {
  isDone: boolean;
  isReachable: boolean;
  children?: Record<string, StatusNode>;
};

export type StatusSimulationResult = {
  path: string[];
  reachableSet: Set<string>;
  isComplete: boolean;
};

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
  isComplete: boolean,
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
      (!keys.has(activeNode) || isComplete),
  };
};

export const buildStatusTree = (
  config: Record<string, { stepId: string }>,
  { path, reachableSet, isComplete }: StatusSimulationResult,
): Record<string, StatusNode> => {
  const prefixPairs = _.flatMap(config, ({ stepId: path }, key) =>
    getPrefixes(path).map((prefix) => ({ prefix, key: key as string })),
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
        path,
        reachableSet,
        isComplete,
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
