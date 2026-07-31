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
import { type NachlassErbscheinErbfolgeUserData } from "~/domains/nachlass/erbschein/erbfolge/userData";

export const nachlassErbscheinAnfrage = {
  flowType: "formFlow",
  config: {
    states: {},
  },
  migration: {
    source: "/nachlass/erbschein/erbfolge",
    sortedFields: [
      "verstorbeneVorname",
      "verstorbeneNachname",
      "verstorbeneFamilienstand",
      "ehepartnerVorname",
      "ehepartnerNachname",
      "ehepartnerStaatsangehoerigkeit",
      "hasEhevertrag",
    ],
    migrationDataMerger: (
      sourceData: NachlassErbscheinErbfolgeUserData,
    ): NachlassErbscheinAnfrageUserData => {
      return {
        ehepartnerVorname: sourceData.ehepartnerName?.split(" ")[0] ?? "",
        ehepartnerNachname: sourceData.ehepartnerName?.split(" ")[1] ?? "",
        ...(sourceData.ehepartnerStaatsangehoerigkeit === "nurDeutsch"
          ? { ehepartnerStaatsangehoerigkeit: "Deutsch" }
          : {}),
        ...(sourceData.ehevertrag && sourceData.ehevertrag !== "unknown"
          ? { hasEhevertrag: sourceData.ehevertrag }
          : {}),
        verstorbeneFamilienstand: sourceData.familienstand,
        verstorbeneVorname: sourceData.name?.split(" ")[0] ?? "",
        verstorbeneNachname: sourceData.name?.split(" ")[1] ?? "",
      };
    },
    buttonUrl: "/nachlass/erbschein/erbfolge",
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
