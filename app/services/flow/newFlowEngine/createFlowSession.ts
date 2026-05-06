import { buildStatusTree, simulate } from "./simulate";
import type { CompiledFlow } from "./compileFlow";
import type { PageConfigMap, InferredUserData } from "./types";
import type { PageData } from "../pageDataSchema";
import { evaluateRoute } from "./routing";

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
  );

  // Prev: The BFS parent guarantees a direct, chronological Back step.
  const prevNodeKey = simulation.parentMap.get(nodeKey);

  // Next: evaluateRoute skips addArrayItem transitions to find the next main-branch step.
  const nextNodeKey =
    evaluateRoute(compiledFlow.transitions[nodeKey], userData) ?? undefined;

  return {
    nodeKey,
    pageSchema: compiledFlow.getSchema(currentPath),
    fieldNames: compiledFlow.getFieldNames(currentPath) as string[],
    initialPath: compiledFlow.getPathFromNodeKey(compiledFlow.initialStep),
    arrayInfo: compiledFlow.getArrayInfo(currentPath),
    path: simulation.path,
    isTerminated: simulation.isTerminatedSuccessfully,
    statusTree: buildStatusTree(compiledFlow.pages, simulation),
    isReachable: (targetPath: string): boolean => {
      const key = compiledFlow.getNodeKeyFromPath(targetPath);
      return key != null && simulation.reachableSet.has(key);
    },
    getNextStep: () => compiledFlow.getPathFromNodeKey(nextNodeKey),
    getPrevStep: () => compiledFlow.getPathFromNodeKey(prevNodeKey),
  };
};

export type FlowSession<C extends PageConfigMap> = ReturnType<
  typeof createFlowSession<C>
>;
