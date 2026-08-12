import isEqual from "lodash/isEqual";
import { runSimulation } from "./simulate";
import { ARRAY_WILDCARD, inferArrayNameFromStepId } from "./compileFlow";
import type { CompiledFlow } from "./compileFlow";
import type { PageConfigMap, InferredUserData, NodeKey } from "./types";
import { evaluateRoute } from "./routing";
import { buildStatusTree } from "./statusTree";
import { pruneUserData } from "./pruneUserData";

const resolveFieldName = (fieldName: string) =>
  fieldName.includes("#") ? fieldName.split("#").at(-1)! : fieldName;

// The data path of the array a page's fields belong to, read from their "#"
// notation (e.g. "parents#children#name" -> ["parents", "children"]).
// Empty for non-array pages.
const arrayDataPath = (fieldNames: string[]): string[] => {
  const arrayField = fieldNames.find((name) => name.includes("#"));
  return arrayField ? arrayField.split("#").slice(0, -1) : [];
};

// Walks `data` down the nested arrays named by `arrayPath` at the given indexes,
// returning the item at that position (or {} when it does not exist yet).
const resolveScopeAtIndexes = (
  data: Record<string, unknown>,
  arrayPath: string[],
  indexes: number[],
): Record<string, unknown> =>
  arrayPath.reduce((scope, arrayName, level) => {
    const items = scope[arrayName];
    const item = Array.isArray(items) ? items[indexes[level]] : undefined;
    return (item ?? {}) as Record<string, unknown>;
  }, data);

const arrayWildcardCount = (stepId: string) =>
  stepId.split(ARRAY_WILDCARD).length - 1;

// Substitutes each array wildcard in a stepId with a concrete index, in
// left-to-right order (e.g. "/a/#/b/#/c" + [0, 2] -> "/a/0/b/2/c").
const insertConcreteIndexes = (stepId: string, indexes: number[]) => {
  let index = 0;
  return stepId.replaceAll(ARRAY_WILDCARD, () => String(indexes[index++]));
};

