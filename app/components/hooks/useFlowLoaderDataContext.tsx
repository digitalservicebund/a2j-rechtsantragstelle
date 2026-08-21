import { useLoaderData } from "react-router";
import { type FlowId } from "~/domains/flowIds";
import { type UserData } from "~/domains/userData";

type FlowLoaderDataContext = {
  flowId: FlowId;
  userData: UserData;
};

export const useFlowLoaderDataContext = (): FlowLoaderDataContext => {
  const loaderData = useLoaderData() as FlowLoaderDataContext;

  if (!loaderData?.flowId || !loaderData?.userData) {
    throw new Error(
      "useFlowContext must be used within a route that provides flowId and userData loader data.",
    );
  }

  return { flowId: loaderData.flowId, userData: loaderData.userData };
};
