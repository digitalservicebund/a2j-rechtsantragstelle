import { antragstellendePersonDone } from "~/flows/prozesskostenhilfeFormular/antragstellendePerson/doneFunctions";
import type { FlowConfigTransitions } from "~/services/flow/server/buildFlowController";

export const getProzesskostenhilfeAntragstellendePersonConfig = (
  transitions?: FlowConfigTransitions,
) => {
  console.log(transitions);
  return {
    id: "antragstellende-person",
    initial: "antragstellende-person",
    meta: { done: antragstellendePersonDone },
    states: {
      antragstellendePerson: {},
    },
  };
};
