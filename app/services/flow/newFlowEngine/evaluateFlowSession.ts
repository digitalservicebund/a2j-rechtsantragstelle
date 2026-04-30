import { getFlowStatusTree, simulatePath } from "./flowStatus";
import type { StaticFlow } from "./compileStaticFlow";
import type {
  PageConfigMap,
  InferredUserData,
  TransitionConfig,
} from "./types";
import type { PageData } from "../pageDataSchema";

export const evaluateFlowSession = <C extends PageConfigMap>(
  staticFlow: StaticFlow<C>,
  userData: InferredUserData<C> & { pageData: PageData },
  stepId: string,
) => {
  const currentKey = staticFlow.getKeyFromStepId(stepId);
  if (!currentKey) throw new Error(`Invalid stepId: ${stepId}`);

  const arrayInfos = staticFlow.arrayInfos(stepId);

  // 2. Single Simulation Pass
  // Always traverse arrays to ensure deeply nested nodes are populated in the reachableSet and path.
  const simulation = simulatePath(
    staticFlow.transitionConfigMap,
    staticFlow.initialStep,
    userData,
    true,
  );

  // 3. Surgical Target Navigation
  // Prev: The topological parent guarantees a direct, chronological Back step (unwinding loops safely).
  const prevKey = simulation.parentMap.get(currentKey);

  // Next: The immediate route evaluating to false explicitly steps OVER arrays, proceeding to the next main branch.
  const nextKey =
    evaluateRoute(staticFlow.transitionConfigMap[currentKey], userData) ??
    undefined;

  return {
    currentKey,
    pageSchema: staticFlow.getSchema(stepId),
    initialStepId: staticFlow.getStepIdFromKey(staticFlow.initialStep),
    arrayInfos,
    path: simulation.path,
    isTerminated: simulation.isTerminatedSuccessfully,
    statusTree: getFlowStatusTree(staticFlow.pageConfigMap, simulation),
    isReachable: (targetStepId: string) => {
      const key = staticFlow.getKeyFromStepId(targetStepId);
      return key && simulation.reachableSet.has(key);
    },
    getNextStep: () => staticFlow.getStepIdFromKey(nextKey),
    getPrevStep: () => staticFlow.getStepIdFromKey(prevKey),
  };
};

// Helper function to statically determine the next step over a specific node
const evaluateRoute = <FlowKey, UserData>(
  route: TransitionConfig<FlowKey, UserData>,
  data: UserData,
): FlowKey | null => {
  if (!route) return null;
  if (Array.isArray(route)) {
    for (const edge of route) {
      if (edge.guard && !edge.guard(data)) continue;
      if (edge.type === "addArrayItem") continue;
      return edge.target;
    }
  }
  if (typeof route === "string") return route as FlowKey;

  return null;
};
