import { useLoaderData } from "react-router";
import { FlowId } from "~/domains/flowIds";
import { UserData } from "~/domains/userData";
import type { loader as loaderNewEngineFormular } from "~/routes/shared/newEngineFormular";
import type { loader as newEngineVorabcheckLoader } from "~/routes/shared/newEngineVorabcheck";

type FlowContext = {
  flowId: FlowId;
  userData: UserData;
};

export const useFlowContext = (): FlowContext => {
  const loaderDataFormular = useLoaderData<typeof loaderNewEngineFormular>();

  const loaderDataVorabcheck =
    useLoaderData<typeof newEngineVorabcheckLoader>();

  const flowId = loaderDataFormular?.flowId ?? loaderDataVorabcheck?.flowId;
  const userData =
    loaderDataFormular?.userData ?? loaderDataVorabcheck?.userData;

  return { flowId, userData };
};
