import { type Flow } from "~/domains/flows.server";
import { nachlassErbscheinAnfrageFlowConfig } from "./flowConfig";
import { type NachlassErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";
import {
  getAmtsgerichtStrings,
  getAngehoerigeStrings,
  getBeguenstigteStrings,
  getEhepartnerName,
  getVerstorbeneName,
  getVerstorbenePostcodeCity,
  getVerstorbeneStreetnameHousenumber,
} from "~/domains/nachlass/erbschein/anfrage/stringReplacements";

export const nachlassErbscheinAnfrage = {
  flowType: "formFlow",
  config: {
    states: {},
  },
  stringReplacements: (context: NachlassErbscheinAnfrageUserData) => ({
    ...getVerstorbeneName(context),
    ...getVerstorbeneStreetnameHousenumber(context),
    ...getVerstorbenePostcodeCity(context),
    ...getEhepartnerName(context),
    ...getBeguenstigteStrings(context),
    ...getAngehoerigeStrings(context),
    ...getAmtsgerichtStrings(context),
  }),
  newEngineConfig: nachlassErbscheinAnfrageFlowConfig,
} satisfies Flow<typeof nachlassErbscheinAnfrageFlowConfig.pages>;
