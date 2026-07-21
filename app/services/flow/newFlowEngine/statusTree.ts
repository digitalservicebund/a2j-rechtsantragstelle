import _ from "lodash";
import type { PageConfigMap } from "./types";
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
  reachableSet: Set<string>,
  doneNodeKeys: Set<string>,
) => {
  const reachableNodes = Array.from(keys).filter((node) =>
    reachableSet.has(node),
  );
  const isReachable = reachableNodes.length > 0;

  return {
    isReachable,
    isDone:
      isReachable && reachableNodes.every((node) => doneNodeKeys.has(node)),
  };
};

export const buildStatusTree = <C extends PageConfigMap>(
  config: C,
  { reachableSet }: SimulationResult,
  doneNodeKeys: Set<string>,
): Record<string, StatusNode> => {
  const prefixPairs = _.flatMap(
    config,
    ({ stepId: path, shouldCollapseIntoParentNavItem }, key) => {
      const prefixes = getPrefixes(path);
      if (prefixes.length > 1 && shouldCollapseIntoParentNavItem) {
        return prefixes.slice(0, -1).map((prefix) => ({ prefix, key: key }));
      }
      return prefixes.map((prefix) => ({ prefix, key: key }));
    },
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
      const status = calcStatus(prefixMap[prefix], reachableSet, doneNodeKeys);

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
