import type { RouteDefinition } from "./types";

export const evaluateRoute = <FlowKey, UserData>(
  route: RouteDefinition<FlowKey, UserData> | undefined,
  data: UserData,
  traverseArrays = false,
): FlowKey | null => {
  if (!route) return null;
  if (typeof route === "string") return route;
  if (Array.isArray(route)) {
    for (const transition of route) {
      const isArrayTransition = transition.type === "addArrayItem";
      if (traverseArrays && isArrayTransition) return transition.target;
      if (!isArrayTransition && (!transition.guard || transition.guard(data))) {
        return transition.target;
      }
    }
  }
  return null;
};

// Extracts all potential target edges from a route definition
export const extractEdges = <FlowKey, UserData>(
  route?: RouteDefinition<FlowKey, UserData>,
): FlowKey[] => {
  if (!route) return [];
  if (Array.isArray(route)) {
    const edges: FlowKey[] = [];
    for (const transition of route) {
      if (transition.target) edges.push(transition.target);
    }
    return edges;
  }
  return [route];
};

export const evaluateAllBranches = <FlowKey, UserData>(
  route: RouteDefinition<FlowKey, UserData> | undefined,
  data: UserData,
): FlowKey[] => {
  if (!route) return [];
  if (typeof route === "string") return [route];

  if (Array.isArray(route)) {
    const branches: FlowKey[] = [];
    for (const transition of route) {
      // Evaluate all guards. If there is no guard, or it passes, it is a valid branch.
      if (!transition.guard || transition.guard(data)) {
        if (transition.target) branches.push(transition.target);
      }
    }
    return branches;
  }
  return [];
};
