import type { Config } from "~/services/flow/server/types";
import mapValues from "lodash/mapValues";

export function reduceExcludedStatesToId(config: Config) {
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
