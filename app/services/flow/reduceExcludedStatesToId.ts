import type { Config } from "~/services/flow/server/types";
import mapValues from "lodash/mapValues";
import type { UserData } from "~/domains/userData";
import { buildFlowController } from "./server/buildFlowController";

function reduceExcludedStatesToId(config: Config) {
  // reduce all states with excludedFromValidation to their id (since it might be referenced by other states)
  return {
    ...config,
    states: mapValues(config.states, (stateConfig) =>
      stateConfig.meta?.excludedFromValidation
        ? { id: stateConfig.id }
        : stateConfig,
    ),
  };
}

export const allValidatedStatesDone = (config: Config, userData: UserData) =>
  buildFlowController({
    config: reduceExcludedStatesToId(config),
    data: userData,
  })
    .stepStates()
    .filter((stepState) => stepState.isReachable)
    .every((stepState) => stepState.isDone);