export const createFlowSession = <C extends PageConfigMap>(
  compiledFlow: CompiledFlow<C>,
  userData: InferredUserData<C>,
  currentPath: string,
) => {
  const nodeKey = compiledFlow.getNodeKeyFromPath(currentPath);
  if (nodeKey == null) throw new Error(`Invalid path: ${currentPath}`);

  let simulation = runSimulation(userData, compiledFlow);
  let effectiveUserData = userData;

  let prunedUserData = pruneUserData(
    compiledFlow,
    simulation.visitedContexts,
    userData,
  );

  // Cascading pruning re-prunes until stable. Guards evaluated during the
  // first pass still see the stale data, so a page kept alive only by a stale
  // field survives one pass, while the branch the clean data selects is not
  // visited yet. Each iteration re-simulates on the pruned data but re-prunes
  // from the original data, so fields of newly selected branches are kept.
  // Guards can in principle oscillate on field presence, so iterations are
  // capped at the page count. The session then navigates on the stable data,
  // so the flow behaves as if the stale fields were gone.
  if (compiledFlow.pruningStrategy === "cascading") {
    const maxIterations = Object.keys(compiledFlow.pages).length;
    for (let iteration = 0; iteration < maxIterations; iteration++) {
      const prunedInput = {
        ...prunedUserData,
        pageData: userData.pageData,
      };
      const rerun = runSimulation(prunedInput, compiledFlow);
      const repruned = pruneUserData(
        compiledFlow,
        rerun.visitedContexts,
        userData,
      );
      simulation = rerun;
      effectiveUserData = prunedInput;
      if (isEqual(repruned, prunedUserData)) break;
      prunedUserData = repruned;
    }
  }

  // Next: evaluateRoute skips addArrayItem transitions to find the next main-branch step.
  const nextNodeKey =
    evaluateRoute(compiledFlow.transitions[nodeKey], effectiveUserData) ??
    undefined;

  const isPageDone = (
    schema: ReturnType<typeof compiledFlow.getSchemaByNodeKey>,
    fieldNames: string[],
    scopeData: Record<string, unknown>,
  ) => {
    if (fieldNames.length === 0) return true;
    const candidate = Object.fromEntries(
      fieldNames.map((fieldName) => [
        fieldName,
        scopeData[resolveFieldName(fieldName)],
      ]),
    );
    return schema?.safeParse(candidate).success ?? false;
  };

  const evaluateDone = (key: NodeKey<C>, scope: Record<string, unknown>) =>
    isPageDone(
      compiledFlow.getSchemaByNodeKey(key),
      compiledFlow.getFieldNamesByNodeKey(key),
      scope,
    );

  // The page the user is on evaluated at its own arrayIndexes. The BFS only
  // fans out array items already in the data, so a brand new item being added
  // (index === array length) has no context; without this its section would
  // wrongly show done.
  const currentPageContext = (): Array<{
    key: NodeKey<C>;
    done: boolean;
  }> => {
    const stepId = compiledFlow.pages[nodeKey]?.stepId ?? "";
    if (!stepId.includes(ARRAY_WILDCARD)) return [];

    const arrayPath = arrayDataPath(
      compiledFlow.getFieldNamesByNodeKey(nodeKey),
    );
    const indexes = userData.pageData?.arrayIndexes ?? [];
    if (indexes.length < arrayPath.length) return [];

    const scope = resolveScopeAtIndexes(
      userData as Record<string, unknown>,
      arrayPath,
      indexes,
    );
    return [{ key: nodeKey, done: evaluateDone(nodeKey, scope) }];
  };

  // An array page has one context per item, all sharing a node key. A node is
  // done only when EVERY context reaching it is done, so one completed item
  // can't mark a section done while another item is still unfilled.
  const doneEvaluations = [
    ...simulation.visitedContexts.map(({ key, scopeData }) => ({
      key,
      done: evaluateDone(key, scopeData as Record<string, unknown>),
    })),
    ...currentPageContext(),
  ];

  const notDoneNodeKeys = new Set(
    doneEvaluations.filter(({ done }) => !done).map(({ key }) => key),
  );
  const doneNodeKeys = new Set(
    doneEvaluations
      .map(({ key }) => key)
      .filter((key) => !notDoneNodeKeys.has(key)),
  );

  // An empty array's "add" target is reachable so the user can add the first
  // item, but it is never visited (no item exists yet). Treat it as done only
  // when the array is optional, so a still-empty optional array does not hold
  // its section back, while an empty required array keeps it incomplete.
  const visitedKeys = new Set<string>(
    simulation.visitedContexts.map(({ key }) => key),
  );
  const isEmptyOptionalArrayTarget = (key: NodeKey<C>) => {
    const arrayName = inferArrayNameFromStepId(
      compiledFlow.getPathFromNodeKey(key) ?? "",
    );
    return arrayName !== "" && compiledFlow.isOptionalArray(arrayName);
  };
  [...simulation.reachableSet]
    .filter((key) => !visitedKeys.has(key))
    .filter((key) => isEmptyOptionalArrayTarget(key as NodeKey<C>))
    .forEach((key) => doneNodeKeys.add(key as NodeKey<C>));

  // If the previous page is a bare fan-out node — it hosts the addArrayItem that
  // reaches the current page but renders no summary of its own — the user never
  // navigated through it. They used the "add" affordance on the summary that node
  // exits to (the add button links straight to the item page). Point Back at that
  // summary instead of the internal fan-out node.
  const skipFanOutOnlyBack = (candidate: NodeKey<C> | undefined) => {
    const seen = new Set<NodeKey<C> | undefined>();
    let node = candidate;
    while (node != null && !seen.has(node)) {
      seen.add(node);
      const transitions = compiledFlow.transitions[node];
      if (compiledFlow.pages[node]?.arraySummary || !Array.isArray(transitions))
        break;
      const addsCurrent = transitions.some(
        (t) =>
          t != null &&
          typeof t === "object" &&
          t.type === "addArrayItem" &&
          t.target === nodeKey,
      );
      if (!addsCurrent) break;
      const fallback = transitions.find(
        (t) => t != null && typeof t === "object" && t.type !== "addArrayItem",
      );
      if (
        fallback == null ||
        typeof fallback !== "object" ||
        fallback.target == null
      )
        break;
      node = fallback.target;
    }
    return node;
  };

  // A cyclical page (an array-summary <-> item flow) can appear more than
  // once in the linear walk. Back always retraces to the FIRST occurrence's
  // predecessor — the step before the array section started — never into an
  // item's own page. This matches the old engine's behavior across all flows.
  const first = simulation.keys.indexOf(nodeKey);
  const linearPrevNodeKey =
    first > 0
      ? (simulation.keys[first - 1] as NodeKey<C> | undefined)
      : simulation.parentMap.get(nodeKey);
  const prevNodeKey = skipFanOutOnlyBack(linearPrevNodeKey);

  // The resolved predecessor can still sit deeper in array nesting than the
  // current page (e.g. a redirect loop through a nested array before landing
  // back on a shallower page). The current page's own arrayIndexes can't
  // fill those extra wildcards in — resolve concrete indexes from the real
  // (index-aware) visited context instead, so prevPath is always directly
  // usable, never a bare "#" template.
  const resolvePrevPath = (): string | undefined => {
    if (prevNodeKey == null) return undefined;
    const prevStepId = compiledFlow.pages[prevNodeKey]?.stepId;
    if (prevStepId == null) return undefined;

    const currentStepId = compiledFlow.pages[nodeKey]?.stepId ?? "";
    if (arrayWildcardCount(prevStepId) <= arrayWildcardCount(currentStepId)) {
      return compiledFlow.getPathFromNodeKey(prevNodeKey);
    }

    // Prefer the most recently completed instance of that page; fall back to
    // the most recently visited one (any state) so partial data still resolves.
    const visited = [...simulation.visitedContexts].reverse();
    const match =
      visited.find(
        ({ key, scopeData }) =>
          key === prevNodeKey &&
          isPageDone(
            compiledFlow.getSchemaByNodeKey(key),
            compiledFlow.getFieldNamesByNodeKey(key),
            scopeData as Record<string, unknown>,
          ),
      ) ?? visited.find(({ key }) => key === prevNodeKey);
    if (!match) return compiledFlow.getPathFromNodeKey(prevNodeKey);
    return insertConcreteIndexes(prevStepId, match.pageData.arrayIndexes ?? []);
  };

  const prevPath = resolvePrevPath();

  return {
    nodeKey,
    pageSchema: compiledFlow.getSchema(currentPath),
    fieldNames: compiledFlow.getFieldNames(currentPath),
    initialPath: compiledFlow.initialPath,
    arrayInfo: compiledFlow.getArrayInfo(currentPath),
    paths: simulation.keys
      .map((key) => compiledFlow.getPathFromNodeKey(key as NodeKey<C>))
      .filter((path): path is string => path !== undefined) as string[],
    isComplete: simulation.isComplete,
    statusTree: buildStatusTree(compiledFlow.pages, simulation, doneNodeKeys),
    prunedUserData,
    isReachable: (targetPath: string): boolean => {
      const key = compiledFlow.getNodeKeyFromPath(targetPath);
      return key != null && simulation.reachableSet.has(key);
    },
    getPathFromNodeKey: (key: string): string | undefined => {
      return compiledFlow.getPathFromNodeKey(key as NodeKey<C>);
    },
    nextPath: compiledFlow.getPathFromNodeKey(nextNodeKey),
    nextArrayPath: compiledFlow.getPathFromNodeKey(
      evaluateRoute(
        compiledFlow.transitions[nodeKey],
        effectiveUserData,
        true,
      ) ?? undefined,
    ),
    prevPath,
    isArrayPage: (path: string): boolean => {
      return compiledFlow.getArrayInfo(path) !== undefined;
    },
    isFinal: compiledFlow.isFinal(currentPath) ?? false,
    getProgress(path: string) {
      return compiledFlow.getProgress(path);
    },
  };
};

export type FlowSession<C extends PageConfigMap> = ReturnType<
  typeof createFlowSession<C>
>;
