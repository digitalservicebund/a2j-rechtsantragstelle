import { buildStatusTree, simulate } from "./simulate";
import { ARRAY_WILDCARD } from "./compileFlow";
import type { CompiledFlow } from "./compileFlow";
import type { PageConfigMap, NodeKey, InferredUserData } from "./types";
import type { PageData } from "../pageDataSchema";
import { evaluateRoute } from "./routing";

// Navigates/creates the nested path in `obj` using `arrayPath` + `indexes`,
// then sets `fieldName = value` on the deepest object.
// e.g. arrayPath=["children","toys"], indexes=[0,1], fieldName="name"
//   → obj.children[0].toys[1].name = value
const setNestedField = (
  obj: Record<string, unknown>,
  arrayPath: string[],
  indexes: number[],
  fieldName: string,
  value: unknown,
): void => {
  if (value === undefined) return;
  let target: Record<string, unknown> = obj;
  for (let i = 0; i < arrayPath.length; i++) {
    const arrayName = arrayPath[i];
    const index = indexes[i];
    if (!Array.isArray(target[arrayName])) target[arrayName] = [];
    const arr = target[arrayName] as Record<string, unknown>[];
    if (arr[index] === undefined) arr[index] = {};
    target = arr[index];
  }
  target[fieldName] = value;
};

const pruneUserData = <C extends PageConfigMap>(
  compiledFlow: CompiledFlow<C>,
  visitedContexts: Array<{
    key: NodeKey<C>;
    pageData: PageData;
    scopeData: Record<string, unknown>;
    arrayPath: string[];
  }>,
  data: InferredUserData<C> & { pageData: PageData },
): InferredUserData<C> => {
  const result: Record<string, unknown> = {};

  for (const { key: nodeKey, pageData, scopeData, arrayPath } of visitedContexts) {
    const page = compiledFlow.pages[nodeKey];
    if (!page || page.arraySummary) continue;

    if (page.stepId.includes(ARRAY_WILDCARD)) {
      // Array item page: copy only the fields declared in its schema.
      // scopeData is the item at this nesting level; arrayPath + arrayIndexes
      // give the reconstruction path in the output.
      const indexes = pageData.arrayIndexes ?? [];
      for (const fieldName of compiledFlow.getFieldNamesByNodeKey(nodeKey)) {
        setNestedField(result, arrayPath, indexes, fieldName, scopeData[fieldName]);
      }
    } else {
      // Regular (top-level) page: copy declared fields directly from userData.
      for (const field of compiledFlow.getFieldNamesByNodeKey(nodeKey)) {
        const val = (data as Record<string, unknown>)[field];
        if (val !== undefined) result[field] = val;
      }
    }
  }

  return result as InferredUserData<C>;
};

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
      const items = scopeData[info.name];
      return Array.isArray(items) ? { name: info.name, count: items.length } : undefined;
    },
  );

  // Prev: The BFS parent guarantees a direct, chronological Back step.
  const prevNodeKey = simulation.parentMap.get(nodeKey);

  // Next: evaluateRoute skips addArrayItem transitions to find the next main-branch step.
  const nextNodeKey =
    evaluateRoute(compiledFlow.transitions[nodeKey], userData) ?? undefined;

  return {
    nodeKey,
    pageSchema: compiledFlow.getSchema(currentPath),
    fieldNames: compiledFlow.getFieldNames(currentPath),
    initialPath: compiledFlow.initialPath,
    arrayInfo: compiledFlow.getArrayInfo(currentPath),
    path: simulation.path,
    isComplete: simulation.isComplete,
    statusTree: buildStatusTree(compiledFlow.pages, simulation),
    prunedUserData: pruneUserData(
      compiledFlow,
      simulation.visitedContexts,
      userData,
    ),
    isReachable: (targetPath: string): boolean => {
      const key = compiledFlow.getNodeKeyFromPath(targetPath);
      return key != null && simulation.reachableSet.has(key);
    },
    nextPath: compiledFlow.getPathFromNodeKey(nextNodeKey),
    prevPath: compiledFlow.getPathFromNodeKey(prevNodeKey),
  };
};

export type FlowSession<C extends PageConfigMap> = ReturnType<
  typeof createFlowSession<C>
>;
