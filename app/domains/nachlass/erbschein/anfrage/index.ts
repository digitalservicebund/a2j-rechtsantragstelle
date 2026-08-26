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
import { migrateElternteil, migrateKind } from "./personMigration";

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
      "kinder",
      "elternteile",
    ],
    migrationDataMerger: (
      sourceData: NachlassErbscheinErbfolgeUserData,
    ): NachlassErbscheinAnfrageUserData => {
      return {
        verstorbeneVorname: sourceData.verstorbeneVorname ?? "",
        verstorbeneNachname: sourceData.verstorbeneNachname ?? "",
        verstorbeneFamilienstand: sourceData.familienstand,
        ehepartnerVorname: sourceData.ehepartnerVorname ?? "",
        ehepartnerNachname: sourceData.ehepartnerNachname ?? "",
        ...(sourceData.ehepartnerStaatsangehoerigkeit === "nurDeutsch"
          ? { ehepartnerStaatsangehoerigkeit: "Deutsch" }
          : {}),
        ...(sourceData.ehevertrag && sourceData.ehevertrag !== "unknown"
          ? { hasEhevertrag: sourceData.ehevertrag }
          : {}),
          hatteKinder: sourceData.hatteKinder,
        ...(sourceData.kinder && {
          kinder: sourceData.kinder.map(migrateKind),
          ...(sourceData.elternteile && {
            elternteile: sourceData.elternteile.map(migrateElternteil),
          }),
        }),
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
