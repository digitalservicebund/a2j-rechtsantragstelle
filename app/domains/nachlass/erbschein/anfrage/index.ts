import { type Flow } from "~/domains/flows.server";
import { nachlassErbscheinAnfrageFlowConfig } from "./flowConfig";
import { type NachlassErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";
import {
  getBeguenstigteStrings,
  getVerstorbeneName,
} from "~/domains/nachlass/erbschein/anfrage/stringReplacements";

export const nachlassErbscheinAnfrage = {
  flowType: "formFlow",
  config: {
    states: {},
  },
  stringReplacements: (context: NachlassErbscheinAnfrageUserData) => ({
    ...getVerstorbeneName(context),
    ...getBeguenstigteStrings(context),
  }),
  newEngineConfig: nachlassErbscheinAnfrageFlowConfig,
} satisfies Flow<typeof nachlassErbscheinAnfrageFlowConfig.pages>;
