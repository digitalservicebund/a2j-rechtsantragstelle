import { createFlowSession } from "~/services/flow/newFlowEngine/createFlowSession";
import { stepStatesToSubflowDoneStates } from "~/services/navigation/stepStatesToSubflowDoneStates";
import { buildStepStatesFromStatusTree } from "~/services/navigation/buildStepStatesFromStatusTree";
import { type FlowId } from "~/domains/flowIds";
import {
  type InferredUserData,
  type PageConfigMap,
} from "../newFlowEngine/types";
import { type CompiledFlow } from "../newFlowEngine/compileFlow";
import merge from "lodash/merge";
import { type SessionData } from "react-router";

type UpcomingUserData<C extends PageConfigMap> = {
  sessionUserData: SessionData;
  formUserData: InferredUserData<C>;
  migrationData: InferredUserData<C> | undefined;
};

export const generateUserDataToSave = <C extends PageConfigMap>(
  stepId: string,
  upcomingUserData: UpcomingUserData<C>,
  flowId: FlowId,
  compiledFlow: CompiledFlow<C>,
) => {
  const updatedUserData = merge(
    {},
    upcomingUserData.sessionUserData,
    upcomingUserData.formUserData,
    upcomingUserData.migrationData,
  );

  const flowSessionEngine = createFlowSession(
    compiledFlow,
    updatedUserData,
    stepId,
  );

  const statusTree = flowSessionEngine.statusTree;

  const subflowDoneStates = stepStatesToSubflowDoneStates(
    buildStepStatesFromStatusTree(statusTree, flowId, flowSessionEngine.paths),
  );

  const userDataToSave = {
    ...updatedUserData,
    pageData: { ...updatedUserData.pageData, subflowDoneStates },
  };

  return userDataToSave;
};
