import { type Flow } from "~/domains/flows.server";
import { nachlassErbscheinAnfrageFlowConfig } from "./flowConfig";

export const nachlassErbscheinAnfrage = {
  flowType: "formFlow",
  config: {
    states: {},
  },
  stringReplacements: () => ({}),
  newEngineConfig: nachlassErbscheinAnfrageFlowConfig,
} satisfies Flow<typeof nachlassErbscheinAnfrageFlowConfig.pages>;
