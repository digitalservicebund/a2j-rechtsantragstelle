import { createFlowSession } from "~/services/flow/newFlowEngine/createFlowSession";
import { stepStatesToSubflowDoneStates } from "~/services/navigation/stepStatesToSubflowDoneStates";
import { buildStepStatesFromStatusTree } from "~/services/navigation/buildStepStatesFromStatusTree";
import { updateSession } from "~/services/session.server";
import { type FlowId } from "~/domains/flowIds";
import { type PageConfigMap } from "../newFlowEngine/types";
import { type CompiledFlow } from "../newFlowEngine/compileFlow";
import type { Session, SessionData } from "react-router";

export const saveUserDataAndReturnEngineSession = <C extends PageConfigMap>(
  stepId: string,
  updatedUserData: any,
  flowId: FlowId,
  compiledFlow: CompiledFlow<C>,
  flowSession: Session<SessionData, SessionData>,
) => {
  const flowSessionEngine = createFlowSession(
    compiledFlow,
    updatedUserData as Parameters<typeof createFlowSession>[1], //NOSONAR
    stepId,
  );

  const statusTree = flowSessionEngine.statusTree;

  const subflowDoneStates = stepStatesToSubflowDoneStates(
    buildStepStatesFromStatusTree(statusTree, flowId),
  );

  const userDataToSave = {
    ...updatedUserData,
    pageData: { ...updatedUserData.pageData, subflowDoneStates },
  };
  updateSession(flowSession, userDataToSave, (_, newData, key) =>
    key === "pageData" ? newData : undefined,
  );

  return createFlowSession(
    compiledFlow,
    userDataToSave as Parameters<typeof createFlowSession>[1],
    stepId,
  );
};
