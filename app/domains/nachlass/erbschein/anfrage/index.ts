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
import { type PageConfigMap } from "~/services/flow/newFlowEngine/types";

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
        ehepartnerVorname: sourceData.ehepartnerVorname ?? "",
        ehepartnerNachname: sourceData.ehepartnerNachname ?? "",
        ...(sourceData.ehepartnerStaatsangehoerigkeit === "nurDeutsch"
          ? { ehepartnerStaatsangehoerigkeit: "Deutsch" }
          : {}),
        ...(sourceData.ehevertrag && sourceData.ehevertrag !== "unknown"
          ? { hasEhevertrag: sourceData.ehevertrag }
          : {}),
        verstorbeneFamilienstand: sourceData.familienstand,
        verstorbeneVorname: sourceData.verstorbeneVorname ?? "",
        verstorbeneNachname: sourceData.verstorbeneNachname ?? "",
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
} satisfies Flow<PageConfigMap>;
