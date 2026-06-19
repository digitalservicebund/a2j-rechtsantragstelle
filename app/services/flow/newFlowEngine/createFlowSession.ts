import { simulate } from "./simulate";
import type { CompiledFlow } from "./compileFlow";
import type { PageConfigMap, InferredUserData } from "./types";
import type { PageData } from "../pageDataSchema";
import { evaluateRoute } from "./routing";
import { buildStatusTree } from "./statusTree";
import { pruneUserData } from "./pruneUserData";

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
  );

  // Prev: use the linear breadcrumb so Back returns to the page the user came
  // from, not the BFS shortcut. Fall back to parentMap for off-path pages.
  const pathIndex = simulation.path.indexOf(nodeKey);
  const prevNodeKey =
    pathIndex > 0
      ? simulation.path[pathIndex - 1]
      : simulation.parentMap.get(nodeKey);

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
    prevPath: compiledFlow.getPathFromNodeKey(
      prevNodeKey as Extract<keyof C, string>,
    ),
  };
};

export type FlowSession<C extends PageConfigMap> = ReturnType<
  typeof createFlowSession<C>
>;
