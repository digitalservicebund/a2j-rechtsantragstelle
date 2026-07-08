import { simulate } from "./simulate";
import { ARRAY_WILDCARD } from "./compileFlow";
import type { CompiledFlow } from "./compileFlow";
import type { PageConfigMap, InferredUserData } from "./types";
import type { PageData } from "../pageDataSchema";
import { evaluateRoute } from "./routing";
import { buildStatusTree } from "./statusTree";
import { pruneUserData } from "./pruneUserData";

const resolveFieldName = (fieldName: string) =>
  fieldName.includes("#") ? fieldName.split("#").at(-1)! : fieldName;

export const createFlowSession = <C extends PageConfigMap>(
  compiledFlow: CompiledFlow<C>,
  userData: InferredUserData<C> & { pageData: PageData },
  currentPath: string,
) => {
  const nodeKey = compiledFlow.getNodeKeyFromPath(currentPath);
  if (nodeKey == null) throw new Error(`Invalid path: ${currentPath}`);

  const simulation = simulate(
    compiledFlow.transitions,
    compiledFlow.initialStep,
    userData,
    true,
    (key, scopeData) => {
      const info = compiledFlow.getArrayInfoByNodeKey(key);
      if (!info) return undefined;
      // info.name uses "#" notation (e.g. "children#children") but scopeData
      // is already scoped to the current item, so the real property key is
      // just the last segment after "#" (e.g. "children").
      const leafName = info.name.split("#").at(-1)!;
      const items = scopeData[leafName];
      // Treat a missing array the same as an empty one so that the add-target
      // remains reachable even before the first item has been submitted.
      return {
        name: info.name,
        count: Array.isArray(items) ? items.length : 0,
      };
    },
    (key) => {
      const stepId = compiledFlow.pages[key]?.stepId ?? "";
      return stepId.split(ARRAY_WILDCARD).length - 1;
    },
  );

  // Prev: use the linear breadcrumb so Back returns to the page the user came
  // from, not the BFS shortcut. Fall back to parentMap for off-path pages.
  const keyIndex = simulation.keys.indexOf(nodeKey);
  const linearPrevNodeKey =
    keyIndex > 0
      ? simulation.keys[keyIndex - 1]
      : simulation.parentMap.get(nodeKey);

  // If the previous page is a bare fan-out node — it hosts the addArrayItem that
  // reaches the current page but renders no summary of its own — the user never
  // navigated through it. They used the "add" affordance on the summary that node
  // exits to (the add button links straight to the item page). Point Back at that
  // summary instead of the internal fan-out node.
  const skipFanOutOnlyBack = (candidate: typeof linearPrevNodeKey) => {
    const seen = new Set<typeof candidate>();
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
  const prevNodeKey = skipFanOutOnlyBack(linearPrevNodeKey);

  // Next: evaluateRoute skips addArrayItem transitions to find the next main-branch step.
  const nextNodeKey =
    evaluateRoute(compiledFlow.transitions[nodeKey], userData) ?? undefined;

  const isPageDone = (
    schema: ReturnType<typeof compiledFlow.getSchemaByNodeKey>,
    fieldNames: string[],
    scopeData: Record<string, unknown>,
  ) => {
    if (fieldNames.length === 0) return true;
    const candidate = Object.fromEntries(
      fieldNames.map((fieldName) => [
        resolveFieldName(fieldName),
        scopeData[resolveFieldName(fieldName)],
      ]),
    );
    return schema?.safeParse(candidate).success ?? false;
  };

  const doneNodeKeys = new Set(
    simulation.visitedContexts
      .filter(({ key, scopeData }) =>
        isPageDone(
          compiledFlow.getSchemaByNodeKey(key),
          compiledFlow.getFieldNamesByNodeKey(key),
          scopeData as Record<string, unknown>,
        ),
      )
      .map(({ key }) => key),
  );

  return {
    nodeKey,
    pageSchema: compiledFlow.getSchema(currentPath),
    fieldNames: compiledFlow.getFieldNames(currentPath),
    initialPath: compiledFlow.initialPath,
    arrayInfo: compiledFlow.getArrayInfo(currentPath),
    paths: simulation.keys
      .map((key) =>
        compiledFlow.getPathFromNodeKey(key as Extract<keyof C, string>),
      )
      .filter((path): path is string => path !== undefined) as string[],
    isComplete: simulation.isComplete,
    statusTree: buildStatusTree(compiledFlow.pages, simulation, doneNodeKeys),
    prunedUserData: pruneUserData(
      compiledFlow,
      simulation.visitedContexts,
      userData,
    ),
    isReachable: (targetPath: string): boolean => {
      const key = compiledFlow.getNodeKeyFromPath(targetPath);
      return key != null && simulation.reachableSet.has(key);
    },
    getPathFromNodeKey: (key: string): string | undefined => {
      return compiledFlow.getPathFromNodeKey(key as Extract<keyof C, string>);
    },
    nextPath: compiledFlow.getPathFromNodeKey(nextNodeKey),
    prevPath: compiledFlow.getPathFromNodeKey(
      prevNodeKey as Extract<keyof C, string>,
    ),
    isArrayPage: (path: string): boolean => {
      return compiledFlow.getArrayInfo(path) !== undefined;
    },
    isFinal: compiledFlow.isFinal(currentPath) ?? false,
  };
};

export type FlowSession<C extends PageConfigMap> = ReturnType<
  typeof createFlowSession<C>
>;
