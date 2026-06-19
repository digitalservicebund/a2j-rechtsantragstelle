import _ from "lodash";
import { type SimulationResult } from "./simulate";

export type StatusNode = {
  isDone: boolean;
  isReachable: boolean;
  children?: Record<string, StatusNode>;
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
  simulationKeys: string[],
  reachableSet: Set<string>,
  isComplete: boolean,
) => {
  // Reachable if the simulation found ANY valid route into this folder
  const isReachable = Array.from(keys).some((node) => reachableSet.has(node));
  const visited = simulationKeys.filter((node) => keys.has(node));
  const activeNode = simulationKeys.at(-1) ?? "";

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
  { keys, reachableSet, isComplete }: SimulationResult,
): Record<string, StatusNode> => {
  const prefixPairs = _.flatMap(config, ({ stepId: path }, key) =>
    getPrefixes(path).map((prefix) => ({ prefix, key: key })),
  );

  // Results in: { "kinder": Set(["key1", "key2"]), "kinder/spielzeuge": Set(["key3"]) }
  const prefixMap = _.mapValues(
    _.groupBy(prefixPairs, "prefix"),
    (items) => new Set(items.map((i) => i.key)),
  );

  // Calculate status and build tree using Lodash
  const tree: Record<string, StatusNode> = {};

  // Sort by depth (not string length) so parents precede children; the stable
  // sort keeps siblings in their flow-definition order.
  Object.keys(prefixMap)
    .sort((a, b) => a.split("/").length - b.split("/").length)
    .forEach((prefix) => {
      const status = calcStatus(
        prefixMap[prefix],
        keys,
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
